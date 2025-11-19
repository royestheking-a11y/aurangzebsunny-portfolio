import { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase, getDatabase } from './_helpers/db';
import { handleCors, setCorsHeaders } from './_helpers/cors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  setCorsHeaders(res);

  try {
    await connectToDatabase();
    const db = getDatabase();
    const collection = db.collection('reviews');

    if (req.method === 'GET') {
      const reviews = await collection.find({}).toArray();
      res.json(reviews);
    } else if (req.method === 'POST') {
      const review = {
        ...req.body,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };
      await collection.insertOne(review);
      res.json(review);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

