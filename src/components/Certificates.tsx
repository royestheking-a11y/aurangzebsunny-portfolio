import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Award, Calendar, ExternalLink } from 'lucide-react';
import { storage } from '../utils/storage';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';

export function Certificates() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [selectedCert, setSelectedCert] = useState<any>(null);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      const allCertificates = await storage.getCertificates();
      const sorted = allCertificates.sort((a: any, b: any) =>
        new Date(b.createdAt || b.date || 0).getTime() - new Date(a.createdAt || a.date || 0).getTime()
      );
      setCertificates(sorted);
    } catch (error) {
      console.error('Error loading certificates:', error);
    }
  };

  if (certificates.length === 0) {
    return null;
  }

  return (
    <>
      <section id="certificates" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl sm:text-5xl mb-6">
              My <span className="gradient-text">Certifications</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional certifications and achievements
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="group cursor-pointer"
              >
                <div className="bg-card rounded-2xl overflow-hidden hover-glow transition-all border border-border">
                  {/* Certificate Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {cert.imageUrl ? (
                      <ImageWithFallback
                        src={cert.imageUrl}
                        alt={cert.title}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Award className="w-16 h-16 text-muted-foreground/30" />
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <p className="text-white text-sm">Click to view details</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="mb-2 group-hover:text-primary transition-colors">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {cert.issuer}
                    </p>
                    {cert.date && (
                      <p className="text-xs text-accent">
                        {new Date(cert.date).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificate Modal */}
      <Dialog open={!!selectedCert} onOpenChange={() => setSelectedCert(null)}>
        <DialogContent className="max-w-4xl p-0" aria-describedby={undefined}>
          <DialogTitle className="sr-only">
            {selectedCert?.title || 'Certificate Details'}
          </DialogTitle>
          {selectedCert && (
            <div>
              <ImageWithFallback
                src={selectedCert.imageUrl}
                alt={selectedCert.title}
                className="w-full h-auto rounded-lg"
              />
              <div className="p-6">
                <h3 className="text-2xl mb-2">{selectedCert.title}</h3>
                <p className="text-muted-foreground mb-1">{selectedCert.issuer}</p>
                {selectedCert.date && (
                  <p className="text-sm text-accent">
                    Issued: {new Date(selectedCert.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}