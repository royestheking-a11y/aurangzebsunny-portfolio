import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { storage } from '../utils/storage';
import { toast } from 'sonner@2.0.3';
import { Textarea } from './ui/textarea';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Knowledge base for the AI assistant
const knowledgeBase = {
  services: [
    'UI/UX Design - Creating beautiful and intuitive user interfaces with user-centered design principles',
    'Web Development - Building responsive, performant, and SEO-optimized websites using modern technologies',
    'Digital Marketing - Comprehensive SEO optimization, social media marketing, content strategy, and analytics',
    'Brand Identity - Complete brand design including logos, color palettes, typography, and brand guidelines',
    'E-commerce Solutions - Full-stack online store development, payment integration, and conversion optimization',
    'Mobile App Design - Native iOS and Android app interfaces with focus on usability and performance',
    'Framer Development - Interactive prototypes and production-ready Framer websites',
    'WordPress Development - Custom WordPress themes and plugins with advanced functionality',
    'Landing Page Design - High-converting landing pages optimized for lead generation',
    'Email Marketing - Email campaign design, automation, and conversion optimization'
  ],
  skills: [
    'Frontend: React, Next.js, TypeScript, JavaScript, HTML5, CSS3',
    'Design Tools: Figma, Adobe XD, Sketch, Adobe Photoshop, Illustrator',
    'CSS Frameworks: Tailwind CSS, Bootstrap, SASS, Styled Components',
    'Backend: Node.js, Express, MongoDB, PostgreSQL, REST APIs',
    'CMS: WordPress, Shopify, Webflow, Framer',
    'Marketing: Google Analytics, SEO tools, Social Media Management, Email Marketing',
    'Version Control: Git, GitHub, GitLab',
    'Testing: Jest, Cypress, React Testing Library',
    'Performance: Web Vitals optimization, lazy loading, code splitting',
    'Responsive Design: Mobile-first development, cross-browser compatibility'
  ],
  expertise: [
    'User Experience (UX) Research and Testing',
    'Wireframing and Prototyping',
    'Conversion Rate Optimization (CRO)',
    'Accessibility (WCAG) Compliance',
    'Progressive Web Apps (PWA)',
    'API Integration and Development',
    'Database Design and Management',
    'Cloud Deployment (Vercel, Netlify, AWS)',
    'Performance Optimization',
    'Search Engine Optimization (SEO)'
  ],
  experience: 'Over 5 years of professional experience in design and development, working with clients globally across various industries including e-commerce, SaaS, healthcare, finance, education, and real estate',
  availability: 'Currently accepting new projects and consultations. Available for both short-term and long-term engagements',
  contact: 'You can reach out via the contact form on this page, email, or WhatsApp. Free consultation calls are available to discuss your project',
  pricing: 'Pricing is project-based and depends on scope, complexity, and timeline. Hourly rates and fixed-price packages available. Book a free consultation to get a detailed quote tailored to your needs',
  process: 'Discovery & Research → Planning & Strategy → Design & Prototyping → Development → Testing & QA → Launch → Ongoing Support & Maintenance',
  processDetails: {
    discovery: 'Understanding your business goals, target audience, competitors, and project requirements through detailed discussions',
    design: 'Creating wireframes, mockups, and interactive prototypes with iterative feedback cycles',
    development: 'Writing clean, maintainable code with best practices, version control, and regular updates',
    testing: 'Comprehensive testing across devices, browsers, and performance optimization',
    launch: 'Deployment to production with proper monitoring, analytics setup, and documentation',
    support: 'Ongoing maintenance, updates, bug fixes, and feature enhancements as needed'
  },
  timeline: {
    landing: '1-2 weeks for a landing page',
    website: '3-6 weeks for a standard website',
    ecommerce: '6-10 weeks for an e-commerce store',
    app: '8-16 weeks for a mobile app',
    custom: 'Custom timelines based on project complexity'
  },
  industries: [
    'E-commerce and Retail',
    'SaaS and Technology',
    'Healthcare and Medical',
    'Finance and Banking',
    'Education and E-learning',
    'Real Estate and Property',
    'Food and Hospitality',
    'Fashion and Lifestyle',
    'Fitness and Wellness',
    'Professional Services'
  ],
  deliverables: [
    'Source code with documentation',
    'Design files (Figma/Adobe)',
    'Responsive, mobile-friendly design',
    'SEO-optimized structure',
    'Performance optimization',
    'Cross-browser compatibility',
    'Admin/CMS training',
    'Deployment and hosting setup',
    'Post-launch support period',
    'Maintenance guidelines'
  ],
  whyChoose: [
    'Proven track record with 100+ successful projects',
    'Focus on both aesthetics and functionality',
    'Agile development with regular updates',
    'Clear communication throughout the project',
    'Quality code following industry best practices',
    'On-time delivery and transparent pricing',
    'Post-launch support and maintenance',
    'Continuous learning and adoption of new technologies'
  ]
};

function getAIResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  
  // Greeting responses
  if (msg.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/)) {
    return "Hello! 👋 I'm Aura, Aurangzeb's AI assistant. I'm here to help you learn about his services, expertise, portfolio, and how he can help bring your project to life. Feel free to ask me anything about web development, design, digital marketing, or how to get started!";
  }
  
  // Services related
  if (msg.includes('service') || msg.includes('what do you do') || msg.includes('what can you do') || msg.includes('offer')) {
    return `Aurangzeb offers a comprehensive range of services:\n\n${knowledgeBase.services.map(s => `• ${s}`).join('\n')}\n\nEach service is tailored to your specific needs and goals. Which service interests you the most?`;
  }
  
  // Skills related
  if (msg.includes('skill') || msg.includes('technology') || msg.includes('tech stack') || msg.includes('tools') || msg.includes('software')) {
    return `Aurangzeb has expertise in a wide range of modern technologies:\n\n${knowledgeBase.skills.map(s => `• ${s}`).join('\n')}\n\nWould you like to know more about any specific technology or how these are used in projects?`;
  }
  
  // Expertise & specialization
  if (msg.includes('expert') || msg.includes('speciali') || msg.includes('good at') || msg.includes('best at')) {
    return `Aurangzeb specializes in:\n\n${knowledgeBase.expertise.map(e => `• ${e}`).join('\n')}\n\n${knowledgeBase.experience}\n\nWhat type of project are you planning?`;
  }
  
  // Experience & Portfolio
  if (msg.includes('experience') || msg.includes('portfolio') || msg.includes('work') || msg.includes('projects') || msg.includes('clients')) {
    return `${knowledgeBase.experience}.\n\nIndustries served:\n${knowledgeBase.industries.slice(0, 5).map(i => `• ${i}`).join('\n')}\n\nYou can view featured projects in the portfolio section above. Each project showcases different skills and approaches. Would you like to know about a specific type of project?`;
  }
  
  // Availability & Hiring
  if (msg.includes('available') || msg.includes('hire') || msg.includes('freelance') || msg.includes('book') || msg.includes('start')) {
    return `${knowledgeBase.availability}.\n\nWhat I offer:\n${knowledgeBase.whyChoose.slice(0, 4).map(w => `• ${w}`).join('\n')}\n\nReady to discuss your project? You can book a free consultation call or send a message through the contact form!`;
  }
  
  // Contact information
  if (msg.includes('contact') || msg.includes('reach') || msg.includes('email') || msg.includes('phone') || msg.includes('whatsapp') || msg.includes('call')) {
    return `You can reach Aurangzeb through:\n\n• Contact form (at the bottom of this page)\n• Email: Check the contact section\n• WhatsApp: Quick consultation available\n\nResponse time: Within 24 hours ✓\n\nWhat's the best way to reach you? I can help you get started with a message!`;
  }
  
  // Pricing & Budget
  if (msg.includes('price') || msg.includes('cost') || msg.includes('rate') || msg.includes('budget') || msg.includes('fee') || msg.includes('charge')) {
    return `${knowledgeBase.pricing}\n\nTypical project ranges:\n• Landing page: Starting from competitive rates\n• Full website: Custom quote based on features\n• E-commerce: Depends on products and integrations\n• Mobile app: Based on complexity and platforms\n\nEvery project is unique! Book a free consultation to discuss your specific requirements and receive a detailed, transparent quote.`;
  }
  
  // Process & Workflow
  if (msg.includes('process') || msg.includes('workflow') || msg.includes('how do you work') || msg.includes('methodology') || msg.includes('approach')) {
    return `Aurangzeb follows a proven 6-step process:\n\n${knowledgeBase.process}\n\nEach phase includes:\n• Discovery: ${knowledgeBase.processDetails.discovery}\n• Design: ${knowledgeBase.processDetails.design}\n• Development: ${knowledgeBase.processDetails.development}\n• Testing: ${knowledgeBase.processDetails.testing}\n• Launch: ${knowledgeBase.processDetails.launch}\n• Support: ${knowledgeBase.processDetails.support}\n\nWould you like to know more about any specific phase?`;
  }
  
  // Design related
  if (msg.includes('design') || msg.includes('ui') || msg.includes('ux') || msg.includes('user interface') || msg.includes('user experience')) {
    return "Aurangzeb specializes in user-centered design that combines aesthetics with functionality:\n\n• Modern, clean interface design\n• User research and persona development\n• Wireframing and interactive prototyping\n• Design systems and component libraries\n• Accessibility and inclusive design\n• Mobile-first responsive design\n\nTools: Figma, Adobe XD, Sketch, and more\n\nLooking for UI/UX design services for your project?";
  }
  
  // Development related
  if (msg.includes('develop') || msg.includes('website') || msg.includes('web app') || msg.includes('build') || msg.includes('code')) {
    return "Aurangzeb builds modern, high-performance web applications:\n\n• Responsive websites (mobile, tablet, desktop)\n• Single Page Applications (SPA)\n• Progressive Web Apps (PWA)\n• E-commerce platforms\n• Custom CMS solutions\n• API development and integration\n\nTech stack: React, Next.js, Node.js, and more\nFeatures: Fast loading, SEO-optimized, secure, scalable\n\nWhat kind of website or application are you planning to build?";
  }
  
  // Marketing & SEO related
  if (msg.includes('market') || msg.includes('seo') || msg.includes('digital') || msg.includes('traffic') || msg.includes('ranking') || msg.includes('google')) {
    return "Digital marketing and SEO services include:\n\n• Technical SEO optimization\n• On-page and off-page SEO\n• Keyword research and strategy\n• Content marketing and strategy\n• Social media marketing\n• Google Analytics setup and analysis\n• Conversion rate optimization\n• Email marketing campaigns\n\nHelp your business grow online with proven strategies that increase visibility, traffic, and conversions!";
  }
  
  // Timeline & Duration
  if (msg.includes('timeline') || msg.includes('how long') || msg.includes('duration') || msg.includes('time') || msg.includes('fast') || msg.includes('quick')) {
    return `Project timelines vary based on scope:\n\n${Object.entries(knowledgeBase.timeline).map(([key, value]) => `• ${value}`).join('\n')}\n\nRush projects can be accommodated with proper planning. The timeline includes all phases: design, development, testing, and launch.\n\nWhat type of project do you have in mind?`;
  }
  
  // Industries
  if (msg.includes('industry') || msg.includes('sector') || msg.includes('niche') || msg.includes('ecommerce') || msg.includes('e-commerce') || msg.includes('saas') || msg.includes('healthcare')) {
    return `Aurangzeb has experience across multiple industries:\n\n${knowledgeBase.industries.map(i => `• ${i}`).join('\n')}\n\nEach industry has unique requirements, and projects are customized accordingly. Which industry is your business in?`;
  }
  
  // Deliverables & What you get
  if (msg.includes('deliver') || msg.includes('get') || msg.includes('receive') || msg.includes('include') || msg.includes('package')) {
    return `When you work with Aurangzeb, you receive:\n\n${knowledgeBase.deliverables.map(d => `✓ ${d}`).join('\n')}\n\nEverything you need for a successful project launch and beyond!`;
  }
  
  // Why choose / Benefits
  if (msg.includes('why') || msg.includes('benefit') || msg.includes('advantage') || msg.includes('different') || msg.includes('better')) {
    return `Why choose Aurangzeb:\n\n${knowledgeBase.whyChoose.map(w => `✓ ${w}`).join('\n')}\n\nClient satisfaction is the top priority, with a focus on delivering measurable results!`;
  }
  
  // Technologies - Specific
  if (msg.includes('react') || msg.includes('next') || msg.includes('node')) {
    return "Yes! Aurangzeb is highly proficient in modern JavaScript frameworks:\n\n• React - For building dynamic, component-based UIs\n• Next.js - For server-side rendering and optimal performance\n• Node.js - For scalable backend development\n• TypeScript - For type-safe, maintainable code\n\nThese technologies enable fast, SEO-friendly, and scalable applications. Need a React or Next.js project?";
  }
  
  // WordPress
  if (msg.includes('wordpress') || msg.includes('wp') || msg.includes('cms')) {
    return "WordPress development services include:\n\n• Custom theme development\n• Plugin development and customization\n• WooCommerce setup and optimization\n• Site migration and maintenance\n• Performance optimization\n• Security hardening\n• SEO configuration\n\nWordPress is great for content-heavy sites and e-commerce. Would you like a WordPress solution?";
  }
  
  // Mobile/App
  if (msg.includes('mobile') || msg.includes('app') || msg.includes('ios') || msg.includes('android')) {
    return "Mobile app design and development services:\n\n• Native iOS and Android design\n• Responsive web apps (PWA)\n• Cross-platform solutions\n• User-friendly interfaces\n• Performance optimization\n• App store guidelines compliance\n\nMobile-first approach ensures great experience on all devices. Planning a mobile app?";
  }
  
  // Support & Maintenance
  if (msg.includes('support') || msg.includes('maintenance') || msg.includes('update') || msg.includes('fix') || msg.includes('help after')) {
    return "Post-launch support and maintenance includes:\n\n• Bug fixes and troubleshooting\n• Feature updates and enhancements\n• Security updates\n• Performance monitoring\n• Content updates\n• Technical support\n• Regular backups\n\nOngoing support packages available to keep your site running smoothly!";
  }
  
  // Consultation
  if (msg.includes('consult') || msg.includes('meeting') || msg.includes('discuss') || msg.includes('talk')) {
    return "Free consultation includes:\n\n• Understanding your business goals\n• Discussing project requirements\n• Reviewing design preferences\n• Exploring technical options\n• Timeline and budget discussion\n• Answering all your questions\n\nNo obligation, just a friendly chat about your project! Ready to schedule a consultation?";
  }
  
  // Getting started
  if (msg.includes('start') || msg.includes('begin') || msg.includes('first step') || msg.includes('get going')) {
    return "Getting started is easy:\n\n1. Share your project details via the contact form\n2. Schedule a free consultation call\n3. Receive a detailed proposal and quote\n4. Review and approve the plan\n5. Project kickoff and development begins!\n\nYou can send a message right now using the contact form below, or I can collect your details here!";
  }

  // Thank you
  if (msg.includes('thank') || msg.includes('thanks') || msg.includes('appreciate')) {
    return "You're very welcome! 😊 I'm here to help anytime. If you have more questions about Aurangzeb's services, projects, or anything else, feel free to ask. Ready to start your project? Just let me know!";
  }

  // Goodbye
  if (msg.match(/^(bye|goodbye|see you|cya|later)/)) {
    return "Thanks for chatting! If you need anything else or want to discuss your project, I'm always here. Don't hesitate to reach out through the contact form. Have a great day! 👋";
  }
  
  // Default response - be helpful
  return "That's a great question! I'd be happy to help you with information about:\n\n• Services offered (design, development, marketing)\n• Technologies and skills\n• Project process and timeline\n• Pricing and packages\n• Portfolio and past work\n• How to get started\n\nWhat would you like to know more about? Or feel free to ask your question in a different way!";
}

