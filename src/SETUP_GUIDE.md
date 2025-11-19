# Portfolio Website - Setup & User Guide

## 🎉 Welcome to Your Luxury Portfolio Website!

This comprehensive portfolio website features a full CMS admin panel, AI chatbot assistant, and all the sections you need to showcase your work professionally.

---

## 🚀 Quick Start

### 1. First Time Setup - Create Admin Account

Before you can manage content, you need to create an admin account:

**Option A: Using the API directly**

Open your browser console and run:

```javascript
fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-abd2a1f4/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  },
  body: JSON.stringify({
    email: 'admin@youremail.com',
    password: 'YourSecurePassword123!',
    name: 'Aurangzeb Sunny'
  })
})
.then(r => r.json())
.then(console.log);
```

Replace:
- `YOUR_PROJECT_ID` with your actual Supabase project ID
- `YOUR_ANON_KEY` with your Supabase anon key
- Update email, password, and name

**Option B: Using curl**

```bash
curl -X POST "https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-abd2a1f4/auth/signup" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "email": "admin@youremail.com",
    "password": "YourSecurePassword123!",
    "name": "Aurangzeb Sunny"
  }'
```

### 2. Access Admin Panel

1. Scroll to the footer of your website
2. Click "Admin Panel Login" button (or navigate to `#admin`)
3. Enter your email and password
4. You're in! 🎊

---

## 📋 Features Overview

### Public Website Sections

1. **Hero Section** - Eye-catching landing with call-to-actions
2. **About** - Your story, current roles, and skills
3. **Process** - Your 3-step workflow visualization
4. **Projects** - Portfolio showcase with category filters
5. **Posts/Blog** - Share your insights and articles
6. **Video Gallery** - Embed YouTube videos of your work
7. **Certificates** - Display your achievements
8. **Jobs Timeline** - Professional experience timeline
9. **Client Reviews** - Testimonials carousel
10. **Q&A Accordion** - Frequently asked questions
11. **Contact Form** - Let clients reach you
12. **Aura AI Assistant** - Smart chatbot that answers questions about your services

### Admin CMS Features

The admin panel at `#admin` allows you to:

- **Overview Dashboard** - View analytics and stats
- **Projects Management** - Add, edit, delete projects
- **Posts Management** - Manage blog posts
- **Videos Management** - Add YouTube videos
- **Certificates** - Upload and manage certifications
- **Jobs Timeline** - Edit work experience
- **Client Reviews** - Add testimonials
- **Q&A Management** - Manage FAQ content
- **Messages** - View contact form submissions
- **Settings** - Configure site settings

---

## 🎨 Adding Content

### Adding a Project

1. Go to Admin Panel → Projects
2. Click "Add Project"
3. Fill in:
   - Title
   - Description
   - Category (UI/UX, Branding, SEO, Framer, Development)
   - Image URL (use Unsplash or your own hosted images)
   - Project URL (optional link to live project)
4. Click "Save"

### Adding a Blog Post

1. Go to Admin Panel → Posts
2. Click "Add Post"
3. Fill in:
   - Title
   - Content (supports markdown-like formatting)
   - Excerpt (short preview)
   - Category/Tags
   - Featured image URL
   - Reading time
4. Click "Save"

### Adding Videos

1. Go to Admin Panel → Videos
2. Click "Add Video"
3. Enter YouTube URL (e.g., `https://www.youtube.com/watch?v=VIDEO_ID`)
4. Add title and description
5. Click "Save"

### Adding Certificates

1. Go to Admin Panel → Certificates
2. Click "Add Certificate"
3. Fill in:
   - Title
   - Issuer
   - Date
   - Image URL of certificate
   - Credential URL (optional verification link)
4. Click "Save"

### Adding Job Experience

1. Go to Admin Panel → Jobs
2. Click "Add Job"
3. Fill in:
   - Company name
   - Job title
   - Location
   - Start/End dates
   - Description
   - Responsibilities
4. Click "Save"

### Adding Client Reviews

1. Go to Admin Panel → Reviews
2. Click "Add Review"
3. Fill in:
   - Client name
   - Company
   - Rating (1-5 stars)
   - Review text
   - Avatar URL
4. Click "Save"

### Adding Q&A Items

1. Go to Admin Panel → Q&A
2. Click "Add Q&A"
3. Fill in:
   - Question
   - Answer
   - Category (optional for grouping)
   - Order (for sorting)
