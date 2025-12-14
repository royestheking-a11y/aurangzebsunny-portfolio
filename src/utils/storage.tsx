// MongoDB-based data storage via API

// Cache Configuration
const CACHE_KEY_PREFIX = 'aura_cache_';
const CACHE_DURATION_MINUTES = 60; // 1 hour cache

// Cache Helper Functions
const getCached = <T,>(key: string): T | null => {
  try {
    const cachedItem = localStorage.getItem(CACHE_KEY_PREFIX + key);
    if (!cachedItem) return null;

    const { data, timestamp } = JSON.parse(cachedItem);
    const now = Date.now();
    const age = (now - timestamp) / (1000 * 60);

    // Return cached data if valid
    if (age < CACHE_DURATION_MINUTES) {
      console.log(`⚡ Using Cached Data for: ${key}`);
      return data;
    }

    // Clear expired cache
    localStorage.removeItem(CACHE_KEY_PREFIX + key);
    return null;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
};

const setCached = (key: string, data: any) => {
  try {
    const cacheItem = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY_PREFIX + key, JSON.stringify(cacheItem));
  } catch (error) {
    console.warn('Cache write error (likely storage full):', error);
  }
};

// Auto-detect API URL: use VITE_API_URL if set and valid, otherwise use current origin in production or localhost in development
const getApiBaseUrl = () => {
  const viteApiUrl = import.meta.env.VITE_API_URL;

  // If VITE_API_URL is set, validate it's a proper URL
  if (viteApiUrl) {
    // Check if it's a valid URL (starts with http:// or https://)
    if (typeof viteApiUrl === 'string' && (viteApiUrl.startsWith('http://') || viteApiUrl.startsWith('https://'))) {
      return viteApiUrl.endsWith('/api') ? viteApiUrl : `${viteApiUrl.replace(/\/$/, '')}/api`;
    }
    // If VITE_API_URL is set but invalid (like 'auraportfolio09'), ignore it and use fallback
    console.warn('⚠️ VITE_API_URL is set to invalid value:', viteApiUrl, '- using auto-detection instead');
  }

  // In production (any deployed environment), use the current origin
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    // If deployed (not localhost), use the deployment URL
    if (!origin.includes('localhost') && !origin.includes('127.0.0.1')) {
      return `${origin}/api`;
    }
  }
  // In development, use localhost
  return 'http://localhost:5001/api';
};

const API_BASE_URL = getApiBaseUrl();

