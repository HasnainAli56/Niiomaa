export interface NavItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  isActive?: boolean;
  children?: {
    title: string;
    description: string;
    href?: string;
  }[];
}

export interface LandingContent {
  brand: {
    name: string;
    logoAlt: string;
  };
  navigation: {
    items: NavItem[];
    signIn: {
      label: string;
      href: string;
    };
    languages: {
      current: string;
      options: string[];
    };
  };
  hero: {
    giantBrandText: string;
    headline: {
      line1: string;
      line2: string;
    };
    subheadline: string;
    ctaButton: {
      label: string;
      href: string;
    };
  };
}

/**
 * Default Headless CMS Content
 * This model can be mapped directly to Plasmic, Strapi, Sanity, or AWS AppSync
 */
export const defaultLandingContent: LandingContent = {
  brand: {
    name: "NIIOMA",
    logoAlt: "NIIOMA Global Platform",
  },
  navigation: {
    items: [
      {
        label: "About",
        href: "#about",
        hasDropdown: true,
        isActive: true,
        children: [
          {
            title: "Overview",
            description: "The new operating system for global enterprise computing.",
            href: "#overview",
          },
          {
            title: "Vision",
            description: "A living global architecture built for trust, scale, and speed.",
            href: "#vision",
          },
          {
            title: "Our Mission",
            description: "Building the digital nervous system for planetary enterprise computing.",
            href: "#mission",
          },
          {
            title: "Leadership & Advisory",
            description: "Pioneers in distributed computing and enterprise intelligence.",
            href: "#leadership",
          },
          {
            title: "Culture & Principles",
            description: "Guiding practices that shape our global ecosystem.",
            href: "#culture",
          },
          {
            title: "AI for Good & Compliance",
            description: "Applying AI to social and environmental challenges.",
            href: "#ai-good",
          },
        ],
      },
      {
        label: "Ecosystem orchestration",
        href: "#ecosystem",
        hasDropdown: true,
        children: [
          {
            title: "Vendor Network",
            description: "Seamless interconnection for cloud, SaaS, and infrastructure partners.",
            href: "#vendor-network",
          },
          {
            title: "Cross-Cloud Federation",
            description: "Unified control plane spanning AWS, Azure, GCP, and private bare metal.",
            href: "#cloud-federation",
          },
          {
            title: "Smart Contracts & Settlement",
            description: "Automated SLA tracking and algorithmic inter-vendor billing.",
            href: "#contracts",
          },
        ],
      },
      {
        label: "Cognitive services",
        href: "#cognitive",
        hasDropdown: true,
        children: [
          {
            title: "Autonomous Decision Agents",
            description: "Self-healing enterprise workflows that adapt to live market signals.",
            href: "#agents",
          },
          {
            title: "Deep Semantic Search",
            description: "Instant knowledge retrieval across multi-terabyte internal repositories.",
            href: "#semantic-search",
          },
          {
            title: "Private Enterprise Models",
            description: "Custom fine-tuned weights hosted in isolated, compliant enclaves.",
            href: "#enterprise-models",
          },
        ],
      },
      {
        label: "Insights",
        href: "#insights",
      },
      {
        label: "FAQ",
        href: "#faq",
      },
      {
        label: "Membership",
        href: "#membership",
      },
    ],
    signIn: {
      label: "Sign in",
      href: "#signin",
    },
    languages: {
      current: "UK · EN",
      options: ["UK · EN", "US · EN", "EU · DE", "FR · FR", "JP · 日本語", "SG · EN"],
    },
  },
  hero: {
    giantBrandText: "NIIOMA",
    headline: {
      line1: "The New Operating System",
      line2: "for Global Business",
    },
    subheadline: "The trusted network for technology vendors and enterprises",
    ctaButton: {
      label: "Enter website",
      href: "#enter",
    },
  },
};
