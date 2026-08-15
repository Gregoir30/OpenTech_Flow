
    // ─── THEME TOGGLE ─────────────────────────────────────────
    const html = document.documentElement;
    const themeBtn = document.getElementById('theme-toggle');
    const saved = localStorage.getItem('theme');
    if (saved === 'light') html.classList.add('light');

    themeBtn.addEventListener('click', () => {
      html.classList.toggle('light');
      localStorage.setItem('theme', html.classList.contains('light') ? 'light' : 'dark');
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
    document.querySelectorAll('a,button,.portfolio-item,.service-card,.process-card').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.style.transform = 'scale(2)'; follower.style.transform = 'scale(1.5)'; });
      el.addEventListener('mouseleave', () => { cursor.style.transform = 'scale(1)'; follower.style.transform = 'scale(1)'; });
    });

    // ─── TOAST NOTIFICATIONS ──────────────────────────────────
    function showToast(msg, icon = 'bi-info-circle-fill') {
      const container = document.getElementById('toast-container');
      if (!container) return;
      const toast = document.createElement('div');
      toast.className = 'toast-msg';
      toast.innerHTML = `<i class="bi ${icon}"></i> <span>${msg}</span>`;
      container.appendChild(toast);
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    }

    // ─── QUICK COPY CONTACT ───────────────────────────────────
    function copyContact(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(`Copié : ${text}`, 'bi-check-circle-fill');
        }).catch(() => {
          fallbackCopy(text);
        });
      } else {
        fallbackCopy(text);
      }
    }
    function fallbackCopy(text) {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast(`Copié : ${text}`, 'bi-check-circle-fill');
    }

    // ─── HERO CANVAS PARTICLES ────────────────────────────────
    (function initHeroCanvas() {
      const canvas = document.getElementById('hero-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let width, height;
      let particles = [];

      function resize() {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
      }
      window.addEventListener('resize', resize);
      resize();

      class Particle {
        constructor() {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.vx = (Math.random() - 0.5) * 0.6;
          this.vy = (Math.random() - 0.5) * 0.6;
          this.radius = Math.random() * 2 + 1;
        }
        update() {
          this.x += this.vx;
          this.y += this.vy;
          if (this.x < 0 || this.x > width) this.vx *= -1;
          if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 229, 255, 0.4)';
          ctx.fill();
        }
      }

      for (let i = 0; i < 45; i++) particles.push(new Particle());

      function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw();
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 110) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(124, 58, 237, ${1 - dist / 110 * 0.8})`;
              ctx.lineWidth = 0.6;
              ctx.stroke();
            }
          }
        }
        requestAnimationFrame(animate);
      }
      animate();
    })();

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

    // ─── CYBER TERMINAL INTERACTIVE ENGINE ────────────────────
    const termBody = document.getElementById('terminal-body');
    const termInput = document.getElementById('terminal-input');

    const termResponses = {
      whoami: `<strong>User:</strong> Grégoir SABA<br>
<strong>Role:</strong> Développeur Full Stack &amp; Ethical Hacker<br>
<strong>Location:</strong> Lomé, Togo (GMT+0)<br>
<strong>Status:</strong> Available for Freelance &amp; Security Audits`,

      skills: `<strong>=== TECHNICAL STACK ===</strong><br>
• Mobile: Flutter, Dart, Firebase, Android/iOS<br>
• Web: PHP (Laravel), JavaScript (Node.js, React), HTML5/CSS3<br>
• Cyber: Pentesting OWASP, Kali Linux, Nmap, Burp Suite, Metasploit<br>
• Network: Cisco, pfSense, UFW, VPN, Wireshark, Fail2Ban`,

      nmap: `Starting Nmap 7.94 ( https://nmap.org )<br>
Nmap scan report for sec-target.local (192.168.1.100)<br>
PORT     STATE SERVICE       VERSION<br>
22/tcp   open  ssh           OpenSSH 9.2 (protocol 2.0)<br>
80/tcp   open  http          Nginx 1.24.0 (Ubuntu)<br>
443/tcp  open  ssl/https     TLS 1.3 (Hardened)<br>
3306/tcp open  mysql         MySQL 8.0 (Encrypted)<br>
<span style="color:#10b981;">[+] Security Hardening Audit: PASSED (No critical vulnerability found)</span>`,

      projects: `<strong>=== FEATURED PROJECTS ===</strong><br>
1. Business Connect — Portail B2B Chine-Togo (https://business-connect.pro)<br>
2. E-Commerce Local — Intégration Paiement Mobile T-Money / Flooz<br>
3. App Streaming VOD — Clone Netflix personnalisé<br>
4. Ettiam BTP — Site Institutionnel (https://ettiam.net)<br>
5. Innove-Corp — Portail Ingénierie (https://innove-corp.netlify.app)`,

      audit: `<strong>=== SECURITY AUDIT METHODOLOGY ===</strong><br>
[1] Reconnaissance &amp; OSINT<br>
[2] Vulnerability Scanning (OWASP Top 10)<br>
[3] Exploitation &amp; Privilege Escalation<br>
[4] Remediation Report &amp; Security Hardening`,

      contact: `<strong>=== CONTACT DIRECT ===</strong><br>
📧 Email: contact@gregoirservices.tg<br>
📞 Téléphone: +228 90 41 61 17<br>
💬 WhatsApp: https://wa.me/22890416117<br>
📍 Localisation: Avédji, Lomé — Togo`,

      help: `<strong>Available commands:</strong><br>
• <span class="term-cmd-highlight">whoami</span>   - Afficher le profil du développeur<br>
• <span class="term-cmd-highlight">skills</span>   - Liste des compétences dev &amp; sécurité<br>
• <span class="term-cmd-highlight">nmap</span>     - Simuler un scan réseau Nmap<br>
• <span class="term-cmd-highlight">projects</span> - Liste des projets principaux<br>
• <span class="term-cmd-highlight">audit</span>    - Méthodologie d'audit cybersécurité<br>
• <span class="term-cmd-highlight">contact</span>  - Coordonnées de contact rapides<br>
• <span class="term-cmd-highlight">clear</span>    - Effacer le terminal`
    };

    function execTermCmd(cmd) {
      cmd = cmd.trim().toLowerCase();
      if (!termBody) return;

      const cmdLine = document.createElement('div');
      cmdLine.className = 'term-line cmd';
      cmdLine.innerHTML = `<span class="term-prompt">gregoir@sec-lab:~$</span> ${cmd}`;
      termBody.appendChild(cmdLine);

      if (cmd === 'clear') {
        termBody.innerHTML = '';
        return;
      }

      const outLine = document.createElement('div');
      outLine.className = 'term-line output';

      if (termResponses[cmd]) {
        outLine.innerHTML = termResponses[cmd];
      } else {
        outLine.innerHTML = `Command not found: <span style="color:#f43f5e;">${cmd}</span>. Type <span class="term-cmd-highlight">help</span> for assistance.`;
      }
      termBody.appendChild(outLine);
      termBody.scrollTop = termBody.scrollHeight;
    }

    function handleTermSubmit(e) {
      e.preventDefault();
      if (!termInput) return;
      const val = termInput.value.trim();
      if (val) {
        execTermCmd(val);
        termInput.value = '';
      }
    }

    // ─── DEVIS EXPRESS CALCULATOR ─────────────────────────────
    let selectedDevisType = 'web';
    let basePrice = 150000;
    let baseDays = 7;

    document.querySelectorAll('#devis-type-group .devis-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('#devis-type-group .devis-opt').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        selectedDevisType = opt.dataset.type;
        basePrice = parseInt(opt.dataset.base, 10);
        baseDays = parseInt(opt.dataset.days, 10);
        updateDevisCalculation();
      });
    });

    document.querySelectorAll('.devis-addon, input[name="devis-urgency"]').forEach(input => {
      input.addEventListener('change', () => {
        if (input.type === 'radio') {
          document.querySelectorAll('.devis-radio').forEach(r => r.classList.remove('active'));
          input.closest('.devis-radio').classList.add('active');
        }
        updateDevisCalculation();
      });
    });

    function updateDevisCalculation() {
      let totalPrice = basePrice;
      let totalDays = baseDays;

      document.querySelectorAll('.devis-addon:checked').forEach(addon => {
        totalPrice += parseInt(addon.dataset.price, 10);
        totalDays += parseInt(addon.dataset.addDays, 10);
      });

      const activeUrgency = document.querySelector('input[name="devis-urgency"]:checked');
      const mult = activeUrgency ? parseFloat(activeUrgency.dataset.mult) : 1;
      totalPrice = Math.round(totalPrice * mult);

      if (mult > 1) {
        totalDays = Math.max(3, Math.round(totalDays * 0.75));
      }

      const priceDisplay = document.getElementById('devis-price-display');
      const delayDisplay = document.getElementById('devis-delay-display');

      if (priceDisplay) {
        priceDisplay.textContent = totalPrice.toLocaleString('fr-FR') + ' FCFA';
      }
      if (delayDisplay) {
        delayDisplay.textContent = `${totalDays} à ${totalDays + 3} jours ouvrés`;
      }
    }

    function sendDevisWhatsApp() {
      const typeOpt = document.querySelector('#devis-type-group .devis-opt.active strong');
      const typeName = typeOpt ? typeOpt.textContent : 'Projet';

      const priceDisplay = document.getElementById('devis-price-display');
      const delayDisplay = document.getElementById('devis-delay-display');

      const selectedAddons = [];
      document.querySelectorAll('.devis-addon:checked').forEach(cb => selectedAddons.push(cb.value));

      const urgencyRadio = document.querySelector('input[name="devis-urgency"]:checked');
      const urgencyVal = urgencyRadio ? urgencyRadio.value : 'Standard';

      const lines = [
        '*Demande de Devis Express — Portfolio*',
        '',
        `*Type de projet :* ${typeName}`,
        `*Options choisies :* ${selectedAddons.length > 0 ? selectedAddons.join(', ') : 'Aucune option supplémentaire'}`,
        `*Urgence :* ${urgencyVal}`,
        `*Estimation Tarif :* ${priceDisplay ? priceDisplay.textContent : ''}`,
        `*Délai estimé :* ${delayDisplay ? delayDisplay.textContent : ''}`,
        '',
        'Bonjour Grégoir, je souhaite affiner ce devis pour mon projet !'
      ];

      const waUrl = `https://wa.me/22890416117?text=${encodeURIComponent(lines.join('\n'))}`;
      window.open(waUrl, '_blank');
    }

    // ─── FAQ ACCORDION ────────────────────────────────────────
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    });

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

    // ─── PROJECT MODAL LIGHTBOX ───────────────────────────────
    const projectDetailsData = {
      'Plateforme E-Commerce Locale': {
        cat: 'Développement Web & Mobile',
        desc: 'Architecture e-commerce complète avec catalogue dynamique, panier réactif et passerelle de paiement mobile (T-Money & Flooz) sécurisée par webhooks.',
        tags: ['Laravel', 'T-Money', 'Flooz', 'MySQL', 'Bootstrap'],
        link: 'https://wa.me/22890416117?text=Demande%20de%20d%C3%A9mo%20E-Commerce'
      },
      'Plateforme Streaming VOD': {
        cat: 'Développement Web Full Stack',
        desc: 'Clone de Netflix haute performance avec player vidéo personnalisé, gestion des profils utilisateurs et abonnements récurrents.',
        tags: ['JavaScript', 'Node.js', 'React', 'Video.js', 'MongoDB'],
        link: 'https://wa.me/22890416117?text=Demande%20de%20d%C3%A9mo%20VOD'
      },
      'Business Connect': {
        cat: 'Plateforme B2B Transcontinentale',
        desc: 'Portail B2B facilitant le commerce et l\'importation de marchandises entre la Chine et le Togo avec suivi de commandes en temps réel.',
        tags: ['PHP', 'Laravel', 'REST API', 'MySQL', 'CSS3'],
        link: 'https://business-connect.pro'
      },
      'Ettiam BTP': {
        cat: 'Site Institutionnel BTP',
        desc: 'Site vitrine haut de gamme et responsive pour une entreprise transcontinentale de BTP, architecture et maintenance d\'infrastructures.',
        tags: ['HTML5', 'Vanilla CSS', 'JavaScript', 'SEO'],
        link: 'https://ettiam.net'
      },
      'Innove-Corp': {
        cat: 'Plateforme d\'Ingénierie',
        desc: 'Plateforme de présentation des services d\'ingénierie et d\'architecture avec galerie de projets dynamique et formulaire interactif.',
        tags: ['React', 'TailwindCSS', 'Netlify', 'UX Design'],
        link: 'https://innove-corp.netlify.app'
      },
      'Portail Universitaire': {
        cat: 'Intranet Académique',
        desc: 'Système de gestion scolaire pour la consultation des notes, emplois du temps, inscriptions et génération de bulletins numérisés.',
        tags: ['PHP', 'MySQL', 'JavaScript', 'Chart.js'],
        link: 'https://wa.me/22890416117?text=Demande%20d%27info%20Portail%20Universitaire'
      },
      'Wireshark Analysis': {
        cat: 'Réseau & Cybersécurité',
        desc: 'Analyse approfondie de trafic réseau pour détecter les fuites de données en clair, les tentatives d\'usurpation d\'IP et sécuriser les protocoles.',
        tags: ['Wireshark', 'TCP/IP', 'OSINT', 'Analyse Réseau'],
        link: 'https://wa.me/22890416117?text=Demande%20d%27audit%20R%C3%A9seau'
      },
      'Hardening Serveur Linux': {
        cat: 'Sécurité Serveur & DevOps',
        desc: 'Hardening complet d\'infrastructures Linux Ubuntu/Debian : UFW Firewall, Fail2Ban, clés SSH à double facteur et certificats SSL Let\'s Encrypt.',
        tags: ['Linux', 'UFW', 'Fail2Ban', 'Docker', 'Nginx'],
        link: 'https://wa.me/22890416117?text=Demande%20de%20Hardening%20Serveur'
      },
      'Project Manager Tool': {
        cat: 'Projet Innovant SaaS',
        desc: 'Application web de gestion de projets type Trello avec tableau Kanban, assignation de tâches et système de notifications.',
        tags: ['JavaScript', 'Node.js', 'Socket.io', 'CSS Glassmorphism'],
        link: 'https://wa.me/22890416117?text=Demande%20Project%20Manager'
      },
      'PHP Adventure': {
        cat: 'Projet Innovant EdTech',
        desc: 'Serious Game ludo-éducatif conçu pour enseigner la programmation orientée objet en PHP aux étudiants débutants.',
        tags: ['PHP 8', 'POO', 'Gamification', 'CSS Animations'],
        link: 'https://wa.me/22890416117?text=Info%20PHP%20Adventure'
      },
      'SQL Query Builder': {
        cat: 'Projet Innovant Base de Données',
        desc: 'Interface graphique intuitive pour composer, tester et optimiser visuellement des requêtes complexes Oracle SQL sans saisir de code.',
        tags: ['Oracle SQL', 'JavaScript', 'Query Parser'],
        link: 'https://wa.me/22890416117?text=Info%20SQL%20Query%20Builder'
      }
    };

    document.querySelectorAll('.portfolio-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('a[target="_blank"]')) return;
        const titleEl = item.querySelector('h4');
        if (!titleEl) return;
        const title = titleEl.textContent.trim();
        const imgEl = item.querySelector('.portfolio-thumb img');
        const imgSrc = imgEl ? imgEl.getAttribute('src') : '';
        const data = projectDetailsData[title] || {
          cat: 'Réalisation Tech',
          desc: 'Projet d\'ingénierie et de développement sur-mesure réalisé par Grégoir SABA.',
          tags: ['Full Stack', 'Security'],
          link: 'https://wa.me/22890416117'
        };

        const modal = document.getElementById('project-modal');
        if (!modal) return;
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-img').src = imgSrc;
        document.getElementById('modal-cat').textContent = data.cat;
        document.getElementById('modal-desc').textContent = data.desc;
        document.getElementById('modal-link').href = data.link;

        const tagsContainer = document.getElementById('modal-tags');
        tagsContainer.innerHTML = '';
        data.tags.forEach(t => {
          const span = document.createElement('span');
          span.className = 'tag';
          span.textContent = t;
          tagsContainer.appendChild(span);
        });

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeProjectModal() {
      const modal = document.getElementById('project-modal');
      if (!modal) return;
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    // ─── INTERSECTION OBSERVER ────────────────────────────────
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
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
          e.target.querySelectorAll('.skill-fill').forEach(bar => {
            bar.style.width = bar.dataset.width + '%';
          });
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

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
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
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
          if (errorEl) {
            errorEl.style.display = 'flex';
            setTimeout(() => errorEl.style.display = 'none', 4000);
          }
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

        const successEl = document.getElementById('form-success');
        if (successEl) successEl.style.display = 'flex';
        this.reset();
        document.querySelectorAll('.service-pill').forEach((p,i) => p.classList.toggle('active', i===0));
        document.getElementById('selected-service').value = 'web';
        setTimeout(() => {
          window.open(waUrl, '_blank');
          if (successEl) setTimeout(() => successEl.style.display = 'none', 5000);
        }, 500);
      });
    }

    // ─── 3D TILT EFFECT FOR CARDS ─────────────────────────────
    document.querySelectorAll('.service-card, .process-card, .certif-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rx = (-y / rect.height) * 10;
        const ry = (x / rect.width) * 10;
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });

    // ─── CHARACTER COUNTER FOR CONTACT MESSAGE ───────────────
    const msgTextarea = document.getElementById('message');
    const charCounter = document.getElementById('char-counter');
    if (msgTextarea && charCounter) {
      msgTextarea.addEventListener('input', () => {
        const len = msgTextarea.value.length;
        const max = msgTextarea.getAttribute('maxlength') || 600;
        charCounter.textContent = `${len} / ${max} caractères`;
        charCounter.classList.toggle('limit-near', len > max * 0.85 && len < max);
        charCounter.classList.toggle('limit-reached', len >= max);
      });
    }

    // ─── SERVICE CARD CLICK TO CONTACT FORM PREFILL ──────────
    document.querySelectorAll('.service-card').forEach((card, index) => {
      card.addEventListener('click', () => {
        const pills = document.querySelectorAll('.service-pill');
        if (pills[index]) {
          pills.forEach(p => p.classList.remove('active'));
          pills[index].classList.add('active');
          const selService = document.getElementById('selected-service');
          if (selService) selService.value = pills[index].dataset.value;
        }
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // ─── SCROLL INDICATOR CLICK ──────────────────────────────
    const scrollInd = document.querySelector('.scroll-indicator');
    if (scrollInd) {
      scrollInd.addEventListener('click', () => {
        const aboutSec = document.getElementById('about');
        if (aboutSec) aboutSec.scrollIntoView({ behavior: 'smooth' });
      });
    }