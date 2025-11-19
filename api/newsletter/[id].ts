import { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase, getDatabase } from '../_helpers/db';
import { handleCors, setCorsHeaders } from '../_helpers/cors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  setCorsHeaders(res);

  try {
    await connectToDatabase();
    const db = getDatabase();
    const collection = db.collection('newsletter');
    const { id } = req.query;

    if (req.method === 'DELETE') {
      await collection.deleteOne({ id });
      res.json({ success: true });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

