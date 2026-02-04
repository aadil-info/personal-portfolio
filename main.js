/**
 * Personal Portfolio Website - Main JavaScript
 * Handles all interactive functionality
 */

// ==========================================
// DOM Elements
// ==========================================
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const mobileToggle = document.getElementById('mobileToggle');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');
const contactForm = document.getElementById('contactForm');
const backToTop = document.getElementById('backToTop');
const statNumbers = document.querySelectorAll('.stat-number');

// ==========================================
// Theme Management
// ==========================================
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ==========================================
// Mobile Navigation
// ==========================================
mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileToggle.querySelector('i').classList.toggle('fa-times');
    mobileToggle.querySelector('i').classList.toggle('fa-bars');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.querySelector('i').classList.remove('fa-times');
        mobileToggle.querySelector('i').classList.add('fa-bars');
    });
});

// ==========================================
// Navbar Scroll Effect
// ==========================================
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add scrolled class to navbar
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Show/hide back to top button
    if (currentScroll > 500) {
        backToTop.classList.add('active');
    } else {
        backToTop.classList.remove('active');
    }

    lastScroll = currentScroll;
});

// Back to top button click
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ==========================================
// Smooth Scrolling for Navigation Links
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Update active nav link
            updateActiveNavLink(targetId);
        }
    });
});

// Update active navigation link based on scroll position
function updateActiveNavLink(sectionId) {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === sectionId) {
            link.classList.add('active');
        }
    });
}

// ==========================================
// Active Navigation Link on Scroll
// ==========================================
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            updateActiveNavLink(`#${sectionId}`);
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// ==========================================
// Counter Animation for Stats
// ==========================================
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const targetValue = parseInt(target.getAttribute('data-target'));
            animateCounter(target, targetValue);
            counterObserver.unobserve(target);
        }
    });
}, observerOptions);

statNumbers.forEach(stat => {
    counterObserver.observe(stat);
});

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

// ==========================================
// Skill Bar Animation
// ==========================================
const skillBars = document.querySelectorAll('.skill-progress');

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
    bar.style.animationPlayState = 'paused';
    skillObserver.observe(bar);
});

// ==========================================
// Scroll Animations (Fade In)
// ==========================================
const fadeElements = document.querySelectorAll('.fade-in, .skill-category, .service-card, .project-card, .education-item');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

fadeElements.forEach(el => {
    el.classList.add('fade-in');
    fadeObserver.observe(el);
});

// ==========================================
// Contact Form Validation and Submission
// ==========================================
const validators = {
    name: {
        validate: (value) => value.trim().length >= 2,
        message: 'Name must be at least 2 characters long'
    },
    email: {
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Please enter a valid email address'
    },
    subject: {
        validate: (value) => value.trim().length >= 3,
        message: 'Subject must be at least 3 characters long'
    },
    message: {
        validate: (value) => value.trim().length >= 10,
        message: 'Message must be at least 10 characters long'
    }
};

function validateField(field) {
    const fieldName = field.name;
    const validator = validators[fieldName];
    const errorSpan = field.parentElement.querySelector('.error-message');

    if (validator && !validator.validate(field.value)) {
        field.parentElement.classList.add('error');
        if (errorSpan) {
            errorSpan.textContent = validator.message;
        }
        return false;
    } else {
        field.parentElement.classList.remove('error');
        if (errorSpan) {
            errorSpan.textContent = '';
        }
        return true;
    }
}

// Add validation to form fields
Object.keys(validators).forEach(fieldName => {
    const field = contactForm.querySelector(`[name="${fieldName}"]`);
    if (field) {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.parentElement.classList.contains('error')) {
                validateField(field);
            }
        });
    }
});

// Form submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    const formData = new FormData(contactForm);

    Object.keys(validators).forEach(fieldName => {
        const field = contactForm.querySelector(`[name="${fieldName}"]`);
        if (field && !validateField(field)) {
            isValid = false;
        }
    });

    if (!isValid) {
        showFeedback('formFeedback', 'Please fill in all fields correctly', 'error');
        return;
    }

    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-flex';
    submitBtn.disabled = true;

    // Prepare template parameters for EmailJS
    const templateParams = {
        name: formData.get('name'),
        email: formData.get('email'),
        title: formData.get('subject'),
        message: formData.get('message')
    };

    try {
        // Check if EmailJS is available
        if (typeof emailjs !== 'undefined') {
            // Replace with your EmailJS credentials
            await emailjs.send(
                'service_x1jhti6',
                'template_c2i8kob',
                templateParams
            );

            showFeedback('formFeedback', 'Thank you! Your message has been sent successfully.', 'success');
            contactForm.reset();
        } else {
            // Fallback: Log form data (for demo purposes)
            console.log('Form submitted:', Object.fromEntries(formData));
            showFeedback('formFeedback', 'Thank you! Your message has been sent. (Demo mode)', 'success');
            contactForm.reset();
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showFeedback('formFeedback', 'Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
        // Reset button state
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        submitBtn.disabled = false;
    }
});

function showFeedback(elementId, message, type) {
    const feedback = document.getElementById(elementId);
    feedback.textContent = message;
    feedback.className = `form-feedback ${type}`;

    // Auto-hide after 5 seconds
    setTimeout(() => {
        feedback.className = 'form-feedback';
        feedback.textContent = '';
    }, 5000);
}

// ==========================================
// Download CV Functionality (Handled by HTML)
// ==========================================
// The download is now handled directly by the anchor tag in index.html
// to ensure MyResume.pdf is downloaded instead of the sample .txt file.

// ==========================================
// Lazy Loading for Images
// ==========================================
const lazyImages = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
}, {
    rootMargin: '50px 0px'
});

lazyImages.forEach(img => {
    imageObserver.observe(img);
});

// ==========================================
// Initialize
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    // Initialize active nav link
    highlightNavLink();

    // Add loaded class to body for entrance animations
    document.body.classList.add('loaded');

    console.log('Portfolio website initialized successfully!');
});

// ==========================================
// Utility Functions
// ==========================================
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

function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

