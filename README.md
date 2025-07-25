# Café Bliss Landing Page

A modern, responsive landing page for a cafe featuring smooth animations, interactive elements, and a warm, inviting design.

## Features

- **Hero Slider**: Auto-rotating 3-image carousel with manual controls using Swiper.js
- **Responsive Design**: Fully responsive with mobile hamburger menu
- **Interactive Menu**: 6 menu items with hover-triggered pop-up details loaded from JSON
- **Contact Form**: Client-side validation with LocalStorage integration
- **GSAP Animations**: Smooth scroll-triggered animations and parallax effects
- **Cookie Consent**: GDPR-compliant banner with LocalStorage persistence
- **SEO Optimized**: Open Graph tags and meta descriptions
- **Accessibility**: ARIA labels, keyboard navigation, WCAG 2.1 compliant

## Technologies Used

- HTML5
- Tailwind CSS (CDN)
- JavaScript (Vanilla)
- Swiper.js (Slider functionality)
- GSAP (Animations)
- Font Awesome (Icons)

## Setup Instructions

1. Clone or download the project files
2. Open `index.html` in a web browser
3. No build process required - all dependencies are loaded via CDN

## File Structure

```
cafesample/
├── index.html      # Main HTML file
├── script.js       # JavaScript functionality
├── menu.json       # Menu items data
└── README.md       # Documentation
```

## Deployment

### Vercel Deployment

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project directory
3. Follow the prompts to deploy
4. Your site will be live at the provided URL

### Alternative Deployment Options

- **GitHub Pages**: Push to a GitHub repository and enable Pages
- **Netlify**: Drag and drop the folder to Netlify dashboard
- **Any Static Host**: Upload all files to your web server

## Customization

- **Colors**: Edit CSS variables in the `<style>` section of index.html
- **Menu Items**: Modify `menu.json` to update menu content
- **Images**: Replace Unsplash URLs with your own images
- **Map**: Update the Google Maps embed URL with your location

## Performance Optimization

- Images are loaded from Unsplash with specific dimensions
- For production, consider:
  - Compressing images with TinyPNG
  - Self-hosting optimized images
  - Implementing lazy loading for below-fold content

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

This project is created for demonstration purposes.