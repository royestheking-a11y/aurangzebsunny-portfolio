import React, { useState, useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Posts } from './components/Posts';
import { VideoGallery } from './components/VideoGallery';
import { Certificates } from './components/Certificates';
import { Jobs } from './components/Jobs';
import { Reviews } from './components/Reviews';
import { QA } from './components/QA';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AuraAssistant } from './components/AuraAssistant';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLogin } from './components/admin/AdminLogin';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }

    // Check URL hash for admin
    const checkAdminRoute = () => {
      if (window.location.hash === '#admin') {
        setIsAdmin(true);
        // Check if already authenticated
        const isAuth = localStorage.getItem('admin_authenticated') === 'true';
        setIsAuthenticated(isAuth);
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    return () => window.removeEventListener('hashchange', checkAdminRoute);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', (!darkMode).toString());
    document.documentElement.classList.toggle('dark');
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    window.location.hash = '';
  };

  if (isAdmin) {
    if (!isAuthenticated) {
      return (
        <>
          <AdminLogin onLogin={handleLogin} />
          <Toaster />
        </>
      );
    }
    return (
      <>
        <AdminDashboard onLogout={handleLogout} />
        <Toaster />
      </>
    );
  }

  // Main Portfolio Site
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <Navigation darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {/* Main Content */}
      <main>
        <Hero />
        <About />
        <Projects />
        <Posts />
        <VideoGallery />
        <Certificates />
        <Jobs />
        <Reviews />
        <QA />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Aura AI Assistant */}
      <AuraAssistant />

      {/* Toast Notifications */}
      <Toaster position="top-right" />
    </div>
  );
}