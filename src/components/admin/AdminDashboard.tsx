import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Video,
  Award,
  Briefcase,
  Star,
  HelpCircle,
  MessageSquare,
  Send,
  Settings,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Check,
  X,
  Mail,
  Play,
  User,
  Menu
} from 'lucide-react';
import { storage } from '../../utils/storage';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { toast } from 'sonner';
import { ImageUpload } from './ImageUpload';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState('overview');
  const [analytics, setAnalytics] = useState<any>(null);
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load analytics
  useEffect(() => {
    loadAnalytics();
  }, []);

  // Load data when view changes
  useEffect(() => {
    loadCurrentViewData();
  }, [currentView]);

  const loadAnalytics = async () => {
    try {
      const analyticsData = await storage.getAnalytics();
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics');
    }
  };

  const loadCurrentViewData = async () => {
    if (currentView === 'overview' || currentView === 'settings') {
      return;
    }

    setLoading(true);
    try {
      let result: any = {};
      switch (currentView) {
        case 'projects':
          result = { projects: await storage.getProjects() || [] };
          break;
        case 'posts':
          result = { posts: await storage.getPosts() || [] };
          break;
        case 'videos':
          result = { videos: await storage.getVideos() || [] };
          break;
        case 'certificates':
          result = { certificates: await storage.getCertificates() || [] };
          break;
        case 'jobs':
          result = { jobs: await storage.getJobs() || [] };
          break;
        case 'reviews':
          result = { reviews: await storage.getReviews() || [] };
          break;
        case 'qa':
          result = { qas: await storage.getQAs() || [] };
          break;
        case 'messages':
          result = { messages: await storage.getMessages() || [] };
          break;
        case 'newsletter':
          result = { newsletter: await storage.getNewsletterSubscriptions() || [] };
          break;
      }
      setData(result);
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast.error(`Failed to load ${currentView}: ${error.message || 'Check if server is running'}`);
      setData({});
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    await loadCurrentViewData();
    if (currentView === 'overview') {
      await loadAnalytics();
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* Floating Glass Sidebar (Desktop) */}
      <aside className="w-80 h-screen sticky top-0 p-6 z-20 flex flex-col gap-6 hidden md:flex">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl h-full p-6 flex flex-col shadow-2xl relative overflow-hidden group">
          {/* Glossy sheen */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

          {/* Header */}
          <div className="flex items-center gap-4 mb-8 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight tracking-wide">Custom Software & <br /><span className="text-primary font-light">Admin Dashboard Development</span></h1>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
            <AdminNavContent currentView={currentView} setCurrentView={setCurrentView} analytics={analytics} />
          </nav>

          {/* Footer User */}
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-medium">Aurangzeb</p>
                <p className="text-muted-foreground">Admin</p>
              </div>
            </div>
            <button onClick={onLogout} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-red-400">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col bg-background">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <LayoutDashboard className="w-4 h-4 text-white" />
              </div>
              <h1 className="font-bold text-sm">Aurangzeb <span className="text-primary font-light"> Dashboard</span></h1>
            </div>
            <Button size="icon" variant="ghost" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <nav className="space-y-2">
              <AdminNavContent
                currentView={currentView}
                setCurrentView={(view: string) => {
                  setCurrentView(view);
                  setIsMobileMenuOpen(false);
                }}
                analytics={analytics}
              />
            </nav>
          </div>
          <div className="p-6 border-t border-white/10">
            <Button variant="destructive" className="w-full justify-start gap-2" onClick={onLogout}>
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-6 z-10 overflow-y-auto h-screen custom-scrollbar">
        <div className="max-w-[1600px] mx-auto space-y-8">
          {/* Header for Mobile/Title */}
          <div className="flex items-center justify-between mb-8 md:hidden">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <LayoutDashboard className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold">Admin</h1>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="outline" className="bg-card/50" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
          {/* Desktop Header with Clock */}
          <div className="hidden md:flex items-center justify-between mb-2">
            <div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                Admin Portal
              </h2>
            </div>
            <LiveClock />
          </div>

          {/* Only show title on desktop if needed, usually nav handles context */}

          {/* Content Switcher */}
          {currentView === 'overview' && <OverviewView analytics={analytics} />}
          {currentView === 'projects' && (
            <ProjectsView
              data={data.projects || []}
              loading={loading}
              onRefresh={onRefresh}
            />
          )}
          {/* Other views mapped similarly (keeping legacy component names but wrapping logic) */}
          {currentView === 'posts' && <PostsView data={data.posts || []} loading={loading} onRefresh={onRefresh} />}
          {currentView === 'videos' && <VideosView data={data.videos || []} loading={loading} onRefresh={onRefresh} />}
          {currentView === 'certificates' && <CertificatesView data={data.certificates || []} loading={loading} onRefresh={onRefresh} />}
          {currentView === 'jobs' && <JobsView data={data.jobs || []} loading={loading} onRefresh={onRefresh} />}
          {currentView === 'reviews' && <ReviewsView data={data.reviews || []} loading={loading} onRefresh={onRefresh} />}
          {currentView === 'qa' && <QAView data={data.qas || []} loading={loading} onRefresh={onRefresh} />}
          {currentView === 'messages' && <MessagesView data={data.messages || []} loading={loading} onRefresh={onRefresh} onAnalyticsUpdate={loadAnalytics} />}
          {/* Newsletter View omitted in original code logic for simplicity or passed through? Re-adding based on context */}
          {currentView === 'newsletter' && <NewsletterView data={data.newsletter || []} loading={loading} onRefresh={onRefresh} />}
          {currentView === 'settings' && <SettingsView />}
        </div>
      </main>
    </div>
  );
}

// ----------------------
// Styled Sub-Components
// ----------------------

function AdminNavContent({ currentView, setCurrentView, analytics }: any) {
  return (
    <>
      <NavCategory label="Main" />
      <NavItem icon={<LayoutDashboard />} label="Overview" active={currentView === 'overview'} onClick={() => setCurrentView('overview')} />
      <NavItem icon={<FolderKanban />} label="Projects" active={currentView === 'projects'} onClick={() => setCurrentView('projects')} badge={analytics?.totalProjects} />
      <NavItem icon={<FileText />} label="Blog Posts" active={currentView === 'posts'} onClick={() => setCurrentView('posts')} badge={analytics?.totalPosts} />
      <NavItem icon={<Video />} label="Videos" active={currentView === 'videos'} onClick={() => setCurrentView('videos')} badge={analytics?.totalVideos} />

      <NavCategory label="Content" />
      <NavItem icon={<Award />} label="Certificates" active={currentView === 'certificates'} onClick={() => setCurrentView('certificates')} badge={analytics?.totalCertificates} />
      <NavItem icon={<Briefcase />} label="Experience" active={currentView === 'jobs'} onClick={() => setCurrentView('jobs')} badge={analytics?.totalJobs} />
      <NavItem icon={<Star />} label="Reviews" active={currentView === 'reviews'} onClick={() => setCurrentView('reviews')} badge={analytics?.totalReviews} />
      <NavItem icon={<HelpCircle />} label="Q&A" active={currentView === 'qa'} onClick={() => setCurrentView('qa')} />

      <NavCategory label="Communication" />
      <NavItem icon={<MessageSquare />} label="Messages" active={currentView === 'messages'} onClick={() => setCurrentView('messages')} badge={analytics?.unreadMessages} badgeColor="bg-red-500" />
      <NavItem icon={<Send />} label="Newsletter" active={currentView === 'newsletter'} onClick={() => setCurrentView('newsletter')} />

      <NavCategory label="System" />
      <NavItem icon={<Settings />} label="Settings" active={currentView === 'settings'} onClick={() => setCurrentView('settings')} />
    </>
  )
}


function NavCategory({ label }: { label: string }) {
  return <div className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold mt-6 mb-2 ml-3">{label}</div>
}

function NavItem({ icon, label, active, onClick, badge, badgeColor = "bg-primary" }: any) {
  return (
    <button
      onClick={onClick}
      className={`relative w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden ${active
        ? 'bg-primary/20 text-primary shadow-lg shadow-primary/10'
        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
        }`}
    >
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />}

      <div className="flex items-center gap-3 relative z-10">
        {React.cloneElement(icon as React.ReactElement<any>, {
          className: `w-5 h-5 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`
        })}
        <span className="font-medium text-sm tracking-wide">{label}</span>
      </div>

      {badge !== undefined && badge !== null && badge > 0 && (
        <span className={`${badgeColor} text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-lg shadow-black/20`}>
          {badge}
        </span>
      )}
    </button>
  );
}

