import { useState, useEffect, useRef } from 'react';

export function useActiveSection(sectionIds: string[]) {
    const [activeSection, setActiveSection] = useState<string>('');
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isMounted = useRef(false);

    // 1. Handle initial hash scroll - Only run ONCE on mount
    useEffect(() => {
        if (isMounted.current) return;
        isMounted.current = true;

        const handleInitialHash = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash && sectionIds.includes(hash)) {
                setTimeout(() => {
                    const element = document.getElementById(hash);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                        setActiveSection(hash);
                    }
                }, 100);
            }
        };

        handleInitialHash();
    }, []); // Empty dependency array intentionally

    // 2. Setup Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);

                        // Debounce the hash update
                        if (timeoutRef.current) clearTimeout(timeoutRef.current);

                        timeoutRef.current = setTimeout(() => {
                            window.history.replaceState(null, '', `#${entry.target.id}`);
                        }, 500);
                    }
                });
            },
            {
                rootMargin: '-50% 0px -50% 0px',
                threshold: 0,
            }
        );

        sectionIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => {
            observer.disconnect();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [sectionIds]);

    return activeSection;
}
