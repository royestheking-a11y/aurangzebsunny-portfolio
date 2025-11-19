import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { storage } from '../utils/storage';

export function Jobs() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const allJobs = await storage.getJobs();
      const sortedJobs = allJobs.sort((a: any, b: any) => {
        // Sort by year/order (most recent first)
        if (a.current) return -1;
        if (b.current) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setJobs(sortedJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  };

  if (jobs.length === 0) {
    return null;
  }

  return (
    <section id="jobs" className="py-24 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl mb-6">
            Experience & <span className="gradient-text">Roles</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            My professional journey across design, development, and marketing
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/20" />

          <div className="space-y-12">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="relative pl-20"
              >
                {/* Timeline dot */}
                <div className="absolute left-6 top-2 w-5 h-5 rounded-full bg-primary border-4 border-background shadow-lg" />

                <div className="bg-card p-6 rounded-2xl hover-glow transition-all border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl">{job.title}</h3>
                        <p className="text-muted-foreground">{job.company}</p>
                      </div>
                    </div>
                    <span className="text-sm px-3 py-1 bg-accent/20 text-accent rounded-full">
                      {job.year}
                    </span>
                  </div>

                  {job.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                  )}

                  {job.description && (
                    <p className="text-muted-foreground leading-relaxed">
                      {job.description}
                    </p>
                  )}

                  {job.achievements && job.achievements.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {job.achievements.map((achievement: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-primary mt-1">•</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  )}

                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                      {job.skills.map((skill: string, i: number) => (
                        <span
                          key={i}
                          className="text-xs px-3 py-1 bg-muted rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}