// Overview Component
function OverviewView({ analytics }: any) {
  if (!analytics) return <div className="p-12 text-center text-muted-foreground animate-pulse">Loading analytics dashboard...</div>;

  const stats = [
    { label: 'Total Projects', value: analytics.totalProjects, icon: FolderKanban, color: 'text-blue-500', bg: 'bg-blue-500/10', delay: 0 },
    { label: 'Blog Posts', value: analytics.totalPosts, icon: FileText, color: 'text-green-500', bg: 'bg-green-500/10', delay: 0.1 },
    { label: 'Total Messages', value: analytics.totalMessages, icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-500/10', delay: 0.2 },
    { label: 'Unread Messages', value: analytics.unreadMessages, icon: MessageSquare, color: 'text-red-500', bg: 'bg-red-500/10', delay: 0.3 },
    { label: 'Video Gallery', value: analytics.totalVideos, icon: Video, color: 'text-orange-500', bg: 'bg-orange-500/10', delay: 0.4 },
    { label: 'Certificates', value: analytics.totalCertificates, icon: Award, color: 'text-yellow-600', bg: 'bg-yellow-500/10', delay: 0.5 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold text-foreground">Overview</h2>
        <p className="text-muted-foreground">Welcome back to your command center.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="group relative bg-card border border-border/50 rounded-3xl p-6 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            style={{ animationDelay: `${stat.delay}s` }}
          >
            <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} border border-border/10`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.bg} ${stat.color}`}>
                  +12% vs last month
                </span>
              </div>

              <div>
                <h3 className="text-4xl font-bold text-foreground mb-1 group-hover:scale-105 transition-transform origin-left">
                  {stat.value || 0}
                </h3>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border/50 rounded-3xl p-8">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Actions</h3>
        <div className="flex gap-4">
          <Button variant="outline" className="border-dashed border-border h-auto py-6 w-full max-w-[200px] flex flex-col gap-2 hover:bg-primary/5 hover:border-primary transition-all group">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors text-primary">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-foreground font-medium">New Project</span>
          </Button>
        </div>
      </div>
    </div>
  );
}


