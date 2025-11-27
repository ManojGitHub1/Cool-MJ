/**
 * Project Interaction Tracking for Google Analytics 4
 * Tracks clicks on project links, images, and tech stack items
 */

document.addEventListener('DOMContentLoaded', () => {
  // Track project card button clicks (View Code, Live Demo)
  document.querySelectorAll('.btn-project').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const projectCard = e.target.closest('.project-entry');
      if (!projectCard) return;
      
      const projectTitle = projectCard.querySelector('h3')?.textContent || 'Unknown Project';
      const linkType = e.target.textContent.toLowerCase().includes('code') ? 'view_code' : 'live_demo';
      const linkUrl = e.target.href;

      if (typeof gtag === 'function') {
        gtag('event', 'project_interaction', {
          project_name: projectTitle,
          action: linkType,
          link_url: linkUrl,
          page_path: window.location.pathname
        });
        console.log(`[Analytics] Project interaction tracked: ${projectTitle} - ${linkType}`);
      }
    });
  });

  // Track project image clicks
  document.querySelectorAll('.project-image-column img').forEach(img => {
    img.addEventListener('click', (e) => {
      const projectCard = e.target.closest('.project-entry');
      if (!projectCard) return;
      
      const projectTitle = projectCard.querySelector('h3')?.textContent || 'Unknown Project';

      if (typeof gtag === 'function') {
        gtag('event', 'project_image_view', {
          project_name: projectTitle,
          page_path: window.location.pathname
        });
        console.log(`[Analytics] Project image view tracked: ${projectTitle}`);
      }
    });
  });

  // Track tech stack tag clicks (if they're clickable)
  document.querySelectorAll('.tech-tag').forEach(tag => {
    tag.addEventListener('click', (e) => {
      const techName = e.target.textContent.trim();
      
      if (typeof gtag === 'function') {
        gtag('event', 'tech_stack_click', {
          technology: techName,
          page_path: window.location.pathname
        });
        console.log(`[Analytics] Tech stack click tracked: ${techName}`);
      }
    });
  });
});