// Helper function for API calls
async function apiCall(endpoint: string, options: RequestInit = {}) {
  try {
    // Ensure endpoint starts with /
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${cleanEndpoint}`;
    // Only log network calls, cached calls are logged in getCached
    if (process.env.NODE_ENV !== 'production') {
      console.log(`🌐 API Call: ${options.method || 'GET'} ${url}`, { API_BASE_URL, endpoint, cleanEndpoint });
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      mode: 'cors',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error (${response.status}):`, errorText);
      let errorMessage = `API error: ${response.status} ${response.statusText}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorMessage;
      } catch {
        // If not JSON, use the text as is
        if (errorText) errorMessage = errorText;
      }
      throw new Error(errorMessage);
    }

    // Check if response has content
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const text = await response.text();
      if (!text || text.trim() === '') {
        // Empty response - return null or empty object based on method
        console.log(`⚠️ Empty response for ${endpoint}`);
        return null;
      }
      try {
        const data = JSON.parse(text);
        // console.log(`✅ API Success: ${endpoint}`); // Reduce noise
        return data;
      } catch (e) {
        console.error(`❌ JSON parse error for ${endpoint}:`, e);
        throw new Error('Invalid JSON response from server');
      }
    }

    // Non-JSON response
    const text = await response.text();
    console.log(`✅ API Success (non-JSON): ${endpoint}`);
    return text || null;
  } catch (error: any) {
    console.error(`❌ API call error for ${endpoint}:`, error.message);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Make sure the backend server is running on port 5001.');
    }
    throw error;
  }
}

// Export storage API
export const storage = {
  // --- Smart Preloading System ---
  preloadAll: async () => {
    // This function fetches all critical data in the background to warm up the cache
    console.log('🚀 Starting Smart Preload System...');
    try {
      // We run these in parallel, but catch individual errors so one failure doesn't stop others
      const loaders = [
        storage.getProjects(true), // force refresh
        storage.getPosts(true),
        storage.getVideos(true),
        storage.getCertificates(true),
        storage.getJobs(true),
        storage.getReviews(true),
        storage.getQAs(true)
      ];

      await Promise.allSettled(loaders);
      console.log('✨ Smart Preload Complete: Critical data cached.');
    } catch (e) {
      console.error('Preload failed partially:', e);
    }
  },

  // Projects
  getProjects: async (forceRefresh = false) => {
    try {
      if (!forceRefresh) {
        const cached = getCached<any[]>('projects');
        if (cached) return cached;
      }
      const result = await apiCall('/projects');
      const data = Array.isArray(result) ? result : [];
      setCached('projects', data);
      return data;
    } catch (error) {
      console.error('Error getting projects:', error);
      return [];
    }
  },

  addProject: async (project: any) => {
    const res = await apiCall('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
    // Invalidate cache
    localStorage.removeItem(CACHE_KEY_PREFIX + 'projects');
    return res;
  },

  updateProject: async (id: string, updates: any) => {
    const res = await apiCall(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    localStorage.removeItem(CACHE_KEY_PREFIX + 'projects');
    return res;
  },

  deleteProject: async (id: string) => {
    const res = await apiCall(`/projects/${id}`, {
      method: 'DELETE',
    });
    localStorage.removeItem(CACHE_KEY_PREFIX + 'projects');
    return res;
  },

  // Posts
  getPosts: async (forceRefresh = false) => {
    try {
      if (!forceRefresh) {
        const cached = getCached<any[]>('posts');
        if (cached) return cached;
      }
      const result = await apiCall('/posts');
      const data = Array.isArray(result) ? result : [];
      setCached('posts', data);
      return data;
    } catch (error) {
      console.error('Error getting posts:', error);
      return [];
    }
  },

  addPost: async (post: any) => {
    const res = await apiCall('/posts', {
      method: 'POST',
      body: JSON.stringify(post),
    });
    localStorage.removeItem(CACHE_KEY_PREFIX + 'posts');
    return res;
  },

  updatePost: async (id: string, updates: any) => {
    const res = await apiCall(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    localStorage.removeItem(CACHE_KEY_PREFIX + 'posts');
    return res;
  },

  deletePost: async (id: string) => {
    const res = await apiCall(`/posts/${id}`, {
      method: 'DELETE',
    });
    localStorage.removeItem(CACHE_KEY_PREFIX + 'posts');
    return res;
  },

  // Videos
  getVideos: async (forceRefresh = false) => {
    try {
      if (!forceRefresh) {
        const cached = getCached<any[]>('videos');
        if (cached) return cached;
      }
      const result = await apiCall('/videos');
      const data = Array.isArray(result) ? result : [];
      setCached('videos', data);
      return data;
    } catch (error) {
      console.error('Error getting videos:', error);
      return [];
    }
  },

  addVideo: async (video: any) => {
    const res = await apiCall('/videos', {
      method: 'POST',
      body: JSON.stringify(video),
    });
    localStorage.removeItem(CACHE_KEY_PREFIX + 'videos');
    return res;
  },

  updateVideo: async (id: string, updates: any) => {
    const res = await apiCall(`/videos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    localStorage.removeItem(CACHE_KEY_PREFIX + 'videos');
    return res;
  },

  deleteVideo: async (id: string) => {
    const res = await apiCall(`/videos/${id}`, {
      method: 'DELETE',
    });
    localStorage.removeItem(CACHE_KEY_PREFIX + 'videos');
    return res;
  },

  // Certificates
  getCertificates: async (forceRefresh = false) => {
    try {
      if (!forceRefresh) {
        const cached = getCached<any[]>('certificates');
        if (cached) return cached;
      }
      const result = await apiCall('/certificates');
      const data = Array.isArray(result) ? result : [];
      setCached('certificates', data);
      return data;
    } catch (error) {
      console.error('Error getting certificates:', error);
      return [];
    }
  },

  addCertificate: async (cert: any) => {
    const res = await apiCall('/certificates', {
      method: 'POST',
      body: JSON.stringify(cert),
    });
    localStorage.removeItem(CACHE_KEY_PREFIX + 'certificates');
    return res;
  },

  updateCertificate: async (id: string, updates: any) => {
    const res = await apiCall(`/certificates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    localStorage.removeItem(CACHE_KEY_PREFIX + 'certificates');
    return res;
  },

  deleteCertificate: async (id: string) => {
    const res = await apiCall(`/certificates/${id}`, {
      method: 'DELETE',
    });
    localStorage.removeItem(CACHE_KEY_PREFIX + 'certificates');
    return res;
  },

  // Jobs
  getJobs: async (forceRefresh = false) => {
    try {
      if (!forceRefresh) {
        const cached = getCached<any[]>('jobs');
        if (cached) return cached;
      }
      const result = await apiCall('/jobs');
      const data = Array.isArray(result) ? result : [];
      setCached('jobs', data);
      return data;
    } catch (error) {
      console.error('Error getting jobs:', error);
      return [];
    }
  },

  addJob: async (job: any) => {
    const res = await apiCall('/jobs', {
      method: 'POST',
      body: JSON.stringify(job),
    });
    localStorage.removeItem(CACHE_KEY_PREFIX + 'jobs');
    return res;
  },

  updateJob: async (id: string, updates: any) => {
    const res = await apiCall(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    localStorage.removeItem(CACHE_KEY_PREFIX + 'jobs');
    return res;
  },

  deleteJob: async (id: string) => {
    const res = await apiCall(`/jobs/${id}`, {
      method: 'DELETE',
    });
    localStorage.removeItem(CACHE_KEY_PREFIX + 'jobs');
    return res;
  },

  // Reviews
  getReviews: async (forceRefresh = false) => {
    try {
      if (!forceRefresh) {
        const cached = getCached<any[]>('reviews');
        if (cached) return cached;
      }
      const result = await apiCall('/reviews');
      const data = Array.isArray(result) ? result : [];
      setCached('reviews', data);
      return data;
    } catch (error) {
      console.error('Error getting reviews:', error);
      return [];
    }
  },

  addReview: async (review: any) => {
    const res = await apiCall('/reviews', {
      method: 'POST',
      body: JSON.stringify(review),
    });
    localStorage.removeItem(CACHE_KEY_PREFIX + 'reviews');
    return res;
  },

  updateReview: async (id: string, updates: any) => {
    const res = await apiCall(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    localStorage.removeItem(CACHE_KEY_PREFIX + 'reviews');
    return res;
  },

  deleteReview: async (id: string) => {
    const res = await apiCall(`/reviews/${id}`, {
      method: 'DELETE',
    });
    localStorage.removeItem(CACHE_KEY_PREFIX + 'reviews');
    return res;
  },

  // Q&A
  getQAs: async (forceRefresh = false) => {
    try {
      if (!forceRefresh) {
        const cached = getCached<any[]>('qas');
        if (cached) return cached;
      }
      const result = await apiCall('/qas');
      const data = Array.isArray(result) ? result : [];
      setCached('qas', data);
      return data;
    } catch (error) {
      console.error('Error getting QAs:', error);
      return [];
    }
  },

  addQA: async (qa: any) => {
    const res = await apiCall('/qas', {
      method: 'POST',
      body: JSON.stringify(qa),
    });
    localStorage.removeItem(CACHE_KEY_PREFIX + 'qas');
    return res;
  },

  updateQA: async (id: string, updates: any) => {
    const res = await apiCall(`/qas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    localStorage.removeItem(CACHE_KEY_PREFIX + 'qas');
    return res;
  },

  deleteQA: async (id: string) => {
    const res = await apiCall(`/qas/${id}`, {
      method: 'DELETE',
    });
    localStorage.removeItem(CACHE_KEY_PREFIX + 'qas');
    return res;
  },

  // Messages (No Caching needed usually, but could add if desired. Skipping for now to prioritize content)
  getMessages: async () => {
    try {
      const result = await apiCall('/messages');
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  },

  addMessage: async (message: any) => {
    return await apiCall('/messages', {
      method: 'POST',
      body: JSON.stringify(message),
    });
  },

  updateMessage: async (id: string, updates: any) => {
    return await apiCall(`/messages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  deleteMessage: async (id: string) => {
    return await apiCall(`/messages/${id}`, {
      method: 'DELETE',
    });
  },

  // Settings
  getSettings: async () => {
    try {
      return await apiCall('/settings');
    } catch (error) {
      console.error('Error getting settings:', error);
      return {};
    }
  },

  updateSettings: async (settings: any) => {
    return await apiCall('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  // Analytics
  getAnalytics: async () => {
    try {
      return await apiCall('/analytics');
    } catch (error) {
      console.error('Error getting analytics:', error);
      return {
        totalProjects: 0,
        totalPosts: 0,
        totalMessages: 0,
        unreadMessages: 0,
        totalVideos: 0,
        totalCertificates: 0,
        totalJobs: 0,
        totalReviews: 0,
      };
    }
  },

  // Aura Assistant - Save lead info
  auraSubmitInfo: async (info: any) => {
    return await apiCall('/aura/submit', {
      method: 'POST',
      body: JSON.stringify(info),
    });
  },

  // Aura Assistant - Save contact info
  auraSubmitContact: async (contact: any) => {
    return await apiCall('/contact', {
      method: 'POST',
      body: JSON.stringify(contact),
    });
  },

  // Newsletter Subscriptions
  getNewsletterSubscriptions: async () => {
    try {
      const result = await apiCall('/newsletter');
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error('Error getting newsletter subscriptions:', error);
      return [];
    }
  },

  addNewsletterSubscription: async (email: string) => {
    return await apiCall('/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  deleteNewsletterSubscription: async (id: string) => {
    return await apiCall(`/newsletter/${id}`, {
      method: 'DELETE',
    });
  },
};

