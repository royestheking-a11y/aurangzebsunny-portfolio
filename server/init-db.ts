import { connectToDatabase, getDatabase } from './config/db';

const sampleData = {
  projects: [
    {
      id: 'sample-1',
      title: 'E-Commerce Platform',
      description: 'A modern e-commerce platform with seamless shopping experience, featuring advanced product filtering, secure payment integration, and real-time inventory management.',
      image: '',
      category: 'Web Development',
      featured: true,
      tags: ['React', 'Node.js', 'Stripe', 'MongoDB'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sample-2',
      title: 'Mobile Banking App',
      description: 'Intuitive mobile banking interface with enhanced security features, biometric authentication, and instant transaction capabilities.',
      image: '',
      category: 'Mobile App',
      featured: true,
      tags: ['React Native', 'Firebase', 'Security'],
      liveUrl: '',
      githubUrl: '',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sample-3',
      title: 'Brand Identity Design',
      description: 'Complete brand identity package including logo design, color palette, typography, and brand guidelines for a luxury fashion brand.',
      image: '',
      category: 'Branding',
      featured: false,
      tags: ['Figma', 'Illustrator', 'Branding'],
      liveUrl: '',
      githubUrl: '',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sample-4',
      title: 'Real Estate Dashboard',
      description: 'Comprehensive property management dashboard with analytics, tenant management, and financial reporting.',
      image: '',
      category: 'UI/UX Design',
      featured: true,
      tags: ['UI/UX', 'Dashboard', 'Analytics'],
      liveUrl: '',
      githubUrl: '',
      createdAt: new Date().toISOString(),
    },
  ],
  posts: [
    {
      id: 'post-1',
      title: 'Getting Started with Web Development in 2025',
      excerpt: 'Learn the fundamentals of modern web development and the latest tools you need to succeed.',
      content: 'Web development is an exciting field that continues to evolve. In this comprehensive guide, we explore the essential technologies every aspiring web developer should master...',
      thumbnail: '',
      author: 'Aurangzeb Sunny',
      readTime: '5 min read',
      tags: ['Web Dev', 'Tutorial', 'Beginner'],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'post-2',
      title: 'Design Principles for Better UX',
      excerpt: 'Discover key design principles that will elevate your user experience design skills.',
      content: 'User experience design is more than just making things look pretty. It\'s about creating intuitive, accessible, and delightful experiences...',
      thumbnail: '',
      author: 'Aurangzeb Sunny',
      readTime: '7 min read',
      tags: ['UX', 'Design', 'Best Practices'],
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'post-3',
      title: 'The Power of Modern CSS',
      excerpt: 'Explore advanced CSS techniques that can transform your web designs.',
      content: 'Modern CSS has evolved tremendously, offering powerful features like Grid, Flexbox, Custom Properties, and more...',
      thumbnail: '',
      author: 'Aurangzeb Sunny',
      readTime: '6 min read',
      tags: ['CSS', 'Frontend', 'Tutorial'],
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ],
  videos: [
    {
      id: 'video-sample-1',
      title: 'Building Modern Web Apps - Complete Tutorial',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Learn how to build modern, responsive web applications using React, TypeScript, and Tailwind CSS. This comprehensive tutorial covers everything from setup to deployment.',
      createdAt: new Date().toISOString(),
    },
  ],
  certificates: [
    {
      id: 'cert-1',
      title: 'Advanced React Development',
      issuer: 'Meta',
      date: '2024',
      image: '',
      credentialUrl: '',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'cert-2',
      title: 'UI/UX Design Specialization',
      issuer: 'Google',
      date: '2023',
      image: '',
      credentialUrl: '',
      createdAt: new Date().toISOString(),
    },
  ],
  jobs: [
    {
      id: 'job-1',
      title: 'Senior UI/UX Designer & Full Stack Developer',
      company: 'Freelance',
      period: '2022 - Present',
      description: 'Leading design and development initiatives for various clients, creating user-centered solutions and modern web applications. Specializing in React, Node.js, and responsive design.',
      skills: ['Figma', 'React', 'Node.js', 'UI/UX', 'TypeScript'],
      achievements: ['Delivered 50+ projects', 'Client satisfaction: 98%'],
      current: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'job-2',
      title: 'Lead Frontend Developer',
      company: 'Tech Innovations Inc.',
      period: '2020 - 2022',
      description: 'Led frontend development team, architected scalable applications, and implemented best practices for code quality and performance.',
      skills: ['React', 'Redux', 'TypeScript', 'Testing'],
      achievements: ['Reduced load time by 40%', 'Mentored 5 junior developers'],
      current: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'job-3',
      title: 'UI/UX Designer',
      company: 'Creative Studio',
      period: '2018 - 2020',
      description: 'Designed user interfaces for web and mobile applications, conducted user research, and created interactive prototypes.',
      skills: ['Figma', 'Sketch', 'Prototyping', 'User Research'],
      achievements: ['Redesigned 3 major products', 'Improved user engagement by 60%'],
      current: false,
      createdAt: new Date().toISOString(),
    },
  ],
  reviews: [
    {
      id: 'review-1',
      name: 'John Anderson',
      role: 'CEO',
      company: 'Startup Inc',
      review: 'Exceptional work! Aurangzeb delivered beyond our expectations. His attention to detail and creative solutions truly set him apart. Highly recommended for any design or development project.',
      rating: 5,
      avatar: '',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'review-2',
      name: 'Sarah Mitchell',
      role: 'Product Manager',
      company: 'Tech Solutions',
      review: 'Working with Aurangzeb was a fantastic experience. He understood our vision perfectly and brought it to life with elegant design and clean code. Communication was excellent throughout.',
      rating: 5,
      avatar: '',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'review-3',
      name: 'Michael Chen',
      role: 'Marketing Director',
      company: 'Digital Agency',
      review: 'Outstanding professionalism and technical expertise. Aurangzeb transformed our outdated website into a modern, high-performing platform that exceeded all our goals.',
      rating: 5,
      avatar: '',
      createdAt: new Date().toISOString(),
    },
  ],
  qas: [
    {
      id: 'qa-1',
      question: 'What services do you offer?',
      answer: 'I offer comprehensive UI/UX design, web development (React, Next.js, Node.js), mobile app development, branding and identity design, digital marketing, SEO optimization, and e-commerce solutions.',
      category: 'Services',
      order: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'qa-2',
      question: 'How long does a typical project take?',
      answer: 'Project timelines vary based on scope and complexity. A typical landing page takes 1-2 weeks, a full website 3-6 weeks, and larger applications 2-4 months. I provide detailed timelines during consultation.',
      category: 'Timeline',
      order: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'qa-3',
      question: 'What is your design process?',
      answer: 'My process includes: 1) Discovery & Research, 2) Wireframing & Prototyping, 3) Visual Design, 4) Development, 5) Testing & QA, 6) Launch & Support. I maintain close collaboration throughout each phase.',
      category: 'Process',
      order: 3,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'qa-4',
      question: 'Do you provide ongoing support?',
      answer: 'Yes! I offer various maintenance and support packages including bug fixes, content updates, performance optimization, and feature enhancements. All projects include 30 days of free support.',
      category: 'Support',
      order: 4,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'qa-5',
      question: 'What are your rates?',
      answer: 'My rates vary depending on project complexity and requirements. I offer both fixed-price projects and hourly rates. Contact me for a detailed quote tailored to your specific needs.',
      category: 'Pricing',
      order: 5,
      createdAt: new Date().toISOString(),
    },
  ],
  settings: {
    id: 'main',
    profileImage: '',
    resumeUrl: '',
    linkedin: 'https://linkedin.com/in/aurangzebsunny',
    github: 'https://github.com/aurangzebsunny',
    instagram: 'https://instagram.com/aurangzebsunny',
    email: 'aurangzeb@example.com',
    phone: '+1234567890',
    whatsapp: '+1234567890',
    createdAt: new Date().toISOString(),
  },
};

async function initializeDatabase() {
  try {
    await connectToDatabase();
    const db = getDatabase();

    console.log('📦 Initializing database with sample data...');

    // Check if data already exists
    const existingProjects = await db.collection('projects').countDocuments();
    if (existingProjects > 0) {
      console.log('⚠️  Database already contains data. Skipping initialization.');
      console.log('   To reinitialize, delete collections first.');
      return;
    }

    // Insert sample data
    for (const [collectionName, data] of Object.entries(sampleData)) {
      if (Array.isArray(data)) {
        if (data.length > 0) {
          await db.collection(collectionName).insertMany(data);
          console.log(`✅ Inserted ${data.length} items into ${collectionName}`);
        }
      } else {
        await db.collection(collectionName).insertOne(data);
        console.log(`✅ Inserted settings into ${collectionName}`);
      }
    }

    console.log('🎉 Database initialization complete!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    process.exit(0);
  }
}

initializeDatabase();

