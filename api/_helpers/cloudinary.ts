import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
// Ensure these environment variables are set in Vercel
cloudinary.config({
    cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

/**
 * Extracts the public ID from a Cloudinary URL
 * @param url Cloudinary image URL
 * @returns Public ID or null if not found
 */
export const getPublicIdFromUrl = (url: string): string | null => {
    if (!url || !url.includes('cloudinary.com')) return null;

    try {
        // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/sample.jpg
        // Split by slash and get parts after 'upload' (and version if present)
        const parts = url.split('/');
        const uploadIndex = parts.findIndex(p => p === 'upload');

        if (uploadIndex === -1) return null;

        // Join everything after upload
        let path = parts.slice(uploadIndex + 1).join('/');

        // Remove version prefix if present (starts with v and numbers)
        // e.g., v1234567890/folder/sample.jpg -> folder/sample.jpg
        path = path.replace(/^v\d+\//, '');

        // Remove extension
        // folder/sample.jpg -> folder/sample
        const lastDotIndex = path.lastIndexOf('.');
        if (lastDotIndex !== -1) {
            path = path.substring(0, lastDotIndex);
        }

        return path;

    } catch (error) {
        console.error('Error extracting public ID:', error);
        return null;
    }
};

/**
 * Deletes an image from Cloudinary
 * @param url Full Cloudinary URL of the image to delete
 * @returns Promise that resolves to the Cloudinary API result
 */
export const deleteImage = async (url: string) => {
    const publicId = getPublicIdFromUrl(url);

    if (!publicId) {
        console.log('No valid Cloudinary public ID found in URL:', url);
        return null;
    }

    console.log('Deleting image from Cloudinary:', publicId);

    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log('Cloudinary Deletion Result:', result);
        return result;
    } catch (error) {
        console.error('Cloudinary Deletion Error:', error);
        // Don't throw error to prevent blocking DB deletion if image delete fails
        return null;
    }
};
