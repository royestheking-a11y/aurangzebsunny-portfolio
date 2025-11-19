// MongoDB-based data storage via API

// Auto-detect API URL: use VITE_API_URL if set, otherwise use current origin in production or localhost in development
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
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
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`🌐 API Call: ${options.method || 'GET'} ${url}`);
    
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
        console.log(`✅ API Success: ${endpoint}`);
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
  // Projects
  getProjects: async () => {
    try {
      return await apiCall('/projects');
    } catch (error) {
      console.error('Error getting projects:', error);
      return [];
    }
  },
  
  addProject: async (project: any) => {
    return await apiCall('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  },
  
  updateProject: async (id: string, updates: any) => {
    return await apiCall(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
  
  deleteProject: async (id: string) => {
    return await apiCall(`/projects/${id}`, {
      method: 'DELETE',
    });
  },

  // Posts
  getPosts: async () => {
    try {
      return await apiCall('/posts');
    } catch (error) {
      console.error('Error getting posts:', error);
      return [];
    }
  },
  
  addPost: async (post: any) => {
    return await apiCall('/posts', {
      method: 'POST',
      body: JSON.stringify(post),
    });
  },
  
  updatePost: async (id: string, updates: any) => {
    return await apiCall(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
  
  deletePost: async (id: string) => {
    return await apiCall(`/posts/${id}`, {
      method: 'DELETE',
    });
  },

  // Videos
  getVideos: async () => {
    try {
      return await apiCall('/videos');
    } catch (error) {
      console.error('Error getting videos:', error);
      return [];
    }
  },
  
  addVideo: async (video: any) => {
    return await apiCall('/videos', {
      method: 'POST',
      body: JSON.stringify(video),
    });
  },
  
  updateVideo: async (id: string, updates: any) => {
    return await apiCall(`/videos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
  
  deleteVideo: async (id: string) => {
    return await apiCall(`/videos/${id}`, {
      method: 'DELETE',
    });
  },

  // Certificates
  getCertificates: async () => {
    try {
      return await apiCall('/certificates');
    } catch (error) {
      console.error('Error getting certificates:', error);
      return [];
    }
  },
  
  addCertificate: async (cert: any) => {
    return await apiCall('/certificates', {
      method: 'POST',
      body: JSON.stringify(cert),
    });
  },
  
  deleteCertificate: async (id: string) => {
    return await apiCall(`/certificates/${id}`, {
      method: 'DELETE',
    });
  },

  // Jobs
  getJobs: async () => {
    try {
      return await apiCall('/jobs');
    } catch (error) {
      console.error('Error getting jobs:', error);
      return [];
    }
  },
  
  addJob: async (job: any) => {
    return await apiCall('/jobs', {
      method: 'POST',
      body: JSON.stringify(job),
    });
  },
  
  updateJob: async (id: string, updates: any) => {
    return await apiCall(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
  
  deleteJob: async (id: string) => {
    return await apiCall(`/jobs/${id}`, {
      method: 'DELETE',
    });
  },

  // Reviews
  getReviews: async () => {
    try {
      return await apiCall('/reviews');
    } catch (error) {
      console.error('Error getting reviews:', error);
      return [];
    }
  },
  
  addReview: async (review: any) => {
    return await apiCall('/reviews', {
      method: 'POST',
      body: JSON.stringify(review),
    });
  },
  
  deleteReview: async (id: string) => {
    return await apiCall(`/reviews/${id}`, {
      method: 'DELETE',
    });
  },

  // Q&A
  getQAs: async () => {
    try {
      return await apiCall('/qas');
    } catch (error) {
      console.error('Error getting QAs:', error);
      return [];
    }
  },
  
  addQA: async (qa: any) => {
    return await apiCall('/qas', {
      method: 'POST',
      body: JSON.stringify(qa),
    });
  },
  
  updateQA: async (id: string, updates: any) => {
    return await apiCall(`/qas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
  
  deleteQA: async (id: string) => {
    return await apiCall(`/qas/${id}`, {
      method: 'DELETE',
    });
  },

  // Messages
  getMessages: async () => {
    try {
      return await apiCall('/messages');
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

  // Newsletter Subscriptions
  getNewsletterSubscriptions: async () => {
    try {
      return await apiCall('/newsletter');
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
