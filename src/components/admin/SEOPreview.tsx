interface SEOPreviewProps {
  title: string;
  description: string;
  slug: string;
  baseUrl?: string;
}

const SEOPreview = ({ 
  title, 
  description, 
  slug, 
  baseUrl = "luxury-dhow-escapes.lovable.app" 
}: SEOPreviewProps) => {
  const displayTitle = title || "Tour Title";
  const displayDescription = description || "Tour description will appear here...";
  const displayUrl = `${baseUrl}/tours/${slug || "tour-slug"}`;

  return (
    <div className="p-4 bg-background border border-border rounded-lg space-y-1">
      <p className="text-xs text-muted-foreground mb-2">Google Preview</p>
      <a 
        href="#" 
        className="text-lg text-blue-600 hover:underline line-clamp-1"
        onClick={(e) => e.preventDefault()}
      >
        {displayTitle.slice(0, 60)}{displayTitle.length > 60 ? "..." : ""}
      </a>
      <p className="text-sm text-emerald-700 line-clamp-1">{displayUrl}</p>
      <p className="text-sm text-muted-foreground line-clamp-2">
        {displayDescription.slice(0, 160)}{displayDescription.length > 160 ? "..." : ""}
      </p>
    </div>
  );
};

export default SEOPreview;
