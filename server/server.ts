import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectToDatabase, getDatabase } from './config/db';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware - CORS configuration (allow all origins for development)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Also use cors middleware as backup
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Helper function to get collection (creates collection if it doesn't exist)
const getCollection = (name: string) => {
  const db = getDatabase();
  // Collections are created automatically on first insert, but we ensure it exists
  return db.collection(name);
};

// Ensure collections exist (MongoDB creates them on first insert, but this helps)
async function ensureCollections() {
  try {
    const db = getDatabase();
    const collections = ['projects', 'posts', 'videos', 'certificates', 'jobs', 'reviews', 'qas', 'messages', 'newsletter', 'settings'];
    
    for (const collectionName of collections) {
      const exists = await db.listCollections({ name: collectionName }).hasNext();
      if (!exists) {
        // Create collection by inserting and deleting a dummy document
        await db.collection(collectionName).insertOne({ _temp: true });
        await db.collection(collectionName).deleteOne({ _temp: true });
        console.log(`✅ Created collection: ${collectionName}`);
      }
    }
    console.log('✅ All collections verified');
  } catch (error) {
    console.error('Error ensuring collections:', error);
  }
}

// Connect to MongoDB before starting server
let dbReady = false;

async function startServer() {
  try {
    await connectToDatabase();
    await ensureCollections();
    dbReady = true;
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
      console.log(`✅ MongoDB connected and collections ready`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// ==================== PROJECTS ====================
app.get('/api/projects', async (req: Request, res: Response) => {
  try {
    const projects = await getCollection('projects').find({}).toArray();
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', async (req: Request, res: Response) => {
  try {
    const project = {
      ...req.body,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    await getCollection('projects').insertOne(project);
    res.json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/projects/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Remove _id and other MongoDB internal fields from updates
    const { _id, ...updates } = req.body;
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    const updateResult = await getCollection('projects').updateOne(
      { id },
      { $set: updateData }
    );
    
    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const updatedProject = await getCollection('projects').findOne({ id });
    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found after update' });
    }
    
    res.json(updatedProject);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/projects/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await getCollection('projects').deleteOne({ id });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== POSTS ====================
app.get('/api/posts', async (req: Request, res: Response) => {
  try {
    const posts = await getCollection('posts').find({}).toArray();
    res.json(posts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/posts', async (req: Request, res: Response) => {
  try {
    const post = {
      ...req.body,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    await getCollection('posts').insertOne(post);
    res.json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/posts/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Remove _id and other MongoDB internal fields from updates
    const { _id, ...updates } = req.body;
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    const updateResult = await getCollection('posts').updateOne(
      { id },
      { $set: updateData }
    );
    
    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const updatedPost = await getCollection('posts').findOne({ id });
    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found after update' });
    }
    
    res.json(updatedPost);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/posts/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await getCollection('posts').deleteOne({ id });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== VIDEOS ====================
app.get('/api/videos', async (req: Request, res: Response) => {
  try {
    const videos = await getCollection('videos').find({}).toArray();
    res.json(videos);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/videos', async (req: Request, res: Response) => {
  try {
    const video = {
      ...req.body,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    await getCollection('videos').insertOne(video);
    res.json(video);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/videos/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Remove _id and other MongoDB internal fields from updates
    const { _id, ...updates } = req.body;
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    // Update the video
    const updateResult = await getCollection('videos').updateOne(
      { id },
      { $set: updateData }
    );
    
    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    // Fetch the updated video
    const updatedVideo = await getCollection('videos').findOne({ id });
    if (!updatedVideo) {
      return res.status(404).json({ error: 'Video not found after update' });
    }
    
    res.json(updatedVideo);
  } catch (error: any) {
    console.error('Error updating video:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/videos/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await getCollection('videos').deleteOne({ id });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== CERTIFICATES ====================
app.get('/api/certificates', async (req: Request, res: Response) => {
  try {
    const certificates = await getCollection('certificates').find({}).toArray();
    res.json(certificates);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/certificates', async (req: Request, res: Response) => {
  try {
    const cert = {
      ...req.body,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    await getCollection('certificates').insertOne(cert);
    res.json(cert);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/certificates/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await getCollection('certificates').deleteOne({ id });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== JOBS ====================
app.get('/api/jobs', async (req: Request, res: Response) => {
  try {
    const jobs = await getCollection('jobs').find({}).toArray();
    res.json(jobs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/jobs', async (req: Request, res: Response) => {
  try {
    const job = {
      ...req.body,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    await getCollection('jobs').insertOne(job);
    res.json(job);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/jobs/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Remove _id and other MongoDB internal fields from updates
    const { _id, ...updates } = req.body;
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    const updateResult = await getCollection('jobs').updateOne(
      { id },
      { $set: updateData }
    );
    
    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    const updatedJob = await getCollection('jobs').findOne({ id });
    if (!updatedJob) {
      return res.status(404).json({ error: 'Job not found after update' });
    }
    
    res.json(updatedJob);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/jobs/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await getCollection('jobs').deleteOne({ id });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== REVIEWS ====================
app.get('/api/reviews', async (req: Request, res: Response) => {
  try {
    const reviews = await getCollection('reviews').find({}).toArray();
    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/reviews', async (req: Request, res: Response) => {
  try {
    const review = {
      ...req.body,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    await getCollection('reviews').insertOne(review);
    res.json(review);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/reviews/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await getCollection('reviews').deleteOne({ id });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== Q&A ====================
app.get('/api/qas', async (req: Request, res: Response) => {
  try {
    const qas = await getCollection('qas').find({}).toArray();
    res.json(qas);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/qas', async (req: Request, res: Response) => {
  try {
    const qa = {
      ...req.body,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    await getCollection('qas').insertOne(qa);
    res.json(qa);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/qas/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Remove _id and other MongoDB internal fields from updates
    const { _id, ...updates } = req.body;
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    const updateResult = await getCollection('qas').updateOne(
      { id },
      { $set: updateData }
    );
    
    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ error: 'Q&A not found' });
    }
    
    const updatedQA = await getCollection('qas').findOne({ id });
    if (!updatedQA) {
      return res.status(404).json({ error: 'Q&A not found after update' });
    }
    
    res.json(updatedQA);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/qas/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await getCollection('qas').deleteOne({ id });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== MESSAGES ====================
app.get('/api/messages', async (req: Request, res: Response) => {
  try {
    const messages = await getCollection('messages').find({}).sort({ createdAt: -1 }).toArray();
    res.json(messages || []);
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/messages', async (req: Request, res: Response) => {
  try {
    const message = {
      ...req.body,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    await getCollection('messages').insertOne(message);
    res.json(message);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/messages/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Remove _id and other MongoDB internal fields from updates
    const { _id, ...updates } = req.body;
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    const updateResult = await getCollection('messages').updateOne(
      { id },
      { $set: updateData }
    );
    
    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    const updatedMessage = await getCollection('messages').findOne({ id });
    if (!updatedMessage) {
      return res.status(404).json({ error: 'Message not found after update' });
    }
    
    res.json(updatedMessage);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/messages/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await getCollection('messages').deleteOne({ id });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SETTINGS ====================
app.get('/api/settings', async (req: Request, res: Response) => {
  try {
    const settings = await getCollection('settings').findOne({ id: 'main' });
    res.json(settings || {});
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/settings', async (req: Request, res: Response) => {
  try {
    // Remove _id and other MongoDB internal fields from updates
    const { _id, ...updates } = req.body;
    const settings = {
      id: 'main',
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await getCollection('settings').updateOne(
      { id: 'main' },
      { $set: settings },
      { upsert: true }
    );
    
    // Fetch the updated settings to return
    const updatedSettings = await getCollection('settings').findOne({ id: 'main' });
    res.json(updatedSettings || settings);
  } catch (error: any) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== NEWSLETTER ====================
app.get('/api/newsletter', async (req: Request, res: Response) => {
  try {
    const subscriptions = await getCollection('newsletter').find({}).sort({ subscribedAt: -1 }).toArray();
    res.json(subscriptions || []);
  } catch (error: any) {
    console.error('Error fetching newsletter:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/newsletter', async (req: Request, res: Response) => {
  try {
    const subscription = {
      email: req.body.email,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      subscribedAt: new Date().toISOString(),
    };
    await getCollection('newsletter').insertOne(subscription);
    res.json(subscription);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/newsletter/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await getCollection('newsletter').deleteOne({ id });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ANALYTICS ====================
app.get('/api/analytics', async (req: Request, res: Response) => {
  try {
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
});

// ==================== CONTACT SUBMIT ====================
app.post('/api/contact', async (req: Request, res: Response) => {
  try {
    const message = {
      ...req.body,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      source: req.body.source || 'contact-form',
      read: false,
      createdAt: new Date().toISOString(),
    };
    await getCollection('messages').insertOne(message);
    res.json({ success: true, data: message });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== AURA ASSISTANT ====================
app.post('/api/aura/submit', async (req: Request, res: Response) => {
  try {
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
    await getCollection('messages').insertOne(message);
    res.json({ success: true, data: message });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const collections = await db.listCollections().toArray();
    res.json({ 
      status: 'ok', 
      message: 'API is running',
      database: 'auraportfolio',
      collections: collections.map(c => c.name),
      collectionCount: collections.length
    });
  } catch (error: any) {
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
});

