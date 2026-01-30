
# AI Content Generation & WebP Image Conversion System

This plan covers two major enhancements: AI-powered content generation for premium tour descriptions and automatic WebP image conversion for all uploads.

---

## Feature 1: AI-Powered Content Generation

### Overview

Add an "AI Generate" button to the RichTextEditor that uses Lovable AI to auto-write premium, luxurious tour descriptions based on the tour title, category, and location.

### Implementation

#### 1.1 New Edge Function: `generate-tour-content`

Create a new edge function that calls Lovable AI Gateway to generate premium content.

| Parameter | Description |
|-----------|-------------|
| `title` | Tour title (e.g., "55ft Luxury Yacht Charter") |
| `category` | Tour category (yacht-private, dhow-cruise, etc.) |
| `location` | Tour location (Dubai Marina, etc.) |
| `type` | "short" or "long" description |

**AI Prompt Strategy:**
- Use a detailed system prompt that enforces the luxury writing style
- Include markdown formatting instructions (headings, bold, italic)
- Request internal links to /tours, /contact, etc.
- Ensure scannable, conversion-focused content

#### 1.2 Update RichTextEditor Component

Add a new "AI Generate" button to the toolbar:
- Shows a sparkle icon with loading state
- Accepts context props: `tourTitle`, `tourCategory`, `tourLocation`
- Calls the edge function and streams/inserts generated content
- Shows toast on success/error

#### 1.3 Update TourForm Integration

Pass the current form values (title, category, location) to the RichTextEditor so the AI has context for generation.

---

## Feature 2: Automatic WebP Image Conversion

### Overview

Create a complete image processing pipeline that converts all uploaded JPG/PNG images to WebP format with configurable quality settings.

### Architecture

```text
┌─────────────────────┐     ┌──────────────────────────┐     ┌─────────────────┐
│  Admin Uploads      │────▶│  convert-image-webp      │────▶│  Storage Bucket │
│  JPG / PNG          │     │  Edge Function           │     │  /webp/ folder  │
└─────────────────────┘     │  (using sharp via Deno)  │     └─────────────────┘
                            └──────────────────────────┘
```

### Implementation

#### 2.1 New Edge Function: `convert-image-webp`

Create an edge function that:
1. Receives image file as base64 or form-data
2. Validates file type (only JPG, JPEG, PNG allowed)
3. Converts to WebP using quality settings
4. Removes EXIF metadata
5. Uploads to Supabase Storage in `/webp/` folder
6. Returns the WebP public URL

**Technical Details:**
- Use Deno's image manipulation capabilities or a Wasm-based solution
- Quality: 75-85% (configurable)
- Preserve aspect ratio
- Max width: 1920px (configurable)
- Strip metadata for privacy/size

#### 2.2 New Reusable Upload Hook: `useImageUpload`

Create a centralized hook for all image uploads:

| Feature | Description |
|---------|-------------|
| File validation | Only accept JPG, JPEG, PNG |
| Size limit | Max 5MB |
| Auto-conversion | Call edge function for WebP |
| Progress tracking | Show upload progress |
| Preview | Generate local preview before upload |

#### 2.3 Update Upload Components

Modify all image upload components to use the new hook:

| Component | Changes |
|-----------|---------|
| `TourForm.tsx` | Main image + gallery uploads |
| `GalleryUploadDialog.tsx` | Gallery image uploads |
| Any future upload components | Use shared hook |

#### 2.4 New Admin Settings: Image Conversion

Add image settings to the Settings page:

| Setting | Default | Description |
|---------|---------|-------------|
| WebP Quality | 80% | Compression quality (75-95) |
| Max Width | 1920px | Maximum image width |
| Enable WebP | true | Toggle WebP conversion |

Store these in `site_settings` table.

#### 2.5 Update OptimizedImage Component

Enhance the component to use `<picture>` tag with WebP fallback:

```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="...">
</picture>
```

**Logic:**
- If URL ends in `.webp`, serve directly
- If legacy URL (jpg/png), attempt to find WebP version
- Fallback gracefully if WebP doesn't exist

---

## Storage Structure

```text
tour-images/
  ├── main/
  │   └── webp/
  │       └── 1234567890-abc123.webp
  ├── gallery/
  │   └── webp/
  │       └── 1234567890-xyz789.webp
  └── legacy/  (optional - keep originals)
```

---

## Files to Create

| File | Purpose |
|------|---------|
| `supabase/functions/generate-tour-content/index.ts` | AI content generation |
| `supabase/functions/convert-image-webp/index.ts` | WebP conversion |
| `src/hooks/useImageUpload.ts` | Centralized upload hook |

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/admin/RichTextEditor.tsx` | Add AI generate button |
| `src/components/admin/TourForm.tsx` | Pass context to RichTextEditor, use new upload hook |
| `src/components/admin/GalleryUploadDialog.tsx` | Use new upload hook |
| `src/components/ui/optimized-image.tsx` | Add picture tag for WebP fallback |
| `src/pages/admin/Settings.tsx` | Add image settings section |
| `supabase/config.toml` | Register new edge functions |

---

## Technical Details

### AI Content Generation Prompt

The edge function will use a carefully crafted prompt:

```text
You are a luxury copywriter for a premium yacht charter company in Dubai.

Write a {type} description for: {title}
Category: {category}
Location: {location}

Requirements:
- Use markdown: ## headings, **bold** for key features, *italic* for experiences
- Include 2-3 internal links: [text](/tours), [text](/contact)
- Tone: Luxurious, inviting, aspirational
- Focus on: Experiences, exclusivity, Dubai landmarks
- Make content scannable with bullet points
- End with a subtle call-to-action
```

### WebP Conversion Approach

Since Deno doesn't have native sharp support, we'll use one of these approaches:

**Option A: Browser-compatible Canvas API (Recommended)**
- Use Deno's web APIs to decode/encode images
- Leverage `ImageBitmap` and `OffscreenCanvas`
- Works without external dependencies

**Option B: External Service Call**
- Call a lightweight image processing service
- Return the processed image

### Upload Flow

```text
1. User selects file
2. Validate: JPG/PNG only, max 5MB
3. Generate local preview
4. Send to edge function
5. Edge function:
   a. Decode image
   b. Resize if > 1920px
   c. Convert to WebP at 80% quality
   d. Upload to Storage
   e. Return WebP URL
6. Update form with new URL
7. Show success toast with file size comparison
```

---

## Security Considerations

- Sanitize file names (remove special chars, generate unique ID)
- Validate file signatures (magic bytes), not just extension
- Rate limit uploads per user
- Max file size enforced both client and server side

---

## Expected Outcomes

**AI Content Generation:**
- 80% faster content creation for new tours
- Consistent premium tone across all descriptions
- Proper markdown formatting for SEO

**WebP Conversion:**
- 25-40% smaller file sizes
- Improved Core Web Vitals (LCP)
- Automatic optimization without manual effort
- Backwards compatible with fallback images
