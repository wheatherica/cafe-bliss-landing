// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Performance monitoring
let performanceData = {
    startTime: performance.now(),
    fps: 0,
    frameCount: 0,
    lastTime: performance.now()
};

// Static text messages in English
const messages = {
    required: 'Please fill in this field',
    invalidEmail: 'Please enter a valid email format',
    thankYou: 'Message sent successfully! We will contact you shortly.'
};

// Cookie Consent
function initCookieConsent() {
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptButton = document.getElementById('acceptCookies');
    
    // Check if cookies already accepted
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookieBanner.classList.remove('hidden');
        }, 2000);
    }
    
    acceptButton.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.classList.add('hidden');
    });
}

// Mobile Menu
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });
    
    // Close menu when clicking links
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenu.classList.remove('active');
        }
    });
}

// Initialize Swiper
function initHeroSlider() {
    const swiper = new Swiper('.heroSwiper', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        }
    });
}

// Load and Display Menu Items
async function loadMenuItems() {
    try {
        const response = await fetch('menu.json');
        const data = await response.json();
        const menuGrid = document.getElementById('menuGrid');
        
        data.menuItems.forEach(item => {
            const menuCard = createMenuCard(item);
            menuGrid.appendChild(menuCard);
        });
        
        // Initialize menu card hover effects
        initMenuCardEffects();
    } catch (error) {
        console.error('Error loading menu items:', error);
    }
}

function createMenuCard(item) {
    const card = document.createElement('div');
    card.className = 'menu-card bg-white rounded-xl shadow-lg overflow-hidden hover-lift transform transition-all duration-300 group';
    
    card.innerHTML = `
        <div class="relative overflow-hidden">
            <div class="skeleton w-full h-56" data-skeleton></div>
            <img data-src="${item.image}" alt="${item.name}" class="w-full h-56 object-cover lazy-load group-hover:scale-110 transition-transform duration-500" loading="lazy">
            <div class="absolute top-4 left-4">
                <span class="bg-cafe-gold text-cafe-brown px-3 py-1 rounded-full text-sm font-semibold shadow-lg">${item.category}</span>
            </div>
            <div class="absolute top-4 right-4">
                <span class="bg-white bg-opacity-95 text-cafe-brown px-3 py-1 rounded-full text-lg font-bold shadow-lg">${item.price}</span>
            </div>
        </div>
        <div class="p-6">
            <h3 class="text-2xl font-bold text-gray-800 mb-3 group-hover:text-cafe-brown transition-colors">${item.name}</h3>
            <p class="text-gray-600 leading-relaxed mb-4">${item.description}</p>
            <div class="flex items-center justify-between">
                <button class="bg-cafe-brown text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cafe-gold focus:ring-opacity-50">
                    Order Now
                </button>
                <div class="flex space-x-1">
                    ${generateStarRating(4.5)}
                </div>
            </div>
        </div>
    `;
    
    return card;
}

function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star text-yellow-400"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star text-gray-300"></i>';
    }
    
    return stars;
}

function initEnhancedMenuEffects() {
    const menuCards = document.querySelectorAll('.menu-card');
    
    menuCards.forEach((card, index) => {
        // Staggered animation on load
        gsap.fromTo(card, 
            { opacity: 0, y: 50 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.6,
                delay: index * 0.1,
                ease: 'power2.out'
            }
        );
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -8,
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        // Order button click effect
        const orderBtn = card.querySelector('button');
        if (orderBtn) {
            orderBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Ripple effect
                const ripple = document.createElement('span');
                const rect = orderBtn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.className = 'absolute bg-white bg-opacity-30 rounded-full animate-ping';
                
                orderBtn.style.position = 'relative';
                orderBtn.appendChild(ripple);
                
                // Track order button click
                if (window.analytics) {
                    const itemName = card.querySelector('h3').textContent;
                    window.analytics.track('order_button_click', { item: itemName });
                }
                
                // Show success feedback
                showOrderFeedback(orderBtn);
                
                setTimeout(() => ripple.remove(), 600);
            });
        }
    });
}

function showOrderFeedback(button) {
    const originalText = button.textContent;
    button.textContent = 'Added to Cart!';
    button.classList.add('bg-green-600');
    button.classList.remove('bg-cafe-brown');
    
    setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('bg-green-600');
        button.classList.add('bg-cafe-brown');
    }, 2000);
}

