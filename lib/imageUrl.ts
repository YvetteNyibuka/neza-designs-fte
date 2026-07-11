/**
 * Convert relative upload URLs to absolute public URLs.
 * Handles both local storage paths and external URLs.
 */
export function getImageUrl(url: string | null | undefined): string {
  if (!url) return '';

  // If it's already an absolute URL, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If it's a relative local storage path, convert it against the public API base.
  if (url.startsWith('/uploads/')) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    // Uploads are served at /uploads on the API origin root, not under /api/v1.
    const apiOrigin = apiUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');
    return `${apiOrigin}${url}`;
  }

  // Fallback: return as-is
  return url;
}
