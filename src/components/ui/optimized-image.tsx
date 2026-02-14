import { useState, memo, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ImageSource {
  src: string;
  width: number;
}

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  /** Array of image sources for srcset - provide multiple sizes for responsive loading */
  sources?: ImageSource[];
  /** Sizes attribute for responsive images (e.g., "(max-width: 768px) 100vw, 50vw") */
  sizes?: string;
  /** Priority loading for above-the-fold images */
  priority?: boolean;
  /** Aspect ratio for the container (e.g., "16/9", "4/3", "1/1") */
  aspectRatio?: string;
  /** Object fit behavior */
  objectFit?: "cover" | "contain" | "fill" | "none";
  /** Callback when image loads */
  onLoad?: () => void;
  /** WebP source URL (optional - for manual WebP fallback) */
  webpSrc?: string;
  /** Enable blur-up placeholder effect */
  blurUp?: boolean;
}

/**
 * Attempts to find a WebP version of the image URL
 * Assumes WebP images are stored in /webp/ subfolder or have .webp extension
 */
function getWebpUrl(src: string): string | null {
  if (!src) return null;
  
  // If already a WebP, return as-is
  if (src.endsWith(".webp")) return src;
  
  // Check if this is a Supabase storage URL
  if (src.includes("supabase") && src.includes("/storage/")) {
    // Try to construct WebP path
    // e.g., /main/image.jpg -> /main/webp/image.webp
    const urlParts = src.split("/");
    const fileName = urlParts.pop() || "";
    const folder = urlParts.pop() || "";
    
    // Only attempt WebP for images in main or gallery folders
    if (folder === "main" || folder === "gallery") {
      const baseName = fileName.replace(/\.(jpg|jpeg|png)$/i, "");
      const webpPath = [...urlParts, folder, "webp", `${baseName}.webp`].join("/");
      return webpPath;
    }
  }
  
  return null;
}

/**
 * Optimized image component with:
 * - Lazy loading with blur-up placeholder
 * - WebP fallback support via <picture> tag
 * - srcset support for responsive images
 * - Smooth fade-in animation
 * - Priority loading for LCP images
 * - Intersection Observer for lazy loading
 */
const OptimizedImage = memo(({
  src,
  alt,
  className,
  containerClassName,
  sources,
  sizes = "100vw",
  priority = false,
  aspectRatio,
  objectFit = "cover",
  onLoad,
  webpSrc,
  blurUp = true,
}: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [webpError, setWebpError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate srcset string from sources array
  const srcSet = sources?.map((s) => `${s.src} ${s.width}w`).join(", ");
  
  // Get WebP URL (either provided or auto-detected)
  const webpUrl = webpSrc || getWebpUrl(src);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !containerRef.current) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px 0px", // Start loading 50px before element is in view
        threshold: 0.01,
      }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    setLoaded(true);
  };

  const handleWebpError = () => {
    setWebpError(true);
  };

  // Determine object-fit class
  const objectFitClass = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
    none: "object-none",
  }[objectFit];

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-muted",
        aspectRatio && `aspect-[${aspectRatio}]`,
        containerClassName
      )}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Blur-up placeholder - shows a blurred gradient until image loads */}
      {blurUp && !loaded && !error && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-muted via-muted/80 to-muted animate-pulse"
          aria-hidden="true"
        />
      )}

      {/* Error fallback */}
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
          <svg
            className="w-12 h-12 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      ) : isInView ? (
        <picture>
          {/* WebP source - only show if we have a WebP URL and it hasn't errored */}
          {webpUrl && !webpError && (
            <source
              srcSet={webpUrl}
              type="image/webp"
              onError={handleWebpError as any}
            />
          )}
          
          {/* Fallback image */}
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            srcSet={srcSet}
            sizes={sizes}
            loading={priority ? "eager" : "lazy"}
            decoding={priority ? "sync" : "async"}
            fetchPriority={priority ? "high" : undefined}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              "w-full h-full transition-opacity duration-500",
              objectFitClass,
              loaded ? "opacity-100" : "opacity-0",
              className
            )}
          />
        </picture>
      ) : null}
    </div>
  );
});

OptimizedImage.displayName = "OptimizedImage";

export { OptimizedImage };
export type { OptimizedImageProps, ImageSource };
