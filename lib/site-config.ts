export const siteConfig = {
  name: "Muhammad Gane",
  title: "Muhammad Gane",
  description:
    "AI/ML Dev | Python & React/React Native Programmer | Consultant & Advisor in Financial Services & Fintech",
  tagline: "Building tools that think",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://muhammadgane.com",
  author: {
    name: "Muhammad Gane",
    email: "m.turnergane@example.com",
    url: "https://muhammadgane.com",
  },
  links: {
    github: "https://github.com/m-turnergane",
    linkedin: "https://www.linkedin.com/in/muhammad-gane/",
    x: "https://x.com/turner_obt",
    medium: "https://medium.com/@m.turnergane",
  },
  nav: [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "Automation", href: "/automation" },
    { name: "Writing", href: "/writing" },
    { name: "Trading Lab", href: "/trading-lab" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
