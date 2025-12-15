import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { storage } from '../utils/storage';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Posts() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const allPosts = await storage.getPosts();
      const sortedPosts = allPosts.sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const [selectedPost, setSelectedPost] = useState<any>(null);

  // Deep Link Handling
  useEffect(() => {
    if (posts.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const postId = params.get('post');
      if (postId) {
        const found = posts.find(p => p.id === postId);
        if (found) {
          setSelectedPost(found);
          // Scroll to posts section
          setTimeout(() => {
            document.getElementById('posts')?.scrollIntoView({ behavior: 'smooth' });
          }, 500);
        }
      }
    }
  }, [posts]);

  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedPost]);

  const handleOpenPost = (post: any) => {
    setSelectedPost(post);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('post', post.id);
    window.history.pushState({}, '', newUrl);
  };

  const handleClosePost = () => {
    setSelectedPost(null);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('post');
    window.history.pushState({}, '', newUrl);
  };

  if (posts.length === 0) {
    return null;
  }

  return (
    <>
      <section id="posts" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl sm:text-5xl mb-6">
              From My <span className="gradient-text">Desk</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Insights, tutorials, and thoughts on design, development, and digital marketing
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="group cursor-pointer"
                onClick={() => handleOpenPost(post)}
              >
                <div className="bg-card rounded-2xl overflow-hidden hover-glow transition-all border border-border h-full flex flex-col">
                  {/* Thumbnail */}
                  {post.thumbnail && (
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <ImageWithFallback
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-medium px-4 py-2 border border-white/30 rounded-full bg-white/10 backdrop-blur-md">Read Article</span>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 2).map((tag: string, i: number) => (
                          <span
                            key={i}
                            className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full flex items-center gap-1"
                          >
                            <ArrowRight className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <h3 className="text-xl mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                      {post.excerpt || post.content?.substring(0, 150) + '...'}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(post.createdAt)}
                      </div>
                      {post.readTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {post.readTime} min read
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Screen Post Details Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={handleClosePost}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header / Image - Parallax style header */}
            <div className="relative h-48 sm:h-64 md:h-80 shrink-0 overflow-hidden bg-muted">
              {selectedPost.thumbnail ? (
                <ImageWithFallback
                  src={selectedPost.thumbnail}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <h1 className="text-4xl font-bold text-primary/20">Article</h1>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
              <button
                onClick={handleClosePost}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors z-10"
              >
                <ArrowRight className="w-6 h-6 rotate-180" /> {/* Using ArrowRight rotated as back icon since X is not imported yet */}
              </button>
            </div>

            {/* Content Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10">
              <div className="max-w-3xl mx-auto">
                {/* Meta Header */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(selectedPost.createdAt)}
                  </span>
                  {selectedPost.readTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedPost.readTime} min read
                    </span>
                  )}
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold mb-8 leading-tight">
                  {selectedPost.title}
                </h2>

                <div className="prose prose-invert max-w-none text-muted-foreground">
                  <p className="whitespace-pre-wrap leading-relaxed text-lg">
                    {selectedPost.content}
                  </p>
                </div>

                {/* Tags Footer */}
                {selectedPost.tags && selectedPost.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-border">
                    <h4 className="text-sm uppercase tracking-wider text-muted-foreground mb-4 font-semibold">
                      Related Topics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.tags.map((tag: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-secondary hover:bg-secondary/80 rounded-full text-sm transition-colors cursor-default">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}