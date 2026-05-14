/**
 * Cloudinary Image Optimization Utility
 * Adds automatic formatting and quality adjustments for luxury performance
 */
export function optimizeImage(url: string, width: number = 800): string {
  if (!url) return "/images/placeholder.png";
  
  // If not a Cloudinary URL, return as is
  if (!url.includes("cloudinary.com")) return url;
  
  // Cloudinary optimization parameters:
  // f_auto: Automatically choose the best format (webp, avif, etc)
  // q_auto: Automatically choose the best quality/compression
  // w_xxx: Resize to specific width
  // c_fill: Fill the dimensions
  
  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;
  
  return `${parts[0]}/upload/f_auto,q_auto,w_${width},c_fill/${parts[1]}`;
}

export const CLOUDINARY_TRANSFORMS = {
  THUMBNAIL: "f_auto,q_auto,w_400,c_fill",
  STANDARD: "f_auto,q_auto,w_800,c_fill",
  LARGE: "f_auto,q_auto,w_1200,c_fill",
  HERO: "f_auto,q_auto,w_1920,c_fill",
};
