// Analytics and A/B Testing Framework
(function() {
    'use strict';
    
    // Initialize analytics object
    window.analytics = window.analytics || {};
    
    // User identification
    const userId = localStorage.getItem('userId') || generateUUID();
    localStorage.setItem('userId', userId);
    
    // Session tracking
    const sessionId = sessionStorage.getItem('sessionId') || generateUUID();
    sessionStorage.setItem('sessionId', sessionId);
    
    // A/B Test Variants
    const abTests = {
        heroContent: {
            control: 'original',
            variant: 'simplified',
            weight: 0.5
        },
        ctaButton: {
            control: 'Send Message',
            variant: 'Get Started Now',
            weight: 0.5
        },
        menuLayout: {
            control: 'grid',
            variant: 'list',
            weight: 0.5
        }
    };
    
    // Assign user to test variants
    const userVariants = {};
    Object.keys(abTests).forEach(test => {
        const savedVariant = localStorage.getItem(`ab_${test}`);
        if (savedVariant) {
            userVariants[test] = savedVariant;
        } else {
            const isVariant = Math.random() < abTests[test].weight;
            userVariants[test] = isVariant ? 'variant' : 'control';
            localStorage.setItem(`ab_${test}`, userVariants[test]);
        }
    });
    
    // Show A/B test indicator in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const indicator = document.getElementById('abTestIndicator');
        const variantName = document.getElementById('variantName');
        if (indicator && variantName) {
            indicator.classList.remove('hidden');
            variantName.textContent = Object.entries(userVariants)
                .map(([test, variant]) => `${test}: ${variant}`)
                .join(', ');
        }
    }
    
    // Apply A/B test variants
    function applyABTests() {
        // CTA Button variant
        if (userVariants.ctaButton === 'variant') {
            const ctaButton = document.querySelector('button[type="submit"]');
            if (ctaButton && ctaButton.textContent.includes('Send Message')) {
                ctaButton.textContent = 'Get Started Now';
            }
        }
        
        // Menu layout variant
        if (userVariants.menuLayout === 'variant') {
            const menuGrid = document.getElementById('menuGrid');
            if (menuGrid) {
                menuGrid.classList.remove('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
                menuGrid.classList.add('flex', 'flex-col', 'space-y-4');
            }
        }
    }
    
    // Event tracking
    const eventQueue = [];
    let isSending = false;
    
    analytics.track = function(eventName, properties = {}) {
        const event = {
            event: eventName,
            properties: {
                ...properties,
                userId,
                sessionId,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                referrer: document.referrer,
                userAgent: navigator.userAgent,
                screenResolution: `${screen.width}x${screen.height}`,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                variants: userVariants
            }
        };
        
        eventQueue.push(event);
        
        // Send events in batches
        if (!isSending) {
            sendEvents();
        }
        
        // Log to console in development
        if (window.location.hostname === 'localhost') {
            console.log('Analytics Event:', event);
        }
    };
    
    // Send events to server (simulated)
    async function sendEvents() {
        if (eventQueue.length === 0) return;
        
        isSending = true;
        const eventsToSend = [...eventQueue];
        eventQueue.length = 0;
        
        try {
            // In production, this would send to your analytics server
            // For demo purposes, we'll store in localStorage
            const storedEvents = JSON.parse(localStorage.getItem('analyticsEvents') || '[]');
            storedEvents.push(...eventsToSend);
            
            // Keep only last 100 events to prevent storage overflow
            if (storedEvents.length > 100) {
                storedEvents.splice(0, storedEvents.length - 100);
            }
            
            localStorage.setItem('analyticsEvents', JSON.stringify(storedEvents));
            
            // Update conversion metrics
            updateConversionMetrics(eventsToSend);
            
        } catch (error) {
            console.error('Failed to send analytics:', error);
            // Re-queue failed events
            eventQueue.unshift(...eventsToSend);
        } finally {
            isSending = false;
            
            // Schedule next batch
            if (eventQueue.length > 0) {
                setTimeout(sendEvents, 5000);
            }
        }
    }
    
    // Conversion tracking
    function updateConversionMetrics(events) {
        const metrics = JSON.parse(localStorage.getItem('conversionMetrics') || '{}');
        
        events.forEach(event => {
            if (event.event === 'form_submission') {
                metrics.totalConversions = (metrics.totalConversions || 0) + 1;
                
                // Track by variant
                const ctaVariant = event.properties.variants.ctaButton;
                metrics[`conversions_${ctaVariant}`] = (metrics[`conversions_${ctaVariant}`] || 0) + 1;
            }
            
            if (event.event === 'page_view') {
                metrics.totalPageViews = (metrics.totalPageViews || 0) + 1;
            }
        });
        
        localStorage.setItem('conversionMetrics', JSON.stringify(metrics));
    }
    
    // Page view tracking
    analytics.track('page_view', {
        title: document.title,
        loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart
    });
    
    // Scroll depth tracking
    let maxScrollDepth = 0;
    let scrollTimer;
    
    window.addEventListener('scroll', () => {
        const scrollDepth = Math.round((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100);
        
        if (scrollDepth > maxScrollDepth) {
            maxScrollDepth = scrollDepth;
            
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(() => {
                analytics.track('scroll_depth', { depth: maxScrollDepth });
            }, 1000);
        }
    });
    
    // Time on page tracking
    let timeOnPage = 0;
    let isVisible = true;
    
    setInterval(() => {
        if (isVisible) {
            timeOnPage++;
        }
    }, 1000);
    
    document.addEventListener('visibilitychange', () => {
        isVisible = !document.hidden;
    });
    
    window.addEventListener('beforeunload', () => {
        analytics.track('page_exit', { timeOnPage });
    });
    
    // Click tracking for important elements
    document.addEventListener('click', (e) => {
        const target = e.target.closest('a, button, .menu-card');
        if (target) {
            const eventData = {
                element: target.tagName.toLowerCase(),
                text: target.textContent.trim().substring(0, 50),
                href: target.href || null,
                classes: target.className
            };
            
            if (target.classList.contains('menu-card')) {
                eventData.menuItem = target.querySelector('h3')?.textContent;
            }
            
            analytics.track('element_click', eventData);
        }
    });
    
    // Utility function to generate UUID
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    // Apply A/B tests when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyABTests);
    } else {
        applyABTests();
    }
    
    // Export analytics dashboard data
    analytics.getDashboardData = function() {
        const events = JSON.parse(localStorage.getItem('analyticsEvents') || '[]');
        const metrics = JSON.parse(localStorage.getItem('conversionMetrics') || '{}');
        
        // Calculate conversion rates
        const conversionRate = metrics.totalPageViews > 0 
            ? (metrics.totalConversions / metrics.totalPageViews * 100).toFixed(2)
            : 0;
            
        const controlConversionRate = metrics.totalPageViews > 0 && metrics.conversions_control
            ? (metrics.conversions_control / (metrics.totalPageViews / 2) * 100).toFixed(2)
            : 0;
            
        const variantConversionRate = metrics.totalPageViews > 0 && metrics.conversions_variant
            ? (metrics.conversions_variant / (metrics.totalPageViews / 2) * 100).toFixed(2)
            : 0;
        
        return {
            totalEvents: events.length,
            totalPageViews: metrics.totalPageViews || 0,
            totalConversions: metrics.totalConversions || 0,
            conversionRate: conversionRate + '%',
            abTestResults: {
                ctaButton: {
                    control: controlConversionRate + '%',
                    variant: variantConversionRate + '%',
                    winner: variantConversionRate > controlConversionRate ? 'variant' : 'control'
                }
            },
            recentEvents: events.slice(-10).reverse(),
            userVariants
        };
    };
    
    // Console helper for viewing analytics
    window.viewAnalytics = function() {
        console.table(analytics.getDashboardData());
    };
    
    console.log('Analytics initialized. Type viewAnalytics() to see dashboard data.');
    
})();