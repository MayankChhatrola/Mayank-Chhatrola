/**
 * Portfolio JavaScript Actions
 * Author: Mayank Chhatrola (UI/UX & Graphic Designer)
 * Uses 'js-' class naming convention for JS selectors.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all page features
  initNavigation();
  initImageFallback();
  initResumeDownload();
  initContactForm();
  initExperienceAccordion();
  initSmoothScrollConnect();
  initMobileMenu();
  initScrollToTop();
  initScrollPersistence();
});

/**
 * Automatically highlights the active page link in the header nav
 */
function initNavigation() {
  const navLinks = document.querySelectorAll('.js-nav-link');
  const currentPath = window.location.pathname;

  navLinks.forEach(link => {
    const href = link.getAttribute('href');

    if (currentPath.endsWith(href) ||
      (href === 'index.html' && (currentPath.endsWith('/') || currentPath === ''))) {
      link.classList.add('active-link');
    } else {
      link.classList.remove('active-link');
    }
  });
}

/**
 * Handles smooth scrolling and navigation logic for Connect button
 */
function initSmoothScrollConnect() {
  const connectLinks = document.querySelectorAll('.js-connect-nav');
  connectLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Check if target is a simple anchor on current page
      if (href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
          history.pushState(null, null, href);
          closeMobileMenu();
        }
      } else if (href.includes('#')) {
        const [path, hash] = href.split('#');
        const currentPath = window.location.pathname;

        // If already on the target page, scroll smoothly instead of reloading
        if (currentPath.endsWith(path) ||
          (path === 'index.html' && (currentPath.endsWith('/') || currentPath === ''))) {
          e.preventDefault();
          const target = document.querySelector('#' + hash);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            history.pushState(null, null, '#' + hash);
            closeMobileMenu();
          }
        }
      }
    });
  });

  // Handle smooth scroll on initial load if URL contains hash
  if (window.location.hash) {
    // Scroll after a small timeout to allow layout to settle
    setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  }
}

/**
 * Handles accordion expansion for experience cards
 */
function initExperienceAccordion() {
  const expCards = document.querySelectorAll('.js-exp-card');
  expCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Avoid toggling if click targets a link or list element directly
      if (e.target.tagName === 'A') return;

      const details = card.querySelector('.js-exp-details');
      const toggleText = card.querySelector('.js-toggle-text');
      const toggleIcon = card.querySelector('.js-toggle-icon');

      if (!details || !toggleText || !toggleIcon) return;

      const isExpanded = card.classList.toggle('expanded');

      if (isExpanded) {
        details.style.maxHeight = details.scrollHeight + 'px';
        toggleText.innerText = 'Hide Contributions';
        toggleIcon.style.transform = 'rotate(180deg)';
        card.querySelector('.exp-accordion-toggle').setAttribute('aria-expanded', 'true');
        details.setAttribute('aria-hidden', 'false');
      } else {
        details.style.maxHeight = '0';
        toggleText.innerText = 'View Contributions';
        toggleIcon.style.transform = 'rotate(0deg)';
        card.querySelector('.exp-accordion-toggle').setAttribute('aria-expanded', 'false');
        details.setAttribute('aria-hidden', 'true');
      }
    });
  });
}

/**
 * Handles missing images by replacing them with styled, labeled wireframe placeholders
 */
function initImageFallback() {
  const images = document.querySelectorAll('.js-portfolio-image');

  images.forEach(img => {
    // Setup error listener
    img.addEventListener('error', function handleImgError() {
      // Create a nice placeholder replacement div
      const placeholder = document.createElement('div');
      placeholder.className = 'placeholder-replacement';

      // Copy styles and sizes
      placeholder.style.width = '100%';
      placeholder.style.height = '100%';
      placeholder.style.minHeight = '100%';
      placeholder.style.background = '#1E1E2F';
      placeholder.style.border = '1.5px solid rgba(255, 255, 255, 0.15)';
      placeholder.style.borderRadius = '12px';
      placeholder.style.display = 'flex';
      placeholder.style.flexDirection = 'column';
      placeholder.style.alignItems = 'center';
      placeholder.style.justifyContent = 'center';
      placeholder.style.color = '#8A9CAE';
      placeholder.style.fontFamily = 'Raleway, sans-serif';
      placeholder.style.fontSize = '14px';
      placeholder.style.padding = '25px';
      placeholder.style.textAlign = 'center';
      placeholder.style.cursor = 'pointer';
      placeholder.style.transition = 'all 0.3s ease';

      // Determine label text from alternative tag
      const labelText = this.alt || 'Visual Asset Placeholder';

      // Add text label and a small mock image icon
      placeholder.innerHTML = `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 10px; opacity: 0.6; color: #00C6C3;">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        <span style="font-weight: bold; margin-bottom: 5px; color: #FFFFFF;">${labelText}</span>
        <span style="font-size: 11px; opacity: 0.7;">(Add image file manually)</span>
      `;

      // Add hover event triggers to mimic the container
      placeholder.addEventListener('mouseenter', () => {
        placeholder.style.borderColor = '#00C6C3';
        placeholder.style.backgroundColor = '#25253F';
        placeholder.style.boxShadow = '0 0 15px rgba(0, 198, 195, 0.25)';
      });
      placeholder.addEventListener('mouseleave', () => {
        placeholder.style.borderColor = 'rgba(255, 255, 255, 0.15)';
        placeholder.style.backgroundColor = '#1E1E2F';
        placeholder.style.boxShadow = 'none';
      });

      // Replace image in the DOM
      if (this.parentNode) {
        this.parentNode.insertBefore(placeholder, this);
        this.remove();
      }
    });

    // Trigger error event if the image is already broken
    if (img.complete && img.naturalWidth === 0) {
      img.dispatchEvent(new Event('error'));
    }
  });
}

