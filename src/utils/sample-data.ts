// Sample data for initial portfolio setup
// Use this as a reference or copy to admin panel

export const sampleProjects = [
  {
    title: "E-Commerce Redesign",
    description: "Complete UI/UX redesign of a fashion e-commerce platform with focus on conversion optimization and user experience.",
    category: "UI/UX",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    projectUrl: "https://example.com",
  },
  {
    title: "Brand Identity - Tech Startup",
    description: "Developed comprehensive brand identity including logo, color palette, typography, and brand guidelines for a SaaS startup.",
    category: "Branding",
    imageUrl: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800",
    projectUrl: "#",
  },
  {
    title: "Interactive Portfolio Site",
    description: "Built a custom portfolio website using React and Framer Motion with advanced animations and interactions.",
    category: "Development",
    imageUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800",
    projectUrl: "#",
  },
];

export const samplePosts = [
  {
    title: "10 UI/UX Principles Every Designer Should Know",
    excerpt: "Discover the fundamental principles that separate good design from great design.",
    content: "In the world of UI/UX design, understanding core principles is essential for creating intuitive and engaging user experiences...",
    category: "Design",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
  },
  {
    title: "The Future of Web Development in 2025",
    excerpt: "Exploring emerging trends and technologies shaping the future of web development.",
    content: "As we move into 2025, web development continues to evolve at a rapid pace. From AI integration to new frameworks...",
    category: "Development",
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
  },
];

export const sampleVideos = [
  {
    title: "Design Process Walkthrough",
    description: "A complete walkthrough of my design process from research to final delivery.",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with actual video
  },
  {
    title: "Building Responsive Layouts",
    description: "Tutorial on creating fully responsive layouts using modern CSS techniques.",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Replace with actual video
  },
];

export const sampleCertificates = [
  {
    title: "Google UX Design Professional Certificate",
    issuer: "Google / Coursera",
    date: "2024",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800",
    credentialUrl: "https://coursera.org/verify/...",
  },
  {
    title: "Advanced React Development",
    issuer: "Meta",
    date: "2023",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800",
    credentialUrl: "#",
  },
];

export const sampleJobs = [
  {
    company: "Transparity",
    title: "Website Developer",
    location: "Remote",
    startDate: "Jan 2025",
    endDate: "Present",
    current: true,
    description: "Leading web development projects and creating responsive, user-friendly websites.",
    responsibilities: [
      "Develop and maintain client websites",
      "Implement responsive designs",
      "Optimize performance and SEO",
    ],
  },
  {
    company: "RizQara Group",
    title: "UI/UX Designer",
    location: "Remote",
    startDate: "Mar 2024",
    endDate: "Present",
    current: true,
    description: "Creating intuitive user experiences and beautiful interfaces for web and mobile applications.",
    responsibilities: [
      "Design user interfaces for web applications",
      "Conduct user research and testing",
      "Create design systems and style guides",
    ],
  },
  {
    company: "Daraz Bangladesh Ltd",
    title: "Digital Marketing Specialist",
    location: "Dhaka, Bangladesh",
    startDate: "Jun 2023",
    endDate: "Feb 2024",
    current: false,
    description: "Managed digital marketing campaigns and increased online presence.",
    responsibilities: [
      "Plan and execute digital marketing campaigns",
      "Analyze marketing metrics and KPIs",
      "Manage social media presence",
    ],
  },
];

export const sampleReviews = [
  {
    name: "Sarah Johnson",
    company: "TechStart Inc.",
    position: "CEO",
    rating: 5,
    review: "Aurangzeb delivered an exceptional website redesign that increased our conversion rate by 40%. His attention to detail and understanding of user experience is outstanding.",
    avatarUrl: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Michael Chen",
    company: "Digital Solutions",
    position: "Marketing Director",
    rating: 5,
    review: "Working with Aurangzeb was a pleasure. He completed our project ahead of schedule and the quality exceeded our expectations. Highly recommended!",
    avatarUrl: "https://i.pravatar.cc/150?img=2",
  },
  {
    name: "Emma Williams",
    company: "Creative Agency",
    position: "Creative Director",
    rating: 5,
    review: "Incredible design work! Aurangzeb transformed our brand identity and created a cohesive visual system that perfectly represents our values.",
    avatarUrl: "https://i.pravatar.cc/150?img=3",
  },
];

export const sampleQAs = [
  {
    question: "What services do you offer?",
    answer: "I offer UI/UX Design, Front-End Development, Framer Websites, SEO Optimization, Digital Marketing, and Brand Identity services. I can handle projects from initial concept to final deployment.",
    category: "Services",
    order: 1,
  },
  {
    question: "What is your typical project timeline?",
    answer: "Most projects are delivered within 2-3 days for smaller tasks, 1-2 weeks for medium complexity projects, and 3-4 weeks for comprehensive solutions. The exact timeline depends on your specific requirements.",
    category: "Process",
    order: 2,
  },
  {
    question: "How much do you charge?",
    answer: "Pricing varies based on project scope and complexity. UI/UX design projects typically start at $500, complete web development with design starts at $2000, and SEO/marketing monthly retainers start at $800. Contact me for a custom quote.",
    category: "Pricing",
    order: 3,
  },
  {
    question: "Do you work with international clients?",
    answer: "Yes! I work with clients globally. I'm experienced in remote collaboration using tools like Zoom, Slack, and project management platforms. Time zone differences are never an issue.",
    category: "General",
    order: 4,
  },
  {
    question: "What tools and technologies do you use?",
    answer: "For design: Figma, Adobe Creative Suite, Sketch. For development: React, Next.js, Tailwind CSS, Framer. For marketing: Google Analytics, SEMrush, Ahrefs, various social media tools.",
    category: "Technical",
    order: 5,
  },
];

// Helper function to format data for API submission
export const formatForAPI = (data: any, type: string) => {
  // Add any necessary formatting here
  return {
    ...data,
    createdAt: new Date().toISOString(),
  };
};
