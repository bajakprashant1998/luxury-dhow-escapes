/**
 * Export data to CSV file
 */
export function exportToCsv<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns?: { key: keyof T; label: string }[]
): void {
  if (data.length === 0) {
    console.warn("No data to export");
    return;
  }

  // If no columns specified, use all keys from first item
  const cols = columns || Object.keys(data[0]).map((key) => ({
    key: key as keyof T,
    label: formatHeader(key),
  }));

  // Create header row
  const headers = cols.map((col) => escapeCSV(col.label));
  
  // Create data rows
  const rows = data.map((item) =>
    cols.map((col) => {
      const value = item[col.key];
      return escapeCSV(formatValue(value));
    })
  );

  // Combine header and rows
  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

  // Create and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Escape value for CSV (handle commas, quotes, newlines)
 */
function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Format header from camelCase or snake_case to Title Case
 */
function formatHeader(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Format value for CSV export
 */
function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (Array.isArray(value)) {
    return value.join("; ");
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

/**
 * Export bookings data
 */
export function exportBookings(bookings: Array<{
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  tour_name: string;
  booking_date: string;
  adults: number;
  children: number;
  infants: number;
  total_price: number;
  status: string;
  created_at: string;
}>) {
  exportToCsv(bookings, `bookings-${new Date().toISOString().split("T")[0]}`, [
    { key: "customer_name", label: "Customer Name" },
    { key: "customer_email", label: "Email" },
    { key: "customer_phone", label: "Phone" },
    { key: "tour_name", label: "Tour" },
    { key: "booking_date", label: "Booking Date" },
    { key: "adults", label: "Adults" },
    { key: "children", label: "Children" },
    { key: "infants", label: "Infants" },
    { key: "total_price", label: "Total Price (AED)" },
    { key: "status", label: "Status" },
    { key: "created_at", label: "Created At" },
  ]);
}

/**
 * Export inquiries data
 */
export function exportInquiries(inquiries: Array<{
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
}>) {
  exportToCsv(inquiries, `inquiries-${new Date().toISOString().split("T")[0]}`, [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "subject", label: "Subject" },
    { key: "message", label: "Message" },
    { key: "status", label: "Status" },
    { key: "created_at", label: "Created At" },
  ]);
}

/**
 * Export customers data
 */
export function exportCustomers(customers: Array<{
  name: string;
  email: string;
  phone: string;
  bookingCount: number;
  totalSpent: number;
}>) {
  exportToCsv(customers, `customers-${new Date().toISOString().split("T")[0]}`, [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "bookingCount", label: "Total Bookings" },
    { key: "totalSpent", label: "Total Spent (AED)" },
  ]);
}

/**
 * Export reviews data
 */
export function exportReviews(reviews: Array<{
  customer_name: string;
  customer_email: string | null;
  rating: number;
  review_text: string | null;
  status: string;
  created_at: string;
}>) {
  exportToCsv(reviews, `reviews-${new Date().toISOString().split("T")[0]}`, [
    { key: "customer_name", label: "Customer Name" },
    { key: "customer_email", label: "Email" },
    { key: "rating", label: "Rating" },
    { key: "review_text", label: "Review" },
    { key: "status", label: "Status" },
    { key: "created_at", label: "Created At" },
  ]);
}

/**
 * Export chat leads data
 */
export function exportChatLeads(leads: Array<{
  name: string;
  email: string;
  phone: string | null;
  travel_date: string | null;
  message: string | null;
  source: string;
  created_at: string;
}>) {
  exportToCsv(leads, `chat-leads-${new Date().toISOString().split("T")[0]}`, [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "travel_date", label: "Travel Date" },
    { key: "message", label: "Message" },
    { key: "source", label: "Source" },
    { key: "created_at", label: "Created At" },
  ]);
}
