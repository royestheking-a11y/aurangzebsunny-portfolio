import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Code, Palette, TrendingUp, Award, Users, Zap, Lightbulb, Rocket, CheckCircle2, Smartphone, Globe, Server, Layout } from 'lucide-react';
import { storage } from '../utils/storage';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function About() {
  const [profileImage, setProfileImage] = useState<string>('');

  useEffect(() => {
    loadProfileImage();
  }, []);

  const loadProfileImage = async () => {
    try {
      const settings = await storage.getSettings();
      if (settings?.profileImage) {
        setProfileImage(settings.profileImage);
      }
    } catch (error) {
      console.error('Error loading profile image:', error);
    }
  };

  const workflowSteps = [
    {
      icon: Lightbulb,
      title: 'Discovery',
      description: 'Understanding your vision, goals, and target audience',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Palette,
      title: 'Design',
      description: 'Creating stunning, user-centric interfaces and experiences',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Code,
      title: 'Development',
      description: 'Building robust, scalable solutions with clean code',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Rocket,
      title: 'Launch',
      description: 'Deploying, optimizing, and ensuring seamless performance',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const skills = [
    { name: 'UI/UX Design', icon: Layout, gradient: 'from-primary to-purple-600' },
    { name: 'Product Design', icon: Palette, gradient: 'from-pink-500 to-rose-500' },
    { name: 'Brand Identity', icon: Award, gradient: 'from-amber-500 to-orange-500' },
    { name: 'Front-End Development', icon: Code, gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Backend Development', icon: Server, gradient: 'from-green-500 to-emerald-500' },
    { name: 'Website Design', icon: Globe, gradient: 'from-indigo-500 to-purple-500' },
    { name: 'Website Development', icon: Code, gradient: 'from-teal-500 to-green-500' },
    { name: 'App Design', icon: Smartphone, gradient: 'from-violet-500 to-purple-500' },
    { name: 'Framer Websites', icon: Zap, gradient: 'from-fuchsia-500 to-pink-500' },
    { name: 'SEO Optimization', icon: TrendingUp, gradient: 'from-cyan-500 to-blue-500' },
    { name: 'Digital Marketing', icon: Users, gradient: 'from-rose-500 to-red-500' },
  ];

  return (
    <section id="about" className="py-32 bg-muted/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          {/* Profile Image */}
          {profileImage && (
            <div className="flex justify-center mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="w-52 h-52 rounded-full overflow-hidden border-4 border-primary/30 shadow-2xl hover-glow relative">
                  <img 
                    src={profileImage} 
                    alt="Aurangzeb Sunny" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 pointer-events-none"></div>
                </div>
              </motion.div>
            </div>
          )}
          
          <h2 className="text-5xl sm:text-6xl mb-6">
            Meet <span className="gradient-text">Aurangzeb Sunny</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            I'm a passionate UI/UX Designer, Full-Stack Developer, and Digital Marketing Specialist.
            I combine creative design, technical expertise, and strategic thinking to build experiences that inspire and perform.
          </p>
        </motion.div>

        {/* My Workflow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm uppercase tracking-wider">My Process</span>
              </span>
            </motion.div>
            <h3 className="text-4xl mb-4">My <span className="gradient-text">Workflow</span></h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A proven process that ensures quality, efficiency, and exceptional results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="relative group"
              >
                <div className="glass-card p-8 rounded-2xl border-2 border-border hover:border-primary/40 transition-all h-full">
                  {/* Step number */}
                  <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg">
                    <span className="text-sm">{index + 1}</span>
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>

                  <h4 className="text-xl mb-3">{step.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connector line (except for last item on desktop) */}
                {index < workflowSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-primary/40 to-transparent z-10"></div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skills & Expertise */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent border border-accent/20">
                <Zap className="w-4 h-4" />
                <span className="text-sm uppercase tracking-wider">Expertise</span>
              </span>
            </motion.div>
            <h3 className="text-4xl mb-4">Skills & <span className="gradient-text">Expertise</span></h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A comprehensive skill set to bring your vision to life
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.05 * index }}
                className="group relative"
              >
                <div className="glass-card p-6 rounded-xl border-2 border-border hover:border-primary/40 transition-all cursor-pointer h-full flex flex-col items-center gap-3 hover:scale-105">
                  {/* Icon with gradient background */}
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${skill.gradient} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow`}>
                    <skill.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <span className="text-sm text-center group-hover:text-primary transition-colors">
                    {skill.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
