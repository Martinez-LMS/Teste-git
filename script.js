(function() {
    const formContato = document.getElementById('formContato');
    const formResult = document.getElementById('formResult');
    if (formContato && formResult) {
        formContato.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(formContato);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);
            formResult.textContent = 'Enviando...';
            formResult.style.color = 'var(--cor-texto-suave)';
            formResult.style.display = 'block';
            const btn = formContato.querySelector('button[type="submit"]');
            if (btn) btn.disabled = true;
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                const data = await response.json();
                if (response.status === 200) {
                    formResult.textContent = 'Mensagem enviada! Entraremos em contato em até 24 horas.';
                    formResult.style.color = '#22c55e';
                    formContato.reset();
                    setTimeout(() => {
                        formResult.style.display = 'none';
                    }, 5000);
                } else {
                    formResult.textContent = data.message || 'Erro ao enviar. Tente novamente.';
                    formResult.style.color = '#ef4444';
                }
            })
            .catch(() => {
                formResult.textContent = 'Erro de conexão. Tente novamente.';
                formResult.style.color = '#ef4444';
            })
            .finally(() => {
                if (btn) btn.disabled = false;
            });
        });
    }

    const header = document.getElementById('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        updateActiveNav();
    }

    function toggleMenu() {
        const willBeActive = !navLinks.classList.contains('active');
        menuToggle.classList.toggle('active', willBeActive);
        navLinks.classList.toggle('active', willBeActive);
        menuToggle.setAttribute('aria-expanded', willBeActive);
        document.body.style.overflow = willBeActive ? 'hidden' : '';
    }

    function closeMenuOnResize() {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    function closeMenuOnLinkClick(e) {
        if (e.target.classList.contains('nav-link')) {
            toggleMenu();
        }
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
            }
        });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const scrollY = window.scrollY;
        const viewportMiddle = scrollY + window.innerHeight / 2;
        let activeId = null;

        for (const section of sections) {
            const id = section.getAttribute('id');
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (viewportMiddle >= sectionTop && viewportMiddle < sectionBottom) {
                activeId = id;
                break;
            }
        }

        if (!activeId && sections.length > 0) {
            const lastSection = sections[sections.length - 1];
            if (scrollY + window.innerHeight > lastSection.offsetTop + lastSection.offsetHeight * 0.5) {
                activeId = lastSection.getAttribute('id');
            }
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + activeId) {
                link.classList.add('active');
            }
        });
    }


    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    window.addEventListener('resize', closeMenuOnResize);
    menuToggle.addEventListener('click', toggleMenu);
    navLinks.addEventListener('click', closeMenuOnLinkClick);

    const heroElements = document.querySelectorAll('.hero .animate-on-scroll');
    heroElements.forEach((el, i) => {
        const delay = (el.dataset.delay || 0) + (i * 100);
        setTimeout(() => el.classList.add('visible'), 300 + parseInt(delay));
    });
})();
