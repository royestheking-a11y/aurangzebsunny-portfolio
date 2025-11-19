# Aurangzeb Sunny - Luxury Portfolio Website 🎨

A comprehensive, modern portfolio website with full-featured CMS admin panel and AI-powered chatbot assistant.

## ✨ Features

### Public Portfolio
- **Hero Section** - Animated landing with gradient backgrounds and floating elements
- **About** - Professional bio, current roles, and skills showcase
- **Process** - Visual 3-step workflow presentation
- **Projects** - Filterable portfolio gallery with categories
- **Blog/Posts** - Article showcase with featured images
- **Video Gallery** - YouTube video embeds with lightbox
- **Certificates** - Professional certifications display
- **Jobs Timeline** - Career history with timeline visualization
- **Client Reviews** - Testimonials carousel
- **Q&A Accordion** - FAQ section with categories
- **Contact Form** - Lead capture with email integration
- **AI Assistant (Aura)** - Chatbot for service inquiries and lead collection

### Admin CMS Panel
- **Dashboard** - Analytics overview
- **Projects Management** - CRUD operations
- **Posts Management** - Blog content management
- **Videos Management** - YouTube video management
- **Certificates Management** - Upload and organize certifications
- **Jobs Management** - Career timeline editor
- **Reviews Management** - Client testimonials
- **Q&A Management** - FAQ content editor
- **Messages** - View contact form submissions
- **Settings** - Site configuration

