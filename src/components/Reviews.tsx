import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { storage } from '../utils/storage';
import { Button } from './ui/button';

export function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const allReviews = await storage.getReviews();
      setReviews(allReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (reviews.length > 1) {
      const interval = setInterval(nextReview, 5000);
      return () => clearInterval(interval);
    }
  }, [reviews.length]);

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section id="reviews" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-4 gradient-text">
            Client Reviews
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            What my clients say about working with me
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons */}
          {reviews.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 glass-effect"
                onClick={prevReview}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 glass-effect"
                onClick={nextReview}
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </>
          )}

          {/* Review Cards */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="glass-card p-8 md:p-12 rounded-2xl relative"
              >
                <Quote className="w-12 h-12 text-primary/20 absolute top-8 left-8" />
                
                <div className="relative z-10">
                  {/* Rating */}
                  <div className="flex gap-1 mb-6 justify-center">
                    {[...Array(reviews[currentIndex].rating || 5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-[#9C6B30] text-[#9C6B30]"
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-lg md:text-xl text-center mb-8 leading-relaxed italic">
                    "{reviews[currentIndex].review}"
                  </p>

                  {/* Reviewer Info */}
                  <div className="flex items-center justify-center gap-4">
                    {reviews[currentIndex].avatar && (
                      <img
                        src={reviews[currentIndex].avatar}
                        alt={reviews[currentIndex].name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div className="text-left">
                      <p className="font-medium">{reviews[currentIndex].name}</p>
                      <p className="text-sm text-muted-foreground">
                        {reviews[currentIndex].role}
                        {reviews[currentIndex].company && (
                          <span> at {reviews[currentIndex].company}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          {reviews.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-primary w-8'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}