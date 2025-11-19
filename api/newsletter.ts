import { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase, getDatabase } from './_helpers/db';
import { handleCors, setCorsHeaders } from './_helpers/cors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  setCorsHeaders(res);

  try {
    await connectToDatabase();
    const db = getDatabase();
    const collection = db.collection('newsletter');

    if (req.method === 'GET') {
      const subscriptions = await collection.find({}).sort({ subscribedAt: -1 }).toArray();
      res.json(subscriptions || []);
    } else if (req.method === 'POST') {
      const subscription = {
        email: req.body.email || req.body,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        subscribedAt: new Date().toISOString(),
      };
      await collection.insertOne(subscription);
      res.json(subscription);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

