
import { useState, useEffect } from 'react';

export function useActiveSection(sectionIds: string[]) {
    const [activeSection, setActiveSection] = useState<string>('');

    useEffect(() => {
        // 1. Handle initial hash scroll
        const handleInitialHash = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash && sectionIds.includes(hash)) {
                setTimeout(() => {
                    const element = document.getElementById(hash);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                        setActiveSection(hash);
                    }
                }, 100); // Small delay to ensure DOM is ready
            }
        };

        handleInitialHash();

        // 2. Setup Intersection Observer for verifying visibility
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                        // Update URL without scrolling
                        window.history.replaceState(null, '', `#${entry.target.id}`);
                    }
                });
            },
            {
                rootMargin: '-50% 0px -50% 0px', // Trigger when section is in middle of viewport
                threshold: 0,
            }
        );

        sectionIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [sectionIds]);

    return activeSection;
}
