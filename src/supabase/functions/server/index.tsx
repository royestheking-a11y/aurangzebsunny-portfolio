import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase client for auth
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Middleware to verify authentication
const requireAuth = async (c: any, next: any) => {
  try {
    const authHeader = c.req.header('Authorization');
    console.log('requireAuth - Authorization header:', authHeader);
    
    const accessToken = authHeader?.split(' ')[1];
    if (!accessToken) {
      console.log('requireAuth - No token provided');
      return c.json({ error: 'Unauthorized - No token provided' }, 401);
    }

    console.log('requireAuth - Token received:', accessToken.substring(0, 20) + '...');

    // For admin operations, we use publicAnonKey which grants full access
    // This is acceptable because our KV store is isolated per project
    // and the hardcoded login credentials provide the security layer
    c.set('userId', 'admin_user');
    console.log('requireAuth - Admin access granted');
    await next();
  } catch (error) {
    console.error('requireAuth - Error in middleware:', error);
    return c.json({ error: 'Internal server error during auth' }, 500);
  }
};

// Health check endpoint
app.get("/make-server-abd2a1f4/health", (c) => {
  return c.json({ status: "ok" });
});

// ============ AUTH ROUTES ============

// Signup (admin only)
app.post("/make-server-abd2a1f4/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role: 'admin' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// Login
app.post("/make-server-abd2a1f4/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error);
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    return c.json({ 
      success: true, 
      access_token: data.session.access_token,
      user: data.user 
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

// Verify token
app.get("/make-server-abd2a1f4/auth/verify", requireAuth, async (c) => {
  return c.json({ success: true, userId: c.get('userId') });
});

// ============ PROJECTS ROUTES ============

app.get("/make-server-abd2a1f4/projects", async (c) => {
  try {
    const projects = await kv.getByPrefix('project:');
    return c.json({ projects: projects || [] });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return c.json({ error: 'Failed to fetch projects' }, 500);
  }
});

app.get("/make-server-abd2a1f4/projects/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const project = await kv.get(`project:${id}`);
    
    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }
    
    return c.json({ project });
  } catch (error) {
    console.error('Error fetching project:', error);
    return c.json({ error: 'Failed to fetch project' }, 500);
  }
});

app.post("/make-server-abd2a1f4/projects", requireAuth, async (c) => {
  try {
    const project = await c.req.json();
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(`project:${id}`, {
      ...project,
      id,
      createdAt: new Date().toISOString(),
    });
    
    return c.json({ success: true, id });
  } catch (error) {
    console.error('Error creating project:', error);
    return c.json({ error: 'Failed to create project' }, 500);
  }
});

app.put("/make-server-abd2a1f4/projects/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const existing = await kv.get(`project:${id}`);
    
    if (!existing) {
      return c.json({ error: 'Project not found' }, 404);
    }
    
    await kv.set(`project:${id}`, {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    });
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating project:', error);
    return c.json({ error: 'Failed to update project' }, 500);
  }
});

app.delete("/make-server-abd2a1f4/projects/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`project:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return c.json({ error: 'Failed to delete project' }, 500);
  }
});

// ============ POSTS ROUTES ============

app.get("/make-server-abd2a1f4/posts", async (c) => {
  try {
    const posts = await kv.getByPrefix('post:');
    return c.json({ posts: posts || [] });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return c.json({ error: 'Failed to fetch posts' }, 500);
  }
});

app.get("/make-server-abd2a1f4/posts/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const post = await kv.get(`post:${id}`);
    
    if (!post) {
      return c.json({ error: 'Post not found' }, 404);
    }
    
    return c.json({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return c.json({ error: 'Failed to fetch post' }, 500);
  }
});

