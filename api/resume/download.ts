import { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase, getDatabase } from '../_helpers/db';
import { handleCors, setCorsHeaders } from '../_helpers/cors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        setCorsHeaders(res);
        return res.status(200).end();
    }

    setCorsHeaders(res);

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await connectToDatabase();
        const db = getDatabase();

        const settings = await db.collection('settings').findOne({ id: 'main' });

        if (!settings || !settings.resumeFile) {
            return res.status(404).send('Resume not found');
        }

        const { data, contentType, fileName } = settings.resumeFile;

        // Set headers
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);

        // MongoDB Binary object has a buffer property
        if (data && data.buffer) {
            res.send(data.buffer);
        } else {
            // Fallback
            res.send(data);
        }
    } catch (error: any) {
        console.error('Download error:', error);
        res.status(500).json({ error: error.message });
    }
}
