// Navigation responsive
document.addEventListener('DOMContentLoaded', function() {
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  const navItems = navLinks?.querySelectorAll('a');

  // Toggle menu on burger click
  if (burger) {
    burger.addEventListener('click', function(e) {
      e.stopPropagation();
      navLinks.classList.toggle('open');
      burger.classList.toggle('toggle');
    });
  }

  // Close menu when clicking on a link
  if (navItems) {
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('open');
        burger.classList.remove('toggle');
      });
    });
  }

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (navLinks && navLinks.classList.contains('open')) {
      if (!e.target.closest('nav') && !e.target.closest('.burger')) {
        navLinks.classList.remove('open');
        burger.classList.remove('toggle');
      }
    }
  });

  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navLinks?.classList.contains('open')) {
      navLinks.classList.remove('open');
      burger.classList.remove('toggle');
    }
  });

  // Smooth scroll for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && document.querySelector(href)) {
        e.preventDefault();
        const target = document.querySelector(href);
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Form submission handler
  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // You can add form submission logic here
      console.log('Form submitted');
      // Show success message
      alert('Merci pour votre message! Je vous recontacterai bientôt.');
      this.reset();
    });
  }

  // Typed.js initialization (typewriter effect)
  try {
    const typedEl = document.querySelector('.typed');
    if (typedEl && window.Typed) {
      const raw = typedEl.getAttribute('data-typed-items') || '';
      const strings = raw.split(',').map(s => s.trim()).filter(Boolean);
      // Initialize Typed with sensible defaults
      new Typed('.typed', {
        strings: strings.length ? strings : ['Ethical Hacker'],
        typeSpeed: 70,
        backSpeed: 40,
        backDelay: 1800,
        startDelay: 300,
        loop: true,
        showCursor: true,
        cursorChar: '|'
      });
    }
  } catch (err) {
    // fail gracefully if Typed.js isn't available
    console.warn('Typed.js initialization failed:', err);
  }

  // Simple portfolio filters (no external isotope required)
  (function initPortfolioFilters(){
    const filterBtns = document.querySelectorAll('.portfolio-filters li');
    const items = Array.from(document.querySelectorAll('.portfolio-item'));
    if (!filterBtns.length || !items.length) return;

    function showAll(){
      items.forEach(i => {
        i.style.display = '';
        i.style.opacity = '1';
        i.style.transform = 'translateY(0)';
      });
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', function(){
        filterBtns.forEach(b => b.classList.remove('filter-active'));
        this.classList.add('filter-active');
        const filter = this.getAttribute('data-filter');
        if (!filter || filter === '*') { showAll(); return; }
        const className = filter.replace('.', '');
        items.forEach(i => {
          if (i.classList.contains(className)) {
            i.style.display = '';
            // small reveal animation
            requestAnimationFrame(() => {
              i.style.opacity = '1';
              i.style.transform = 'translateY(0)';
            });
          } else {
            // hide with transition
            i.style.opacity = '0';
            i.style.transform = 'translateY(20px)';
            setTimeout(() => { i.style.display = 'none'; }, 260);
          }
        });
      });
    });
  })();
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe sections for animation
document.querySelectorAll('section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(20px)';
  section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(section);
});

document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('.testimonial-slider');
  const items = document.querySelectorAll('.testimonial-item');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  let currentIndex = 0;
  const total = items.length;

  function updateSlider() {
    slider.style.transform = 'translateX(' + (-currentIndex * 100) + '%)';
  }

  nextBtn.addEventListener('click', function() {
    currentIndex = (currentIndex + 1) % total;
    updateSlider();
  });

  prevBtn.addEventListener('click', function() {
    currentIndex = (currentIndex - 1 + total) % total;
    updateSlider();
  });

  // Optionnel: auto-play toutes les 5 secondes
  setInterval(function() {
    currentIndex = (currentIndex + 1) % total;
    updateSlider();
  }, 5000);
});