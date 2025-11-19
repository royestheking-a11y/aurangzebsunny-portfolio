# Public Assets Directory

## Favicon Files

Place your favicon files here. The following files are expected:

### Required Files:
- `favicon.ico` - Main favicon (multi-size ICO file)
- `favicon-16x16.png` - 16x16 pixels PNG
- `favicon-32x32.png` - 32x32 pixels PNG
- `apple-touch-icon.png` - 180x180 pixels (for iOS devices)
- `android-chrome-192x192.png` - 192x192 pixels (for Android)
- `android-chrome-512x512.png` - 512x512 pixels (for Android)

### Already Created:
- `site.webmanifest` - Web app manifest (already configured)

## How to Add Your Favicon

1. **Copy your favicon files** to this `/public` directory
2. **Name them exactly** as listed above
3. **Restart your dev server** to see the changes

## File Sizes

- **favicon.ico**: Can contain multiple sizes (16x16, 32x32, 48x48)
- **favicon-16x16.png**: 16x16 pixels
- **favicon-32x32.png**: 32x32 pixels
- **apple-touch-icon.png**: 180x180 pixels
- **android-chrome-192x192.png**: 192x192 pixels
- **android-chrome-512x512.png**: 512x512 pixels

## Testing

After adding files, visit:
- `http://localhost:3000/favicon.ico` - Should show your favicon
- Check browser tab - Should display your favicon icon

## Note

If you only have one favicon file (like `favicon.ico`), that's fine! The HTML will still work. The other sizes are optional but recommended for better display across different devices and browsers.

