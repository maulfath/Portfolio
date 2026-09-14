document.addEventListener('DOMContentLoaded', () => {
  // Sync exact header height with CSS variable
  const updateHeaderHeight = () => {
    const header = document.querySelector('.site-header');
    if (header) {
      document.documentElement.style.setProperty('--header-height', `${header.getBoundingClientRect().height}px`);
    }
  };
  updateHeaderHeight();
  window.addEventListener('resize', updateHeaderHeight);

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.querySelector('.site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    siteNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Highlight active nav link based on scroll position
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.site-nav a');

  const setActiveLink = () => {
    let currentId = '';
    // If user is scrolled near the bottom of the page, directly activate the contact section
    const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);

    if (isAtBottom) {
      currentId = 'contact';
    } else {
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom >= 140) {
          currentId = section.id;
        }
      });
    }

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
      });
    }
  };

  document.addEventListener('scroll', setActiveLink, { passive: true });
  window.addEventListener('resize', setActiveLink);
  setActiveLink();

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const targetHref = link.getAttribute('href');
      if (targetHref && targetHref.startsWith('#')) {
        navLinks.forEach(l => l.classList.toggle('active', l === link));
      }
    });
  });

  // One deliberate load animation: draw the stochastic path in the hero
  const samplePath = document.getElementById('samplePath');
  const expectedPath = document.getElementById('expectedPath');
  const jumpDot = document.getElementById('jumpDot');

  if (samplePath && !prefersReducedMotion) {
    const sampleLength = samplePath.getTotalLength();
    const expectedLength = expectedPath.getTotalLength();

    samplePath.style.strokeDasharray = sampleLength;
    samplePath.style.strokeDashoffset = sampleLength;
    expectedPath.style.strokeDasharray = expectedLength;
    expectedPath.style.strokeDashoffset = expectedLength;
    jumpDot.style.opacity = '0';

    requestAnimationFrame(() => {
      samplePath.style.transition = 'stroke-dashoffset 1.8s ease-out';
      expectedPath.style.transition = 'stroke-dashoffset 1.8s ease-out';
      samplePath.style.strokeDashoffset = '0';
      expectedPath.style.strokeDashoffset = '0';
    });

    window.setTimeout(() => {
      jumpDot.style.transition = 'opacity 0.4s ease-in';
      jumpDot.style.opacity = '1';
    }, 900);
  }

  // Floating Back to Top Button
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Image Lightbox Modal for Deliverables & Visuals
  const lightbox = document.getElementById('imageLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.querySelector('.lightbox-backdrop');

  const openLightbox = (src, caption) => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = caption || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lightboxImg) lightboxImg.src = '';
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });

  // Attach Lightbox to all deliverable showcases and project media
  document.querySelectorAll('.exp-showcase-media a, .preview-media').forEach(link => {
    link.addEventListener('click', (e) => {
      const img = link.querySelector('img');
      if (img && img.getAttribute('src')) {
        e.preventDefault();
        const caption = link.getAttribute('title') || img.getAttribute('alt') || '';
        openLightbox(img.getAttribute('src'), caption);
      }
    });
  });
});