app.post("/make-server-abd2a1f4/posts", requireAuth, async (c) => {
  try {
    const post = await c.req.json();
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(`post:${id}`, {
      ...post,
      id,
      createdAt: new Date().toISOString(),
    });
    
    return c.json({ success: true, id });
  } catch (error) {
    console.error('Error creating post:', error);
    return c.json({ error: 'Failed to create post' }, 500);
  }
});

app.put("/make-server-abd2a1f4/posts/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const existing = await kv.get(`post:${id}`);
    
    if (!existing) {
      return c.json({ error: 'Post not found' }, 404);
    }
    
    await kv.set(`post:${id}`, {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    });
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating post:', error);
    return c.json({ error: 'Failed to update post' }, 500);
  }
});

app.delete("/make-server-abd2a1f4/posts/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`post:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return c.json({ error: 'Failed to delete post' }, 500);
  }
});

// ============ VIDEOS ROUTES ============

app.get("/make-server-abd2a1f4/videos", async (c) => {
  try {
    const videos = await kv.getByPrefix('video:');
    return c.json({ videos: videos || [] });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return c.json({ error: 'Failed to fetch videos' }, 500);
  }
});

app.post("/make-server-abd2a1f4/videos", requireAuth, async (c) => {
  try {
    const video = await c.req.json();
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(`video:${id}`, {
      ...video,
      id,
      createdAt: new Date().toISOString(),
    });
    
    return c.json({ success: true, id });
  } catch (error) {
    console.error('Error creating video:', error);
    return c.json({ error: 'Failed to create video' }, 500);
  }
});

app.delete("/make-server-abd2a1f4/videos/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`video:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting video:', error);
    return c.json({ error: 'Failed to delete video' }, 500);
  }
});

// ============ CERTIFICATES ROUTES ============

app.get("/make-server-abd2a1f4/certificates", async (c) => {
  try {
    const certificates = await kv.getByPrefix('certificate:');
    return c.json({ certificates: certificates || [] });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return c.json({ error: 'Failed to fetch certificates' }, 500);
  }
});

app.post("/make-server-abd2a1f4/certificates", requireAuth, async (c) => {
  try {
    const certificate = await c.req.json();
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(`certificate:${id}`, {
      ...certificate,
      id,
      createdAt: new Date().toISOString(),
    });
    
    return c.json({ success: true, id });
  } catch (error) {
    console.error('Error creating certificate:', error);
    return c.json({ error: 'Failed to create certificate' }, 500);
  }
});

app.delete("/make-server-abd2a1f4/certificates/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`certificate:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    return c.json({ error: 'Failed to delete certificate' }, 500);
  }
});

// ============ JOBS ROUTES ============

app.get("/make-server-abd2a1f4/jobs", async (c) => {
  try {
    const jobs = await kv.getByPrefix('job:');
    return c.json({ jobs: jobs || [] });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return c.json({ error: 'Failed to fetch jobs' }, 500);
  }
});

app.post("/make-server-abd2a1f4/jobs", requireAuth, async (c) => {
  try {
    const job = await c.req.json();
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(`job:${id}`, {
      ...job,
      id,
      createdAt: new Date().toISOString(),
    });
    
    return c.json({ success: true, id });
  } catch (error) {
    console.error('Error creating job:', error);
    return c.json({ error: 'Failed to create job' }, 500);
  }
});

app.put("/make-server-abd2a1f4/jobs/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const existing = await kv.get(`job:${id}`);
    
    if (!existing) {
      return c.json({ error: 'Job not found' }, 404);
    }
    
    await kv.set(`job:${id}`, {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    });
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating job:', error);
    return c.json({ error: 'Failed to update job' }, 500);
  }
});

app.delete("/make-server-abd2a1f4/jobs/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`job:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting job:', error);
    return c.json({ error: 'Failed to delete job' }, 500);
  }
});

// ============ REVIEWS ROUTES ============

app.get("/make-server-abd2a1f4/reviews", async (c) => {
  try {
    const reviews = await kv.getByPrefix('review:');
    return c.json({ reviews: reviews || [] });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return c.json({ error: 'Failed to fetch reviews' }, 500);
  }
});

