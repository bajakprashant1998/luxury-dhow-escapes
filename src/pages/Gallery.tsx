import { useState } from "react";
import { X } from "lucide-react";
import Layout from "@/components/layout/Layout";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
    alt: "Dubai Marina skyline at night",
    category: "Skyline",
  },
  {
    src: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800",
    alt: "Traditional dhow boat",
    category: "Dhow",
  },
  {
    src: "https://images.unsplash.com/photo-1546412414-e1885259563a?w=800",
    alt: "Dubai Marina waterfront",
    category: "Skyline",
  },
  {
    src: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800",
    alt: "Luxury yacht dining",
    category: "Dining",
  },
  {
    src: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800",
    alt: "Dubai sunset view",
    category: "Skyline",
  },
  {
    src: "https://images.unsplash.com/photo-1533395427226-788cee25cc7b?w=800",
    alt: "Buffet dinner spread",
    category: "Dining",
  },
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    alt: "Evening entertainment",
    category: "Entertainment",
  },
  {
    src: "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800",
    alt: "Dubai skyline panorama",
    category: "Skyline",
  },
  {
    src: "https://images.unsplash.com/photo-1597659840241-37e2b9c2f55f?w=800",
    alt: "Cruise deck view",
    category: "Dhow",
  },
  {
    src: "https://images.unsplash.com/photo-1571406252241-db0280bd36cd?w=800",
    alt: "Fine dining setup",
    category: "Dining",
  },
  {
    src: "https://images.unsplash.com/photo-1549944850-84e00be4203b?w=800",
    alt: "Marina night lights",
    category: "Skyline",
  },
  {
    src: "https://images.unsplash.com/photo-1524824267900-2fa9cbf7a506?w=800",
    alt: "Traditional performance",
    category: "Entertainment",
  },
];

const categories = ["All", "Skyline", "Dhow", "Dining", "Entertainment"];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const filteredImages =
    selectedCategory === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920"
            alt="Dubai Marina"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10">
          <div className="max-w-2xl">
            <p className="text-secondary font-semibold tracking-wider uppercase mb-4">
              Visual Journey
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Photo Gallery
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              Explore stunning moments from our dhow cruise experiences. 
              From breathtaking skyline views to unforgettable dining moments.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16">
        <div className="container">
          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredImages.map((image, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer"
                onClick={() => setLightboxImage(image.src)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-colors duration-300 flex items-center justify-center">
                  <span className="text-primary-foreground font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    View
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-primary-foreground text-sm">{image.alt}</p>
                  <span className="text-secondary text-xs">{image.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-secondary transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={lightboxImage.replace("w=800", "w=1400")}
            alt="Gallery image"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </Layout>
  );
};

export default Gallery;
