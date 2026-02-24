import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Share2, Download, ZoomIn, Images, Camera, Sparkles } from "lucide-react";
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
    if (e.key === "Escape") setLightboxIndex(null);
    else if (e.key === "ArrowRight") setLightboxIndex((prev) => prev !== null ? (prev + 1) % filteredImages.length : null);
    else if (e.key === "ArrowLeft") setLightboxIndex((prev) => prev !== null ? (prev - 1 + filteredImages.length) % filteredImages.length : null);
  }, [lightboxIndex, filteredImages.length]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  const handleShare = async () => {
    if (lightboxIndex === null) return;
    const image = filteredImages[lightboxIndex];
    if (navigator.share) {
      try { await navigator.share({ title: image.alt, url: image.src }); } catch {}
    } else {
      navigator.clipboard.writeText(image.src);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const } },
  };

  return (
    <Layout>
      <PageMeta
        title="Gallery - Rental Yacht Dubai"
        description="Browse our stunning gallery of yacht experiences, dhow cruises, and luxury marine moments in Dubai."
        canonicalPath="/gallery"
      />

      {/* ─── Hero Section ─── */}
      <section className="relative py-20 sm:py-24 md:py-32 bg-primary text-primary-foreground overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/40 to-primary z-10" />
          <img src={dubaiMarinaNight} alt="Dubai Marina" className="w-full h-full object-cover" />
        </motion.div>

        <div className="container relative z-20">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-secondary/15 backdrop-blur-md text-secondary px-3 py-1.5 rounded-full mb-4 border border-secondary/25"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Camera className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide">Visual Journey</span>
            </motion.div>

            <motion.h1
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Photo Gallery
            </motion.h1>

            <motion.p
              className="text-primary-foreground/80 text-sm sm:text-lg md:text-xl leading-relaxed max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Explore stunning moments from our dhow cruise experiences.
              From breathtaking skyline views to unforgettable dining moments.
            </motion.p>

            <motion.div
              className="flex items-center gap-4 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full border border-primary-foreground/10">
                <ZoomIn className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium">{images.length} Photos</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full border border-primary-foreground/10">
                <Sparkles className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium">{dbCategories.length} Categories</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Gallery Section ─── */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="container">
          {/* Sticky Filter Tabs */}
          <motion.div
            className="sticky top-16 md:top-[72px] z-30 bg-background/95 backdrop-blur-lg py-3 sm:py-4 -mx-4 px-4 sm:mx-0 sm:px-0 mb-6 sm:mb-10 border-b border-border/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex gap-2 overflow-x-auto scrollbar-hide snap-x-mandatory sm:flex-wrap sm:justify-center">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-semibold transition-all flex-shrink-0 snap-start touch-target text-xs sm:text-sm whitespace-nowrap border ${
                    selectedCategory === category.name
                      ? "bg-secondary text-secondary-foreground border-secondary shadow-md shadow-secondary/20"
                      : "bg-card text-muted-foreground hover:text-foreground border-border hover:border-secondary/40 hover:bg-muted/50"
                  }`}
                >
                  {category.name}
                  <span className={`ml-1.5 text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    selectedCategory === category.name
                      ? "bg-white/20"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Loading State */}
          {imagesLoading ? (
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className={`rounded-xl w-full break-inside-avoid ${
                    index % 4 === 0 ? "h-72" : index % 3 === 0 ? "h-56" : "h-48"
                  }`}
                />
              ))}
            </div>
          ) : filteredImages.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-5">
                <Images className="w-10 h-10 text-muted-foreground/40" />
              </div>
              <p className="text-muted-foreground text-lg font-medium mb-2">No photos found</p>
              <p className="text-muted-foreground/70 text-sm">
                {selectedCategory === "All"
                  ? "No images in the gallery yet."
                  : `Try selecting a different category.`}
              </p>
              {selectedCategory !== "All" && (
                <Button
                  variant="outline"
                  className="mt-4 rounded-xl"
                  onClick={() => setSelectedCategory("All")}
                >
                  View All Photos
                </Button>
              )}
            </motion.div>
          ) : (
            /* True Masonry Layout */
            <motion.div
              className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4 space-y-3 sm:space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key={selectedCategory}
            >
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  variants={itemVariants}
                  className="group relative overflow-hidden rounded-xl sm:rounded-2xl cursor-pointer break-inside-avoid"
                  onClick={() => setLightboxIndex(index)}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {/* Center zoom icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-11 h-11 sm:w-14 sm:h-14 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 scale-75 group-hover:scale-100 transition-transform duration-300">
                        <ZoomIn className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                    </div>

                    {/* Bottom info */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                      <p className="text-white text-xs sm:text-sm font-semibold line-clamp-1 mb-1">{image.alt}</p>
                      <span className="inline-block px-2 py-0.5 bg-secondary/80 text-secondary-foreground text-[10px] sm:text-xs rounded-full font-medium">
                        {image.category}
                      </span>
                    </div>
                  </div>

                  {/* Subtle bottom gradient always visible on mobile */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-primary/40 to-transparent sm:hidden pointer-events-none" />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Results count */}
          {!imagesLoading && filteredImages.length > 0 && (
            <motion.p
              className="text-center text-sm text-muted-foreground mt-8 sm:mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Showing {filteredImages.length} of {images.length} photos
              {selectedCategory !== "All" && (
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="ml-2 text-secondary hover:text-secondary/80 font-semibold transition-colors"
                >
                  · View All
                </button>
              )}
            </motion.p>
          )}
        </div>
      </section>

      {/* ─── Enhanced Lightbox ─── */}
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
              className="absolute top-4 right-4 z-20 text-white hover:text-secondary transition-colors w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full touch-target"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close lightbox"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
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
                className="text-white hover:text-secondary bg-white/10 backdrop-blur-sm rounded-full w-10 h-10 sm:w-11 sm:h-11"
                onClick={(e) => { e.stopPropagation(); handleShare(); }}
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-secondary bg-white/10 backdrop-blur-sm rounded-full w-10 h-10 sm:w-11 sm:h-11"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(filteredImages[lightboxIndex].src, '_blank');
                }}
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </motion.div>

            {/* Image counter */}
            <motion.div
              className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-medium"
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
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full text-white hover:text-secondary hover:bg-white/20 transition-colors touch-target"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => prev !== null ? (prev - 1 + filteredImages.length) % filteredImages.length : null);
                  }}
                  aria-label="Previous image"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.button>

                <motion.button
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full text-white hover:text-secondary hover:bg-white/20 transition-colors touch-target"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex((prev) => prev !== null ? (prev + 1) % filteredImages.length : null);
                  }}
                  aria-label="Next image"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.button>
              </>
            )}

            {/* Main image */}
            <motion.div
              className="relative max-w-[92vw] max-h-[80vh] sm:max-h-[85vh]"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={lightboxIndex}
                  src={filteredImages[lightboxIndex].src}
                  alt={filteredImages[lightboxIndex].alt}
                  className="max-w-full max-h-[80vh] sm:max-h-[85vh] object-contain rounded-lg sm:rounded-xl"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.25 }}
                  draggable={false}
                />
              </AnimatePresence>
            </motion.div>

            {/* Image info at bottom */}
            <motion.div
              className="absolute bottom-16 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 text-center max-w-[80vw]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <p className="text-white font-medium text-sm sm:text-base mb-1 truncate">{filteredImages[lightboxIndex].alt}</p>
              <span className="inline-block px-3 py-1 bg-secondary/80 text-secondary-foreground text-xs sm:text-sm rounded-full font-medium">
                {filteredImages[lightboxIndex].category}
              </span>
            </motion.div>

            {/* Thumbnail strip (desktop) */}
            {filteredImages.length > 1 && (
              <motion.div
                className="absolute bottom-20 sm:bottom-16 left-1/2 -translate-x-1/2 z-20 hidden sm:flex gap-1.5 px-3 py-2 bg-white/10 backdrop-blur-md rounded-xl overflow-x-auto max-w-[85vw] scrollbar-hide"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                {filteredImages.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); }}
                    className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden transition-all duration-200 ${
                      idx === lightboxIndex
                        ? "ring-2 ring-secondary ring-offset-2 ring-offset-black scale-105"
                        : "opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </motion.div>
            )}

            {/* Keyboard hint */}
            <motion.p
              className="absolute bottom-4 right-4 z-20 text-white/40 text-[11px] hidden sm:block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              ← → navigate · ESC close
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Gallery;
