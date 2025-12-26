# Google OAuth Logo Requirements for Sway

## Requirements
- **Format**: PNG
- **Size**: 120x120 pixels (minimum)
- **Background**: Transparent preferred
- **Max file size**: 50KB (smaller is better)
- **Aspect ratio**: Square (1:1)

## Current Sway Branding
- **Icon**: Zap/lightning bolt (⚡)
- **Colors**: Purple (#7c3aed) to Fuchsia (#d946ef) gradient
- **Style**: Modern, bold, glassmorphic

## Logo Created
I've created an SVG logo at: `public/sway-logo.svg`

## How to Convert SVG to PNG

### Option 1: Online Converter
1. Go to: https://cloudconvert.com/svg-to-png
2. Upload `public/sway-logo.svg`
3. Set dimensions: 120x120 pixels
4. Download as PNG

### Option 2: Using ImageMagick (if installed)
```bash
convert public/sway-logo.svg -resize 120x120 public/sway-logo.png
```

### Option 3: Using Inkscape (if installed)
```bash
inkscape public/sway-logo.svg --export-filename=public/sway-logo.png --export-width=120 --export-height=120
```

### Option 4: Design Tool
- Open `public/sway-logo.svg` in Figma, Adobe Illustrator, or similar
- Export as PNG at 120x120 pixels
- Ensure transparent background

## Upload to Google
1. Go to: https://console.cloud.google.com/apis/credentials/consent?project=joinsway
2. Click "Edit App"
3. Scroll to "App logo"
4. Click "Upload"
5. Select your `sway-logo.png` file
6. Save

## Alternative: Use a Design Tool
If you want a more polished logo:
1. Use Figma, Canva, or Adobe Express
2. Create 120x120px square
3. Add purple-to-fuchsia gradient background
4. Add white lightning bolt icon
5. Export as PNG with transparent background
6. Keep file size under 50KB

