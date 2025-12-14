import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Github, Star, X, ChevronLeft, ChevronRight, Share2, Globe, Layers, Code2 } from 'lucide-react';
import { storage } from '../utils/storage';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { toast } from 'sonner';

export function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadProjects = async () => {
      const data = await storage.getProjects();
      setProjects(data);
    };
    loadProjects();
  }, []);

  // Deep Link Handling
  useEffect(() => {
    if (projects.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const projectId = params.get('project');
      if (projectId) {
        const found = projects.find(p => p.id === projectId);
        if (found) {
          setSelectedProject(found);
          // Scroll to projects section if not already visible? 
          // Optional, but might be nice.
          setTimeout(() => {
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
          }, 500);
        }
      }
    }
  }, [projects]);

  // Lock body scroll when project is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  const handleOpenProject = (project: any) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('project', project.id);
    window.history.pushState({}, '', newUrl);
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('project');
    window.history.pushState({}, '', newUrl);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Project link copied to clipboard!');
  };

  const categories = ['All', 'UI/UX Design', 'Web Development', 'Mobile App', 'Branding'];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  // Gallery Navigation
  const allImages = selectedProject ? [selectedProject.image, ...(selectedProject.gallery || [])].filter(Boolean) : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <section id="projects" className="py-24 bg-muted/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-6 font-bold">
            Web Application & <span className="gradient-text">Website Development Projects</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore my latest projects across design, development, and marketing
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-all uppercase tracking-wider text-sm ${selectedCategory === category
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-card border border-border hover-glow'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="group cursor-pointer"
                onClick={() => handleOpenProject(project)}
              >
                <div className="bg-card rounded-2xl overflow-hidden hover-glow transition-all border border-border h-full flex flex-col">
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <ImageWithFallback
                      src={project.image || 'https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=800'}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      optimizeWidth={800}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-medium px-4 py-2 border border-white/30 rounded-full bg-white/10 backdrop-blur-md">View Details</span>
                    </div>
                    {project.featured && (
                      <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full flex items-center gap-1 text-sm z-10">
                        <Star className="w-4 h-4 fill-current" />
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs uppercase tracking-wider text-primary font-semibold">
                        {project.category || 'Project'}
                      </span>
                    </div>
                    <h3 className="text-xl mb-2 font-bold group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                      {project.description}
                    </p>

                    {/* Tags Preview */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {project.tags.slice(0, 3).map((tag: string, i: number) => (
                          <span key={i} className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="text-xs px-2 py-1 text-muted-foreground">+{project.tags.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Full Screen Project Details Modal - Rendered via Portal */}
      {createPortal(
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-background overscroll-none touch-none"
              onClick={handleCloseProject}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full h-full flex flex-col md:flex-row relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={handleCloseProject}
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Image Gallery Section (Left/Top) */}
                <div className="w-full md:w-2/3 bg-black relative flex items-center justify-center overflow-hidden group">
                  <div className="absolute inset-0 bg-neutral-900/50" />

                  {/* Main Image */}
                  <div className="relative w-full h-[40vh] md:h-full flex items-center justify-center p-4 md:p-12">
                    <img
                      src={allImages[currentImageIndex] || 'https://via.placeholder.com/800'}
                      alt={selectedProject.title}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    />
                  </div>

                  {/* Navigation Arrows */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-primary transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-primary transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>

                      {/* Dots Indicator */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {allImages.map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-primary w-6' : 'bg-white/50'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Details Section (Right/Bottom) */}
                <div className="w-full md:w-1/3 p-8 flex flex-col bg-card overflow-y-auto custom-scrollbar h-full md:border-l border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm uppercase tracking-widest text-primary font-bold">
                      {selectedProject.category}
                    </span>
                    <button onClick={handleShare} className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-primary" title="Copy Link">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                    {selectedProject.title}
                  </h2>

                  <div className="space-y-8 flex-1">
                    <div>
                      <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-3 font-semibold flex items-center gap-2">
                        <Globe className="w-4 h-4" /> About Project
                      </h3>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {selectedProject.description}
                      </p>
                    </div>

                    {/* Tags */}
                    {selectedProject.tags && selectedProject.tags.length > 0 && (
                      <div>
                        <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-3 font-semibold flex items-center gap-2">
                          <Layers className="w-4 h-4" /> Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.tags.map((tag: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-secondary hover:bg-secondary/80 rounded-lg text-sm transition-colors border border-transparent hover:border-primary/20">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tools */}
                    {selectedProject.tools && selectedProject.tools.length > 0 && (
                      <div>
                        <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-3 font-semibold flex items-center gap-2">
                          <Code2 className="w-4 h-4" /> Tools Used
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.tools.map((tool: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-medium border border-primary/20">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-8 mt-8 border-t border-border flex flex-col gap-3">
                    {selectedProject.liveUrl && (
                      <Button size="lg" className="w-full text-base" asChild>
                        <a href={selectedProject.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" /> Live Preview
                        </a>
                      </Button>
                    )}
                    {selectedProject.githubUrl && (
                      <Button size="lg" variant="outline" className="w-full text-base" asChild>
                        <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-2" /> View Source
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}