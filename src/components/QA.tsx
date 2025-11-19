import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { storage } from '../utils/storage';

export function QA() {
  const [qas, setQAs] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    loadQAs();
  }, []);

  const loadQAs = async () => {
    try {
      const allQAs = await storage.getQAs();
      const sortedQAs = allQAs.sort((a: any, b: any) => {
        return (a.order || 0) - (b.order || 0);
      });
      setQAs(sortedQAs);
    } catch (error) {
      console.error('Error loading Q&As:', error);
    }
  };

  // Group by category
  const groupedQAs = qas.reduce((acc: any, qa: any) => {
    const category = qa.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(qa);
    return acc;
  }, {});

  if (qas.length === 0) {
    return null;
  }

  return (
    <section id="qa" className="py-24 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl mb-6">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Common questions about my services, pricing, and delivery
          </p>
        </motion.div>

        <div className="space-y-8">
          {Object.entries(groupedQAs).map(([category, categoryQAs]: [string, any], catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * catIndex }}
            >
              {Object.keys(groupedQAs).length > 1 && (
                <h3 className="text-2xl mb-4 text-primary">{category}</h3>
              )}

              <Accordion type="single" collapsible className="space-y-4">
                {categoryQAs.map((qa: any, index: number) => (
                  <AccordionItem
                    key={qa.id}
                    value={qa.id}
                    className="bg-card border border-border rounded-xl px-6 hover-glow transition-all"
                  >
                    <AccordionTrigger className="hover:no-underline py-4">
                      <span className="text-left">{qa.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4">
                      {qa.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}