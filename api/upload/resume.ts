import { VercelRequest, VercelResponse } from '@vercel/node';
import { Binary } from 'mongodb';
import multer from 'multer';
import { connectToDatabase, getDatabase } from '../_helpers/db';
import { handleCors, setCorsHeaders } from '../_helpers/cors';

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
});

// Disable Vercel's default body parser to let multer handle multipart/form-data
export const config = {
    api: {
        bodyParser: false,
    },
};

function runMiddleware(req: any, res: any, fn: any) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        setCorsHeaders(res);
        return res.status(200).end();
    }

    setCorsHeaders(res);

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await connectToDatabase();
        const db = getDatabase();

        // Run multer middleware
        await runMiddleware(req, res, upload.single('file'));

        // The 'req' object is augmented by multer.
        // However, VercelRequest type doesn't know about 'file'.
        // We cast to any or define a custom interface.
        const file = (req as any).file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { buffer, mimetype, originalname } = file;

        // Convert buffer to binary for MongoDB
        const binaryFile = new Binary(buffer);

        // Update settings with the file data
        await db.collection('settings').updateOne(
            { id: 'main' },
            {
                $set: {
                    resumeFile: {
                        data: binaryFile,
                        contentType: mimetype,
                        fileName: originalname,
                        updatedAt: new Date().toISOString(),
                    },
                    // Set URL to download endpoint
                    resumeUrl: '/api/download-resume',
                }
            },
            { upsert: true }
        );

        return res.status(200).json({
            success: true,
            url: '/api/download-resume',
            message: 'Resume uploaded successfully'
        });
    } catch (error: any) {
        console.error('Upload error:', error);
        return res.status(500).json({ error: error.message });
    }
}
