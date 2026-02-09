import { useEffect } from "react";

const DOMAIN = "https://rentalyachtindubai.com";

const DEFAULT_META = {
  title: "Rental Yacht Dubai - Premium Yacht Charters & Dhow Cruises",
  description: "Experience Dubai from the water with premium yacht charters, dhow cruises, and luxury marine experiences. Book your unforgettable Dubai cruise today.",
  ogImage: `${DOMAIN}/logo.jpeg`,
  ogType: "website",
};

interface PageMetaProps {
  title: string;
  description: string;
  ogImage?: string;
  canonicalPath: string;
  ogType?: string;
}

function setMetaTag(property: string, content: string, isName = false) {
  const attr = isName ? "name" : "property";
  let el = document.querySelector(`meta[${attr}="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

const PageMeta = ({ title, description, ogImage, canonicalPath, ogType = "website" }: PageMetaProps) => {
  useEffect(() => {
    const absoluteImage = ogImage
      ? ogImage.startsWith("http") ? ogImage : `${DOMAIN}${ogImage.startsWith("/") ? "" : "/"}${ogImage}`
      : DEFAULT_META.ogImage;

    const canonicalUrl = `${DOMAIN}${canonicalPath}`;

    // Title
    document.title = title;

    // Standard meta
    setMetaTag("description", description, true);

    // Open Graph
    setMetaTag("og:title", title);
    setMetaTag("og:description", description);
    setMetaTag("og:image", absoluteImage);
    setMetaTag("og:url", canonicalUrl);
    setMetaTag("og:type", ogType);
    setMetaTag("og:site_name", "Rental Yacht Dubai");

    // Twitter
    setMetaTag("twitter:card", "summary_large_image", true);
    setMetaTag("twitter:title", title, true);
    setMetaTag("twitter:description", description, true);
    setMetaTag("twitter:image", absoluteImage, true);

    // Canonical
    setCanonical(canonicalUrl);

    // Cleanup: restore defaults on unmount
    return () => {
      document.title = DEFAULT_META.title;
      setMetaTag("description", DEFAULT_META.description, true);
      setMetaTag("og:title", DEFAULT_META.title);
      setMetaTag("og:description", DEFAULT_META.description);
      setMetaTag("og:image", DEFAULT_META.ogImage);
      setMetaTag("og:url", DOMAIN);
      setMetaTag("og:type", DEFAULT_META.ogType);
      setMetaTag("twitter:title", DEFAULT_META.title, true);
      setMetaTag("twitter:description", DEFAULT_META.description, true);
      setMetaTag("twitter:image", DEFAULT_META.ogImage, true);
      setCanonical(DOMAIN);
    };
  }, [title, description, ogImage, canonicalPath, ogType]);

  return null;
};

export default PageMeta;