// Form Validation
function initContactForm() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            // Save to localStorage
            const formData = {
                name: form.name.value,
                email: form.email.value,
                reservationDate: form.reservationDate.value,
                message: form.message.value,
                timestamp: new Date().toISOString()
            };
            
            // Get existing submissions or create new array
            let submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
            submissions.push(formData);
            localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
            
            // Track conversion
            if (window.analytics) {
                window.analytics.track('form_submission', formData);
            }
            
            // Show success message with animation
            showSuccessMessage(messages.thankYou);
            form.reset();
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearError(input));
    });
}

function validateForm() {
    const form = document.getElementById('contactForm');
    let isValid = true;
    
    // Validate required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const errorElement = field.nextElementSibling;
    let isValid = true;
    
    // Check if empty
    if (!field.value.trim()) {
        showError(field, errorElement, messages.required);
        isValid = false;
    } 
    // Email validation
    else if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            showError(field, errorElement, messages.invalidEmail);
            isValid = false;
        }
    }
    
    if (isValid) {
        clearError(field);
    }
    
    return isValid;
}

function showError(field, errorElement, message) {
    field.classList.add('border-red-500');
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
}

function clearError(field) {
    field.classList.remove('border-red-500');
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.classList.add('hidden');
    }
}

// GSAP Animations
function initAnimations() {
    // Fade in sections on scroll
    gsap.utils.toArray('.fade-in').forEach(section => {
        gsap.fromTo(section, 
            {
                opacity: 0,
                y: 30
            },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });
    
    // Parallax effect on hero images
    gsap.utils.toArray('.parallax-bg').forEach(bg => {
        gsap.to(bg, {
            yPercent: -20,
            ease: 'none',
            scrollTrigger: {
                trigger: bg.closest('.swiper-slide'),
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });
    });
    
    // Menu cards stagger animation
    ScrollTrigger.create({
        trigger: '#menu',
        start: 'top 80%',
        onEnter: () => {
            gsap.fromTo('.menu-card', 
                {
                    opacity: 0,
                    y: 50
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power2.out'
                }
            );
        },
        once: true
    });
}

// Smooth Scrolling
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Dark mode functionality
function initDarkMode() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle?.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Track theme change
        if (window.analytics) {
            window.analytics.track('theme_changed', { theme: newTheme });
        }
    });
}

function updateThemeIcon(theme) {
    const sunIcon = document.querySelector('.fa-sun')?.parentElement;
    const moonIcon = document.querySelector('.fa-moon')?.parentElement;
    
    if (theme === 'dark') {
        sunIcon?.querySelector('.fa-sun')?.classList.add('hidden');
        moonIcon?.querySelector('.fa-moon')?.classList.remove('hidden');
    } else {
        sunIcon?.querySelector('.fa-sun')?.classList.remove('hidden');
        moonIcon?.querySelector('.fa-moon')?.classList.add('hidden');
    }
}

// Removed language switching functionality

// Lazy loading images
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-load');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                
                if (src) {
                    img.src = src;
                    img.classList.add('loaded');
                    
                    // Remove skeleton
                    const skeleton = img.previousElementSibling;
                    if (skeleton?.hasAttribute('data-skeleton')) {
                        skeleton.style.display = 'none';
                    }
                    
                    observer.unobserve(img);
                }
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Success message animation
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    gsap.fromTo(successDiv, 
        { opacity: 0, y: -20 },
        { 
            opacity: 1, 
            y: 0, 
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
                setTimeout(() => {
                    gsap.to(successDiv, {
                        opacity: 0,
                        y: -20,
                        duration: 0.5,
                        onComplete: () => successDiv.remove()
                    });
                }, 3000);
            }
        }
    );
}

// Performance monitoring
function initPerformanceMonitoring() {
    const perfMonitor = document.getElementById('perfMonitor');
    const fpsElement = document.getElementById('fps');
    const loadTimeElement = document.getElementById('loadTime');
    
    // Show performance monitor with keyboard shortcut (Ctrl+Shift+P)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'P') {
            perfMonitor?.classList.toggle('hidden');
        }
    });
    
    // Calculate FPS
    function updateFPS() {
        const now = performance.now();
        const delta = now - performanceData.lastTime;
        
        performanceData.frameCount++;
        
        if (delta >= 1000) {
            performanceData.fps = Math.round((performanceData.frameCount * 1000) / delta);
            performanceData.frameCount = 0;
            performanceData.lastTime = now;
            
            if (fpsElement) {
                fpsElement.textContent = performanceData.fps;
            }
        }
        
        requestAnimationFrame(updateFPS);
    }
    
    // Display load time
    window.addEventListener('load', () => {
        const loadTime = Math.round(performance.now() - performanceData.startTime);
        if (loadTimeElement) {
            loadTimeElement.textContent = loadTime;
        }
        
        // Send performance metrics
        if (window.analytics) {
            window.analytics.track('page_performance', {
                loadTime,
                connectionType: navigator.connection?.effectiveType || 'unknown'
            });
        }
    });
    
    requestAnimationFrame(updateFPS);
}

