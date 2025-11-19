import { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase, getDatabase } from './_helpers/db';
import { handleCors, setCorsHeaders } from './_helpers/cors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  setCorsHeaders(res);

  try {
    await connectToDatabase();
    const db = getDatabase();
    
    const [
      projects,
      posts,
      messages,
      videos,
      certificates,
      jobs,
      reviews,
    ] = await Promise.all([
      db.collection('projects').countDocuments(),
      db.collection('posts').countDocuments(),
      db.collection('messages').countDocuments(),
      db.collection('videos').countDocuments(),
      db.collection('certificates').countDocuments(),
      db.collection('jobs').countDocuments(),
      db.collection('reviews').countDocuments(),
    ]);

    const unreadMessages = await db
      .collection('messages')
      .countDocuments({ read: { $ne: true } });

    res.json({
      totalProjects: projects,
      totalPosts: posts,
      totalMessages: messages,
      unreadMessages,
      totalVideos: videos,
      totalCertificates: certificates,
      totalJobs: jobs,
      totalReviews: reviews,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

