import React, { useState, useEffect } from 'react';
import { Linkedin, Github, Instagram, Mail, Lock, Send, ArrowRight } from 'lucide-react';
import { storage } from '../utils/storage';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';

export function Footer() {
  const [socialLinks, setSocialLinks] = useState<any>({});
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    emailjs.init("rY7fwl06URv1eEY1Z");
    loadSocialLinks();
  }, []);

  const loadSocialLinks = async () => {
    try {
      const settings = await storage.getSettings();
      if (settings) {
        setSocialLinks({
          linkedin: settings.linkedin || '',
          github: settings.github || '',
          instagram: settings.instagram || '',
          email: settings.email || 'contact@aurangzeb.com',
        });
      }
    } catch (error) {
      console.error('Error loading social links:', error);
    }
  };

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Send Auto-Reply via EmailJS
      await emailjs.send(
        "service_tp6i5hq",
        "template_90mw91f",
        {
          name: "Friend",
          to_email: email,
          email: email,
          reply_to: email,
          message: "Welcome to the community! We're glad to have you."
        }
      );

      // 2. Save newsletter subscription to MongoDB
      await storage.addNewsletterSubscription(email);

      toast.success('🎉 Welcome to the family! Check your inbox.');
      setEmail('');
    } catch (error) {
      console.error('Newsletter error:', error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-card border-t-2 border-primary/20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Left Column - Branding */}
          <div className="lg:col-span-1">
            <h3 className="text-3xl gradient-text mb-4 uppercase tracking-wide">
              Aurangzeb Sunny
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed italic">
              "Building brands that breathe purpose into pixels."
            </p>
            <div className="flex gap-3">
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center hover-glow transition-all hover:bg-primary hover:text-primary-foreground hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center hover-glow transition-all hover:bg-primary hover:text-primary-foreground hover:scale-110"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center hover-glow transition-all hover:bg-primary hover:text-primary-foreground hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {socialLinks.email && (
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center hover-glow transition-all hover:bg-primary hover:text-primary-foreground hover:scale-110"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Center Column - Quick Links */}
          <div>
            <h4 className="mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', id: 'home' },
                { label: 'About', id: 'about' },
                { label: 'Projects', id: 'projects' },
                { label: 'Reviews', id: 'reviews' },
                { label: 'Q&A', id: 'qa' },
                { label: 'Contact', id: 'contact' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column - Newsletter (Spans 2 columns on large screens) */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-lg uppercase tracking-wider">Stay in the Loop</h4>
                  <p className="text-xs text-muted-foreground">Get exclusive updates</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Join our community for exclusive insights and project updates.
              </p>

              <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="w-full h-10 pl-10 pr-3 bg-background/50 border-2 focus:border-primary transition-all text-sm"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 px-6 bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 transition-all uppercase tracking-wider text-sm"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Subscribing...
                    </span>
                  ) : (
                    <>
                      Subscribe
                      <Send className="w-3 h-3 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <p className="text-xs text-muted-foreground mt-3">
                🔒 We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <button
              onClick={() => {
                window.location.hash = '#admin';
              }}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider group"
            >
              <Lock className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              Admin Login
            </button>

            <p className="text-sm text-muted-foreground text-center">
              © 2025 Crafted with ❤️ by{' '}
              <span className="text-primary gradient-text">Aurangzeb Sunny</span>
              {' '}| All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}