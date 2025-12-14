
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Extracts the public ID from a Cloudinary URL and deletes the asset.
 * @param url The Cloudinary secure_url
 */
export const deleteFromCloudinary = async (url: string | undefined | null) => {
    if (!url) return;

    try {
        // Check if it's actually a Cloudinary URL
        if (!url.includes('cloudinary.com')) {
            return;
        }

        // Extract public ID
        // specific to standard Cloudinary URLs: .../upload/v12345678/folder/public_id.jpg
        const regex = /\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/;
        const match = url.match(regex);

        if (match && match[1]) {
            const publicId = match[1];
            console.log(`🗑️ Deleting from Cloudinary: ${publicId}`);
            await cloudinary.uploader.destroy(publicId);
        }
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
    }
};