/**
 * Handles logging or tracking for the resume download button
 */
function initResumeDownload() {
  const resumeBtn = document.querySelector('.js-download-resume');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      // We can also trigger a visual confirmation or custom analytics logging
      console.log('User clicked Download Resume. Opening Google Drive link.');
    });
  }
}

/**
 * Handles validation and submission states for the contact form
 */
function initContactForm() {
  const contactForm = document.querySelector('.js-contact-form');
  const statusContainer = document.querySelector('.js-form-status');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear previous status
    statusContainer.className = 'form-status js-form-status';
    statusContainer.innerText = '';

    const nameInput = document.querySelector('.js-input-name');
    const emailInput = document.querySelector('.js-input-email');
    const messageInput = document.querySelector('.js-input-message');

    // Basic Client-Side Validation
    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
      statusContainer.classList.add('error');
      statusContainer.innerText = 'Please fill out all fields.';
      return;
    }

    // Show Loading/Sending state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = 'Sending Message...';
    submitBtn.disabled = true;

    // Simulate API request delay
    setTimeout(() => {
      // Mock Success Response
      statusContainer.classList.add('success');
      statusContainer.innerText = `Thank you, ${nameInput.value.trim()}! Your message has been sent successfully.`;

      // Clear inputs
      contactForm.reset();

      // Reset button
      submitBtn.innerText = originalBtnText;
      submitBtn.disabled = false;
    }, 1500);
  });
}

/**
 * Handles mobile navigation toggle and drawer states
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.js-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navMenu.classList.toggle('active');
    toggleBtn.classList.toggle('active');
    document.body.classList.toggle('body-menu-open');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
      closeMobileMenu();
    }
  });
}

/**
 * Closes the mobile navigation drawer
 */
function closeMobileMenu() {
  const toggleBtn = document.querySelector('.js-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navMenu && navMenu.classList.contains('active')) {
    navMenu.classList.remove('active');
    if (toggleBtn) toggleBtn.classList.remove('active');
    document.body.classList.remove('body-menu-open');
  }
}

/**
 * Initializes the Scroll To Top button feature dynamically on all pages.
 */
function initScrollToTop() {
  let scrollTopBtn = document.querySelector('.js-scroll-to-top');

  // Dynamically create and append button if not present in markup
  if (!scrollTopBtn) {
    scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-to-top js-scroll-to-top';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollTopBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
    `;
    document.body.appendChild(scrollTopBtn);
  }

  // Toggle button visibility based on scroll position
  const toggleScrollBtnVisibility = () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  };

  // Scroll smoothly to top when clicked
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Listen to window scroll events efficiently
  let scrollFrame;
  window.addEventListener('scroll', () => {
    if (scrollFrame) {
      window.cancelAnimationFrame(scrollFrame);
    }
    scrollFrame = window.requestAnimationFrame(toggleScrollBtnVisibility);
  });

  // Initial check in case page is refreshed while scrolled down
  toggleScrollBtnVisibility();
}

/**
 * Retains and restores the scroll position across session navigations for all pages.
 */
function initScrollPersistence() {
  const currentPath = window.location.pathname || 'index.html';
  const storageKey = 'scroll_pos_' + currentPath;

  // Prevent browser native scroll restoration conflicts
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // Restore saved scroll position for this specific page if available
  const savedScrollY = sessionStorage.getItem(storageKey);
  if (savedScrollY !== null) {
    const targetY = parseInt(savedScrollY, 10);
    if (!isNaN(targetY) && targetY > 0) {
      // Ensure layout is rendered before restoring scroll position
      setTimeout(() => {
        window.scrollTo({
          top: targetY,
          behavior: 'smooth'
        });
      }, 150);
    }
  }

  // Throttled scroll listener to save current position for this page
  let scrollSaveTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollSaveTimeout);
    scrollSaveTimeout = setTimeout(() => {
      sessionStorage.setItem(storageKey, window.scrollY.toString());
    }, 100);
  });

  // Save position immediately before navigating away
  window.addEventListener('beforeunload', () => {
    sessionStorage.setItem(storageKey, window.scrollY.toString());
  });
}

