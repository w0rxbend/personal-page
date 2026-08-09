/* ============================================================================
   Profile, résumé and account data.

   The employment history, technology lists and education below are transcribed
   from the detailed CV (Oleksandr_Balyshyn-detailed.pdf) and should stay in
   step with it. If the CV changes, change this file — not the markup.

   A note on the skill bars: the bar length is years of production use derived
   from the employment history below, normalised against the total career
   length. It is not a self-assessed "percentage of mastery", because that
   number would mean nothing to a reader.
   ========================================================================= */

window.WB_PROFILE = {
  person: {
    name: "Oleksandr Balyshyn",
    title: "Java/Scala Software Engineer",
    specialisms: [
      "distributed systems",
      "stream processing",
      "JVM platform work",
      "Scala 3 libraries",
      "Linux tooling",
      "IoT and embedded",
    ],
    location: "Kyiv, Ukraine",
    email: "oleksandr.balyshyn@gmail.com",
    phone: "+380 96 199 03 67",
    telegram: "https://t.me/oleksandr_balyshyn",
    telegramLabel: "@oleksandr_balyshyn",
    careerStart: 2016,

    /* Straight from the CV's Introduction section. */
    intro:
      "Senior Software Engineer with 9+ years architecting fault-tolerant distributed systems " +
      "serving millions of telecom subscribers and handling petabyte-scale data pipelines. " +
      "Proven expertise in designing cloud-native infrastructure that reduced compute costs by 20% " +
      "while improving reliability. Deep proficiency in the Scala/JVM ecosystem (Cats, Akka, FS2) " +
      "for building low-latency, high-throughput systems; equally strong in Java and modern cloud " +
      "platforms. Track record of building reusable abstractions and frameworks that enable teams " +
      "to ship faster and reduce operational complexity in production environments.",

    /* The other half of the story: what gets built outside working hours. */
    osIntro:
      "Away from the day job the work is hardware and tooling rather than telecom: air-quality " +
      "sensors, ESP32 cameras speaking a hand-rolled binary TCP protocol, OBS Studio control " +
      "surfaces, and declarative Linux provisioning. None of it is commercial — it is unpaid " +
      "engineering on problems I actually have, which is why the repositories carry real READMEs, " +
      "CI pipelines and release artifacts rather than a weekend's commits.",
  },

  metrics: [
    { val: "9+", suffix: "", lbl: "Years engineering" },
    { val: "5", suffix: "B", lbl: "Daily events ingested" },
    { val: "1", suffix: "M", lbl: "Events / second peak" },
    { val: "20", suffix: "%", lbl: "Cloud cost reduction" },
  ],

  /* ------------------------------------------------------ employment ---- */

  jobs: [
    {
      id: "lotusflare",
      start: "Feb 2021",
      end: "Nov 2025",
      duration: "4 yrs 10 mos",
      role: "Senior Software Engineer",
      team: "Platform team",
      company: "LotusFlare",
      location: "US · Remote",
      blurb: "A product company providing cloud-native SaaS platforms for leading telecom providers.",
      points: [
        "Led platform team of 3 engineers building infrastructure that ingested **5B+ daily events** from telecom networks, reducing time-to-insight from hours to **sub-second latency** through real-time Kafka Streams pipelines.",
        "Designed and implemented reusable **Scala/JVM infrastructure framework** reducing new platform service onboarding from **3 weeks to 2 days**, enabling rapid feature delivery across the organization.",
        "Architected cloud-agnostic **serverless framework on Kubernetes** replacing 20+ always-on worker processes with an event-driven model, cutting annual cloud infrastructure costs by **20%** while improving scalability.",
        "Engineered distributed stream processing architecture handling **1M events/sec** with sub-100ms latency, serving real-time dashboards for executive decision-making on network quality and subscriber behavior.",
        "Led JVM performance optimization initiative tuning GC, heap sizing, and container configurations, reducing **95th percentile latency by 60%** and improving reliability SLA from **99.5% to 99.95%**.",
      ],
      tech: [
        "Scala 2.12/2.13", "Monix", "akka-http", "http4s", "cats", "fs2-kafka", "cats-effect",
        "Java 17", "Apache Camel", "GC tuning", "Kubernetes", "Kafka", "Redis", "Cassandra",
        "AWS (S3, SSM, SNS, SQS)", "Azure Blob Storage", "GCP Cloud Storage",
      ],
    },
    {
      id: "epam",
      start: "Feb 2020",
      end: "Feb 2021",
      duration: "1 yr 1 mo",
      role: "Senior Java Software Engineer",
      company: "EPAM",
      location: "US · Remote",
      blurb: "Global provider of software product engineering and digital platform engineering services.",
      points: [
        "Led delivery of **Spring Boot microservices** handling patient data for a **top-3 US healthcare provider**, managing compliance at scale (**100M+ patient records**) with zero security incidents and maintaining **99.99% uptime SLA**.",
        "Designed fault-tolerant distributed system architecture supporting **10M+ daily transactions** across multiple cloud platforms (Azure, PCF), reducing deployment failures by **50%** through improved CI/CD practices.",
        "Established performance and reliability guardrails, implementing observability that caught critical bugs before production, reducing **incident response time by 50%**.",
        "Mentored junior engineers on distributed system design principles and Spring Boot best practices.",
      ],
      tech: ["Java 8", "Spring Boot", "Microsoft Azure", "Azure Functions", "Service Bus", "MsSQL", "Jenkins", "PCF"],
    },
    {
      id: "unicorn",
      start: "Jan 2018",
      end: "Feb 2020",
      duration: "2 yrs 2 mos",
      role: "Software Engineer",
      company: "Unicorn",
      location: "CZ · Remote",
      blurb: "A European company providing information systems and solutions.",
      points: [
        "Architected core algorithms for **TERRE LIBRA** pilot, a mission-critical cross-border energy exchange platform connecting grid operators across **6 countries**, enabling secure peer-to-peer energy trading at continental scale.",
        "Optimized real-time energy balancing algorithms reducing calculation latency from **2s to 200ms**, enabling dynamic pricing and preventing grid instability during peak demand periods.",
        "Designed distributed cache and async task queue patterns in the Unicorn Application Framework, adopted across the company enabling **20+ platforms** to achieve **5x throughput improvement**.",
        "Migrated full-text search from custom indexing to **Elasticsearch**, achieving **6x query latency improvement** and enabling new features (autocomplete, faceted search) that increased platform adoption by **40%**.",
        "Built integration layer supporting RSS/Atom standards for the Nordic Availability Collection System, consolidating disparate data sources and reducing data pipeline latency from batch to real-time.",
      ],
      tech: ["Java 8", "Spring Boot", "MongoDB", "RabbitMQ", "Elasticsearch", "ReactJS", "NodeJS"],
    },
    {
      id: "omniesoft",
      start: "Jan 2016",
      end: "Jan 2018",
      duration: "2 yrs 1 mo",
      role: "Software Engineer",
      company: "OmnieSoft",
      location: "Ukraine",
      blurb: "Backend engineering for small-business e-commerce platforms.",
      points: [
        "Built e-commerce platform (backend) serving **500+ small businesses** with features like inventory management, CRM, and order processing, achieving **99.9% uptime** and handling **100K+ daily transactions**.",
        "Designed inventory management system with real-time stock tracking and low-stock alerts, reducing stockouts by **30%** and improving customer satisfaction.",
        "Architected CRM module with appointment scheduling, enabling businesses to increase booking conversion by **25%** and average transaction value by **15%**.",
      ],
      tech: ["Java", "Spring", "MySQL", "REST"],
    },
  ],

  /* --------------------------------------------------------- skills ----- */
  /* `yrs` is years of production use inferred from the employment history
     above. The bar is that number over the 9-year career length. */

  skillGroups: [
    {
      glyph: "λ",
      title: "Languages & Frameworks",
      items: [
        { name: "Java", yrs: 9, note: "Spring Boot" },
        { name: "Scala", yrs: 5, note: "Akka, Cats, http4s" },
        { name: "Spring Boot", yrs: 5, note: "" },
        { name: "cats-effect / FS2", yrs: 5, note: "" },
        { name: "Monix / akka-http", yrs: 5, note: "" },
        { name: "JavaScript / Node.js", yrs: 2, note: "ReactJS" },
      ],
    },
    {
      glyph: "◷",
      title: "Data & Messaging",
      items: [
        { name: "Kafka", yrs: 5, note: "Streams, Connect" },
        { name: "Cassandra", yrs: 5, note: "" },
        { name: "Redis", yrs: 5, note: "" },
        { name: "PostgreSQL / SQL", yrs: 9, note: "" },
        { name: "Elasticsearch", yrs: 2, note: "" },
        { name: "MongoDB / RabbitMQ", yrs: 2, note: "" },
      ],
    },
    {
      glyph: "☁",
      title: "Infrastructure & Cloud",
      items: [
        { name: "Docker", yrs: 7, note: "" },
        { name: "Kubernetes", yrs: 5, note: "" },
        { name: "AWS", yrs: 5, note: "Lambda, S3, SSM" },
        { name: "Azure", yrs: 5, note: "Functions, Service Bus" },
        { name: "Jenkins", yrs: 3, note: "" },
        { name: "GCP", yrs: 3, note: "Cloud Storage" },
      ],
    },
  ],

  education: [
    {
      date: "Dec 2019",
      degree: "Master of Science in Software Engineering",
      school: "Khmelnitsky National University",
      place: "Khmelnytskyi, Ukraine",
    },
    {
      date: "May 2018",
      degree: "Bachelor of Science in Software Engineering",
      school: "Khmelnitsky National University",
      place: "Khmelnytskyi, Ukraine",
    },
  ],

  /* -------------------------------------------------------- accounts ---- */
  /* Counts are a snapshot from the GitHub REST API on the date in
     WB_CATALOG.generatedAt. They are indicative, not live. */

  accounts: [
    {
      handle: "w0rxbend",
      name: "Oleksandr B.",
      url: "https://github.com/w0rxbend",
      role: "Main account",
      repos: 53,
      followers: 277,
      site: "https://readme.worxbend.com/",
      note:
        "The largest of the three and the one with the broadest range: ESP32 camera firmware and " +
        "its Go frame server, Twitch and OBS browser-source overlays, the Scala 3 OpenCV binding, " +
        "and whole libraries ported into unfamiliar languages to learn them.",
      picks: ["scalacv", "spycam", "instachron", "obs-effects", "system-bootstrap"],
    },
    {
      handle: "worxbend",
      name: "worxbend",
      url: "https://github.com/worxbend",
      role: "Tooling & products",
      repos: 28,
      followers: 3,
      site: "https://about.worxbend.com",
      note:
        "Where the finished tools live. The OBS Studio control suite, the five-platform AirGradient " +
        "air-quality family, and the declarative Linux provisioning tools — the repositories with " +
        "release binaries, install scripts and documentation sites.",
      picks: ["scenedeck", "obsctl-rs", "obs-stats", "airgradient-cli", "fluxion", "binstaller"],
    },
    {
      handle: "oleksandr-balyshyn",
      name: "Oleksandr Balyshyn",
      url: "https://github.com/oleksandr-balyshyn",
      role: "Named / CV-facing",
      repos: 4,
      followers: 64,
      site: "",
      note:
        "The account under my own name, kept deliberately small. It holds glyphora, a Scala 3 " +
        "terminal-UI toolkit with reactive signals and native-image builds, plus a GTK4 desk " +
        "controller and bootstrap scripts.",
      picks: ["glyphora", "deskctl", "bootstrap-scripts"],
    },
  ],
};
