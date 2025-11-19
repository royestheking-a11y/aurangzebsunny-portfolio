import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';

export function Hero() {
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.submitContact({
        ...formData,
        source: 'Appointment Booking'
      });
      toast.success('Appointment request sent! I\'ll get back to you within 24 hours.');
      setAppointmentOpen(false);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('Failed to send appointment request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      style={{
        background: 'linear-gradient(135deg, #F5F5F2 0%, #EDEAE4 30%, rgba(108, 0, 162, 0.05) 60%, rgba(156, 107, 48, 0.05) 100%)',
      }}
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(108, 0, 162, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(108, 0, 162, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}></div>
      </div>

      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(108, 0, 162, 0.15) 0%, transparent 70%)',
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(156, 107, 48, 0.15) 0%, transparent 70%)',
          }}
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full blur-2xl"
          style={{
            background: 'radial-gradient(circle, rgba(108, 0, 162, 0.1) 0%, transparent 70%)',
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl mb-8 text-foreground leading-tight">
            Design With Purpose,
            <br />
            <span className="gradient-text">Develop With Passion.</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            Every pixel and line of code I create is driven by intention and heart.
            I craft meaningful, user-centric digital experiences that solve real-world problems.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground hover-glow uppercase tracking-wider px-8 py-6 text-base border-2 border-primary hover:scale-105 transition-all duration-300 shadow-lg"
              onClick={() => scrollToSection('projects')}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              View My Work
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="glass-effect hover-glow uppercase tracking-wider px-8 py-6 text-base border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
              asChild
            >
              <a href="https://cal.com/aurangzeb-sunny-dnk5osadd" target="_blank" rel="noopener noreferrer">
                <Calendar className="w-5 h-5 mr-2" />
                Book Free Call
              </a>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Appointment Dialog */}
      <Dialog open={appointmentOpen} onOpenChange={setAppointmentOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl gradient-text">Book a Free Consultation</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Let's discuss your project! Fill out the form below and I'll get back to you within 24 hours.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAppointmentSubmit} className="space-y-4 mt-4">
            
            <div>
              <Input
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full"
              />
            </div>

            <div>
              <Input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full"
              />
            </div>

            <div>
              <Textarea
                placeholder="Tell me about your project..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                className="w-full min-h-[120px]"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 hover-glow uppercase tracking-wider border-2 border-primary"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Request'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}