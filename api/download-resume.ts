import { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase, getDatabase } from './_helpers/db';
import { handleCors, setCorsHeaders } from './_helpers/cors';

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
            console.error('Download Resume: Settings or document found', !!settings);
            return res.status(404).send('Resume not found in database');
        }

        const { data, contentType, fileName } = settings.resumeFile;

        if (!data) {
            console.error('Download Resume: No data field');
            return res.status(404).send('File data missing');
        }

        // Set headers
        res.setHeader('Content-Type', contentType || 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${fileName || 'resume.pdf'}"`);

        // MongoDB Binary object check
        let fileBuffer;
        if (Buffer.isBuffer(data)) {
            fileBuffer = data;
        } else if (data.buffer && Buffer.isBuffer(data.buffer)) {
            fileBuffer = data.buffer;
        } else if (data.buffer) {
            // In case it's a Uint8Array or similar
            fileBuffer = Buffer.from(data.buffer);
        } else {
            // Try strict buffer access or toString base64 if it's stored oddly
            try {
                fileBuffer = Buffer.from(data.toString('binary'), 'binary');
            } catch (e) {
                console.error('Buffer conversion failed', e);
            }
        }

        if (fileBuffer) {
            res.send(fileBuffer);
        } else {
            // Last resort: send data as is
            res.send(data);
        }

    } catch (error: any) {
        console.error('Download error:', error);
        res.status(500).json({ error: error.message });
    }
}
