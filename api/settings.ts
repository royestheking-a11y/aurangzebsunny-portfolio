import { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase, getDatabase } from './_helpers/db';
import { handleCors, setCorsHeaders } from './_helpers/cors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  setCorsHeaders(res);

  try {
    await connectToDatabase();
    const db = getDatabase();
    const collection = db.collection('settings');

    if (req.method === 'GET') {
      const settings = await collection.findOne({ id: 'main' });
      res.json(settings || {});
    } else if (req.method === 'PUT') {
      const { _id, ...updates } = req.body;
      const settings = {
        id: 'main',
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      await collection.updateOne(
        { id: 'main' },
        { $set: settings },
        { upsert: true }
      );
      const updatedSettings = await collection.findOne({ id: 'main' });
      res.json(updatedSettings || settings);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

