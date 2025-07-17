// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeProgressBar();
    initializeBackToTop();
    initializeSmoothScroll();
    initializeNavigation();
    initializeGallery();
});

// Progress Bar Functionality
function initializeProgressBar() {
    const progressBar = document.getElementById('progressBar');
    
    function updateProgressBar() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    }
    
    window.addEventListener('scroll', updateProgressBar);
    updateProgressBar(); // Initial call
}

// Scroll Animations - DISABLED to prevent white blocks
// All content is now always visible without JavaScript manipulation

// Back to Top Button
function initializeBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    function toggleBackToTop() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }
    
    window.addEventListener('scroll', toggleBackToTop);
    toggleBackToTop(); // Initial call
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Smooth Scroll for Navigation Links
function initializeSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed nav
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Navigation Active State
function initializeNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNav() {
        const scrollPos = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Initial call
}

// Image Gallery Functionality
let currentImageIndex = 0;
let galleryImages = [];

// Initialize gallery images array
function initializeGallery() {
    galleryImages = Array.from(document.querySelectorAll('.stage-image')).map(img => ({
        src: img.dataset.fullSrc || img.src, // Use full-size image if available
        thumbnailSrc: img.src, // Keep thumbnail for reference
        alt: img.alt,
        caption: img.parentElement.querySelector('.image-caption')?.textContent || img.alt
    }));
}

// Image Modal Functionality
function openModal(img) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const modalCounter = document.getElementById('modalCounter');
    
    // Find current image index based on thumbnail src
    currentImageIndex = galleryImages.findIndex(item => item.thumbnailSrc === img.src);
    
    modal.style.display = 'block';
    updateModalImage();
    
    // Add animation
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function updateModalImage() {
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const modalCounter = document.getElementById('modalCounter');
    
    if (galleryImages.length > 0 && currentImageIndex >= 0 && currentImageIndex < galleryImages.length) {
        const currentImage = galleryImages[currentImageIndex];
        
        // Show loading indicator
        modalImg.style.opacity = '0.5';
        modalCaption.textContent = 'Загрузка полноразмерного изображения...';
        
        // Load full-size image
        const fullImg = new Image();
        fullImg.onload = () => {
            modalImg.src = fullImg.src;
            modalImg.alt = currentImage.alt;
            modalImg.style.opacity = '1';
            modalCaption.textContent = currentImage.caption;
            modalCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
        };
        
        fullImg.onerror = () => {
            // Fallback to thumbnail if full image fails to load
            modalImg.src = currentImage.thumbnailSrc || currentImage.src;
            modalImg.alt = currentImage.alt;
            modalImg.style.opacity = '1';
            modalCaption.textContent = currentImage.caption + ' (оптимизированная версия)';
            modalCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
        };
        
        fullImg.src = currentImage.src;
    }
}

function nextImage(event) {
    event.stopPropagation();
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateModalImage();
}

function previousImage(event) {
    event.stopPropagation();
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateModalImage();
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Keyboard Navigation for Modal
document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('imageModal');
    
    if (modal.style.display === 'block') {
        switch(e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                previousImage(e);
                break;
            case 'ArrowRight':
                nextImage(e);
                break;
        }
    }
});

// Performance Optimizations
let ticking = false;

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
    }
}

function updateAnimations() {
    // Update any animations here if needed
    ticking = false;
}

// Parallax Effect for Hero Section (Optional Enhancement)
function initializeParallax() {
    const hero = document.querySelector('.hero');
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    }
    
    window.addEventListener('scroll', updateParallax);
}

// Initialize parallax on larger screens only
if (window.innerWidth > 768) {
    initializeParallax();
}

// Lazy Loading Images (Enhancement)
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Preload Critical Images
function preloadImages() {
    const criticalImages = [
        'case_screen/лендинг продукта.png',
        'case_screen/лендинг услуги.png'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
preloadImages();

// Resize Handler
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Recalculate layouts if needed
        updateProgressBar();
    }, 250);
});

// Print Styles Handler
window.addEventListener('beforeprint', function() {
    // Expand all collapsed content for printing
    document.querySelectorAll('.stage').forEach(stage => {
        stage.classList.add('visible');
    });
});

// Error Handling for Images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.warn(`Failed to load image: ${this.src}`);
            this.style.display = 'none';
        });
    });
});

// Analytics and Performance Tracking (Placeholder)
function trackPagePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            const perfData = performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            console.log(`Page load time: ${loadTime}ms`);
            
            // Send to analytics if needed
            // analytics.track('page_load_time', { duration: loadTime });
        });
    }
}

trackPagePerformance();

// Service Worker Registration (Future Enhancement)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// Accessibility Enhancements
function initializeA11y() {
    // Focus management for modal
    const modal = document.getElementById('imageModal');
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    
    if (focusableElements.length > 0) {
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
}

initializeA11y();

// Reduced Motion Support
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.style.setProperty('--animation-duration', '0s');
}

// Dark Mode Support (Future Enhancement)
function initializeDarkMode() {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    if (prefersDarkScheme.matches) {
        // Apply dark mode styles if needed
        // document.body.classList.add('dark-mode');
    }
}

// Initialize all features
document.addEventListener('DOMContentLoaded', function() {
    initializeDarkMode();
    
    // Add any final initialization here
    console.log('Кейс "Домашний интернет" - презентация загружена');
}); 