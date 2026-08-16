/* ============================================================================
   Profile and résumé data.

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
      "Nine years on the JVM. Telecom ingest at 1M events/sec sustained, 10M at peak, roughly " +
      "80 billion a day, on Kafka, Cassandra and Kubernetes. Scala where the type system pays " +
      "for itself — cats-effect, FS2, Monix, http4s — Java where it does not. I build the layer " +
      "other teams build on: a service framework that cut onboarding from three weeks to two " +
      "days, a serverless runtime that took 20% off the cloud bill, GC work that halved p95.",
  },

  metrics: [
    { val: "9+", suffix: "", lbl: "Years on the JVM" },
    { val: "80", suffix: "B", lbl: "Events ingested / day" },
    { val: "10", suffix: "M", lbl: "Events / sec at peak" },
    { val: "20", suffix: "%", lbl: "Cloud spend removed" },
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
      blurb: "Cloud-native SaaS platforms for tier-one telecom operators.",
      points: [
        "Ran a 3-engineer platform team on the telecom ingest path: **~80B events a day**, **1M/sec sustained**, **10M/sec at peak**. Kafka Streams replaced the batch jobs. Time-to-insight: hours to **sub-second**.",
        "Wrote the **Scala/JVM service framework** the platform is built on. New service onboarding went from **3 weeks to 2 days**.",
        "Built a cloud-agnostic **serverless runtime on Kubernetes**. 20+ always-on workers became event-driven and now scale to zero: **20% off the annual cloud bill**.",
        "Held the stream path under **100ms end-to-end** at that volume. The dashboards executives watch during an incident read from it.",
        "Tuned GC, heap and container limits across the fleet: **p95 latency down 60%**, availability from **99.5% to 99.95%**.",
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
      blurb: "Product and platform engineering services, worldwide.",
      points: [
        "Led delivery of the **Spring Boot microservices** holding patient data for a **top-3 US healthcare provider** — **100M+ records** under HIPAA, **zero security incidents**, **99.99% uptime**.",
        "Designed the fault-tolerant architecture carrying **10M+ transactions a day** across Azure and PCF, then rebuilt CI/CD around it: **deployment failures halved**.",
        "Moved observability in front of the release instead of after it: bugs caught pre-production, **incident response down 50%**.",
        "Mentored junior engineers on distributed-system design and where Spring Boot's defaults stop being enough.",
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
      blurb: "European information systems, mostly for the energy sector.",
      points: [
        "Wrote the core algorithms for the **TERRE LIBRA** pilot — a cross-border balancing-energy exchange wiring grid operators in **6 countries** together. Get it wrong and a national grid notices.",
        "Cut the real-time balancing calculation from **2s to 200ms**. That is what made dynamic pricing viable at peak demand.",
        "Designed the distributed cache and async task-queue patterns in the Unicorn Application Framework. **20+ platforms** adopted them; **5x throughput**.",
        "Moved full-text search off hand-rolled indexing onto **Elasticsearch**: **6x faster queries**, plus autocomplete and faceting — adoption up **40%**.",
        "Built the RSS/Atom integration layer for the Nordic Availability Collection System. Batch imports became a real-time feed.",
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
      blurb: "Backend for small-business e-commerce.",
      points: [
        "Built the backend serving **500+ small businesses** — inventory, CRM, orders. **100K+ transactions a day** at **99.9% uptime**.",
        "Real-time stock tracking with low-stock alerts cut **stockouts by 30%**.",
        "Added appointment scheduling to the CRM: **+25% booking conversion**, **+15% average transaction value**.",
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
};
