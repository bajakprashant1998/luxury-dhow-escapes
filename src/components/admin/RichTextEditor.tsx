import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  Link,
  Minus,
  Quote,
  Sparkles,
  Eye,
  Edit3,
  Ship,
  MapPin,
  CalendarCheck,
  Utensils,
  Star,
  Loader2,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface RichTextEditorProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  helpText?: string;
  // Context for AI generation
  tourTitle?: string;
  tourCategory?: string;
  tourLocation?: string;
  descriptionType?: "short" | "long";
}

// Premium content templates
const contentTemplates = {
  yachtFeatures: `## Yacht Features

**Premium Vessel Specifications:**
- *Spacious sundeck* with premium loungers
- *Air-conditioned* main salon
- State-of-the-art sound system
- Fully equipped galley

`,
  amenities: `## Onboard Amenities

**Luxury Comforts Include:**
- *Gourmet catering* available
- Premium beverage selection
- Plush towels and linens
- Snorkeling equipment

`,
  destinations: `## Destinations

**Cruise Through Dubai's Iconic Waters:**
- *Burj Al Arab* – Sail past the world's most luxurious hotel
- *Palm Jumeirah* – Explore the magnificent man-made island
- *Dubai Marina* – Marvel at stunning skyline views

[Explore Our Popular Destinations →](/tours)

`,
  bookingInfo: `## Booking Information

**Flexible Charter Options:**
- *Private charters* for intimate gatherings
- Corporate event packages available
- Sunset and moonlight cruises

[View Charter Packages →](/contact)

`,
  experience: `## The Experience

*Indulge in an unforgettable maritime journey* where luxury meets the azure waters of Dubai. Every moment aboard is crafted to inspire wonder and create lasting memories.

**What Awaits You:**
- Breathtaking panoramic views
- *World-class hospitality*
- Seamless, personalized service

`,
};

