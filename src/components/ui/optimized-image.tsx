import { useState, memo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
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
}

/**
 * Optimized image component with:
 * - Lazy loading with skeleton placeholder
 * - srcset support for responsive images
 * - WebP format detection
 * - Smooth fade-in animation
 * - Priority loading for LCP images
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
}: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Generate srcset string from sources array
  const srcSet = sources?.map((s) => `${s.src} ${s.width}w`).join(", ");

  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    setLoaded(true);
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
      className={cn(
        "relative overflow-hidden bg-muted",
        aspectRatio && `aspect-[${aspectRatio}]`,
        containerClassName
      )}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Skeleton placeholder */}
      {!loaded && (
        <Skeleton className="absolute inset-0 w-full h-full" />
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
      ) : (
        <picture>
          {/* WebP source if available - browsers will pick first supported format */}
          {src.match(/\.(jpg|jpeg|png)$/i) && (
            <source
              type="image/webp"
              srcSet={srcSet?.replace(/\.(jpg|jpeg|png)/gi, ".webp") || src.replace(/\.(jpg|jpeg|png)$/i, ".webp")}
              sizes={sizes}
            />
          )}
          
          {/* Original format fallback */}
          <img
            src={src}
            alt={alt}
            srcSet={srcSet}
            sizes={sizes}
            loading={priority ? "eager" : "lazy"}
            decoding={priority ? "sync" : "async"}
            fetchPriority={priority ? "high" : "auto"}
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
      )}
    </div>
  );
});

OptimizedImage.displayName = "OptimizedImage";

export { OptimizedImage };
export type { OptimizedImageProps, ImageSource };