// Advanced micro-interactions
function initMicroInteractions() {
    // Button ripple effect
    document.querySelectorAll('.btn-ripple').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.className = 'absolute bg-white bg-opacity-30 rounded-full pointer-events-none animate-ripple';
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Magnetic hover effect for menu cards
    document.querySelectorAll('.menu-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            gsap.to(card, {
                rotateY: deltaX * 5,
                rotateX: -deltaY * 5,
                duration: 0.5,
                ease: 'power2.out',
                transformPerspective: 1000
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateY: 0,
                rotateX: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
}

// Enhanced scroll header effect
function initScrollHeader() {
    const header = document.querySelector('header');
    header.style.transition = 'all 0.3s ease';
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('bg-white', 'bg-opacity-95', 'shadow-xl');
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.classList.remove('bg-white', 'bg-opacity-95', 'shadow-xl');
            header.style.backdropFilter = 'none';
        }
        
        // Hide header on scroll down, show on scroll up
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'fixed top-0 left-0 h-1 bg-gradient-to-r from-cafe-brown to-cafe-gold z-50 transition-all duration-300';
    progressBar.style.width = '0%';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Animated statistics counter
function initStatsCounter() {
    const statsSection = document.createElement('section');
    statsSection.className = 'py-16 gradient-bg';
    statsSection.innerHTML = `
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                <div class="stat-item">
                    <div class="text-4xl font-bold mb-2" data-target="500">0</div>
                    <div class="text-lg opacity-90">Happy Customers</div>
                </div>
                <div class="stat-item">
                    <div class="text-4xl font-bold mb-2" data-target="50">0</div>
                    <div class="text-lg opacity-90">Coffee Varieties</div>
                </div>
                <div class="stat-item">
                    <div class="text-4xl font-bold mb-2" data-target="5">0</div>
                    <div class="text-lg opacity-90">Years Experience</div>
                </div>
                <div class="stat-item">
                    <div class="text-4xl font-bold mb-2" data-target="98">0</div>
                    <div class="text-lg opacity-90">Satisfaction %</div>
                </div>
            </div>
        </div>
    `;
    
    // Insert after menu section
    const menuSection = document.getElementById('menu');
    menuSection.parentNode.insertBefore(statsSection, menuSection.nextSibling);
    
    // Animate counters when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    document.querySelectorAll('.stat-item').forEach(item => {
        observer.observe(item);
    });
}

function animateCounter(item) {
    const counter = item.querySelector('[data-target]');
    const target = parseInt(counter.getAttribute('data-target'));
    const increment = target / 100;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        counter.textContent = Math.floor(current);
    }, 20);
}

// Floating Action Button
function initFloatingActionButton() {
    const fab = document.getElementById('fab');
    const fabMenu = document.getElementById('fabMenu');
    const fabIcon = fab.querySelector('i');
    let isMenuOpen = false;
    
    fab.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        fabMenu.classList.toggle('active', isMenuOpen);
        
        if (isMenuOpen) {
            fabIcon.className = 'fas fa-times';
            fab.style.transform = 'rotate(45deg)';
        } else {
            fabIcon.className = 'fas fa-plus';
            fab.style.transform = 'rotate(0deg)';
        }
    });
    
    // FAB Menu Actions
    document.querySelectorAll('.fab-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const action = e.currentTarget.dataset.action;
            
            switch(action) {
                case 'menu':
                    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
                    break;
                case 'contact':
                    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                    break;
                case 'top':
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    break;
                case 'theme':
                    document.getElementById('themeToggle')?.click();
                    break;
            }
            
            // Close menu after action
            isMenuOpen = false;
            fabMenu.classList.remove('active');
            fabIcon.className = 'fas fa-plus';
            fab.style.transform = 'rotate(0deg)';
            
            // Track FAB usage
            if (window.analytics) {
                window.analytics.track('fab_action', { action });
            }
        });
    });
    
    // Hide FAB when scrolling down, show when scrolling up
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && window.scrollY > 300) {
            fab.style.transform = 'translateY(100px)';
        } else {
            fab.style.transform = 'translateY(0)';
        }
        lastScrollY = window.scrollY;
    });
}

