// API client - Wrapper around storage for consistent API interface
import { storage } from './storage';

export const api = {
  // Contact form submission
  submitContact: async (data: {
    name: string;
    email: string;
    message: string;
    source?: string;
    phone?: string;
    subject?: string;
  }) => {
    try {
      const result = await storage.addMessage({
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        subject: data.subject || data.source || 'Contact Form',
        message: data.message,
        source: data.source || 'contact-form',
        read: false,
      });
      return { success: true, data: result };
    } catch (error) {
      console.error('Error submitting contact:', error);
      throw error;
    }
  },

  // Aura Assistant - Submit lead info
  auraSubmitInfo: async (info: {
    name: string;
    email: string;
    phone?: string;
    message?: string;
  }) => {
    try {
      const result = await storage.auraSubmitInfo(info);
      return result;
    } catch (error) {
      console.error('Error submitting aura info:', error);
      throw error;
    }
  },

  // Projects
  getProjects: () => storage.getProjects(),
  addProject: (project: any) => storage.addProject(project),
  updateProject: (id: string, updates: any) => storage.updateProject(id, updates),
  deleteProject: (id: string) => storage.deleteProject(id),

  // Posts
  getPosts: () => storage.getPosts(),
  addPost: (post: any) => storage.addPost(post),
  updatePost: (id: string, updates: any) => storage.updatePost(id, updates),
  deletePost: (id: string) => storage.deletePost(id),

  // Videos
  getVideos: () => storage.getVideos(),
  addVideo: (video: any) => storage.addVideo(video),
  updateVideo: (id: string, updates: any) => storage.updateVideo(id, updates),
  deleteVideo: (id: string) => storage.deleteVideo(id),

  // Certificates
  getCertificates: () => storage.getCertificates(),
  addCertificate: (cert: any) => storage.addCertificate(cert),
  deleteCertificate: (id: string) => storage.deleteCertificate(id),

  // Jobs
  getJobs: () => storage.getJobs(),
  addJob: (job: any) => storage.addJob(job),
  updateJob: (id: string, updates: any) => storage.updateJob(id, updates),
  deleteJob: (id: string) => storage.deleteJob(id),

  // Reviews
  getReviews: () => storage.getReviews(),
  addReview: (review: any) => storage.addReview(review),
  deleteReview: (id: string) => storage.deleteReview(id),

  // Q&A
  getQAs: () => storage.getQAs(),
  addQA: (qa: any) => storage.addQA(qa),
  updateQA: (id: string, updates: any) => storage.updateQA(id, updates),
  deleteQA: (id: string) => storage.deleteQA(id),

  // Messages
  getMessages: () => storage.getMessages(),
  addMessage: (message: any) => storage.addMessage(message),
  updateMessage: (id: string, updates: any) => storage.updateMessage(id, updates),
  deleteMessage: (id: string) => storage.deleteMessage(id),

  // Settings
  getSettings: () => storage.getSettings(),
  updateSettings: (settings: any) => storage.updateSettings(settings),

  // Analytics
  getAnalytics: () => storage.getAnalytics(),

  // Newsletter
  getNewsletterSubscriptions: () => storage.getNewsletterSubscriptions(),
  addNewsletterSubscription: (email: string) => storage.addNewsletterSubscription(email),
  deleteNewsletterSubscription: (id: string) => storage.deleteNewsletterSubscription(id),
};
