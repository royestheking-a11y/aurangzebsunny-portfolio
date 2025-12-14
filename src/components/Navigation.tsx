import React, { useState, useEffect } from 'react';
import { Menu, X, Download, Moon, Sun, Lock as LockIcon } from 'lucide-react';
import { Button } from './ui/button';
import { storage } from '../utils/storage';
import { AnimatePresence, motion } from 'motion/react';
import { useActiveSection } from '../hooks/useActiveSection';

interface NavigationProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const menuItems = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'qa', label: 'Q&A' },
];

export function Navigation({ darkMode, toggleDarkMode }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeSection = useActiveSection(menuItems.map(item => item.id));

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
    setIsMobileMenuOpen(false);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isMobileMenuOpen ? 'glass-effect shadow-lg' : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 z-50">
            <h1 className="text-2xl gradient-text cursor-pointer uppercase tracking-wide" onClick={() => scrollToSection('home')}>
              Aurangzeb Sunny
            </h1>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`transition-colors uppercase tracking-wider text-sm relative group ${activeSection === item.id ? 'text-primary font-medium' : 'text-foreground/80 hover:text-primary'
                  }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Desktop CTA and Dark Mode Toggle */}
          <div className="hidden md:flex items-center space-x-4">
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
              onClick={() => window.location.hash = 'admin'}
              className="p-2 rounded-full glass-effect hover-glow transition-all text-foreground/80 hover:text-primary"
              aria-label="Admin Login"
              title="Admin Access"
            >
              <LockIcon className="w-5 h-5" />
            </button>

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

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-4 z-50">
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
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg glass-effect hover:bg-primary/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 top-0 left-0 w-full h-screen z-40 md:hidden flex flex-col items-center justify-center overflow-hidden bg-background"
          >
            {/* Background Decor */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-1/4 -right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30"
              />
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.2, 0.4, 0.2],
                  rotate: [0, 90, 0]
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl opacity-30"
              />
            </div>

            <nav className="relative z-50 flex flex-col items-center space-y-8">
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + (index * 0.1), type: "spring", stiffness: 100 }}
                  onClick={() => scrollToSection(item.id)}
                  className="group relative"
                >
                  <span className={`text-3xl md:text-4xl font-light tracking-widest transition-colors ${activeSection === item.id ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
                    }`}>
                    {item.label}
                  </span>
                  <span className={`absolute -bottom-2 left-0 h-[2px] bg-gradient-to-r from-primary to-accent transition-all duration-300 ${activeSection === item.id ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                </motion.button>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-8"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 py-6 text-lg tracking-widest hover:bg-primary hover:text-primary-foreground border-2 border-primary/20 transition-all duration-300 shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_40px_rgba(var(--primary),0.6)]"
                  onClick={handleResumeDownload}
                >
                  <Download className="w-5 h-5 mr-3" />
                  Resume
                </Button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}