// Projects View
function ProjectsView({ data, loading, onRefresh }: any) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      gallery: [], // For multiple screenshots
      category: 'UI/UX Design',
      featured: false,
      tags: [],
      tools: [],
      liveUrl: '',
      githubUrl: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    // Remove _id from item before setting form data
    const { _id, ...itemData } = item;
    setEditingItem(item);
    setFormData({
      ...itemData,
      gallery: itemData.gallery || [],
      tags: itemData.tags || [],
      tools: itemData.tools || []
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Please fill in required fields (Title and Description)');
      return;
    }

    setSaving(true);
    try {
      // Clean up arrays (remove empty strings/spaces)
      const cleanFormData = {
        ...formData,
        tags: Array.isArray(formData.tags) ? formData.tags.map((t: string) => t.trim()).filter(Boolean) : [],
        tools: Array.isArray(formData.tools) ? formData.tools.map((t: string) => t.trim()).filter(Boolean) : [],
        gallery: Array.isArray(formData.gallery) ? formData.gallery.filter(Boolean) : []
      };

      if (editingItem) {
        await storage.updateProject(editingItem.id, cleanFormData);
        toast.success('Project updated successfully!');
      } else {
        await storage.addProject(cleanFormData);
        toast.success('Project created successfully!');
      }
      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData({});
      await onRefresh();
    } catch (error: any) {
      console.error('Error saving project:', error);
      toast.error(`Failed to save project: ${error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await storage.deleteProject(id);
        toast.success('Project deleted successfully!');
        await onRefresh();
      } catch (error: any) {
        console.error('Error deleting project:', error);
        toast.error(`Failed to delete project: ${error.message || 'Unknown error'}`);
      }
    }
  };

  // Helper to handle array inputs (tags/tools) from string
  const handleArrayInput = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value.split(',') });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl">Projects</h2>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <FolderKanban className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">No projects yet</p>
          <Button onClick={handleAdd}>Create your first project</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((project: any) => (
            <div key={project.id} className="bg-card p-6 rounded-xl border border-border">
              {project.image && (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-xl mb-2">{project.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {project.description}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(project.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
          <div className="p-6 pb-4 border-b bg-background/95 backdrop-blur z-10">
            <DialogHeader className="p-0">
              <DialogTitle>{editingItem ? 'Edit Project' : 'Add Project'}</DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update the project details below.' : 'Fill in the details to create a new project.'}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Project Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select
                    className="w-full p-2 h-10 rounded-md border border-input bg-background"
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Branding">Branding</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  className="min-h-[100px]"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed project description..."
                />
              </div>

              <div className="space-y-2">
                <Label>Main Thumbnail (Cover Image)</Label>
                <ImageUpload
                  value={formData.image || ''}
                  onChange={(url: string) => setFormData({ ...formData, image: url })}
                  aspectRatio={16 / 9}
                  maxWidth={800}
                  maxHeight={450}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Project Gallery (Screenshots)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData({ ...formData, gallery: [...(formData.gallery || []), ''] })}
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Image
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(formData.gallery || []).map((url: string, index: number) => (
                    <div key={index} className="relative group">
                      <ImageUpload
                        value={url}
                        onChange={(newUrl: string) => {
                          const newGallery = [...formData.gallery];
                          newGallery[index] = newUrl;
                          setFormData({ ...formData, gallery: newGallery });
                        }}
                        aspectRatio={16 / 9}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          const newGallery = formData.gallery.filter((_: any, i: number) => i !== index);
                          setFormData({ ...formData, gallery: newGallery });
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tags (comma separated)</Label>
                  <Input
                    value={Array.isArray(formData.tags) ? formData.tags.join(',') : ''}
                    onChange={(e) => handleArrayInput('tags', e.target.value)}
                    placeholder="React, TypeScript, Redux..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tools Used (comma separated)</Label>
                  <Input
                    value={Array.isArray(formData.tools) ? formData.tools.join(',') : ''}
                    onChange={(e) => handleArrayInput('tools', e.target.value)}
                    placeholder="Figma, VS Code, Vercel..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Live URL</Label>
                  <Input
                    value={formData.liveUrl || ''}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>GitHub URL</Label>
                  <Input
                    value={formData.githubUrl || ''}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={formData.featured || false}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                />
                <Label htmlFor="featured" className="cursor-pointer">Featured Project (Show on Home)</Label>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={handleSave} disabled={saving} className="flex-1">
                  {saving ? 'Saving...' : 'Save Project'}
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Posts View
function PostsView({ data, loading, onRefresh }: any) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      thumbnail: '',
      author: 'Aurangzeb Sunny',
      readTime: '5 min read',
      tags: [],
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    // Remove _id from item before setting form data
    const { _id, ...itemData } = item;
    setEditingItem(item);
    setFormData(itemData);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.excerpt || !formData.content) {
      toast.error('Please fill in required fields (Title, Excerpt, and Content)');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        await storage.updatePost(editingItem.id, formData);
        toast.success('Post updated successfully!');
      } else {
        await storage.addPost(formData);
        toast.success('Post created successfully!');
      }
      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData({});
      await onRefresh();
    } catch (error: any) {
      console.error('Error saving post:', error);
      toast.error(`Failed to save post: ${error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await storage.deletePost(id);
        toast.success('Post deleted successfully!');
        await onRefresh();
      } catch (error: any) {
        console.error('Error deleting post:', error);
        toast.error(`Failed to delete post: ${error.message || 'Unknown error'}`);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl">Blog Posts</h2>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Post
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">No blog posts yet</p>
          <Button onClick={handleAdd}>Create your first post</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((post: any) => (
            <div key={post.id} className="bg-card p-6 rounded-xl border border-border flex items-start gap-4">
              {post.thumbnail && (
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-32 h-32 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="text-xl mb-2">{post.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Post' : 'Add Post'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the post details below.' : 'Create a new blog post with all the details.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Excerpt</Label>
              <Textarea
                value={formData.excerpt || ''}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={2}
              />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={8}
              />
            </div>
            <div>
              <Label>Thumbnail</Label>
              <ImageUpload
                value={formData.thumbnail || ''}
                onChange={(url: string) => setFormData({ ...formData, thumbnail: url })}
                aspectRatio={16 / 9}
                maxWidth={800}
                maxHeight={450}
              />
            </div>
            <div>
              <Label>Read Time</Label>
              <Input
                value={formData.readTime || ''}
                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                placeholder="5 min read"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Videos View
function VideosView({ data, loading, onRefresh }: any) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const getVideoId = (url: string) => {
    if (!url) return null;
    // Extract YouTube video ID from various URL formats
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\\/\s]{11})/);
    return match ? match[1] : null;
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ title: '', youtubeUrl: '', description: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (video: any) => {
    // Remove _id from video before setting form data
    const { _id, ...videoData } = video;
    setEditingId(video.id);
    setFormData({
      title: videoData.title || '',
      youtubeUrl: videoData.youtubeUrl || '',
      description: videoData.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.youtubeUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate YouTube URL
    const videoId = getVideoId(formData.youtubeUrl);
    if (!videoId) {
      toast.error('Please enter a valid YouTube URL');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await storage.updateVideo(editingId, formData);
        toast.success('Video updated successfully!');
      } else {
        await storage.addVideo(formData);
        toast.success('Video added successfully!');
      }

      setIsDialogOpen(false);
      setEditingId(null);
      setFormData({});
      await onRefresh();
    } catch (error: any) {
      console.error('Error saving video:', error);
      const errorMessage = error.message || 'Unknown error';
      if (errorMessage.includes('not found')) {
        toast.error(`Video not found. It may have been deleted. Please refresh the page.`);
      } else {
        toast.error(`Failed to ${editingId ? 'update' : 'add'} video: ${errorMessage}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      try {
        await storage.deleteVideo(id);
        toast.success('Video deleted successfully!');
        await onRefresh();
      } catch (error: any) {
        console.error('Error deleting video:', error);
        toast.error(`Failed to delete video: ${error.message || 'Unknown error'}`);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl">Videos</h2>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Video
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">No videos yet</p>
          <Button onClick={handleAdd}>Add your first video</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((video: any) => {
            const videoId = getVideoId(video.youtubeUrl);
            const thumbnail = videoId
              ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
              : 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=800';

            return (
              <div key={video.id} className="bg-card rounded-xl border border-border overflow-hidden hover-glow transition-all">
                {/* Video Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <img
                    src={thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to hqdefault if maxresdefault fails
                      const target = e.target as HTMLImageElement;
                      if (videoId && target.src.includes('maxresdefault')) {
                        target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                      }
                    }}
                  />
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </div>
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <h3 className="text-lg mb-2 line-clamp-1">{video.title}</h3>
                  {video.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{video.description}</p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(video)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(video.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Video' : 'Add Video'}</DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Update the video information below.'
                : 'Add a new video from YouTube, YouTube Shorts, or Vimeo to your gallery.'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., My Amazing Project Tutorial"
              />
            </div>

            <div>
              <Label>YouTube URL *</Label>
              <Input
                value={formData.youtubeUrl || ''}
                onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Supports: youtube.com/watch, youtu.be, youtube.com/shorts
              </p>
            </div>

            {/* Video Preview */}
            {formData.youtubeUrl && getVideoId(formData.youtubeUrl) && (
              <div>
                <Label>Preview</Label>
                <div className="relative aspect-video overflow-hidden bg-muted rounded-lg border border-border">
                  <img
                    src={`https://img.youtube.com/vi/${getVideoId(formData.youtubeUrl)}/maxresdefault.jpg`}
                    alt="Video preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const videoId = getVideoId(formData.youtubeUrl);
                      if (videoId && target.src.includes('maxresdefault')) {
                        target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                      }
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description about the video..."
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {(formData.description || '').length} characters
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleSave} className="flex-1" disabled={saving}>
              {saving ? 'Saving...' : (editingId ? 'Update Video' : 'Add Video')}
            </Button>
            <Button variant="outline" onClick={() => {
              setIsDialogOpen(false);
              setEditingId(null);
            }}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Certificates View
function CertificatesView({ data, loading, onRefresh }: any) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      issuer: '',
      date: '',
      image: '',
      credentialUrl: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    const { _id, ...itemData } = item;
    setEditingItem(item);
    setFormData(itemData);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.issuer) {
      toast.error('Please fill in required fields (Title and Issuer)');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        await storage.updateCertificate(editingItem.id, formData);
        toast.success('Certificate updated successfully!');
      } else {
        await storage.addCertificate(formData);
        toast.success('Certificate added successfully!');
      }
      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData({});
      await onRefresh();
    } catch (error: any) {
      console.error('Error adding certificate:', error);
      toast.error(`Failed to add certificate: ${error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this certificate?')) {
      try {
        await storage.deleteCertificate(id);
        toast.success('Certificate deleted successfully!');
        await onRefresh();
      } catch (error: any) {
        console.error('Error deleting certificate:', error);
        toast.error(`Failed to delete certificate: ${error.message || 'Unknown error'}`);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl">Certificates</h2>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Certificate
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">No certificates yet</p>
          <Button onClick={handleAdd}>Add your first certificate</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((cert: any) => (
            <div key={cert.id} className="bg-card p-6 rounded-xl border border-border">
              {cert.image && (
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-xl mb-2">{cert.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{cert.issuer}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(cert)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(cert.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Certificate' : 'Add Certificate'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update your certificate details.' : 'Add a new professional certificate or achievement to showcase your credentials.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Issuer</Label>
              <Input
                value={formData.issuer || ''}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div>
              <Label>Certificate Image</Label>
              <ImageUpload
                value={formData.image || ''}
                onChange={(url: string) => setFormData({ ...formData, image: url })}
                aspectRatio={4 / 3}
                maxWidth={800}
                maxHeight={600}
              />
            </div>
            <div>
              <Label>Credential URL (optional)</Label>
              <Input
                value={formData.credentialUrl || ''}
                onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Jobs View
function JobsView({ data, loading, onRefresh }: any) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      company: '',
      period: '',
      description: '',
      skills: [],
      achievements: [],
      current: false,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    // Remove _id from item before setting form data
    const { _id, ...itemData } = item;
    setEditingItem(item);
    setFormData(itemData);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.company || !formData.period) {
      toast.error('Please fill in required fields (Title, Company, and Period)');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        await storage.updateJob(editingItem.id, formData);
        toast.success('Job updated successfully!');
      } else {
        await storage.addJob(formData);
        toast.success('Job added successfully!');
      }
      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData({});
      await onRefresh();
    } catch (error: any) {
      console.error('Error saving job:', error);
      toast.error(`Failed to save job: ${error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      try {
        await storage.deleteJob(id);
        toast.success('Job deleted successfully!');
        await onRefresh();
      } catch (error: any) {
        console.error('Error deleting job:', error);
        toast.error(`Failed to delete job: ${error.message || 'Unknown error'}`);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl">Experience</h2>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Job
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">No experience yet</p>
          <Button onClick={handleAdd}>Add your first job</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((job: any) => (
            <div key={job.id} className="bg-card p-6 rounded-xl border border-border">
              <h3 className="text-xl mb-2">{job.title}</h3>
              <p className="text-muted-foreground mb-2">{job.company}</p>
              <p className="text-sm text-muted-foreground mb-4">{job.period}</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(job)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(job.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Job' : 'Add Job'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the job experience details below.' : 'Add a new job position to your career timeline.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Job Title</Label>
              <Input
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Company</Label>
              <Input
                value={formData.company || ''}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
            <div>
              <Label>Period</Label>
              <Input
                value={formData.period || ''}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="Jan 2023 - Present"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.current || false}
                onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
              />
              <Label>Current Position</Label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Reviews View
function ReviewsView({ data, loading, onRefresh }: any) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      role: '',
      company: '',
      review: '',
      rating: 5,
      avatar: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    const { _id, ...itemData } = item;
    setEditingItem(item);
    setFormData(itemData);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.review || !formData.rating) {
      toast.error('Please fill in required fields (Name, Review, and Rating)');
      return;
    }

    setSaving(true);
    setSaving(true);
    try {
      if (editingItem) {
        await storage.updateReview(editingItem.id, formData);
        toast.success('Review updated successfully!');
      } else {
        await storage.addReview(formData);
        toast.success('Review added successfully!');
      }
      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData({});
      await onRefresh();
    } catch (error: any) {
      console.error('Error adding review:', error);
      toast.error(`Failed to add review: ${error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      try {
        await storage.deleteReview(id);
        toast.success('Review deleted successfully!');
        await onRefresh();
      } catch (error: any) {
        console.error('Error deleting review:', error);
        toast.error(`Failed to delete review: ${error.message || 'Unknown error'}`);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl">Reviews</h2>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Review
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">No reviews yet</p>
          <Button onClick={handleAdd}>Add your first review</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((review: any) => (
            <div key={review.id} className="bg-card p-6 rounded-xl border border-border">
              <div className="flex items-start gap-4">
                {review.avatar && (
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl mb-1">{review.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {review.role} at {review.company}
                  </p>
                  <p className="text-muted-foreground mb-4">{review.review}</p>
                  <div className="flex gap-2 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(review)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(review.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Review' : 'Add Review'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the client review details.' : 'Add a client testimonial or review to showcase your work quality.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Role</Label>
              <Input
                value={formData.role || ''}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
            </div>
            <div>
              <Label>Company</Label>
              <Input
                value={formData.company || ''}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
            <div>
              <Label>Review</Label>
              <Textarea
                value={formData.review || ''}
                onChange={(e) => setFormData({ ...formData, review: e.target.value })}
              />
            </div>
            <div>
              <Label>Rating (1-5)</Label>
              <Input
                type="number"
                min="1"
                max="5"
                value={formData.rating || 5}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label>Avatar</Label>
              <ImageUpload
                value={formData.avatar || ''}
                onChange={(url: string) => setFormData({ ...formData, avatar: url })}
                aspectRatio={1}
                maxWidth={200}
                maxHeight={200}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Q&A View
function QAView({ data, loading, onRefresh }: any) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ question: '', answer: '', category: 'General' });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: any) => {
    // Remove _id from item before setting form data
    const { _id, ...itemData } = item;
    setEditingItem(item);
    setFormData(itemData);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.question || !formData.answer) {
      toast.error('Please fill in required fields (Question and Answer)');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        await storage.updateQA(editingItem.id, formData);
        toast.success('Q&A updated successfully!');
      } else {
        await storage.addQA(formData);
        toast.success('Q&A added successfully!');
      }
      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData({});
      await onRefresh();
    } catch (error: any) {
      console.error('Error saving Q&A:', error);
      toast.error(`Failed to save Q&A: ${error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this Q&A?')) {
      try {
        await storage.deleteQA(id);
        toast.success('Q&A deleted successfully!');
        await onRefresh();
      } catch (error: any) {
        console.error('Error deleting Q&A:', error);
        toast.error(`Failed to delete Q&A: ${error.message || 'Unknown error'}`);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl">Q&A</h2>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Q&A
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <HelpCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">No Q&A yet</p>
          <Button onClick={handleAdd}>Add your first Q&A</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((qa: any) => (
            <div key={qa.id} className="bg-card p-6 rounded-xl border border-border">
              <h3 className="text-xl mb-2">{qa.question}</h3>
              <p className="text-muted-foreground mb-4">{qa.answer}</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(qa)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(qa.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Q&A' : 'Add Q&A'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the Q&A content below.' : 'Add a new frequently asked question and its answer.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Question</Label>
              <Input
                value={formData.question || ''}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              />
            </div>
            <div>
              <Label>Answer</Label>
              <Textarea
                value={formData.answer || ''}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                rows={6}
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="General, Services, Pricing, etc."
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Messages View
function MessagesView({ data, loading, onRefresh, onAnalyticsUpdate }: any) {
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);

  const handleToggleRead = async (id: string, currentRead: boolean) => {
    try {
      await storage.updateMessage(id, { read: !currentRead });
      toast.success(`Message marked as ${!currentRead ? 'read' : 'unread'}`);
      await onRefresh();
      onAnalyticsUpdate();
    } catch (error: any) {
      console.error('Error updating message:', error);
      toast.error(`Failed to update message: ${error.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        await storage.deleteMessage(id);
        toast.success('Message deleted successfully!');
        await onRefresh();
        onAnalyticsUpdate();
      } catch (error: any) {
        console.error('Error deleting message:', error);
        toast.error(`Failed to delete message: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'contact-form':
        return { label: 'Contact Form', color: 'bg-blue-500' };
      case 'aura-assistant':
        return { label: 'Aura Assistant (Lead)', color: 'bg-purple-500' };
      case 'aura-assistant-contact':
        return { label: 'Aura Assistant (Direct Contact)', color: 'bg-green-500' };
      default:
        return { label: 'Unknown', color: 'bg-gray-500' };
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl">Messages</h2>
        <p className="text-muted-foreground">
          {data.length} total messages
        </p>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">No messages yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((message: any) => {
            const sourceInfo = getSourceLabel(message.source || 'contact-form');
            return (
              <div
                key={message.id}
                className={`bg-card p-6 rounded-xl border ${message.read ? 'border-border' : 'border-primary'
                  }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl">{message.name}</h3>
                      {!message.read && (
                        <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                          New
                        </span>
                      )}
                      <span className={`${sourceInfo.color} text-white px-2 py-1 rounded text-xs`}>
                        {sourceInfo.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{message.email}</p>
                    {message.phone && (
                      <p className="text-sm text-muted-foreground">📞 {message.phone}</p>
                    )}
                    {message.subject && (
                      <p className="text-sm mt-2"><strong>Subject:</strong> {message.subject}</p>
                    )}
                    {message.createdAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-muted-foreground">{message.message}</p>
                </div>

                {/* Chat History (for Aura Assistant messages) */}
                {message.chatHistory && message.chatHistory.length > 0 && (
                  <div className="mt-4 border-t border-border pt-4">
                    <button
                      onClick={() => setExpandedMessage(expandedMessage === message.id ? null : message.id)}
                      className="text-sm text-primary hover:underline mb-2"
                    >
                      {expandedMessage === message.id ? '▼ Hide' : '▶'} Chat History ({message.chatHistory.length} messages)
                    </button>
                    {expandedMessage === message.id && (
                      <div className="bg-muted/50 p-4 rounded-lg space-y-2 max-h-60 overflow-y-auto">
                        {message.chatHistory.map((chat: any, index: number) => (
                          <div key={index} className={`text-sm ${chat.role === 'user' ? 'text-right' : 'text-left'}`}>
                            <span className={`inline-block p-2 rounded ${chat.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card'
                              }`}>
                              {chat.content}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleRead(message.id, message.read)}
                  >
                    {message.read ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                    {message.read ? 'Mark Unread' : 'Mark Read'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(message.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  {message.email && (
                    <a href={`mailto:${message.email}`}>
                      <Button variant="outline" size="sm">
                        <Mail className="w-4 h-4 mr-2" />
                        Reply
                      </Button>
                    </a>
                  )}
                  {message.phone && (
                    <a href={`https://wa.me/${message.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        WhatsApp
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Newsletter View
function NewsletterView({ data, loading, onRefresh }: any) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);

  const handleAdd = () => {
    setFormData({ email: '' });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.email) {
      toast.error('Please enter an email address');
      return;
    }

    setSaving(true);
    try {
      await storage.addNewsletterSubscription(formData.email || formData);
      toast.success('Subscription added successfully!');
      setIsDialogOpen(false);
      setFormData({});
      await onRefresh();
    } catch (error: any) {
      console.error('Error adding subscription:', error);
      toast.error(`Failed to add subscription: ${error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this subscription?')) {
      try {
        await storage.deleteNewsletterSubscription(id);
        toast.success('Subscription deleted successfully!');
        await onRefresh();
      } catch (error: any) {
        console.error('Error deleting subscription:', error);
        toast.error(`Failed to delete subscription: ${error.message || 'Unknown error'}`);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl">Newsletter Subscriptions</h2>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Subscription
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <Send className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">No subscriptions yet</p>
          <Button onClick={handleAdd}>Add your first subscription</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((subscription: any) => (
            <div key={subscription.id} className="bg-card p-6 rounded-xl border border-border">
              <h3 className="text-xl mb-2">{subscription.email}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Subscribed: {subscription.createdAt ? new Date(subscription.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : 'Date unknown'}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(subscription.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Subscription</DialogTitle>
            <DialogDescription>
              Manually add a newsletter subscriber to your mailing list.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Settings View
function SettingsView() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const currentSettings = await storage.getSettings();
      setSettings(currentSettings);
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Remove _id before sending to API
      const { _id, ...settingsToUpdate } = settings;
      await storage.updateSettings(settingsToUpdate);
      toast.success('Settings updated successfully!');
      // Reload settings to get updated data
      const updatedSettings = await storage.getSettings();
      setSettings(updatedSettings);
    } catch (error: any) {
      console.error('Error updating settings:', error);
      toast.error(`Failed to update settings: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl mb-8">Settings</h2>
      <div className="bg-card p-6 rounded-xl border border-border max-w-2xl">
        <div className="space-y-6">
          <div>
            <Label>Profile Image</Label>
            <ImageUpload
              value={settings.profileImage || ''}
              onChange={(url: string) => setSettings({ ...settings, profileImage: url })}
              aspectRatio={1}
              maxWidth={400}
              maxHeight={400}
            />
          </div>
          <div>
            <Label>Resume URL</Label>
            <Input
              value={settings.resumeUrl || ''}
              onChange={(e) => setSettings({ ...settings, resumeUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div>
            <Label>LinkedIn</Label>
            <Input
              value={settings.linkedin || ''}
              onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/..."
            />
          </div>
          <div>
            <Label>GitHub</Label>
            <Input
              value={settings.github || ''}
              onChange={(e) => setSettings({ ...settings, github: e.target.value })}
              placeholder="https://github.com/..."
            />
          </div>
          <div>
            <Label>Instagram</Label>
            <Input
              value={settings.instagram || ''}
              onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={settings.email || ''}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            />
          </div>
          <div>
            <Label>WhatsApp</Label>
            <Input
              value={settings.whatsapp || ''}
              onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
              placeholder="+1234567890"
            />
          </div>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function LiveClock() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-4 bg-card/50 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm shadow-sm hover:bg-card/70 transition-colors">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-bold text-foreground font-mono tabular-nums tracking-tight">
          {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
          {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center relative overflow-hidden group hover:scale-105 transition-transform">
        <div className="absolute inset-0 bg-primary/20 animate-pulse" />
        <div className="relative w-2 h-2 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.8)]" />
      </div>
    </div>
  );
}