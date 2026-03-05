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
 * Upload any file (image or PDF) to Cloudinary.
 * PDFs use resource_type 'raw' (no transformations).
 */
export async function uploadFileToCloudinary(
  buffer: Buffer,
  folder: string = 'deliverables',
  isPdf: boolean = false
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const options: any = {
      folder: `portfolio/${folder}`,
      resource_type: isPdf ? 'raw' : 'image',
    };
    if (!isPdf) {
      options.transformation = [
        { width: 1200, height: 900, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
      ];
    }
    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (error || !result) return reject(error || new Error('Upload failed'));
        resolve({ url: result.secure_url, publicId: result.public_id });
      })
      .end(buffer);
  });
}

/**
 * Delete a file from Cloudinary by public ID.
 */
export async function deleteFromCloudinary(publicId: string, resourceType: string = 'image'): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}