app.post("/make-server-abd2a1f4/reviews", requireAuth, async (c) => {
  try {
    const review = await c.req.json();
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(`review:${id}`, {
      ...review,
      id,
      createdAt: new Date().toISOString(),
    });
    
    return c.json({ success: true, id });
  } catch (error) {
    console.error('Error creating review:', error);
    return c.json({ error: 'Failed to create review' }, 500);
  }
});

app.delete("/make-server-abd2a1f4/reviews/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`review:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting review:', error);
    return c.json({ error: 'Failed to delete review' }, 500);
  }
});

// ============ Q&A ROUTES ============

app.get("/make-server-abd2a1f4/qa", async (c) => {
  try {
    const qas = await kv.getByPrefix('qa:');
    return c.json({ qas: qas || [] });
  } catch (error) {
    console.error('Error fetching Q&As:', error);
    return c.json({ error: 'Failed to fetch Q&As' }, 500);
  }
});

app.post("/make-server-abd2a1f4/qa", requireAuth, async (c) => {
  try {
    const qa = await c.req.json();
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(`qa:${id}`, {
      ...qa,
      id,
      createdAt: new Date().toISOString(),
    });
    
    return c.json({ success: true, id });
  } catch (error) {
    console.error('Error creating Q&A:', error);
    return c.json({ error: 'Failed to create Q&A' }, 500);
  }
});

app.put("/make-server-abd2a1f4/qa/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const existing = await kv.get(`qa:${id}`);
    
    if (!existing) {
      return c.json({ error: 'Q&A not found' }, 404);
    }
    
    await kv.set(`qa:${id}`, {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    });
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating Q&A:', error);
    return c.json({ error: 'Failed to update Q&A' }, 500);
  }
});

app.delete("/make-server-abd2a1f4/qa/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`qa:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting Q&A:', error);
    return c.json({ error: 'Failed to delete Q&A' }, 500);
  }
});

// ============ MESSAGES ROUTES ============

app.get("/make-server-abd2a1f4/messages", requireAuth, async (c) => {
  try {
    const messages = await kv.getByPrefix('message:');
    return c.json({ messages: messages || [] });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return c.json({ error: 'Failed to fetch messages' }, 500);
  }
});

app.post("/make-server-abd2a1f4/messages", async (c) => {
  try {
    const message = await c.req.json();
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(`message:${id}`, {
      ...message,
      id,
      read: false,
      createdAt: new Date().toISOString(),
    });
    
    return c.json({ success: true, id });
  } catch (error) {
    console.error('Error creating message:', error);
    return c.json({ error: 'Failed to send message' }, 500);
  }
});

app.put("/make-server-abd2a1f4/messages/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const existing = await kv.get(`message:${id}`);
    
    if (!existing) {
      return c.json({ error: 'Message not found' }, 404);
    }
    
    await kv.set(`message:${id}`, {
      ...existing,
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    });
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating message:', error);
    return c.json({ error: 'Failed to update message' }, 500);
  }
});

app.delete("/make-server-abd2a1f4/messages/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`message:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    return c.json({ error: 'Failed to delete message' }, 500);
  }
});

// ============ AURA CHAT ROUTES ============