### Design Features
- **Glassmorphic UI** - Modern glass effect components
- **Dark Mode** - Toggle between light and dark themes
- **Luxury Color Palette** - Purple (#6C00A2) and Bronze (#9C6B30) accents
- **Smooth Animations** - Motion animations throughout
- **Responsive Design** - Mobile-first, works on all devices
- **Premium Typography** - Poppins for headings, Inter for body

## 🚀 Getting Started

### 1. Create Admin Account

First, you need to create an admin account. Open browser console and run:

```javascript
fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-abd2a1f4/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  },
  body: JSON.stringify({
    email: 'your@email.com',
    password: 'YourPassword123!',
    name: 'Your Name'
  })
})
.then(r => r.json())
.then(console.log);
```

### 2. Access Admin Panel

1. Click "Admin Panel Login" in the footer
2. Or navigate to `#admin` in the URL
3. Enter your credentials
4. Start managing content!

### 3. Add Content

Navigate through the admin panel sections to add:
- Projects
- Blog posts
- Videos
- Certificates
- Job history
- Client reviews
- Q&A items

## 📁 Project Structure

```
├── App.tsx                      # Main application component with routing
├── components/
│   ├── About.tsx               # About section
│   ├── AuraAssistant.tsx       # AI chatbot widget
│   ├── Certificates.tsx        # Certificates showcase
│   ├── Contact.tsx             # Contact form
│   ├── Footer.tsx              # Site footer
│   ├── Hero.tsx                # Landing hero section
│   ├── Jobs.tsx                # Career timeline
│   ├── Navigation.tsx          # Top navigation bar
│   ├── Posts.tsx               # Blog posts grid
│   ├── Process.tsx             # Workflow steps
│   ├── Projects.tsx            # Portfolio projects
│   ├── QA.tsx                  # Q&A accordion
│   ├── Reviews.tsx             # Client testimonials
│   ├── VideoGallery.tsx        # Video showcase
│   ├── admin/
│   │   ├── AdminDashboard.tsx  # Admin panel main view
│   │   └── AdminLogin.tsx      # Admin authentication
│   └── ui/                     # Shadcn UI components
├── styles/
│   └── globals.css             # Global styles and design tokens
├── supabase/functions/server/
│   ├── index.tsx               # API routes and backend logic
│   └── kv_store.tsx            # Key-value database utilities
└── utils/
    ├── api.tsx                 # Frontend API client
    └── sample-data.ts          # Sample data templates
```

## 🎨 Design System

### Colors
```css
--background: #F5F5F2    /* Cream background */
--primary: #6C00A2       /* Purple */
--secondary: #9C6B30     /* Bronze */
--foreground: #2E2E2E    /* Dark text */
--muted: #EDEAE4         /* Light beige */
```

### Typography
- **Headings**: Poppins (400, 500, 600, 700)
- **Body**: Inter (400, 500, 600)

### Components
- **Glass Effect**: Backdrop blur with transparency
- **Hover Glow**: Shadow animation on interactive elements
- **Gradient Text**: Purple to bronze gradient

## 🔧 Technology Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Motion** (Framer Motion) - Animations
- **Lucide React** - Icons
- **Shadcn/ui** - Component library
- **Sonner** - Toast notifications

### Backend
- **Supabase** - Backend platform
- **Hono** - Web framework for edge functions
- **Supabase Auth** - Authentication
- **KV Store** - Data persistence

## 📝 Content Management

### Adding Projects
```typescript
{
  title: string;
  description: string;
  category: 'UI/UX' | 'Branding' | 'SEO' | 'Framer' | 'Development';
  imageUrl: string;
  projectUrl?: string;
}
```

### Adding Posts
```typescript
{
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  imageUrl: string;
}
```

### Adding Videos
```typescript
{
  title: string;
  description: string;
  url: string; // YouTube URL
}
```

## 🤖 Aura AI Assistant

The AI chatbot provides automated responses to common questions about:
- Services and pricing
- Project timelines
- Experience and portfolio
- Contact information

After 4 interactions, it prompts users to provide contact information for lead generation.

### Customizing AI Responses

Edit `/supabase/functions/server/index.tsx` in the Aura chat route to customize:
- Keywords and triggers
- Response messages
- Lead collection behavior

## 🔐 Security

- **Authentication**: Supabase Auth with JWT tokens
- **Protected Routes**: Admin endpoints require valid token
- **Service Role Key**: Server-side only, never exposed to client
- **Email Confirmation**: Auto-confirmed (no email server needed)

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Laptop**: 1024px - 1920px
- **Desktop**: 1920px+

## 🎯 Best Practices

### Images
- Use high-quality images (min 1200px width)
- Optimize before uploading
- Use Unsplash for stock photos
- Consider using image CDNs

### Content
- Keep descriptions concise
- Use action-oriented language
- Update regularly (at least monthly)
- Include keywords for SEO

### Performance
- Lazy load images
- Minimize animation complexity
- Cache API responses
- Monitor bundle size

## 📚 Additional Resources

- [Setup Guide](./SETUP_GUIDE.md) - Detailed setup instructions
- [Quick Start](./QUICK_START.md) - Fast setup with sample data
- [Sample Data](./utils/sample-data.ts) - Content templates

## 🐛 Troubleshooting

### Login Issues
- Verify you created an account
- Check credentials
- Clear browser cache
- Check browser console for errors

### Content Not Displaying
- Refresh the page
- Verify content was saved
- Check API response in network tab
- Ensure you're authenticated for admin actions

### Admin Panel Not Loading
- Check internet connection
- Verify Supabase is operational
- Clear localStorage and try again
- Check console for JavaScript errors

## 🚀 Deployment

The application is already deployed on Figma Make. For custom domain:

1. Export the project
2. Deploy to:
   - **Vercel** (recommended)
   - **Netlify**
   - **Cloudflare Pages**
   - Your own hosting

3. Update environment variables for Supabase

## 📄 License

This portfolio website was created for Aurangzeb Sunny. Customize and use as needed.

## 🙏 Credits

- **Design System**: Custom luxury design
- **Icons**: Lucide React
- **UI Components**: Shadcn/ui
- **Animations**: Motion (Framer Motion)
- **Backend**: Supabase
- **Fonts**: Google Fonts (Poppins, Inter)

---

**Built with ❤️ for showcasing exceptional work**
