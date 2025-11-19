import { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase, getDatabase } from './_helpers/db';
import { handleCors, setCorsHeaders } from './_helpers/cors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  setCorsHeaders(res);

  try {
    await connectToDatabase();
    const db = getDatabase();
    const collection = db.collection('messages');

    if (req.method === 'POST') {
      const message = {
        ...req.body,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        source: req.body.source || 'contact-form',
        read: false,
        createdAt: new Date().toISOString(),
      };
      await collection.insertOne(message);
      res.json({ success: true, data: message });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