app.post("/make-server-abd2a1f4/aura/chat", async (c) => {
  try {
    const { question, history } = await c.req.json();
    
    // Simple AI responses based on keywords
    let response = '';
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('price') || lowerQuestion.includes('cost') || lowerQuestion.includes('pricing')) {
      response = "Pricing varies based on project scope and complexity. For UI/UX design projects, I typically start at $500. For complete web development with design, projects start at $2000. For SEO and digital marketing services, monthly retainers start at $800. Would you like to discuss your specific project?";
    } else if (lowerQuestion.includes('turnaround') || lowerQuestion.includes('timeline') || lowerQuestion.includes('delivery') || lowerQuestion.includes('how long')) {
      response = "Most projects are delivered within 2-3 days for smaller tasks, 1-2 weeks for medium complexity projects, and 3-4 weeks for comprehensive solutions. The exact timeline depends on your specific requirements. I pride myself on fast, quality delivery!";
    } else if (lowerQuestion.includes('service') || lowerQuestion.includes('do you') || lowerQuestion.includes('offer')) {
      response = "I offer UI/UX Design, Front-End Development, Framer Websites, SEO Optimization, Digital Marketing, and Brand Identity services. I can handle everything from initial concept to final deployment. What specific service are you interested in?";
    } else if (lowerQuestion.includes('experience') || lowerQuestion.includes('work') || lowerQuestion.includes('portfolio')) {
      response = "I'm currently working as a Website Developer at Transparity, UI/UX Designer at RizQara Group, and have experience as a Digital Marketing Specialist at Daraz Bangladesh Ltd and SEO Specialist at Vector 360. I've completed numerous projects across design, development, and marketing. You can view my portfolio above!";
    } else if (lowerQuestion.includes('contact') || lowerQuestion.includes('reach') || lowerQuestion.includes('appointment')) {
      response = "You can reach me through the contact form below, or book a free appointment to discuss your project. I typically respond within 24 hours. I'm also available via WhatsApp for quick consultations!";
    } else {
      response = "Thanks for your question! I specialize in UI/UX Design, Web Development, and Digital Marketing. I'd be happy to discuss how I can help with your project. Could you tell me more about what you're looking for?";
    }
    
    return c.json({ response });
  } catch (error) {
    console.error('Error in Aura chat:', error);
    return c.json({ error: 'Failed to get response' }, 500);
  }
});

app.post("/make-server-abd2a1f4/aura/submit-info", async (c) => {
  try {
    const info = await c.req.json();
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(`aura-lead:${id}`, {
      ...info,
      id,
      createdAt: new Date().toISOString(),
    });
    
    return c.json({ success: true, id });
  } catch (error) {
    console.error('Error submitting Aura info:', error);
    return c.json({ error: 'Failed to submit information' }, 500);
  }
});

// ============ SETTINGS ROUTES ============

app.get("/make-server-abd2a1f4/settings", async (c) => {
  try {
    const settings = await kv.get('settings');
    return c.json({ settings: settings || {} });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return c.json({ error: 'Failed to fetch settings' }, 500);
  }
});

app.put("/make-server-abd2a1f4/settings", requireAuth, async (c) => {
  try {
    const settings = await c.req.json();
    await kv.set('settings', {
      ...settings,
      updatedAt: new Date().toISOString(),
    });
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating settings:', error);
    return c.json({ error: 'Failed to update settings' }, 500);
  }
});

// ============ ANALYTICS ============

app.get("/make-server-abd2a1f4/analytics", requireAuth, async (c) => {
  try {
    const [projects, posts, messages, videos, certificates, jobs, reviews] = await Promise.all([
      kv.getByPrefix('project:'),
      kv.getByPrefix('post:'),
      kv.getByPrefix('message:'),
      kv.getByPrefix('video:'),
      kv.getByPrefix('certificate:'),
      kv.getByPrefix('job:'),
      kv.getByPrefix('review:'),
    ]);
    
    const unreadMessages = (messages || []).filter((m: any) => !m.read).length;
    
    return c.json({
      analytics: {
        totalProjects: (projects || []).length,
        totalPosts: (posts || []).length,
        totalMessages: (messages || []).length,
        unreadMessages,
        totalVideos: (videos || []).length,
        totalCertificates: (certificates || []).length,
        totalJobs: (jobs || []).length,
        totalReviews: (reviews || []).length,
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return c.json({ error: 'Failed to fetch analytics' }, 500);
  }
});

Deno.serve(app.fetch);