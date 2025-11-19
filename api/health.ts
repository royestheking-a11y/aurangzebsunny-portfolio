import { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase, getDatabase } from './_helpers/db';
import { handleCors, setCorsHeaders } from './_helpers/cors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  setCorsHeaders(res);

  try {
    await connectToDatabase();
    const db = getDatabase();
    const collections = await db.listCollections().toArray();
    
    res.json({
      status: 'ok',
      message: 'API is running',
      database: process.env.MONGODB_DB_NAME || 'auraportfolio',
      collections: collections.map(c => c.name),
      collectionCount: collections.length
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
}

