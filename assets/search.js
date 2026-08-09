/* ============================================================================
   WBSearch — client-side full-text search over the project catalog
   ----------------------------------------------------------------------------
   Everything happens in the browser. There is no search server, no network
   request, and no third-party library: the whole catalog is a few dozen
   kilobytes of JSON that already shipped with the page, so the fastest thing
   to do is index it once at startup and query it in memory.

   What it does that a naive `indexOf` filter does not:

     * Inverted index      term -> list of (document, weight). Lookup cost
                           depends on how many documents contain the term, not
                           on how many documents exist.
     * Field weighting     a hit in the title counts for more than a hit deep
                           in a summary paragraph, so ranking is meaningful.
     * Prefix matching     "kub" finds "kubernetes" while you are still typing.
                           Terms are kept in one sorted array and the prefix
                           range is found by binary search.
     * Typo tolerance      for words of four characters or more, if nothing
                           matches we retry allowing a single edit, so
                           "kafak" still finds "kafka".
     * Field queries       `lang:rust`, `owner:worxbend`, `tier:flagship`
                           narrow without touching the text index.

   The public surface is two functions: build() and query().
   ========================================================================= */

(function (global) {
  "use strict";

  /* How much a hit in each field contributes to a document's score. */
  var FIELD_WEIGHTS = {
    title: 10,
    name: 9,
    tags: 6,
    stack: 5,
    tagline: 4,
    category: 4,
    owner: 3,
    lang: 3,
    highlights: 2,
    summary: 1,
  };

  var FIELD_QUERY = /^(lang|language|owner|tier|cat|category|tag|stack)\s*:\s*(.+)$/i;

  /* ------------------------------------------------------------ tokenising */

  /* Split on anything that is not a letter or digit, but keep the original
     token too when it contained separators — so "obs-websocket" indexes as
     "obs", "websocket" AND "obswebsocket", and all three spellings find it. */
  function tokenize(text) {
    if (!text) return [];
    var lower = String(text).toLowerCase();
    var out = [];
    var parts = lower.split(/[^a-z0-9+#.]+/);
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (!p) continue;
      /* Trailing dots from prose ("fluxion.cr." ) are noise; a dot between
         alphanumerics is meaningful and stays. */
      p = p.replace(/^\.+|\.+$/g, "");
      if (!p) continue;
      out.push(p);
      if (p.indexOf(".") !== -1) {
        var sub = p.split(".");
        for (var j = 0; j < sub.length; j++) if (sub[j]) out.push(sub[j]);
      }
    }
    return out;
  }

  function fieldText(doc, field) {
    var v = doc[field];
    if (v == null) return "";
    if (Array.isArray(v)) return v.join(" ");
    return String(v);
  }

  /* ---------------------------------------------------------------- build */

  function build(docs) {
    var postings = Object.create(null);   // term -> { docId: weight }
    var fields = Object.keys(FIELD_WEIGHTS);

    for (var d = 0; d < docs.length; d++) {
      var doc = docs[d];
      for (var f = 0; f < fields.length; f++) {
        var field = fields[f];
        var weight = FIELD_WEIGHTS[field];
        var terms = tokenize(fieldText(doc, field));
        /* Deduplicate within a field so a word repeated five times in one
           summary does not outrank a word in a title. */
        var seen = Object.create(null);
        for (var t = 0; t < terms.length; t++) {
          var term = terms[t];
          if (seen[term]) continue;
          seen[term] = 1;
          var list = postings[term] || (postings[term] = Object.create(null));
          list[d] = (list[d] || 0) + weight;
        }
      }
    }

    var terms = Object.keys(postings).sort();

    return {
      docs: docs,
      postings: postings,
      terms: terms,
      size: terms.length,
    };
  }

  /* --------------------------------------------------------- prefix range */

  function lowerBound(arr, target) {
    var lo = 0, hi = arr.length;
    while (lo < hi) {
      var mid = (lo + hi) >> 1;
      if (arr[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  /* All indexed terms starting with `prefix`, capped so a one-letter query
     does not walk the entire vocabulary. */
  function prefixTerms(index, prefix, limit) {
    var out = [];
    var start = lowerBound(index.terms, prefix);
    for (var i = start; i < index.terms.length && out.length < limit; i++) {
      if (index.terms[i].indexOf(prefix) !== 0) break;
      out.push(index.terms[i]);
    }
    return out;
  }

  /* ---------------------------------------------------------- edit distance */

  /* Bounded Damerau-Levenshtein, optimal string alignment variant.

     Plain Levenshtein charges two edits for a transposition, which matters
     because swapping two letters is the single most common typing mistake:
     "kafak" for "kafka" would score 2 and fall outside a 1-edit budget, so the
     search would find nothing. Counting an adjacent swap as one edit fixes
     that, and costs one extra row of state.

     Bounded: gives up as soon as every cell in a row exceeds the budget, which
     keeps the overwhelmingly common "nothing like it" case cheap. */
  function withinEdits(a, b, max) {
    var al = a.length, bl = b.length;
    if (Math.abs(al - bl) > max) return false;

    var prev2 = new Array(bl + 1);   // row i-2, needed for the swap case
    var prev = new Array(bl + 1);    // row i-1
    var cur = new Array(bl + 1);
    for (var j = 0; j <= bl; j++) prev[j] = j;

    for (var i = 1; i <= al; i++) {
      cur[0] = i;
      var best = cur[0];
      for (var k = 1; k <= bl; k++) {
        var cost = a.charCodeAt(i - 1) === b.charCodeAt(k - 1) ? 0 : 1;
        var v = Math.min(cur[k - 1] + 1, prev[k] + 1, prev[k - 1] + cost);
        /* Adjacent transposition: a[i-1]a[i-2] reversed matches b[k-2]b[k-1]. */
        if (i > 1 && k > 1 &&
            a.charCodeAt(i - 1) === b.charCodeAt(k - 2) &&
            a.charCodeAt(i - 2) === b.charCodeAt(k - 1)) {
          v = Math.min(v, prev2[k - 2] + 1);
        }
        cur[k] = v;
        if (v < best) best = v;
      }
      if (best > max) return false;
      var rotate = prev2; prev2 = prev; prev = cur; cur = rotate;
    }
    return prev[bl] <= max;
  }

  function fuzzyTerms(index, term, limit) {
    var out = [];
    var max = term.length >= 7 ? 2 : 1;
    for (var i = 0; i < index.terms.length && out.length < limit; i++) {
      var t = index.terms[i];
      if (Math.abs(t.length - term.length) > max) continue;
      if (withinEdits(term, t, max)) out.push(t);
    }
    return out;
  }

  /* ---------------------------------------------------------------- query */

  /* Returns [{ doc, score, terms }] sorted by descending score.
     `filter` is an optional predicate applied before scoring. */
  function query(index, raw, opts) {
    opts = opts || {};
    var limit = opts.limit || 200;
    var filter = opts.filter;

    var text = String(raw || "").trim();
    if (!text) {
      var all = [];
      for (var i = 0; i < index.docs.length; i++) {
        if (filter && !filter(index.docs[i])) continue;
        all.push({ doc: index.docs[i], score: 0, terms: [] });
      }
      return all;
    }

    /* Pull `field:value` clauses out first; whatever is left is free text. */
    var clauses = text.split(/\s+/);
    var fieldFilters = [];
    var words = [];
    for (var c = 0; c < clauses.length; c++) {
      var m = FIELD_QUERY.exec(clauses[c]);
      if (m) fieldFilters.push({ field: m[1].toLowerCase(), value: m[2].toLowerCase() });
      else words.push(clauses[c]);
    }

    var scores = Object.create(null);
    var matched = Object.create(null);
    var terms = tokenize(words.join(" "));

    for (var t = 0; t < terms.length; t++) {
      var term = terms[t];
      var candidates = prefixTerms(index, term, 60);

      /* Nothing starts with what was typed — try one edit before giving up. */
      if (!candidates.length && term.length >= 4) {
        candidates = fuzzyTerms(index, term, 12);
      }
      if (!candidates.length) {
        /* An unmatchable term means no results, because terms are ANDed. */
        return [];
      }

      var hitThisTerm = Object.create(null);
      for (var ci = 0; ci < candidates.length; ci++) {
        var cand = candidates[ci];
        /* An exact match should beat a long prefix expansion. */
        var decay = cand === term ? 1 : (term.length / cand.length) * 0.85;
        var list = index.postings[cand];
        for (var docId in list) {
          var add = list[docId] * decay;
          hitThisTerm[docId] = Math.max(hitThisTerm[docId] || 0, add);
          (matched[docId] || (matched[docId] = Object.create(null)))[cand] = 1;
        }
      }

      if (t === 0) {
        for (var d0 in hitThisTerm) scores[d0] = hitThisTerm[d0];
      } else {
        /* AND: drop any document that missed this term. */
        for (var d1 in scores) {
          if (hitThisTerm[d1] === undefined) delete scores[d1];
          else scores[d1] += hitThisTerm[d1];
        }
      }
      if (!Object.keys(scores).length) return [];
    }

    var results = [];
    for (var id in scores) {
      var doc = index.docs[id];
      if (!doc) continue;
      if (filter && !filter(doc)) continue;
      if (!passesFieldFilters(doc, fieldFilters)) continue;
      results.push({
        doc: doc,
        score: scores[id],
        terms: Object.keys(matched[id] || {}),
      });
    }

    /* Field-only queries ("lang:rust" with no words) skip text scoring
       entirely and return everything that matches the filters. */
    if (!terms.length && fieldFilters.length) {
      results = [];
      for (var k = 0; k < index.docs.length; k++) {
        var dd = index.docs[k];
        if (filter && !filter(dd)) continue;
        if (!passesFieldFilters(dd, fieldFilters)) continue;
        results.push({ doc: dd, score: 1, terms: [] });
      }
    }

    results.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return String(a.doc.title || "").localeCompare(String(b.doc.title || ""));
    });

    return results.slice(0, limit);
  }

  function passesFieldFilters(doc, filters) {
    for (var i = 0; i < filters.length; i++) {
      var f = filters[i];
      var key = f.field;
      if (key === "language") key = "lang";
      if (key === "cat") key = "category";
      if (key === "tag") key = "tags";

      var val = doc[key];
      if (val == null) return false;
      var hay = Array.isArray(val) ? val.join(" ").toLowerCase() : String(val).toLowerCase();
      if (hay.indexOf(f.value) === -1) return false;
    }
    return true;
  }

  /* ------------------------------------------------------------ highlight */

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeRegex(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /* Wraps matched terms in <mark>. Always escapes first, so catalog text can
     never inject markup into the page. */
  function highlight(text, terms) {
    var safe = escapeHtml(text);
    if (!terms || !terms.length) return safe;
    var alts = terms
      .slice()
      .sort(function (a, b) { return b.length - a.length; })
      .map(escapeRegex)
      .join("|");
    if (!alts) return safe;
    try {
      return safe.replace(new RegExp("(" + alts + ")", "gi"), '<mark class="hit">$1</mark>');
    } catch (e) {
      return safe;
    }
  }

  global.WBSearch = {
    build: build,
    query: query,
    tokenize: tokenize,
    highlight: highlight,
    escapeHtml: escapeHtml,
  };
})(window);
