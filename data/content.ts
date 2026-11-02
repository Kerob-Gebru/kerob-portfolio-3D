/**
 * Every word on the page except the project cards (see data/projects.ts).
 * Edit here; nothing in the components needs to change.
 */

export const brand = {
  name: "Kerob",
  wordmark: "KEROB",
  email: "kerobgebru32@gmail.com",
  github: "https://github.com/Kerob-Gebru",
  linkedin: "https://linkedin.com/in/kerob-gebru-108740348",
};

export const nav = [
  { label: "About", href: "#about" },
  { label: "Timeline", href: "#log" },
  { label: "Stack", href: "#trajectory" },
  { label: "Projects", href: "#missions" },
  { label: "Contact", href: "#reserve" },
];

export const hero = {
  title: "KEROB",
  kicker: "Full-stack engineer · Addis Ababa",
  site: "Addis Ababa · 9.03°N 38.74°E",
};

export const about = {
  eyebrow: "Profile",
  heading: "Full-stack engineering, rooted in Ethiopia.",
  body: [
    "I’m a Computer Science & Engineering graduate of Adama Science and Technology University (ASTU) and a software engineer based in Addis Ababa, focused on high-impact technical solutions and modular, reliable systems.",
    "My work spans full-stack development, microservices and cloud infrastructure: resilient service pipelines and database schemas that hold up under heavy load, and codebases refactored into clean architectural divisions.",
    "Right now that experience goes into KBCoffeeLink, a B2B marketplace connecting Ethiopian coffee washing stations with licensed exporters.",
  ],
  facts: [
    ["Role", "Software Engineer"],
    ["Company", "Tech Solutions Inc."],
    ["Education", "B.Sc. CSE · ASTU"],
    ["Based in", "Addis Ababa, ET"],
    ["Focus", "Full-stack · Microservices"],
    ["Status", "Open to opportunities"],
  ] as [string, string][],
};

export const intro = {
  eyebrow: "Timeline",
  heading: "Four chapters, frame by frame.",
  body: "From the lecture hall at ASTU to production systems, and the marketplace I’m building now.",
};

export const log = [
  {
    tag: "2018 — 2022",
    title: "ASTU",
    sub: "B.Sc. Computer Science & Engineering",
    body: "Adama Science and Technology University. 3.22 major GPA, 3.11 CGPA.",
  },
  {
    tag: "2022 — 2024",
    title: "Innovative Tech Labs",
    sub: "Software Developer",
    body: "Designed and ran end-to-end and unit testing processes, lifting baseline code coverage by 25%.",
  },
  {
    tag: "2024 — Now",
    title: "Tech Solutions Inc.",
    sub: "Software Engineer",
    body: "Automated service pipelines and database schemas holding 99.99% availability under heavy load; core components refactored into clean architectural divisions.",
  },
  {
    tag: "Now",
    title: "KBCoffeeLink",
    sub: "In progress",
    body: "A B2B marketplace taking Ethiopian coffee from washing stations to licensed exporters.",
  },
];

/** Legs of the SOURCE → PRODUCTION trajectory, in drawing order. */
export const trajectory = {
  eyebrow: "Stack",
  heading: "From source to production, drawn as you scroll.",
  start: "SOURCE",
  end: "PRODUCTION",
  legs: [
    {
      day: "Orbit",
      title: "Languages",
      body: "Where everything starts: the languages I build in, from typed web services to smart contracts.",
      items: ["TypeScript", "JavaScript", "Python", "SQL", "Solidity"],
    },
    {
      day: "Coast",
      title: "Frameworks",
      body: "Interfaces and services, from React and Next.js on the client to NestJS and Express behind it.",
      items: ["React", "Next.js", "Node.js", "Express.js", "NestJS", "Tailwind CSS", "Vite"],
    },
    {
      day: "Capture",
      title: "Data & messaging",
      body: "Where state lives and moves: relational and document stores, caching, and message queues.",
      items: ["PostgreSQL", "MongoDB", "Redis", "Firebase", "RabbitMQ"],
    },
    {
      day: "Landing",
      title: "Delivery",
      body: "Getting it to production: version control, pipelines, containers and cloud.",
      items: ["Git", "GitHub Actions", "Docker", "AWS", "REST APIs"],
    },
  ],
};

export const missions = {
  eyebrow: "Projects",
  heading: "Selected missions.",
  note: "One orbit ring per technology.",
};

export const reserve = {
  eyebrow: "Contact",
  heading: "Open a channel.",
  body: "Open to opportunities, collaborations, and conversations about building technology for local markets.",
  clockLabel: "Local time · Addis Ababa (EAT)",
  topics: ["Job opportunity", "Project / freelance", "Collaboration", "Just saying hi"],
};
