import cloudinary from '../config/cloudinary';

interface UploadResult {
  url: string;
  publicId: string;
}

/**
 * Upload a buffer to Cloudinary.
 * Returns the optimized URL (auto format + quality) and the public ID for deletion.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string = 'projects'
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `portfolio/${folder}`,
          resource_type: 'image',
          transformation: [
            { width: 800, height: 600, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error || !result) return reject(error || new Error('Upload failed'));
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      )
      .end(buffer);
  });
}

/**
 * Delete an image from Cloudinary by public ID.
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
