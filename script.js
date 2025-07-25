// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Performance monitoring
let performanceData = {
    startTime: performance.now(),
    fps: 0,
    frameCount: 0,
    lastTime: performance.now()
};

// Language translations
const translations = {
    en: {
        welcome: 'Welcome to Café Bliss',
        tagline: 'Where Every Cup Tells a Story',
        artisan: 'Artisan Coffee',
        crafted: 'Crafted with Passion, Served with Love',
        fresh: 'Fresh Daily',
        treats: 'Delicious Treats & Premium Blends',
        menu: 'Our Menu',
        contact: 'Get in Touch',
        name: 'Name',
        email: 'Email',
        message: 'Message',
        reservation: 'Reservation Date',
        send: 'Send Message',
        visit: 'Visit Us',
        hours: 'Business Hours',
        follow: 'Follow Us',
        required: 'This field is required',
        invalidEmail: 'Please enter a valid email address',
        thankYou: 'Thank you for your message! We will get back to you soon.'
    },
    ja: {
        welcome: 'カフェ・ブリスへようこそ',
        tagline: 'すべてのカップに物語がある',
        artisan: '職人のコーヒー',
        crafted: '情熱を込めて作り、愛を込めて提供',
        fresh: '毎日新鮮',
        treats: 'おいしいお菓子とプレミアムブレンド',
        menu: 'メニュー',
        contact: 'お問い合わせ',
        name: 'お名前',
        email: 'メールアドレス',
        message: 'メッセージ',
        reservation: '予約日',
        send: 'メッセージを送信',
        visit: 'アクセス',
        hours: '営業時間',
        follow: 'フォローする',
        required: 'この項目は必須です',
        invalidEmail: '有効なメールアドレスを入力してください',
        thankYou: 'お問い合わせありがとうございます。すぐにご連絡いたします。'
    }
};

let currentLang = localStorage.getItem('preferredLanguage') || 'en';

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
    card.className = 'menu-card bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer relative hover-lift';
    
    card.innerHTML = `
        <div class="skeleton w-full h-48" data-skeleton></div>
        <img data-src="${item.image}" alt="${item.name}" class="w-full h-48 object-cover lazy-load" loading="lazy">
        <div class="p-6">
            <span class="text-sm text-cafe-gold font-semibold">${item.category}</span>
            <h3 class="text-xl font-bold text-gray-800 mt-2">${item.name}</h3>
            <p class="text-cafe-brown font-bold mt-2">${item.price}</p>
        </div>
        <div class="menu-popup absolute inset-0 bg-cafe-brown bg-opacity-95 text-white p-6 opacity-0 pointer-events-none transition-opacity duration-300">
            <h3 class="text-2xl font-bold mb-2">${item.name}</h3>
            <p class="mb-4">${item.description}</p>
            <p class="text-2xl font-bold text-cafe-gold">${item.price}</p>
        </div>
    `;
    
    return card;
}

function initMenuCardEffects() {
    const menuCards = document.querySelectorAll('.menu-card');
    
    menuCards.forEach(card => {
        const popup = card.querySelector('.menu-popup');
        
        card.addEventListener('mouseenter', () => {
            popup.style.opacity = '1';
            popup.style.pointerEvents = 'auto';
        });
        
        card.addEventListener('mouseleave', () => {
            popup.style.opacity = '0';
            popup.style.pointerEvents = 'none';
        });
    });
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
            showSuccessMessage(translations[currentLang].thankYou);
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
        showError(field, errorElement, translations[currentLang].required);
        isValid = false;
    } 
    // Email validation
    else if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            showError(field, errorElement, translations[currentLang].invalidEmail);
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

// Language switching
function initLanguageSwitch() {
    const langToggle = document.getElementById('langToggle');
    
    if (langToggle) {
        langToggle.value = currentLang;
        updateLanguage(currentLang);
        
        langToggle.addEventListener('change', (e) => {
            currentLang = e.target.value;
            localStorage.setItem('preferredLanguage', currentLang);
            updateLanguage(currentLang);
            
            // Track language change
            if (window.analytics) {
                window.analytics.track('language_changed', { language: currentLang });
            }
        });
    }
}

function updateLanguage(lang) {
    const t = translations[lang];
    
    // Update text content based on data attributes or specific selectors
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.textContent = t[key];
        }
    });
}

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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initCookieConsent();
    initMobileMenu();
    initDarkMode();
    initLanguageSwitch();
    initHeroSlider();
    loadMenuItems();
    initContactForm();
    initAnimations();
    initSmoothScroll();
    initLazyLoading();
    initPerformanceMonitoring();
    
    // Delay micro-interactions to ensure elements are loaded
    setTimeout(initMicroInteractions, 500);
    
    // Log performance metrics
    console.log('Page initialized:', {
        loadTime: performance.now(),
        memory: performance.memory || 'N/A'
    });
});