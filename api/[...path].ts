import { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase, getDatabase } from './_helpers/db';
import { handleCors, setCorsHeaders } from './_helpers/cors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  setCorsHeaders(res);

  try {
    await connectToDatabase();
    const db = getDatabase();
    
    const method = req.method;
    // Get path from query parameter (Vercel catch-all route)
    const pathParts = (req.query.path as string[]) || [];
    
    const resource = pathParts[0];
    const id = pathParts[1];

    // Health check
    if (resource === 'health' && method === 'GET') {
      const collections = await db.listCollections().toArray();
      return res.json({
        status: 'ok',
        message: 'API is running',
        database: process.env.MONGODB_DB_NAME || 'auraportfolio',
        collections: collections.map(c => c.name),
        collectionCount: collections.length
      });
    }

    // Analytics
    if (resource === 'analytics' && method === 'GET') {
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

      return res.json({
        totalProjects: projects,
        totalPosts: posts,
        totalMessages: messages,
        unreadMessages,
        totalVideos: videos,
        totalCertificates: certificates,
        totalJobs: jobs,
        totalReviews: reviews,
      });
    }

    // Projects
    if (resource === 'projects') {
      const collection = db.collection('projects');
      if (method === 'GET' && !id) {
        const items = await collection.find({}).toArray();
        return res.json(items);
      }
      if (method === 'POST') {
        const item = {
          ...req.body,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };
        await collection.insertOne(item);
        return res.json(item);
      }
      if (method === 'PUT' && id) {
        const { _id, ...updates } = req.body;
        const updateData = { ...updates, updatedAt: new Date().toISOString() };
        const updateResult = await collection.updateOne({ id }, { $set: updateData });
        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ error: 'Project not found' });
        }
        const updated = await collection.findOne({ id });
        return res.json(updated);
      }
      if (method === 'DELETE' && id) {
        await collection.deleteOne({ id });
        return res.json({ success: true });
      }
    }

    // Posts
    if (resource === 'posts') {
      const collection = db.collection('posts');
      if (method === 'GET' && !id) {
        const items = await collection.find({}).toArray();
        return res.json(items);
      }
      if (method === 'POST') {
        const item = {
          ...req.body,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };
        await collection.insertOne(item);
        return res.json(item);
      }
      if (method === 'PUT' && id) {
        const { _id, ...updates } = req.body;
        const updateData = { ...updates, updatedAt: new Date().toISOString() };
        const updateResult = await collection.updateOne({ id }, { $set: updateData });
        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ error: 'Post not found' });
        }
        const updated = await collection.findOne({ id });
        return res.json(updated);
      }
      if (method === 'DELETE' && id) {
        await collection.deleteOne({ id });
        return res.json({ success: true });
      }
    }

    // Videos
    if (resource === 'videos') {
      const collection = db.collection('videos');
      if (method === 'GET' && !id) {
        const items = await collection.find({}).toArray();
        return res.json(items);
      }
      if (method === 'POST') {
        const item = {
          ...req.body,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };
        await collection.insertOne(item);
        return res.json(item);
      }
      if (method === 'PUT' && id) {
        const { _id, ...updates } = req.body;
        const updateData = { ...updates, updatedAt: new Date().toISOString() };
        const updateResult = await collection.updateOne({ id }, { $set: updateData });
        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ error: 'Video not found' });
        }
        const updated = await collection.findOne({ id });
        return res.json(updated);
      }
      if (method === 'DELETE' && id) {
        await collection.deleteOne({ id });
        return res.json({ success: true });
      }
    }

    // Certificates
    if (resource === 'certificates') {
      const collection = db.collection('certificates');
      if (method === 'GET' && !id) {
        const items = await collection.find({}).toArray();
        return res.json(items);
      }
      if (method === 'POST') {
        const item = {
          ...req.body,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };
        await collection.insertOne(item);
        return res.json(item);
      }
      if (method === 'DELETE' && id) {
        await collection.deleteOne({ id });
        return res.json({ success: true });
      }
    }

    // Jobs
    if (resource === 'jobs') {
      const collection = db.collection('jobs');
      if (method === 'GET' && !id) {
        const items = await collection.find({}).toArray();
        return res.json(items);
      }
      if (method === 'POST') {
        const item = {
          ...req.body,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };
        await collection.insertOne(item);
        return res.json(item);
      }
      if (method === 'PUT' && id) {
        const { _id, ...updates } = req.body;
        const updateData = { ...updates, updatedAt: new Date().toISOString() };
        const updateResult = await collection.updateOne({ id }, { $set: updateData });
        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ error: 'Job not found' });
        }
        const updated = await collection.findOne({ id });
        return res.json(updated);
      }
      if (method === 'DELETE' && id) {
        await collection.deleteOne({ id });
        return res.json({ success: true });
      }
    }

    // Reviews
    if (resource === 'reviews') {
      const collection = db.collection('reviews');
      if (method === 'GET' && !id) {
        const items = await collection.find({}).toArray();
        return res.json(items);
      }
      if (method === 'POST') {
        const item = {
          ...req.body,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };
        await collection.insertOne(item);
        return res.json(item);
      }
      if (method === 'DELETE' && id) {
        await collection.deleteOne({ id });
        return res.json({ success: true });
      }
    }

    // Q&A
    if (resource === 'qas') {
      const collection = db.collection('qas');
      if (method === 'GET' && !id) {
        const items = await collection.find({}).toArray();
        return res.json(items);
      }
      if (method === 'POST') {
        const item = {
          ...req.body,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };
        await collection.insertOne(item);
        return res.json(item);
      }
      if (method === 'PUT' && id) {
        const { _id, ...updates } = req.body;
        const updateData = { ...updates, updatedAt: new Date().toISOString() };
        const updateResult = await collection.updateOne({ id }, { $set: updateData });
        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ error: 'Q&A not found' });
        }
        const updated = await collection.findOne({ id });
        return res.json(updated);
      }
      if (method === 'DELETE' && id) {
        await collection.deleteOne({ id });
        return res.json({ success: true });
      }
    }

    // Messages
    if (resource === 'messages') {
      const collection = db.collection('messages');
      if (method === 'GET' && !id) {
        const items = await collection.find({}).sort({ createdAt: -1 }).toArray();
        return res.json(items || []);
      }
      if (method === 'POST') {
        const item = {
          ...req.body,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        };
        await collection.insertOne(item);
        return res.json(item);
      }
      if (method === 'PUT' && id) {
        const { _id, ...updates } = req.body;
        const updateData = { ...updates, updatedAt: new Date().toISOString() };
        const updateResult = await collection.updateOne({ id }, { $set: updateData });
        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ error: 'Message not found' });
        }
        const updated = await collection.findOne({ id });
        return res.json(updated);
      }
      if (method === 'DELETE' && id) {
        await collection.deleteOne({ id });
        return res.json({ success: true });
      }
    }

    // Settings
    if (resource === 'settings') {
      const collection = db.collection('settings');
      if (method === 'GET') {
        const settings = await collection.findOne({ id: 'main' });
        return res.json(settings || {});
      }
      if (method === 'PUT') {
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
        return res.json(updatedSettings || settings);
      }
    }

    // Newsletter
    if (resource === 'newsletter') {
      const collection = db.collection('newsletter');
      if (method === 'GET' && !id) {
        const items = await collection.find({}).sort({ subscribedAt: -1 }).toArray();
        return res.json(items || []);
      }
      if (method === 'POST') {
        const item = {
          email: req.body.email || req.body,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          subscribedAt: new Date().toISOString(),
        };
        await collection.insertOne(item);
        return res.json(item);
      }
      if (method === 'DELETE' && id) {
        await collection.deleteOne({ id });
        return res.json({ success: true });
      }
    }

    // Contact
    if (resource === 'contact' && method === 'POST') {
      const collection = db.collection('messages');
      const message = {
        ...req.body,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        source: req.body.source || 'contact-form',
        read: false,
        createdAt: new Date().toISOString(),
      };
      await collection.insertOne(message);
      return res.json({ success: true, data: message });
    }

    // Aura Assistant
    if (resource === 'aura' && pathParts[1] === 'submit' && method === 'POST') {
      const collection = db.collection('messages');
      const message = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone || '',
        subject: 'Aura Assistant Lead',
        message: req.body.message || 'Lead captured from Aura Assistant',
        source: 'aura-assistant',
        read: false,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      };
      await collection.insertOne(message);
      return res.json({ success: true, data: message });
    }

    // 404 for unknown routes
    res.status(404).json({ error: 'Not found' });
  } catch (error: any) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
}