// Cursor Trail Effect
function initCursorTrail() {
    const trails = [];
    const trailLength = 10;
    
    // Create trail elements
    for (let i = 0; i < trailLength; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.opacity = (trailLength - i) / trailLength * 0.5;
        document.body.appendChild(trail);
        trails.push({
            element: trail,
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0
        });
    }
    
    // Update cursor position
    document.addEventListener('mousemove', (e) => {
        trails[0].targetX = e.clientX - 4;
        trails[0].targetY = e.clientY - 4;
    });
    
    // Animate trail
    function animateTrail() {
        for (let i = 0; i < trails.length; i++) {
            const trail = trails[i];
            
            if (i === 0) {
                trail.x += (trail.targetX - trail.x) * 0.4;
                trail.y += (trail.targetY - trail.y) * 0.4;
            } else {
                const prevTrail = trails[i - 1];
                trail.x += (prevTrail.x - trail.x) * 0.3;
                trail.y += (prevTrail.y - trail.y) * 0.3;
            }
            
            trail.element.style.left = trail.x + 'px';
            trail.element.style.top = trail.y + 'px';
        }
        
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
    
    // Hide trails when cursor leaves window
    document.addEventListener('mouseleave', () => {
        trails.forEach(trail => {
            trail.element.style.opacity = '0';
        });
    });
    
    document.addEventListener('mouseenter', () => {
        trails.forEach((trail, index) => {
            trail.element.style.opacity = (trailLength - index) / trailLength * 0.5;
        });
    });
}

// Interactive Background Particles
function initBackgroundParticles() {
    const heroSection = document.getElementById('home');
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'bg-particle';
        
        const size = Math.random() * 60 + 20;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        
        heroSection.appendChild(particle);
    }
    
    // Mouse interaction with particles
    heroSection.addEventListener('mousemove', (e) => {
        const particles = heroSection.querySelectorAll('.bg-particle');
        const rect = heroSection.getBoundingClientRect();
        const mouseX = (e.clientX - rect.left) / rect.width;
        const mouseY = (e.clientY - rect.top) / rect.height;
        
        particles.forEach(particle => {
            const particleRect = particle.getBoundingClientRect();
            const particleX = (particleRect.left + particleRect.width / 2 - rect.left) / rect.width;
            const particleY = (particleRect.top + particleRect.height / 2 - rect.top) / rect.height;
            
            const deltaX = mouseX - particleX;
            const deltaY = mouseY - particleY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            if (distance < 0.3) {
                const force = (0.3 - distance) / 0.3;
                const moveX = -deltaX * force * 50;
                const moveY = -deltaY * force * 50;
                
                particle.style.transform = `translate(${moveX}px, ${moveY}px)`;
            } else {
                particle.style.transform = 'translate(0, 0)';
            }
        });
    });
}

// Page Transition Effects
function initPageTransitions() {
    // Add entrance animation to all sections
    const sections = document.querySelectorAll('section');
    
    sections.forEach((section, index) => {
        gsap.set(section, { opacity: 0, y: 30 });
        
        ScrollTrigger.create({
            trigger: section,
            start: 'top 85%',
            onEnter: () => {
                gsap.to(section, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: 'power2.out'
                });
            },
            once: true
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initCookieConsent();
    initMobileMenu();
    initDarkMode();
    initScrollHeader();
    initScrollProgress();
    initHeroSlider();
    loadMenuItems();
    initContactForm();
    initAnimations();
    initSmoothScroll();
    initLazyLoading();
    initPerformanceMonitoring();
    initStatsCounter();
    initFloatingActionButton();
    initCursorTrail();
    initBackgroundParticles();
    initPageTransitions();
    
    // Delay micro-interactions to ensure elements are loaded
    setTimeout(initMicroInteractions, 500);
    
    // Log performance metrics
    console.log('Page initialized:', {
        loadTime: performance.now(),
        memory: performance.memory || 'N/A'
    });
});