// @helix:story USER-136000
// Features section component — TypeScript, framework-agnostic, drop-in ready.

export interface FeatureItem {
  /** Unique identifier (used for keyed rendering). */
  id: string;
  /** Inline SVG markup for the feature icon. Provide a complete <svg> element. */
  icon: string;
  /** Feature title shown prominently on the card. */
  title: string;
  /** Short description (1–2 sentences) explaining the feature. */
  description: string;
}

export interface FeaturesSectionConfig {
  /** Short label rendered as the pill above the title (e.g. "Why choose us"). */
  eyebrow?: string;
  /** Section headline. The trailing word is automatically accented. */
  title: string;
  /** Supporting copy shown under the headline. */
  subtitle?: string;
  /** The word inside `title` that should receive the gradient accent. */
  accentWord?: string;
  /** List of 3–6 feature cards to render. */
  features: FeatureItem[];
  /** Optional id applied to the section element. */
  id?: string;
}

const DEFAULT_CONFIG: Required<Pick<FeaturesSectionConfig, "eyebrow">> = {
  eyebrow: "Why choose us",
};

/**
 * Builds the Features section as an HTMLElement.
 * Returns a self-contained `<section>` that ships its own scoped CSS.
 */
export function createFeaturesSection(config: FeaturesSectionConfig): HTMLElement {
  if (!config || !Array.isArray(config.features) || config.features.length < 3) {
    throw new Error(
      "createFeaturesSection: at least 3 features are required (3–6 recommended).",
    );
  }
  if (config.features.length > 6) {
    throw new Error("createFeaturesSection: a maximum of 6 features is supported.");
  }

  const { title, subtitle, features, id } = config;
  const eyebrow = config.eyebrow ?? DEFAULT_CONFIG.eyebrow;
  const accentWord = config.accentWord ?? title.split(" ").slice(-1)[0] ?? "";

  const section = document.createElement("section");
  section.className = "features-section";
  section.setAttribute("aria-labelledby", "features-heading");
  if (id) section.id = id;

  section.innerHTML = `
    <div class="features-container">
      <header class="features-header">
        <span class="features-eyebrow">${escapeHtml(eyebrow)}</span>
        <h2 id="features-heading" class="features-title">
          ${escapeHtml(title).replace(
            escapeHtml(accentWord),
            `<span class="accent">${escapeHtml(accentWord)}</span>`,
          )}
        </h2>
        ${subtitle ? `<p class="features-subtitle">${escapeHtml(subtitle)}</p>` : ""}
      </header>

      <ul class="features-grid" role="list">
        ${features.map((f) => renderCard(f)).join("")}
      </ul>
    </div>
  `;

  return section;
}

function renderCard(feature: FeatureItem): string {
  return `
    <li class="feature-card">
      <span class="feature-icon" aria-hidden="true">${feature.icon}</span>
      <h3 class="feature-title">${escapeHtml(feature.title)}</h3>
      <p class="feature-description">${escapeHtml(feature.description)}</p>
    </li>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Default content used by the demo entry point. */
export const defaultFeaturesConfig: FeaturesSectionConfig = {
  eyebrow: "Why choose us",
  title: "Everything you need to launch faster",
  subtitle:
    "Production-ready building blocks, thoughtful defaults, and a polished experience out of the box — so your team can focus on what makes your product unique.",
  accentWord: "faster",
  features: [
    {
      id: "performance",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/></svg>`,
      title: "Lightning fast",
      description:
        "Optimized rendering and zero-runtime overhead keep your pages snappy on every device.",
    },
    {
      id: "secure",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
      title: "Secure by default",
      description:
        "Hardened defaults, sanitized inputs, and best-practice patterns baked in from day one.",
    },
    {
      id: "customizable",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>`,
      title: "Fully customizable",
      description:
        "Theme tokens, layout primitives, and copy that adapts to your brand in minutes.",
    },
    {
      id: "responsive",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
      title: "Responsive layouts",
      description:
        "Mobile-first grids that gracefully reflow from phone to ultra-wide displays.",
    },
    {
      id: "analytics",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 5-6"/></svg>`,
      title: "Insightful analytics",
      description:
        "Understand what works with first-class telemetry hooks ready to integrate.",
    },
    {
      id: "support",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/></svg>`,
      title: "Priority support",
      description:
        "Real humans, fast responses, and detailed guidance when you need it most.",
    },
  ],
};