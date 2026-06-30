import { useEffect } from "react";

// Lightweight, dependency-free document-head management for an SPA.
// Each page calls useSeo({...}); the next page that calls it overwrites the
// tags. We restore the title on unmount and remove any JSON-LD we injected.

const SITE_NAME = "Sanskruti";
const DEFAULT_DESC =
  "Handcrafted heritage weaves — premium sarees, lehengas, kurtis and bridal couture.";

function upsertMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export type SeoOptions = {
  title?: string;
  description?: string;
  image?: string;
  /** Structured data object rendered as a <script type="application/ld+json">. */
  jsonLd?: Record<string, any> | null;
};

export function useSeo({ title, description, image, jsonLd }: SeoOptions) {
  useEffect(() => {
    const prevTitle = document.title;
    const fullTitle = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
    const desc = description || DEFAULT_DESC;

    document.title = fullTitle;
    upsertMeta('meta[name="description"]', "name", "description", desc);
    upsertMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    upsertMeta('meta[property="og:description"]', "property", "og:description", desc);
    upsertMeta('meta[property="og:type"]', "property", "og:type", "website");
    upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", image ? "summary_large_image" : "summary");
    if (image) {
      upsertMeta('meta[property="og:image"]', "property", "og:image", image);
      upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", image);
    }

    let script: HTMLScriptElement | null = null;
    if (jsonLd) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      document.title = prevTitle;
      if (script) script.remove();
    };
  }, [title, description, image, JSON.stringify(jsonLd)]);
}
