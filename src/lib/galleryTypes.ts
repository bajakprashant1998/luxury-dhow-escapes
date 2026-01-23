export interface GalleryImage {
  id: string;
  image_url: string;
  title: string | null;
  category: string | null;
  tour_id: string | null;
  sort_order: number | null;
  created_at: string | null;
}

export interface GalleryImageDisplay {
  id: string;
  src: string;
  alt: string;
  category: string;
}

export function mapGalleryImage(dbImage: GalleryImage): GalleryImageDisplay {
  return {
    id: dbImage.id,
    src: dbImage.image_url,
    alt: dbImage.title || "Gallery image",
    category: dbImage.category || "Uncategorized",
  };
}
