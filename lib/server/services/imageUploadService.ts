import { v2 as cloudinary } from 'cloudinary';
import { logger } from '@/lib/server/utils/logger';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getPublicIdFromUrl = (imageUrl: string): string | null => {
  try {
    const url = new URL(imageUrl);
    const segments = url.pathname.split('/').filter(Boolean);
    const filename = segments[segments.length - 1];
    const baseName = filename.includes('.')
      ? filename.substring(0, filename.lastIndexOf('.'))
      : filename;
    const folder = process.env.CLOUDINARY_FOLDER;
    return folder ? `${folder}/${baseName}` : baseName;
  } catch {
    return null;
  }
};

async function uploadBuffer(buffer: Buffer): Promise<string> {
  const folder = process.env.CLOUDINARY_FOLDER || 'imisioluwa-products';
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => {
        if (err || !result) {
          reject(err || new Error('Cloudinary upload failed'));
          return;
        }
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

export const imageUploadService = {
  saveImageFromFile: async (file: File): Promise<string> => {
    try {
      const bytes = await file.arrayBuffer();
      return await uploadBuffer(Buffer.from(bytes));
    } catch (error) {
      logger.error('Error uploading image to Cloudinary:', error);
      throw error;
    }
  },

  deleteImage: async (imageUrl: string): Promise<void> => {
    try {
      const publicId = getPublicIdFromUrl(imageUrl);
      if (!publicId) {
        logger.warn(`Could not derive Cloudinary public ID from URL: ${imageUrl}`);
        return;
      }
      await cloudinary.uploader.destroy(publicId);
      logger.info(`Image deleted from Cloudinary: ${publicId}`);
    } catch (error) {
      logger.error('Error deleting image from Cloudinary:', error);
    }
  },

  deleteMultipleImages: async (imageUrls: string[]): Promise<void> => {
    await Promise.all(imageUrls.map((url) => imageUploadService.deleteImage(url)));
  },
};
