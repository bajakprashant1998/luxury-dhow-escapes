import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Camera, ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

const ImageGallery = ({ images, title }: ImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
  };

  const goToPrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
        case "Escape":
          setIsLightboxOpen(false);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, goToPrevious, goToNext]);

  return (
    <>
      {/* Mobile Swipe Gallery */}
      <div className="md:hidden -mx-4">
        <div className="flex overflow-x-auto snap-x-mandatory scrollbar-hide">
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0 w-full snap-center cursor-pointer relative"
              onClick={() => openLightbox(index)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {!loadedImages[index] && (
                <Skeleton className="absolute inset-0 w-full h-[280px]" />
              )}
              <img
                src={image}
                alt={`${title} - ${index + 1}`}
                onLoad={() => handleImageLoad(index)}
                className={cn(
                  "w-full h-[280px] object-cover",
                  loadedImages[index] ? "opacity-100" : "opacity-0"
                )}
              />
              {/* Image counter */}
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <span className="text-white text-sm font-medium">
                  {index + 1} / {images.length}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Swipe indicator dots */}
        <div className="flex justify-center gap-1.5 mt-3 px-4">
          {images.slice(0, Math.min(5, images.length)).map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === 0 ? "bg-secondary w-4" : "bg-muted-foreground/30"
              )}
            />
          ))}
          {images.length > 5 && (
            <span className="text-xs text-muted-foreground ml-1">+{images.length - 5}</span>
          )}
        </div>
      </div>

      {/* Desktop Gallery Grid */}
      <motion.div 
        className="hidden md:grid grid-cols-4 gap-2 md:gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Main Large Image */}
        <motion.div 
          className="col-span-4 md:col-span-2 row-span-2 cursor-pointer group relative overflow-hidden rounded-xl md:rounded-2xl"
          onClick={() => openLightbox(0)}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          {!loadedImages[0] && (
            <Skeleton className="absolute inset-0 w-full h-[420px]" />
          )}
          <img
            src={images[0]}
            alt={title}
            onLoad={() => handleImageLoad(0)}
            className={cn(
              "w-full h-[420px] object-cover transition-all duration-700 group-hover:scale-110",
              loadedImages[0] ? "opacity-100" : "opacity-0"
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Zoom Icon */}
          <motion.div 
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.1 }}
          >
            <ZoomIn className="w-5 h-5 text-foreground" />
          </motion.div>

          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              openLightbox(0);
            }}
            className="absolute bottom-4 right-4 bg-card/95 backdrop-blur-sm hover:bg-card px-4 py-2.5 rounded-xl font-medium text-sm shadow-lg flex items-center gap-2 transition-all touch-target"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Camera className="w-4 h-4" />
            View all {images.length} photos
          </motion.button>
        </motion.div>

        {/* Smaller Images */}
        {images.slice(1, 5).map((image, index) => (
          <motion.div
            key={index}
            className="cursor-pointer group relative overflow-hidden rounded-lg md:rounded-xl"
            onClick={() => openLightbox(index + 1)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
            whileHover={{ scale: 1.03 }}
          >
            {!loadedImages[index + 1] && (
              <Skeleton className="absolute inset-0 w-full h-[200px]" />
            )}
            <img
              src={image}
              alt={`${title} - ${index + 2}`}
              loading="lazy"
              onLoad={() => handleImageLoad(index + 1)}
              className={cn(
                "w-full h-[200px] object-cover transition-all duration-500 group-hover:scale-110",
                loadedImages[index + 1] ? "opacity-100" : "opacity-0"
              )}
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Show More overlay on last visible image */}
            {index === 3 && images.length > 5 && (
              <motion.div 
                className="absolute inset-0 bg-black/60 flex items-center justify-center"
                whileHover={{ backgroundColor: "rgba(0,0,0,0.7)" }}
              >
                <span className="text-white font-semibold text-lg">
                  +{images.length - 5} more
                </span>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Lightbox Modal */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/98 border-none">
          <div className="relative w-full h-[90vh] flex items-center justify-center">
            {/* Close Button */}
            <DialogClose className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <X className="w-5 h-5 text-white" />
            </DialogClose>

            {/* Navigation Arrows - Larger touch targets on mobile */}
            <motion.button
              onClick={goToPrevious}
              className="absolute left-2 md:left-4 z-50 w-14 h-14 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors touch-target"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-7 h-7 md:w-6 md:h-6 text-white" />
            </motion.button>
            <motion.button
              onClick={goToNext}
              className="absolute right-2 md:right-4 z-50 w-14 h-14 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors touch-target"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-7 h-7 md:w-6 md:h-6 text-white" />
            </motion.button>

            {/* Main Image with Animation */}
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedIndex}
                src={images[selectedIndex]}
                alt={`${title} - ${selectedIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              />
            </AnimatePresence>

            {/* Image Counter */}
            <motion.div 
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-white font-medium">
                {selectedIndex + 1} / {images.length}
              </span>
            </motion.div>

            {/* Thumbnail Strip */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto py-2 px-4 scrollbar-hide">
              {images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={cn(
                    "flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden transition-all duration-200",
                    selectedIndex === index
                      ? "ring-2 ring-secondary opacity-100 scale-110"
                      : "opacity-50 hover:opacity-80"
                  )}
                  whileHover={{ scale: selectedIndex === index ? 1.1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageGallery;
