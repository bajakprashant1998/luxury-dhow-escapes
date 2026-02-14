import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Share2, Download, ZoomIn, Images } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PageMeta from "@/components/PageMeta";
import { useGallery, useGalleryCategories } from "@/hooks/useGallery";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import dubaiMarinaNight from "@/assets/dubai-marina-night.webp";

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data: images = [], isLoading: imagesLoading } = useGallery();
  const { data: dbCategories = [] } = useGalleryCategories();

  // Build categories list with image counts
  const categories = [
    { name: "All", count: images.length },
    ...dbCategories.map(cat => ({
      name: cat,
      count: images.filter(img => img.category === cat).length,
    })),
  ];

  const filteredImages =
    selectedCategory === "All"
      ? images
      : images.filter((img) => img.category === selectedCategory);

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (lightboxIndex === null) return;
    
    if (e.key === "Escape") {
      setLightboxIndex(null);
    } else if (e.key === "ArrowRight") {
      setLightboxIndex((prev) => 
        prev !== null ? (prev + 1) % filteredImages.length : null
      );
    } else if (e.key === "ArrowLeft") {
      setLightboxIndex((prev) => 
        prev !== null ? (prev - 1 + filteredImages.length) % filteredImages.length : null
      );
    }
  }, [lightboxIndex, filteredImages.length]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

  const handleShare = async () => {
    if (lightboxIndex === null) return;
    const image = filteredImages[lightboxIndex];
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.alt,
          url: image.src,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(image.src);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: [0, 0, 0.2, 1] as const },
    },
  };

  return (
    <Layout>
      <PageMeta
        title="Gallery - Rental Yacht Dubai"
        description="Browse our stunning gallery of yacht experiences, dhow cruises, and luxury marine moments in Dubai."
        canonicalPath="/gallery"
      />
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-primary text-primary-foreground overflow-hidden">
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-primary z-10" />
          <img
            src={dubaiMarinaNight}
            alt="Dubai Marina"
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="container relative z-20">
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="flex items-center gap-3 mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Images className="w-5 h-5 text-secondary" />
              <p className="text-secondary font-semibold tracking-wider uppercase">
                Visual Journey
              </p>
            </motion.div>
            <motion.h1 
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Photo Gallery
            </motion.h1>
            <motion.p 
              className="text-primary-foreground/80 text-lg md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Explore stunning moments from our dhow cruise experiences. 
              From breathtaking skyline views to unforgettable dining moments.
            </motion.p>
            
            {/* Image count badge */}
            <motion.div 
              className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-primary-foreground/10 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <ZoomIn className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium">{images.length} Photos</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-primary-foreground/40 rounded-full flex items-start justify-center p-1"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div 
              className="w-1.5 h-2.5 bg-secondary rounded-full"
              animate={{ opacity: [1, 0.3, 1], y: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Gallery Section */}
      <section className="py-10 sm:py-16">
        <div className="container px-4 sm:px-6">
          {/* Filter Tabs with Animation */}
          <motion.div 
            className="flex gap-2 overflow-x-auto scrollbar-hide snap-x-mandatory pb-2 mb-8 sm:mb-12 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {categories.map((category) => (
              <motion.button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`relative px-4 sm:px-6 py-2 rounded-full font-medium transition-all flex-shrink-0 snap-start touch-target text-sm sm:text-base whitespace-nowrap ${
                  selectedCategory === category.name
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{category.name}</span>
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                  selectedCategory === category.name 
                    ? "bg-secondary-foreground/20" 
                    : "bg-background"
                }`}>
                  {category.count}
                </span>
                {selectedCategory === category.name && (
                  <motion.div
                    className="absolute inset-0 bg-secondary rounded-full -z-10"
                    layoutId="galleryFilterBackground"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Loading State */}
          {imagesLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Skeleton className={`rounded-xl ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-square'}`} />
                </motion.div>
              ))}
            </div>
          ) : filteredImages.length === 0 ? (
            /* Empty State */
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Images className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-lg">
                {selectedCategory === "All"
                  ? "No images in the gallery yet."
                  : `No images found in "${selectedCategory}" category.`}
              </p>
            </motion.div>
          ) : (
            /* Masonry-style Image Grid */
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key={selectedCategory}
            >
              <AnimatePresence mode="popLayout">
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    variants={itemVariants}
                    layout
                    className={`group relative overflow-hidden rounded-xl cursor-pointer ${
                      index % 5 === 0 ? 'sm:row-span-2 aspect-[3/4] sm:aspect-auto' : 'aspect-square'
                    }`}
                    onClick={() => setLightboxIndex(index)}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                      {/* Zoom icon */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <motion.div
                          className="w-12 h-12 bg-primary-foreground/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                          initial={{ scale: 0 }}
                          whileHover={{ scale: 1.1 }}
                        >
                          <ZoomIn className="w-5 h-5 text-primary-foreground" />
                        </motion.div>
                      </div>
                      
                      {/* Bottom info */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                        <p className="text-primary-foreground text-sm font-medium line-clamp-1">{image.alt}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-secondary/80 text-secondary-foreground text-xs rounded-full">
                          {image.category}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Enhanced Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close button */}
            <motion.button
              className="absolute top-4 right-4 z-20 text-white hover:text-secondary transition-colors w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full touch-target"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close lightbox"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6" />
            </motion.button>

            {/* Action buttons */}
            <motion.div
              className="absolute top-4 left-4 z-20 flex gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-secondary bg-white/10 backdrop-blur-sm rounded-full"
                onClick={(e) => { e.stopPropagation(); handleShare(); }}
              >
                <Share2 className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-secondary bg-white/10 backdrop-blur-sm rounded-full"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  window.open(filteredImages[lightboxIndex].src, '_blank');
                }}
              >
                <Download className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* Image counter */}
            <motion.div
              className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {lightboxIndex + 1} / {filteredImages.length}
            </motion.div>

            {/* Navigation arrows */}
            {filteredImages.length > 1 && (
              <>
                <motion.button
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full text-white hover:text-secondary hover:bg-white/20 transition-colors touch-target"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => 
                      prev !== null ? (prev - 1 + filteredImages.length) % filteredImages.length : null
                    );
                  }}
                  aria-label="Previous image"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className="w-6 h-6" />
                </motion.button>
                
                <motion.button
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full text-white hover:text-secondary hover:bg-white/20 transition-colors touch-target"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => 
                      prev !== null ? (prev + 1) % filteredImages.length : null
                    );
                  }}
                  aria-label="Next image"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.button>
              </>
            )}

            {/* Main image */}
            <motion.div
              className="relative max-w-[90vw] max-h-[85vh] sm:max-h-[90vh]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={lightboxIndex}
                  src={filteredImages[lightboxIndex].src}
                  alt={filteredImages[lightboxIndex].alt}
                  className="max-w-full max-h-[85vh] sm:max-h-[90vh] object-contain rounded-lg"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  draggable={false}
                />
              </AnimatePresence>
            </motion.div>

            {/* Image info at bottom */}
            <motion.div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <p className="text-white font-medium mb-1">{filteredImages[lightboxIndex].alt}</p>
              <span className="inline-block px-3 py-1 bg-secondary/80 text-secondary-foreground text-sm rounded-full">
                {filteredImages[lightboxIndex].category}
              </span>
            </motion.div>

            {/* Thumbnail strip */}
            {filteredImages.length > 1 && (
              <motion.div
                className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 hidden sm:flex gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl overflow-x-auto max-w-[80vw] scrollbar-hide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                {filteredImages.map((img, idx) => (
                  <motion.button
                    key={img.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(idx);
                    }}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                      idx === lightboxIndex 
                        ? 'ring-2 ring-secondary ring-offset-2 ring-offset-black' 
                        : 'opacity-60 hover:opacity-100'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img 
                      src={img.src} 
                      alt={img.alt}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Keyboard hint */}
            <motion.p
              className="absolute bottom-4 right-4 z-20 text-white/50 text-xs hidden sm:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Use ← → to navigate, ESC to close
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Gallery;
