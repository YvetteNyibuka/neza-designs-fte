/**
 * Convert relative upload URLs to absolute backend URLs
 * Handles both local storage paths and external URLs
 */
export function getImageUrl(url: string | null | undefined): string {
  if (!url) return '';

  // If it's already an absolute URL, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If it's a relative local storage path, convert to absolute backend URL
  if (url.startsWith('/uploads/')) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    // Remove /api/v1 from the end to get the base URL
    const baseUrl = apiUrl.replace('/api/v1', '');
    return `${baseUrl}${url}`;
  }

  // Fallback: return as-is
  return url;
}
