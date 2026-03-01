
    // ─── THEME TOGGLE ─────────────────────────────────────────
    const html = document.documentElement;
    const themeBtn = document.getElementById('theme-toggle');
    const saved = localStorage.getItem('theme');
    if (saved === 'light') html.classList.add('light');

    themeBtn.addEventListener('click', () => {
      html.classList.toggle('light');
      localStorage.setItem('theme', html.classList.contains('light') ? 'light' : 'dark');
      // ripple effect
      themeBtn.style.transform = 'scale(0.85)';
      setTimeout(() => themeBtn.style.transform = '', 200);
    });

    // ─── CURSOR ───────────────────────────────────────────────
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    let mx = 0, my = 0, fx = 0, fy = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx - 5 + 'px';
      cursor.style.top = my - 5 + 'px';
    });
    function animFollower() {
      fx += (mx - fx - 18) * 0.12;
      fy += (my - fy - 18) * 0.12;
      follower.style.left = fx + 'px';
      follower.style.top = fy + 'px';
      requestAnimationFrame(animFollower);
    }
    animFollower();
    document.querySelectorAll('a,button,.portfolio-item,.service-card').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.style.transform = 'scale(2)'; follower.style.transform = 'scale(1.5)'; });
      el.addEventListener('mouseleave', () => { cursor.style.transform = 'scale(1)'; follower.style.transform = 'scale(1)'; });
    });

    // ─── HEADER SCROLL ───────────────────────────────────────
    const header = document.getElementById('header');
    const backTop = document.getElementById('back-top');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) { header.classList.add('scrolled'); backTop.classList.add('visible'); }
      else { header.classList.remove('scrolled'); backTop.classList.remove('visible'); }
      // Active nav
      document.querySelectorAll('section[id]').forEach(sec => {
        const top = sec.offsetTop - 100;
        const bot = top + sec.offsetHeight;
        if (window.scrollY >= top && window.scrollY < bot) {
          document.querySelectorAll('nav a').forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === '#' + sec.id) a.classList.add('active');
          });
        }
      });
    });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // ─── MOBILE DRAWER ────────────────────────────────────────
    const burger = document.getElementById('burger');
    const mobileNav = document.getElementById('mobile-nav');
    const closeNav = document.getElementById('close-nav');
    const drawerOverlay = document.getElementById('drawer-overlay');

    function openMobileNav() {
      mobileNav.classList.add('open');
      mobileNav.setAttribute('aria-hidden', 'false');
      drawerOverlay.classList.add('open');
      burger.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileNav() {
      mobileNav.classList.remove('open');
      mobileNav.setAttribute('aria-hidden', 'true');
      drawerOverlay.classList.remove('open');
      burger.classList.remove('active');
      document.body.style.overflow = '';
    }

    burger.addEventListener('click', () => {
      mobileNav.classList.contains('open') ? closeMobileNav() : openMobileNav();
    });
    closeNav.addEventListener('click', closeMobileNav);
    drawerOverlay.addEventListener('click', closeMobileNav);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileNav(); });

    // ─── TYPED ROLES ──────────────────────────────────────────
    const roles = ['Développeur Web', 'Flutter Developer', 'Ethical Hacker', 'Ingénieur Réseau', 'Security Engineer', 'Pentester'];
    let ri = 0, ci = 0, deleting = false;
    const typedEl = document.getElementById('typed-role');
    function typeRole() {
      const word = roles[ri];
      if (!deleting) {
        typedEl.textContent = word.slice(0, ++ci);
        if (ci === word.length) { deleting = true; setTimeout(typeRole, 2000); return; }
      } else {
        typedEl.textContent = word.slice(0, --ci);
        if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
      }
      setTimeout(typeRole, deleting ? 60 : 90);
    }
    typeRole();

    // ─── PORTFOLIO FILTER ─────────────────────────────────────
    document.querySelectorAll('.portfolio-filters li').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.portfolio-filters li').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.portfolio-item').forEach(item => {
          if (filter === '*' || item.dataset.category === filter) {
            item.style.display = '';
            setTimeout(() => item.style.opacity = '1', 10);
          } else {
            item.style.opacity = '0';
            setTimeout(() => item.style.display = 'none', 300);
          }
        });
      });
    });

    // ─── INTERSECTION OBSERVER ────────────────────────────────
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          // Count up numbers
          e.target.querySelectorAll('[data-count]').forEach(el => {
            const target = +el.dataset.count;
            let current = 0;
            const step = target / 40;
            const interval = setInterval(() => {
              current = Math.min(current + step, target);
              el.textContent = Math.floor(current) + '+';
              if (current >= target) clearInterval(interval);
            }, 40);
          });
          // Skill bars
          e.target.querySelectorAll('.skill-fill').forEach(bar => {
            bar.style.width = bar.dataset.width + '%';
          });
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Also observe skill bars directly
    const skillObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.skill-fill').forEach(bar => {
            setTimeout(() => bar.style.width = bar.dataset.width + '%', 200);
          });
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.skills-layout > div').forEach(el => skillObserver.observe(el));

    // ─── SERVICE PILLS ────────────────────────────────────────
    document.querySelectorAll('.service-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.service-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        document.getElementById('selected-service').value = pill.dataset.value;
      });
    });

    // ─── CONTACT FORM → WHATSAPP ──────────────────────────────
    document.getElementById('contact-form').addEventListener('submit', function(e) {
      e.preventDefault();

      const name    = document.getElementById('name').value.trim();
      const email   = document.getElementById('email').value.trim();
      const phone   = document.getElementById('phone').value.trim();
      const message = document.getElementById('message').value.trim();
      const service = document.getElementById('selected-service').value;

      const serviceLabels = {
        web: 'Développement Web', mobile: 'App Mobile',
        audit: 'Audit / Pentest', reseau: 'Config Réseau',
        formation: 'Formation', autre: 'Autre'
      };

      if (!name || !email || !message) {
        const errorEl = document.getElementById('form-error');
        errorEl.style.display = 'flex';
        setTimeout(() => errorEl.style.display = 'none', 4000);
        return;
      }

      const text = [
        '*Nouveau message depuis le portfolio*',
        '',
        `*Nom :* ${name}`,
        `*Email :* ${email}`,
        phone ? `*Téléphone :* ${phone}` : null,
        `*Service :* ${serviceLabels[service] || service}`,
        '',
        `*Message :*`,
        message
      ].filter(l => l !== null).join('\n');

      const waUrl = `https://wa.me/22890416117?text=${encodeURIComponent(text)}`;

      // Show success then open WhatsApp
      const successEl = document.getElementById('form-success');
      successEl.style.display = 'flex';
      this.reset();
      document.querySelectorAll('.service-pill').forEach((p,i) => p.classList.toggle('active', i===0));
      document.getElementById('selected-service').value = 'web';
      setTimeout(() => {
        window.open(waUrl, '_blank');
        setTimeout(() => successEl.style.display = 'none', 5000);
      }, 500);
    });
  