import React, { useState, useEffect } from 'react';
import { Menu, X, Download, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { storage } from '../utils/storage';

interface NavigationProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function Navigation({ darkMode, toggleDarkMode }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    loadResume();
  }, []);

  const loadResume = async () => {
    try {
      const settings = await storage.getSettings();
      if (settings?.resumeUrl) {
        setResumeUrl(settings.resumeUrl);
      }
    } catch (error) {
      console.error('Error loading resume URL:', error);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResumeDownload = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    } else {
      alert('Resume not available. Please contact the admin.');
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-effect shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl gradient-text cursor-pointer uppercase tracking-wide" onClick={() => scrollToSection('home')}>
              Aurangzeb Sunny
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-foreground/80 hover:text-primary transition-colors uppercase tracking-wider text-sm"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-foreground/80 hover:text-primary transition-colors uppercase tracking-wider text-sm"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className="text-foreground/80 hover:text-primary transition-colors uppercase tracking-wider text-sm"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="text-foreground/80 hover:text-primary transition-colors uppercase tracking-wider text-sm"
            >
              Reviews
            </button>
            <button
              onClick={() => scrollToSection('qa')}
              className="text-foreground/80 hover:text-primary transition-colors uppercase tracking-wider text-sm"
            >
              Q&A
            </button>
          </div>

          {/* CTA and Dark Mode Toggle */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="glass-effect hover-glow uppercase tracking-wider border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              onClick={handleResumeDownload}
            >
              <Download className="w-4 h-4 mr-2" />
              Resume
            </Button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full glass-effect hover-glow transition-all"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}