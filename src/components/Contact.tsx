import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Mail, Phone, MapPin, Loader2, MessageSquare, CheckCircle2, Calendar, Clock, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';
import { storage } from '../utils/storage';

export function Contact() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save message to MongoDB
      await storage.addMessage({
        ...formData,
        source: 'contact-form',
        read: false,
      });

      toast.success('Message sent successfully! I\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm uppercase tracking-wider">Let's Connect</span>
            </span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl mb-6">
            Let's Create Something
            <br />
            <span className="gradient-text">Extraordinary Together</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Have a vision? Let's bring it to life. Whether it's a groundbreaking app,
            a stunning website, or a complete digital transformation - I'm here to help.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Contact Info - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Quick Book CTA */}
            <div className="glass-card p-8 rounded-2xl border-2 border-primary/20 hover:border-primary/40 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl">Book a Free Call</h3>
                  <p className="text-sm text-muted-foreground">30-minute consultation</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                Skip the form - let's talk directly. Book a time that works for you.
              </p>
              <Button
                className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/30 transition-all uppercase tracking-wider"
                size="lg"
                asChild
              >
                <a href="https://cal.com/aurangzeb-sunny-dnk5osadd" target="_blank" rel="noopener noreferrer">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Now
                </a>
              </Button>
            </div>

            {/* Contact Methods */}
            <div className="space-y-4">
              <h3 className="text-xl mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Other Ways to Reach Me
              </h3>

              <motion.a
                href="mailto:aurangzebsunnyy@gmail.com"
                whileHover={{ x: 8 }}
                className="flex items-center gap-4 p-5 glass-card rounded-xl border border-border hover:border-primary/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="group-hover:text-primary transition-colors">aurangzebsunnyy@gmail.com</p>
                </div>
              </motion.a>

              <motion.a
                href="tel:+8801625691878"
                whileHover={{ x: 8 }}
                className="flex items-center gap-4 p-5 glass-card rounded-xl border border-border hover:border-accent/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                  <Phone className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Phone</p>
                  <p className="group-hover:text-accent transition-colors">+880 (162)5691-878</p>
                </div>
              </motion.a>

              <motion.a
                href="https://wa.link/nww3a3"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 8 }}
                className="flex items-center gap-4 p-5 glass-card rounded-xl border border-border hover:border-green-500/40 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
                  <MessageSquare className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">WhatsApp</p>
                  <p className="group-hover:text-green-500 transition-colors">Quick consultation</p>
                </div>
              </motion.a>
            </div>

            {/* Response Time Badge */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-primary" />
                <p className="text-sm uppercase tracking-wider text-muted-foreground">Response Time</p>
              </div>
              <p className="flex items-center gap-2 text-primary text-xl">
                <CheckCircle2 className="w-6 h-6" />
                Within 24 hours
              </p>
            </div>
          </motion.div>

          {/* Contact Form - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="glass-card p-8 sm:p-10 rounded-2xl border-2 border-border hover:border-primary/20 transition-all">
              <div className="mb-8">
                <h3 className="text-2xl mb-2">Send a Message</h3>
                <p className="text-muted-foreground">
                  Fill out the form below and I'll get back to you as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-sm uppercase tracking-wider text-muted-foreground">
                      Your Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full h-12 bg-secondary/30 border-border focus:border-primary transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm uppercase tracking-wider text-muted-foreground">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full h-12 bg-secondary/30 border-border focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block mb-2 text-sm uppercase tracking-wider text-muted-foreground">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full h-12 bg-secondary/30 border-border focus:border-primary transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block mb-2 text-sm uppercase tracking-wider text-muted-foreground">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full h-12 bg-secondary/30 border-border focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block mb-2 text-sm uppercase tracking-wider text-muted-foreground">
                    Your Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full min-h-[180px] bg-secondary/30 border-border focus:border-primary transition-all resize-none"
                    placeholder="Tell me about your project, goals, and how I can help..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-gradient-to-r from-primary to-accent hover:shadow-xl hover:shadow-primary/30 transition-all uppercase tracking-wider text-base"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Sending Your Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By submitting this form, you agree to receive communication from me regarding your inquiry.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}