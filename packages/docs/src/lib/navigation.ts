export interface NavigationPage {
  title: string;
  href: string;
  priority?: number;
}

export interface NavigationSection {
  title: string;
  links: NavigationPage[];
}

export const navigation: NavigationSection[] = [
  {
    title: "Introduction",
    links: [
      { title: "Getting started", href: "/" },
      { title: "Troubleshooting", href: "/troubleshooting" },
      { title: "Manual installation", href: "/manual-installation" },
      { title: "Configuration", href: "/configuration" },
      { title: "How does it work?", href: "/how-does-it-work" },
    ],
  },
  // {
  //   title: "Core concepts",
  //   links: [
  //     { title: "Understanding caching", href: "/understanding-caching" },
  //     {
  //       title: "Predicting user behavior",
  //       href: "/predicting-user-behavior",
  //     },
  //     { title: "Basics of time-travel", href: "/basics-of-time-travel" },
  //     {
  //       title: "Introduction to string theory",
  //       href: "/introduction-to-string-theory",
  //     },
  //     { title: "The butterfly effect", href: "/the-butterfly-effect" },
  //   ],
  // },
  // {
  //   title: "Advanced guides",
  //   links: [
  //     { title: "Writing plugins", href: "/writing-plugins" },
  //     { title: "Neuralink integration", href: "/neuralink-integration" },
  //     { title: "Temporal paradoxes", href: "/temporal-paradoxes" },
  //     { title: "Testing", href: "/testing" },
  //     { title: "Compile-time caching", href: "/compile-time-caching" },
  //     {
  //       title: "Predictive data generation",
  //       href: "/predictive-data-generation",
  //     },
  //   ],
  // },
  {
    title: "SDK Reference",
    links: [
      {
        title: "toFulfillCriterion",
        href: "/sdk-reference/to-fulfill-criterion",
      },
      {
        title: "outputFulfillsCriterion",
        href: "/sdk-reference/output-fulfills-criterion",
      },
    ],
  },
  // {
  //   title: "Contributing",
  //   links: [
  //     { title: "How to contribute", href: "/how-to-contribute" },
  //     { title: "Architecture guide", href: "/architecture-guide" },
  //     { title: "Design principles", href: "/design-principles" },
  //   ],
  // },
  {
    title: "Essays",
    links: [
      {
        title: "AI Testing as part of Full-Stack Engineering",
        href: "/essays/ai-testing-as-part-of-fullstack-engineering",
      },
      {
        title: "How To Write Unit Tests for Your AI Web App",
        href: "/essays/how-to-write-unit-tests-for-ai-web-app",
      },
      {
        title: "Case Study - Unit Testing a Legal AI App",
        href: "/essays/unit-testing-a-legal-ai-app",
      },
    ],
  },
];
