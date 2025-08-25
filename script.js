document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuLinks = mobileMenu?.querySelectorAll('a'); // Select all links within the menu
  let isMenuOpen = false;

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      mobileMenu.classList.toggle('active', isMenuOpen);
      mobileMenuButton.setAttribute('aria-expanded', isMenuOpen);

      if (isMenuOpen) {
        mobileMenu.focus(); // Focus the menu itself
        trapFocus(mobileMenu);
      } else {
        mobileMenuButton.focus();
      }
    });

    const closeMenu = () => {
      isMenuOpen = false;
      mobileMenu.classList.remove('active');
      mobileMenuButton.setAttribute('aria-expanded', false);
      mobileMenuButton.focus();
    };

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    });
  }

  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
    );
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      const isTabPressed = e.key === 'Tab' || e.keyCode === 9;

      if (!isTabPressed) {
        return;
      }

      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    });
  }

  // Smooth Scroll and Back to Top
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const backToTopButton = document.querySelector('.back-to-top');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });

        // Update the URL hash without triggering navigation
        history.pushState(null, null, targetId);
      }
    });
  });

  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add('show');
      } else {
        backToTopButton.classList.remove('show');
      }
    });

    backToTopButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  // Testimonial Slider
  const testimonialSlider = document.querySelector('.testimonial-slider');
  if (testimonialSlider) {
    const slides = testimonialSlider.querySelectorAll('.testimonial-slide');
    const prevButton = testimonialSlider.querySelector('.slider-prev');
    const nextButton = testimonialSlider.querySelector('.slider-next');
    let currentSlide = 0;
    const slideInterval = 5000; // Auto-advance every 5 seconds
    let intervalId;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    };

    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    };

    const prevSlide = () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    };

    const startSlider = () => {
      intervalId = setInterval(nextSlide, slideInterval);
    };

    const stopSlider = () => {
      clearInterval(intervalId);
    };

    if (prevButton) {
      prevButton.addEventListener('click', () => {
        stopSlider();
        prevSlide();
        startSlider();
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        stopSlider();
        nextSlide();
        startSlider();
      });
    }

    showSlide(currentSlide); // Initial slide
    startSlider();

    testimonialSlider.addEventListener('mouseenter', stopSlider);
    testimonialSlider.addEventListener('mouseleave', startSlider);
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      faqItems.forEach(otherItem => {
        otherItem.classList.remove('open');
        otherItem.querySelector('.faq-content').setAttribute('aria-hidden', 'true');
      });

      if (!isOpen) {
        item.classList.add('open');
        content.setAttribute('aria-hidden', 'false');
      } else {
        content.setAttribute('aria-hidden', 'true');
      }
    });
  });

  // Email Capture Validation
  const emailForm = document.querySelector('#email-capture-form');

  if (emailForm) {
    emailForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = emailForm.querySelector('input[type="email"]');
      const emailValue = emailInput.value.trim();

      if (isValidEmail(emailValue)) {
        console.log('Email submitted:', emailValue);
        // Simulate submission and clear the form
        emailForm.reset();
      } else {
        alert('Please enter a valid email address.');
      }
    });
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // UTM-aware CTA click logging
  const utmParams = new URLSearchParams(window.location.search);
  const ctaButtons = document.querySelectorAll('.cta-button');

  ctaButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const utmSource = utmParams.get('utm_source');
      const utmMedium = utmParams.get('utm_medium');
      const utmCampaign = utmParams.get('utm_campaign');

      console.log('CTA Clicked:', {
        target: event.target.textContent,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign
      });
    });
  });
});