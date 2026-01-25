# Facilities Images

This directory contains images for facility pages (ambulance, transport, etc.).

## Required Images

### Ambulance Service
- `ambulance-1.jpg` - Primary ambulance service vehicle image
- `ambulance-2.jpg` - (Optional) Emergency equipment or interior view
- `ambulance-3.jpg` - (Optional) Medical staff or service in action

## Image Specifications

- **Format**: JPG, PNG, or WebP
- **Recommended Size**: 1200x900px (4:3 aspect ratio)
- **Max File Size**: 500KB (compress with TinyPNG or similar)
- **Quality**: High quality, well-lit, professional photos

## Placeholder Images

Until actual images are available, you can:
1. Use placeholder services like https://placehold.co/1200x900/0b6d41/ffffff?text=Ambulance
2. Or temporarily comment out the images array in the data file

## Adding New Images

1. Place images in this directory
2. Reference them in the data template: `/images/facilities/your-image.jpg`
3. Ensure Next.js Image component can optimize them (jpg, png, webp formats)
