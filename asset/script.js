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
// Sélection des éléments
const form = document.querySelector('form[aria-label="Formulaire de contact"]');
const nameEl = document.querySelector('#name');
const emailEl = document.querySelector('#email');
const phoneEl = document.querySelector('#phone');
const messageEl = document.querySelector('#message');

// Fonction utilitaire : Vérifier si un champ est vide
const isRequired = value => value === '' ? false : true;

// Fonction utilitaire : Vérifier la longueur
const isBetween = (length, min, max) => length < min || length > max ? false : true;

// Fonction utilitaire : Regex Email standard
const isEmailValid = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

// Fonction utilitaire : Regex Téléphone (Accepte format international +228... ou local 90...)
// Accepte les espaces, les tirets et les parenthèses
const isPhoneValid = (phone) => {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{2,6}$/im;
    return re.test(phone);
};

// --- Fonctions d'affichage des erreurs/succès ---

const showError = (input, message) => {
    // Récupère le parent (.form-group)
    const formField = input.parentElement;
    
    // Ajoute la classe d'erreur
    input.classList.remove('success');
    input.classList.add('error');
    formField.classList.add('show-error');

    // Affiche le message
    // On vérifie si la balise <small> existe déjà, sinon on la crée
    let errorDisplay = formField.querySelector('small');
    if (!errorDisplay) {
        errorDisplay = document.createElement('small');
        formField.appendChild(errorDisplay);
    }
    errorDisplay.innerText = message;
};

const showSuccess = (input) => {
    const formField = input.parentElement;

    // Enlève la classe d'erreur
    input.classList.remove('error');
    input.classList.add('success');
    formField.classList.remove('show-error');

    // Vide le message d'erreur
    const errorDisplay = formField.querySelector('small');
    if (errorDisplay) {
        errorDisplay.innerText = '';
    }
};

// --- Fonctions de validation individuelles ---

const checkName = () => {
    let valid = false;
    const min = 3, max = 50;
    const name = nameEl.value.trim();

    if (!isRequired(name)) {
        showError(nameEl, 'Le nom ne peut pas être vide.');
    } else if (!isBetween(name.length, min, max)) {
        showError(nameEl, `Le nom doit contenir entre ${min} et ${max} caractères.`);
    } else {
        showSuccess(nameEl);
        valid = true;
    }
    return valid;
};

const checkEmail = () => {
    let valid = false;
    const email = emailEl.value.trim();

    if (!isRequired(email)) {
        showError(emailEl, "L'email ne peut pas être vide.");
    } else if (!isEmailValid(email)) {
        showError(emailEl, "L'adresse email n'est pas valide.");
    } else {
        showSuccess(emailEl);
        valid = true;
    }
    return valid;
};

const checkPhone = () => {
    let valid = false;
    const phone = phoneEl.value.trim();

    // Le téléphone n'est pas 'required' dans le HTML, donc on valide seulement s'il est rempli
    if (!isRequired(phone)) {
        // Si vide, on considère valide (car optionnel) mais on enlève le vert/rouge
        phoneEl.classList.remove('success', 'error');
        phoneEl.parentElement.classList.remove('show-error');
        valid = true; 
    } else if (!isPhoneValid(phone)) {
        showError(phoneEl, "Numéro de téléphone invalide.");
    } else {
        showSuccess(phoneEl);
        valid = true;
    }
    return valid;
};

const checkMessage = () => {
    let valid = false;
    const message = messageEl.value.trim();
    const min = 10;

    if (!isRequired(message)) {
        showError(messageEl, "Le message ne peut pas être vide.");
    } else if (message.length < min) {
        showError(messageEl, `Le message doit contenir au moins ${min} caractères.`);
    } else {
        showSuccess(messageEl);
        valid = true;
    }
    return valid;
};

// --- Écouteurs d'événements ---

// 1. Validation en temps réel (Debounce pour éviter de spammer pendant la frappe)
const debounce = (fn, delay = 500) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            fn.apply(null, args);
        }, delay);
    };
};

// Appliquer la validation instantanée
if(form) {
    form.addEventListener('input', debounce(function (e) {
        switch (e.target.id) {
            case 'name':
                checkName();
                break;
            case 'email':
                checkEmail();
                break;
            case 'phone':
                checkPhone();
                break;
            case 'message':
                checkMessage();
                break;
        }
    }));

    // 2. Validation à la soumission
    form.addEventListener('submit', function (e) {
        // Empêcher l'envoi par défaut
        e.preventDefault();

        // Valider tous les champs
        let isNameValid = checkName(),
            isEmailValid = checkEmail(),
            isPhoneValid = checkPhone(),
            isMessageValid = checkMessage();

        let isFormValid = isNameValid && isEmailValid && isPhoneValid && isMessageValid;

        // Si tout est valide
        if (isFormValid) {
            // Simulation d'envoi (Ici vous connecterez votre Backend ou EmailJS)
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            
            submitBtn.innerText = 'Envoi en cours...';
            submitBtn.disabled = true;

            setTimeout(() => {
                alert('Merci ! Votre message a été envoyé avec succès.');
                form.reset(); // Vider le formulaire
                
                // Retirer les classes success (vert)
                document.querySelectorAll('.success').forEach(el => el.classList.remove('success'));
                
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }, 1500);
        }
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

// script.js
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".testimonial-slider");
  const slides = Array.from(document.querySelectorAll(".testimonial-item"));
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");

  let currentIndex = 0;

  function updateSlider() {
    const offset = - currentIndex * 100;
    slider.style.transform = `translateX(${offset}%)`;
  }

  prevBtn.addEventListener("click", () => {
    currentIndex--;
    if (currentIndex < 0) {
      currentIndex = slides.length - 1;
    }
    updateSlider();
  });

  nextBtn.addEventListener("click", () => {
    currentIndex++;
    if (currentIndex >= slides.length) {
      currentIndex = 0;
    }
    updateSlider();
  });

  // Optionnel : auto-slide toutes les 5 secondes
  let autoSlide = setInterval(() => {
    currentIndex++;
    if (currentIndex >= slides.length) currentIndex = 0;
    updateSlider();
  }, 5000);

  // Si l’utilisateur clique sur un bouton — reset interval pour éviter conflit
  [prevBtn, nextBtn].forEach(btn => {
    btn.addEventListener("click", () => {
      clearInterval(autoSlide);
      autoSlide = setInterval(() => {
        currentIndex++;
        if (currentIndex >= slides.length) currentIndex = 0;
        updateSlider();
      }, 5000);
    });
  });

  // Initialisation
  updateSlider();
});
