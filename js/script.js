// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Open/Close mobile menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scroll behavior for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll effect to navbar
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 212, 255, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    observer.observe(section);
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Lazy load images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// Copy to clipboard functionality
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Text copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }

    // Tab navigation
    if (e.key === 'Tab') {
        const focusableElements = document.querySelectorAll(
            'a, button, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }
});

// Form validation (if needed)
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Responsive table functionality
function makeTableResponsive() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        if (window.innerWidth < 768) {
            table.setAttribute('data-responsive', 'true');
            const rows = table.querySelectorAll('tr');
            const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent);

            rows.forEach((row, index) => {
                if (index > 0) {
                    const cells = row.querySelectorAll('td');
                    cells.forEach((cell, cellIndex) => {
                        cell.setAttribute('data-label', headers[cellIndex]);
                    });
                }
            });
        }
    });
}

makeTableResponsive();
window.addEventListener('resize', throttle(makeTableResponsive, 250));

// Product carousel (if needed for future features)
class Carousel {
    constructor(containerSelector, options = {}) {
        this.container = document.querySelector(containerSelector);
        this.options = {
            autoplay: options.autoplay || false,
            interval: options.interval || 5000,
            ...options
        };
        this.currentIndex = 0;
        this.items = [];
        this.init();
    }

    init() {
        if (!this.container) return;
        this.items = this.container.querySelectorAll('[data-carousel-item]');
        if (this.items.length === 0) return;

        if (this.options.autoplay) {
            this.startAutoplay();
        }
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        this.update();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.update();
    }

    update() {
        this.items.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentIndex);
        });
    }

    startAutoplay() {
        setInterval(() => this.next(), this.options.interval);
    }
}

// Performance monitoring
function logPerformanceMetrics() {
    if (window.performance && window.performance.timing) {
        const perf = window.performance.timing;
        const pageLoadTime = perf.loadEventEnd - perf.navigationStart;
        console.log('Page Load Time: ' + pageLoadTime + 'ms');

        // Additional metrics
        const connectTime = perf.responseEnd - perf.requestStart;
        const renderTime = perf.domComplete - perf.domLoading;
        const domContentLoadedTime = perf.domContentLoadedEventEnd - perf.navigationStart;

        console.log('Connect Time: ' + connectTime + 'ms');
        console.log('Render Time: ' + renderTime + 'ms');
        console.log('DOM Content Loaded: ' + domContentLoadedTime + 'ms');
    }
}

// Log performance metrics after page load
window.addEventListener('load', logPerformanceMetrics);

// Service Worker Registration (for PWA support) - DISABLED for development
// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//         navigator.serviceWorker.register('sw.js').catch(err => {
//             console.log('Service Worker registration failed: ', err);
//         });
//     });
// }

// Accessibility improvements
document.addEventListener('DOMContentLoaded', () => {
    // Add ARIA labels
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (!button.hasAttribute('aria-label')) {
            button.setAttribute('aria-label', button.textContent || 'Button');
        }
    });

    // Add role to interactive elements
    document.querySelectorAll('.card-link').forEach(link => {
        link.setAttribute('role', 'button');
    });
});

// Export functions for use in other scripts
window.Bitverse = {
    copyToClipboard,
    validateEmail,
    debounce,
    throttle,
    Carousel,
    animateCounter
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Bitverse Platform Loaded Successfully');
    
    // Initialize wallet modal opening
    initializeWalletModalTriggers();
    
    // Add any initialization code here
    // For example: initialize tooltips, popovers, etc.
});

// ===== WALLET MODAL FUNCTIONALITY =====

function initializeWalletModalTriggers() {
    // Function to open wallet modal (injected script exposes global)
    function openWalletModal() {
        if (typeof window.openWalletModal === 'function') {
            try { window.openWalletModal(); return; } catch (e) { console.error('openWalletModal failed', e); }
        }
        // fallback: try posting to iframe if it exists
        const iframe = document.getElementById('wallet-modal-iframe');
        if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({ action: 'openModal' }, '*');
        }
    }

    // Get all elements that should trigger the wallet modal
    const walletTriggerElements = document.querySelectorAll('.open-modal');
    
    walletTriggerElements.forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openWalletModal();
        });
    });

    // Also support the old onclick handlers
    window.Bitverse = window.Bitverse || {};
    window.Bitverse.openSelectWalletModal = openWalletModal;
}

