# Favicon Setup Guide 🎨

## Favicon Files Location

Place your favicon files in the `/public` directory:

```
public/
├── favicon.ico              # Main favicon (16x16, 32x32, 48x48)
├── favicon-16x16.png        # 16x16 PNG
├── favicon-32x32.png        # 32x32 PNG
├── apple-touch-icon.png     # 180x180 for iOS
├── android-chrome-192x192.png  # 192x192 for Android
├── android-chrome-512x512.png  # 512x512 for Android
└── site.webmanifest         # Web manifest (already created)
```

## Required Favicon Sizes

1. **favicon.ico** - Multi-size ICO file (16x16, 32x32, 48x48)
2. **favicon-16x16.png** - 16x16 pixels
3. **favicon-32x32.png** - 32x32 pixels
4. **apple-touch-icon.png** - 180x180 pixels (for iOS)
5. **android-chrome-192x192.png** - 192x192 pixels (for Android)
6. **android-chrome-512x512.png** - 512x512 pixels (for Android)

## How to Add Your Favicon

1. **Place your favicon files** in the `/public` directory
2. **Name them exactly** as listed above
3. **The HTML is already configured** - no code changes needed!

## Favicon Generator Tools

If you need to generate favicons from an image:

- **Favicon.io**: https://favicon.io
- **RealFaviconGenerator**: https://realfavicongenerator.net
- **Favicon Generator**: https://www.favicon-generator.org

## Testing

After adding favicon files:

1. **Restart your dev server**:
   ```bash
   npm run dev
   ```

2. **Check in browser**:
   - Look at the browser tab - should show your favicon
   - Check browser console for any 404 errors

3. **Verify files are accessible**:
   - Visit: `http://localhost:3000/favicon.ico`
   - Should load your favicon

## For Vercel Deployment

Favicon files in `/public` will automatically be served at the root:
- `https://your-site.vercel.app/favicon.ico`
- `https://your-site.vercel.app/favicon-32x32.png`
- etc.

## Current Setup

✅ HTML updated with favicon links
✅ Web manifest created
✅ Public directory ready
⏳ **Just add your favicon files to `/public` directory!**

