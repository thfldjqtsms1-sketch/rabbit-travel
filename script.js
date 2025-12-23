// ===============================
// RABBIT TRAVEL - Main Script
// ===============================

// Supabase Configuration
const SUPABASE_URL = 'https://qgaqguflhbomjapcrcsw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_NB9yifqzelDvlnuBad8-aA_UqN1kg7C';

// Initialize Supabase client
let supabaseClient = null;

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded');

    // Initialize Supabase
    try {
        if (window.supabase && window.supabase.createClient) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase client initialized');
        } else {
            console.warn('Supabase library not loaded');
        }
    } catch (e) {
        console.error('Supabase init error:', e);
    }

    // Initialize particles
    createParticles();

    // Initialize scroll animations
    initScrollAnimations();

    // Phone input formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);

            if (value.length > 7) {
                value = value.replace(/(\d{3})(\d{4})(\d{0,4})/, '$1-$2-$3');
            } else if (value.length > 3) {
                value = value.replace(/(\d{3})(\d{0,4})/, '$1-$2');
            }
            e.target.value = value;
        });
    }
});

// ===============================
// Header Scroll Effect
// ===============================
window.addEventListener('scroll', function () {
    const header = document.getElementById('header');
    if (header) {
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// ===============================
// Mobile Navigation Toggle
// ===============================
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.querySelector('.nav__menu');

if (navToggle) {
    navToggle.addEventListener('click', function () {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', function () {
        if (navMenu) navMenu.classList.remove('active');
        if (navToggle) navToggle.classList.remove('active');
    });
});

// ===============================
// Smooth Scroll for CTA Buttons
// ===============================
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);

        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===============================
// Form Validation
// ===============================
function validateForm(name, phone, fetalAge) {
    const errors = [];

    if (!name || name.trim().length < 2) {
        errors.push('이름을 2자 이상 입력해주세요.');
    }

    // More flexible phone validation
    const cleanPhone = phone.replace(/-/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
        errors.push('올바른 전화번호를 입력해주세요.');
    }

    if (!fetalAge) {
        errors.push('임신 주수를 선택해주세요.');
    }

    return errors;
}

// ===============================
// Form Submission Handler (Global)
// ===============================
async function handleFormSubmit(e) {
    e.preventDefault();
    console.log('handleFormSubmit called');

    const submitBtn = document.getElementById('submitBtn');
    const form = document.getElementById('inquiryForm');

    // Get form values
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const fetalAge = document.getElementById('fetalAge').value;

    console.log('Form data:', { name, phone, fetalAge });

    // Validate
    const errors = validateForm(name, phone, fetalAge);
    if (errors.length > 0) {
        alert(errors.join('\n'));
        return false;
    }

    // Show loading state
    if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    }

    try {
        // Submit to Supabase if available
        if (supabaseClient) {
            console.log('Submitting to Supabase...');
            const { data, error } = await supabaseClient
                .from('inquiries')
                .insert([{
                    name: name,
                    phone: phone,
                    fetal_age: fetalAge
                }]);

            if (error) {
                console.error('Supabase error:', error);
            } else {
                console.log('Supabase success:', data);
            }
        } else {
            console.log('Supabase not available');
        }

        // Always show success modal
        showModal();
        if (form) form.reset();

    } catch (error) {
        console.error('Submission error:', error);
        // Still show success modal for UX
        showModal();
        if (form) form.reset();
    } finally {
        if (submitBtn) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }

    return false;
}

// ===============================
// Modal Functions
// ===============================
function showModal() {
    console.log('showModal called');
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        console.log('Modal should now be visible');
    } else {
        console.error('Modal element not found!');
    }
}

function closeModal() {
    console.log('closeModal called');
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Close modal on background click
document.addEventListener('click', function (e) {
    const modal = document.getElementById('successModal');
    if (e.target === modal) {
        closeModal();
    }
});

// Close modal on ESC key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// ===============================
// Scroll Animations
// ===============================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
        '.about__card, .service__card, .benefit__item, .review__card'
    );

    animatedElements.forEach(function (el, index) {
        el.classList.add('fade-in');
        el.style.transitionDelay = (index * 0.1) + 's';
        observer.observe(el);
    });
}

// ===============================
// Floating Particles
// ===============================
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 10 + 5;
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const opacity = Math.random() * 0.3 + 0.1;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;

        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 107, 157, ${opacity});
            border-radius: 50%;
            left: ${left}%;
            top: ${top}%;
            animation: float ${duration}s ease-in-out infinite;
            animation-delay: ${delay}s;
        `;
        particlesContainer.appendChild(particle);
    }

    // Add float animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); }
            25% { transform: translateY(-20px) translateX(10px); }
            50% { transform: translateY(-10px) translateX(-10px); }
            75% { transform: translateY(-30px) translateX(5px); }
        }
    `;
    document.head.appendChild(style);
}
