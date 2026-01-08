import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * Delete image file from public/images directory
 * @param imageUrl - The image URL (e.g., "/images/1234567890-abc123.jpg")
 * @returns Promise<boolean> - true if deleted successfully or file doesn't exist, false if error
 */
export async function deleteImageFile(imageUrl: string | null | undefined): Promise<boolean> {
  if (!imageUrl) return true;

  try {
    // Extract filename from URL (e.g., "/images/filename.jpg" -> "filename.jpg")
    const filename = imageUrl.replace(/^\/images\//, '');
    
    // Skip if URL doesn't match expected pattern
    if (!filename || filename === imageUrl) {
      console.warn('Invalid image URL format:', imageUrl);
      return true;
    }

    // Build full path to file
    const filepath = join(process.cwd(), 'public', 'images', filename);

    // Check if file exists
    if (existsSync(filepath)) {
      await unlink(filepath);
      console.log('Deleted image file:', filename);
    } else {
      console.log('Image file not found (already deleted?):', filename);
    }

    return true;
  } catch (error) {
    console.error('Error deleting image file:', imageUrl, error);
    // Don't throw error, just log and continue
    return false;
  }
}

/**
 * Delete multiple image files
 * @param imageUrls - Array of image URLs to delete
 * @returns Promise<void>
 */
export async function deleteImageFiles(imageUrls: (string | null | undefined)[]): Promise<void> {
  const promises = imageUrls.filter(Boolean).map(url => deleteImageFile(url));
  await Promise.all(promises);
}