4. Click "Save"

---

## 🤖 Aura AI Assistant

The Aura chatbot appears as a floating button in the bottom right corner. It:

- Answers questions about your services
- Provides pricing information
- Explains your workflow
- Collects lead information after 4 interactions
- You can reply to collected leads from the Messages section

### Customizing AI Responses

The AI responses are in `/supabase/functions/server/index.tsx` in the Aura chat route. You can customize:
- Keywords that trigger specific responses
- Default responses
- Pricing information
- Service descriptions

---

## 🎨 Customization

### Updating Colors

Colors are defined in `/styles/globals.css`:
- `--primary: #6C00A2` (Main purple)
- `--secondary: #9C6B30` (Bronze accent)
- `--background: #F5F5F2` (Cream background)

### Updating Personal Information

Update these files:
- `/components/Hero.tsx` - Tagline and description
- `/components/About.tsx` - Bio, skills, current roles
- `/components/Contact.tsx` - Email, WhatsApp link
- `/components/Footer.tsx` - Social media links, tagline
- `/components/Navigation.tsx` - Resume link

### Dark Mode

Users can toggle dark mode using the sun/moon icon in the navigation bar. The preference is saved to localStorage.

---

## 📱 Responsive Design

The entire website is fully responsive and works beautifully on:
- Desktop (1920px+)
- Laptop (1024px - 1920px)
- Tablet (768px - 1024px)
- Mobile (320px - 768px)

---

## 🔒 Security Notes

1. **Never share your admin credentials**
2. **Use a strong password** (mix of letters, numbers, symbols)
3. **The admin panel is protected** - only accessible with valid token
4. **Service role key is secure** - stored server-side only
5. **All API calls are authenticated**

---

## 📊 Managing Messages & Leads

### Contact Form Messages

When users submit the contact form, messages appear in:
- Admin Panel → Messages

You can:
- View all messages
- Mark as read
- Reply (manually via email)
- Delete messages

### Aura AI Leads

When users interact with Aura and provide their contact info:
- Leads are stored separately (prefixed with `aura-lead:`)
- View them by checking the messages/leads section
- Export for your CRM

---

## 🎯 Best Practices

### Images
- Use high-quality images (at least 1200px wide)
- Optimize images before uploading
- Use Unsplash for stock photos
- Host images on Imgur, Cloudinary, or similar

### Content
- Keep project descriptions concise (2-3 paragraphs)
- Use clear, benefit-driven copy
- Update regularly to show you're active
- Add new content at least monthly

### SEO
- Use descriptive titles for projects/posts
- Write meta descriptions
- Add alt text to images (when possible)
- Keep URLs clean and readable

---

## 🐛 Troubleshooting

### Can't Login?
- Check your email/password
- Make sure you created an account first
- Clear browser cache and try again

### Content Not Showing?
- Refresh the page
- Check if content was saved successfully
- Look in browser console for errors

### Admin Panel Not Loading?
- Check your internet connection
- Verify Supabase is running
- Check browser console for errors

---

## 🎁 Included Features

✅ Full CMS Admin Panel
✅ Project Portfolio with Filters
✅ Blog/Posts Section
✅ Video Gallery
✅ Certificates Showcase
✅ Job Timeline
✅ Client Reviews Carousel
✅ Q&A Accordion
✅ Contact Form
✅ AI Chatbot Assistant
✅ Dark Mode
✅ Glassmorphic Design
✅ Smooth Animations
✅ Mobile Responsive
✅ Toast Notifications
✅ Secure Authentication
✅ Real-time Updates

---

## 📞 Need Help?

If you encounter any issues or need customization:
1. Check the browser console for error messages
2. Review this guide thoroughly
3. Check the component files for inline documentation

---

## 🎨 Color Palette Reference

- **Background**: #F5F5F2 (Cream)
- **Primary**: #6C00A2 (Purple)
- **Secondary/Accent**: #9C6B30 (Bronze)
- **Text**: #2E2E2E (Dark Gray)
- **Muted**: #EDEAE4 (Light Beige)

---

## 🚀 Going Live

To deploy your portfolio:
1. The Supabase backend is already live
2. Your site is accessible via Figma Make's preview
3. For custom domain, export and host on:
   - Vercel
   - Netlify
   - Cloudflare Pages
   - Your own hosting

---

**Enjoy your beautiful new portfolio! 🎉**
