import { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase, getDatabase } from '../_helpers/db';
import { handleCors, setCorsHeaders } from '../_helpers/cors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  setCorsHeaders(res);

  try {
    await connectToDatabase();
    const db = getDatabase();
    const collection = db.collection('qas');
    const { id } = req.query;

    if (req.method === 'PUT') {
      const { _id, ...updates } = req.body;
      const updateData = { ...updates, updatedAt: new Date().toISOString() };
      const updateResult = await collection.updateOne({ id }, { $set: updateData });
      if (updateResult.matchedCount === 0) {
        return res.status(404).json({ error: 'Q&A not found' });
      }
      const updatedQA = await collection.findOne({ id });
      res.json(updatedQA);
    } else if (req.method === 'DELETE') {
      await collection.deleteOne({ id });
      res.json({ success: true });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

