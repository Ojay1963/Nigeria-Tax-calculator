import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function updateMeta(selector, content) {
  const element = document.querySelector(selector);
  if (!element || typeof content !== "string") {
    return () => {};
  }

  const previous = element.getAttribute("content") ?? "";
  element.setAttribute("content", content);
  return () => element.setAttribute("content", previous);
}

export default function SeoHead({ title, description, schema = [], canonicalPath }) {
  const location = useLocation();

  useEffect(() => {
    const previousTitle = document.title;
    const cleanSchema = Array.isArray(schema) ? schema.filter(Boolean) : [];
    const canonicalHref = (() => {
      if (typeof window === "undefined") {
        return canonicalPath || location.pathname;
      }

      const path = canonicalPath || location.pathname;
      return new URL(path, window.location.origin).toString();
    })();

    document.title = title;

    const restoreDescription = updateMeta('meta[name="description"]', description);
    const restoreOgTitle = updateMeta('meta[property="og:title"]', title);
    const restoreOgDescription = updateMeta('meta[property="og:description"]', description);
    const restoreOgUrl = updateMeta('meta[property="og:url"]', canonicalHref);
    const restoreTwitterTitle = updateMeta('meta[name="twitter:title"]', title);
    const restoreTwitterDescription = updateMeta('meta[name="twitter:description"]', description);

    let canonicalElement = document.querySelector('link[rel="canonical"]');
    const hadCanonical = Boolean(canonicalElement);
    const previousCanonical = canonicalElement?.getAttribute("href") ?? "";

    if (!canonicalElement) {
      canonicalElement = document.createElement("link");
      canonicalElement.setAttribute("rel", "canonical");
      document.head.append(canonicalElement);
    }

    canonicalElement.setAttribute("href", canonicalHref);

    const scriptElements = cleanSchema.map((entry, index) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-schema", `${index}`);
      script.textContent = JSON.stringify(entry);
      document.head.append(script);
      return script;
    });

    return () => {
      document.title = previousTitle;
      restoreDescription();
      restoreOgTitle();
      restoreOgDescription();
      restoreOgUrl();
      restoreTwitterTitle();
      restoreTwitterDescription();
      if (canonicalElement) {
        if (hadCanonical) {
          canonicalElement.setAttribute("href", previousCanonical);
        } else {
          canonicalElement.remove();
        }
      }
      scriptElements.forEach(script => script.remove());
    };
  }, [canonicalPath, description, location.pathname, schema, title]);

  return null;
}
