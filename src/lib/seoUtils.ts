import { Tour } from "@/lib/tourMapper";

// Category slug mappings for SEO-friendly URLs
export const categoryPaths: Record<string, string> = {
  "dhow-cruise": "dhow-cruises",
  "yacht-shared": "shared-yacht-tours",
  "yacht-private": "private-yacht-charter",
  "megayacht": "megayacht-experiences",
};

// Reverse mapping for looking up category from path
export const pathToCategory: Record<string, string> = {
  "dhow-cruises": "dhow-cruise",
  "shared-yacht-tours": "yacht-shared",
  "private-yacht-charter": "yacht-private",
  "megayacht-experiences": "megayacht",
};

/**
 * Get SEO-friendly category path from category slug
 */
export function getCategoryPath(category: string): string {
  return categoryPaths[category] || category;
}

/**
 * Get original category slug from SEO-friendly path
 */
export function getCategoryFromPath(path: string): string {
  return pathToCategory[path] || path;
}

/**
 * Generate SEO-friendly URL for a tour
 * New format: /dubai/{category-path}/{seo-slug || slug}
 */
export function getTourUrl(tour: Tour): string {
  const categoryPath = getCategoryPath(tour.category);
  const tourSlug = tour.seoSlug || tour.slug;
  return `/dubai/${categoryPath}/${tourSlug}`;
}

/**
 * Generate SEO-friendly URL for a category
 * New format: /dubai/{category-path}
 */
export function getCategoryUrl(category: string): string {
  const categoryPath = getCategoryPath(category);
  return `/dubai/${categoryPath}`;
}

/**
 * Generate SEO-optimized slug from tour data
 * Pattern: {type}-{size/name}-{location}
 */
export function generateSeoSlug(
  title: string, 
  category: string, 
  location?: string
): string {
  // Extract meaningful keywords from title
  const titleSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Add location if available
  const locationSlug = location
    ? `-${location.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`
    : "";

  return `${titleSlug}${locationSlug}`;
}

/**
 * Check if a path is an old-format URL that needs redirecting
 */
export function isOldTourUrl(path: string): boolean {
  return path.startsWith("/tours/") && !path.startsWith("/tours?");
}

/**
 * Parse tour slug from old URL format
 */
export function getSlugFromOldUrl(path: string): string | null {
  const match = path.match(/^\/tours\/([^/?]+)/);
  return match ? match[1] : null;
}

/**
 * Check if a path is a new-format SEO URL
 */
export function isNewTourUrl(path: string): boolean {
  return path.startsWith("/dubai/");
}

/**
 * Parse tour slug from new URL format
 */
export function getSlugFromNewUrl(path: string): string | null {
  // Pattern: /dubai/{category}/{slug}
  const match = path.match(/^\/dubai\/[^/]+\/([^/?]+)/);
  return match ? match[1] : null;
}

/**
 * Parse category from new URL format
 */
export function getCategoryFromNewUrl(path: string): string | null {
  // Pattern: /dubai/{category}/{slug?}
  const match = path.match(/^\/dubai\/([^/]+)/);
  if (!match) return null;
  return pathToCategory[match[1]] || match[1];
}