const RichTextEditor = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 6,
  helpText,
  tourTitle = "",
  tourCategory = "",
  tourLocation = "",
  descriptionType = "short",
}: RichTextEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const insertAtCursor = useCallback(
    (before: string, after: string = "") => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      const newText =
        value.substring(0, start) +
        before +
        selectedText +
        after +
        value.substring(end);

      onChange(newText);

      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + before.length + selectedText.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    },
    [value, onChange]
  );

  const wrapSelection = useCallback(
    (wrapper: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end) || "text";
      const newText =
        value.substring(0, start) +
        wrapper +
        selectedText +
        wrapper +
        value.substring(end);

      onChange(newText);
    },
    [value, onChange]
  );

  const insertHeading = (level: 2 | 3) => {
    const prefix = level === 2 ? "## " : "### ";
    insertAtCursor("\n" + prefix, "\n");
  };

  const insertList = () => {
    insertAtCursor("\n- ", "\n");
  };

  const insertLink = () => {
    if (!linkUrl) return;
    const text = linkText || linkUrl;
    insertAtCursor(`[${text}](${linkUrl})`);
    setLinkUrl("");
    setLinkText("");
  };

  const insertDivider = () => {
    insertAtCursor("\n\n---\n\n");
  };

  const insertBlockquote = () => {
    insertAtCursor("\n> ", "\n");
  };

  const insertTemplate = (template: keyof typeof contentTemplates) => {
    const content = contentTemplates[template];
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const newText =
      value.substring(0, cursorPos) + content + value.substring(cursorPos);
    onChange(newText);
  };

  // AI Content Generation
  const generateWithAI = async () => {
    if (!tourTitle) {
      toast.error("Please enter a tour title first");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-tour-content`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            title: tourTitle,
            category: tourCategory,
            location: tourLocation,
            type: descriptionType,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Generation failed");
      }

      const data = await response.json();
      if (data.content) {
        onChange(data.content);
        toast.success("Content generated successfully!");
      }
    } catch (error) {
      console.error("AI generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  // Simple markdown to HTML preview
  const renderPreview = (text: string) => {
    if (!text) return "<p class='text-muted-foreground italic'>No content to preview</p>";

    let html = text
      // Escape HTML
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      // Headers
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2 text-foreground">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3 text-foreground border-b border-border pb-2">$1</h2>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em class="italic text-secondary">$1</em>')
      // Links
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-secondary underline hover:text-secondary/80 font-medium">$1</a>')
      // Blockquotes
      .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-secondary pl-4 italic text-muted-foreground my-3">$1</blockquote>')
      // Horizontal rules
      .replace(/^---$/gm, '<hr class="my-6 border-border" />')
      // List items
      .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-muted-foreground">$1</li>')
      // Paragraphs (double newlines)
      .replace(/\n\n/g, '</p><p class="my-3 text-muted-foreground leading-relaxed">')
      // Single newlines within paragraphs
      .replace(/\n/g, "<br />");

    // Wrap in paragraph tags
    html = '<p class="my-3 text-muted-foreground leading-relaxed">' + html + "</p>";

    // Fix list items to be wrapped in ul
    html = html.replace(
      /(<li[^>]*>.*?<\/li>)+/g,
      '<ul class="my-3 space-y-1">$&</ul>'
    );

    return html;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant={isPreview ? "ghost" : "secondary"}
            size="sm"
            onClick={() => setIsPreview(false)}
            className="h-7 px-2"
          >
            <Edit3 className="w-3.5 h-3.5 mr-1" />
            Edit
          </Button>
          <Button
            type="button"
            variant={isPreview ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setIsPreview(true)}
            className="h-7 px-2"
          >
            <Eye className="w-3.5 h-3.5 mr-1" />
            Preview
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      {!isPreview && (
        <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/50 rounded-t-md border border-b-0 border-input">
          {/* AI Generate Button */}
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={generateWithAI}
            disabled={isGenerating || !tourTitle}
            className="h-8 gap-1.5 px-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
            title={tourTitle ? "Generate premium content with AI" : "Enter tour title first"}
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">AI Generate</span>
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Formatting buttons */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => wrapSelection("**")}
            className="h-8 w-8 p-0"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => wrapSelection("*")}
            className="h-8 w-8 p-0"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertHeading(2)}
            className="h-8 w-8 p-0"
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertHeading(3)}
            className="h-8 w-8 p-0"
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertList}
            className="h-8 w-8 p-0"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertBlockquote}
            className="h-8 w-8 p-0"
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertDivider}
            className="h-8 w-8 p-0"
            title="Horizontal Divider"
          >
            <Minus className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Link popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Insert Link"
              >
                <Link className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Link Text</Label>
                  <Input
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Explore Our Fleet"
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">URL</Label>
                  <Input
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="/tours or https://..."
                    className="h-8"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={insertLink}
                    className="flex-1"
                  >
                    Insert Link
                  </Button>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Quick Links:</p>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { text: "Explore Our Fleet", url: "/tours" },
                      { text: "View Destinations", url: "/tours" },
                      { text: "Book Now", url: "/contact" },
                      { text: "Contact Us", url: "/contact" },
                    ].map((link) => (
                      <Button
                        key={link.url + link.text}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-6 text-xs"
                        onClick={() => {
                          setLinkText(link.text);
                          setLinkUrl(link.url);
                        }}
                      >
                        {link.text}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Template popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1 px-2"
                title="Insert Template"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-xs hidden sm:inline">Templates</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64" align="start">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground mb-2 font-medium">
                  Insert Premium Content Block:
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-9"
                  onClick={() => insertTemplate("yachtFeatures")}
                >
                  <Ship className="w-4 h-4 mr-2 text-secondary" />
                  Yacht Features
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-9"
                  onClick={() => insertTemplate("amenities")}
                >
                  <Utensils className="w-4 h-4 mr-2 text-secondary" />
                  Onboard Amenities
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-9"
                  onClick={() => insertTemplate("destinations")}
                >
                  <MapPin className="w-4 h-4 mr-2 text-secondary" />
                  Destinations
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-9"
                  onClick={() => insertTemplate("bookingInfo")}
                >
                  <CalendarCheck className="w-4 h-4 mr-2 text-secondary" />
                  Booking Info
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-9"
                  onClick={() => insertTemplate("experience")}
                >
                  <Star className="w-4 h-4 mr-2 text-secondary" />
                  The Experience
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Editor / Preview */}
      {isPreview ? (
        <div
          className={cn(
            "min-h-[150px] p-4 border rounded-md bg-background",
            "prose prose-sm max-w-none"
          )}
          style={{ minHeight: `${rows * 24 + 32}px` }}
          dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
        />
      ) : (
        <Textarea
          ref={textareaRef}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="rounded-t-none font-mono text-sm"
        />
      )}

      {helpText && (
        <p className="text-xs text-muted-foreground">{helpText}</p>
      )}

      {/* Quick formatting guide */}
      {!isPreview && (
        <div className="text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
          <span>
            <code className="bg-muted px-1 rounded">**bold**</code>
          </span>
          <span>
            <code className="bg-muted px-1 rounded">*italic*</code>
          </span>
          <span>
            <code className="bg-muted px-1 rounded">## Heading</code>
          </span>
          <span>
            <code className="bg-muted px-1 rounded">[link](/url)</code>
          </span>
          <span>
            <code className="bg-muted px-1 rounded">- list item</code>
          </span>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
