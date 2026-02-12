/**
 * Converts markdown text to HTML for frontend rendering.
 * Matches the preview logic used in the admin RichTextEditor.
 */
export function renderMarkdown(text: string): string {
  if (!text) return "";

  let html = text
    // Escape HTML
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Headers
    .replace(
      /^### (.+)$/gm,
      '<h3 class="text-lg font-semibold mt-4 mb-2 text-foreground">$1</h3>'
    )
    .replace(
      /^## (.+)$/gm,
      '<h2 class="text-xl font-bold mt-6 mb-3 text-foreground border-b border-border pb-2">$1</h2>'
    )
    // Bold
    .replace(
      /\*\*(.+?)\*\*/g,
      '<strong class="font-semibold text-foreground">$1</strong>'
    )
    // Italic
    .replace(
      /\*(.+?)\*/g,
      '<em class="italic text-secondary">$1</em>'
    )
    // Links
    .replace(
      /\[(.+?)\]\((.+?)\)/g,
      '<a href="$2" class="text-secondary underline hover:text-secondary/80 font-medium">$1</a>'
    )
    // Blockquotes
    .replace(
      /^> (.+)$/gm,
      '<blockquote class="border-l-4 border-secondary pl-4 italic text-muted-foreground my-3">$1</blockquote>'
    )
    // Horizontal rules
    .replace(/^---$/gm, '<hr class="my-6 border-border" />')
    // List items
    .replace(
      /^- (.+)$/gm,
      '<li class="ml-4 list-disc text-muted-foreground">$1</li>'
    )
    // Paragraphs (double newlines)
    .replace(
      /\n\n/g,
      '</p><p class="my-3 text-muted-foreground leading-relaxed">'
    )
    // Single newlines
    .replace(/\n/g, "<br />");

  // Wrap in paragraph tags
  html =
    '<p class="my-3 text-muted-foreground leading-relaxed">' + html + "</p>";

  // Fix list items to be wrapped in ul
  html = html.replace(
    /(<li[^>]*>.*?<\/li>)+/g,
    '<ul class="my-3 space-y-1">$&</ul>'
  );

  return html;
}
