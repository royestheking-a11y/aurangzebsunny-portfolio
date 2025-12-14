/**
 * Optimizes a Cloudinary URL by injecting transformation parameters.
 * Defaults to f_auto (format) and q_auto (quality) for best performance.
 * 
 * @param url The original image URL
 * @param width Optional width to resize to
 * @returns The optimized URL
 */
export const optimizeCloudinaryUrl = (url: string, width?: number): string => {
    if (!url || !url.includes('cloudinary.com')) return url;

    // Split the URL to insert transformations
    // Standard Cloudinary URL format: https://res.cloudinary.com/<cloud_name>/image/upload/<transformations>/<version>/<public_id>

    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return url;

    const baseUrl = url.slice(0, uploadIndex + 8); // includes '/upload/'
    const restOfUrl = url.slice(uploadIndex + 8);

    const transformations = ['f_auto', 'q_auto'];
    if (width) {
        transformations.push(`w_${width}`);
    }

    // Check if there are existing transformations (part before 'v' version or public ID)
    // This logic works for simple cases. If 'restOfUrl' starts with 'v', we just prepend.
    // If it starts with other params, we might need to merge or prepend.
    // For safety, we prepend our optimizations. Cloudinary applies them in order.

    return `${baseUrl}${transformations.join(',')}/${restOfUrl}`;
};