export function AuraAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Aura, Aurangzeb's AI assistant. 👋\n\nHow can I help you today?\n\n• Ask about services & expertise\n• Discuss your project\n• Get pricing information\n• Or connect directly with Aurangzeb",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [showInfoForm, setShowInfoForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [contactFormData, setContactFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);
    setQuestionCount((prev) => prev + 1);

    try {
      const response = getAIResponse(userMessage);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response },
      ]);

      // Show info form after 4 questions
      if (questionCount >= 3 && !showInfoForm) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content:
                "I'd love to continue helping you! Could you please share your name and email so we can keep in touch?",
            },
          ]);
          setShowInfoForm(true);
        }, 1000);
      }
    } catch (error) {
      console.error('Error in Aura chat:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm sorry, I'm having trouble responding right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInfo.name || !userInfo.email) return;

    try {
      await storage.auraSubmitInfo({
        name: userInfo.name,
        email: userInfo.email,
        chatHistory: messages,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Thanks ${userInfo.name}! I've saved your information. Feel free to continue asking questions!`,
        },
      ]);
      setShowInfoForm(false);
      toast.success('Information saved successfully!');
    } catch (error) {
      console.error('Error submitting info:', error);
      toast.error('Failed to save information. Please try again.');
    }
  };

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactFormData.name || !contactFormData.email || !contactFormData.message) return;

    try {
      await storage.auraSubmitContact({
        name: contactFormData.name,
        email: contactFormData.email,
        phone: contactFormData.phone,
        message: contactFormData.message,
        chatHistory: messages,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Thanks ${contactFormData.name}! I've saved your contact information. Aurangzeb will get back to you soon!`,
        },
      ]);
      setShowContactForm(false);
      toast.success('Contact information saved successfully!');
    } catch (error) {
      console.error('Error submitting contact info:', error);
      toast.error('Failed to save contact information. Please try again.');
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-2xl hover:shadow-primary/50 transition-all hover:scale-110 z-50 flex items-center justify-center"
            aria-label="Open Aura Assistant"
          >
            <Sparkles className="w-8 h-8" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-card border-2 border-primary/20 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-accent text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Aura Assistant</h3>
                  <p className="text-xs opacity-90">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Info Form */}
            {showInfoForm && (
              <div className="p-4 bg-muted/50 border-t border-border">
                <form onSubmit={handleSubmitInfo} className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    required
                  />
                  <Button type="submit" className="w-full bg-primary">
                    Submit
                  </Button>
                </form>
              </div>
            )}

            {/* Contact Form */}
            {showContactForm && (
              <div className="p-4 bg-muted/50 border-t border-border max-h-[400px] overflow-y-auto">
                <form onSubmit={handleSubmitContact} className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={contactFormData.name}
                    onChange={(e) => setContactFormData({ ...contactFormData, name: e.target.value })}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={contactFormData.email}
                    onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
                    required
                  />
                  <Input
                    type="tel"
                    placeholder="Your phone (optional)"
                    value={contactFormData.phone}
                    onChange={(e) => setContactFormData({ ...contactFormData, phone: e.target.value })}
                  />
                  <Textarea
                    placeholder="Your message"
                    value={contactFormData.message}
                    onChange={(e) => setContactFormData({ ...contactFormData, message: e.target.value })}
                    required
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1 bg-primary">
                      Submit
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowContactForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Input */}
            {!showInfoForm && !showContactForm && (
              <div className="p-4 border-t border-border">
                <div className="mb-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowContactForm(true)}
                    className="w-full text-xs"
                  >
                    💬 Contact Aurangzeb Directly
                  </Button>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Ask me anything..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={loading || !input.trim()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}