// ===============================
// RABBIT TRAVEL - Main Script
// MonkeyTravel Style Update
// ===============================

// Supabase Configuration
const SUPABASE_URL = 'https://qgaqguflhbomjapcrcsw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_NB9yifqzelDvlnuBad8-aA_UqN1kg7C';

// Initialize Supabase client
let supabaseClient = null;

document.addEventListener('DOMContentLoaded', function () {
    console.log('🐰 Rabbit Travel initialized');

    // Initialize Supabase
    try {
        if (window.supabase && window.supabase.createClient) {
            supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase client initialized');
        } else {
            console.warn('⚠️ Supabase library not loaded');
        }
    } catch (e) {
        console.error('❌ Supabase init error:', e);
    }

    // Initialize all features
    initDestinationTabs();
    initScrollAnimations();
    initCounterAnimation();
    initPhoneFormatting();
    initFloatingCTA();
    initSearchBar();
});

// ===============================
// Destination Tabs
// ===============================
function initDestinationTabs() {
    const tabs = document.querySelectorAll('.destination-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');

            const destination = this.dataset.destination;
            console.log('Selected destination:', destination);

            // Could filter products here in the future
            animateProducts();
        });
    });
}

function animateProducts() {
    const products = document.querySelectorAll('.product-card');
    products.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// ===============================
// Header Scroll Effect
// ===============================
let lastScrollY = 0;
let ticking = false;

window.addEventListener('scroll', function () {
    lastScrollY = window.pageYOffset;

    if (!ticking) {
        window.requestAnimationFrame(function () {
            handleScroll(lastScrollY);
            ticking = false;
        });
        ticking = true;
    }
});

function handleScroll(scrollY) {
    const header = document.getElementById('header');
    const floatingCta = document.querySelector('.floating-cta');

    // Header shadow on scroll
    if (header) {
        if (scrollY > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        }
    }

    // Show/hide floating CTA
    if (floatingCta) {
        if (scrollY > 500) {
            floatingCta.style.opacity = '1';
            floatingCta.style.transform = 'translateY(0)';
        } else {
            floatingCta.style.opacity = '0';
            floatingCta.style.transform = 'translateY(20px)';
        }
    }
}

// ===============================
// Mobile Navigation Toggle
// ===============================
const navToggle = document.getElementById('nav-toggle');

if (navToggle) {
    navToggle.addEventListener('click', function () {
        this.classList.toggle('active');

        // Create mobile menu if it doesn't exist
        let mobileMenu = document.querySelector('.mobile-menu');
        if (!mobileMenu) {
            mobileMenu = createMobileMenu();
        }

        mobileMenu.classList.toggle('active');
    });
}

function createMobileMenu() {
    const menu = document.createElement('div');
    menu.className = 'mobile-menu';
    menu.innerHTML = `
        <div class="mobile-menu-content">
            <a href="#destinations" class="mobile-link">인기 상품</a>
            <a href="#about" class="mobile-link">소개</a>
            <a href="#reviews" class="mobile-link">후기</a>
            <a href="#inquiry" class="mobile-link mobile-link--cta">무료 상담</a>
            <div class="mobile-contact">
                <a href="tel:02-1234-5678">📞 02-1234-5678</a>
            </div>
        </div>
    `;
    document.body.appendChild(menu);

    // Add styles for mobile menu
    const style = document.createElement('style');
    style.textContent = `
        .mobile-menu {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            z-index: 999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        .mobile-menu.active {
            opacity: 1;
            visibility: visible;
        }
        .mobile-menu-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            gap: 24px;
        }
        .mobile-link {
            font-size: 1.25rem;
            font-weight: 600;
            color: #0F172A;
            padding: 12px 24px;
        }
        .mobile-link--cta {
            background: linear-gradient(135deg, #FF6B9D 0%, #9B6BFF 100%);
            color: white;
            border-radius: 999px;
        }
        .mobile-contact {
            margin-top: 24px;
        }
        .mobile-contact a {
            font-size: 1.1rem;
            color: #64748B;
        }
    `;
    document.head.appendChild(style);

    // Close menu when clicking links
    menu.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    return menu;
}

// ===============================
// Smooth Scroll
// ===============================
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        e.preventDefault();
        const target = document.querySelector(targetId);

        if (target) {
            const headerOffset = 140;
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
// Search Bar
// ===============================
function initSearchBar() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) {
                // Scroll to products section
                const products = document.getElementById('destinations');
                if (products) {
                    products.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
}

// ===============================
// Counter Animation
// ===============================
function initCounterAnimation() {
    const counters = document.querySelectorAll('.review-score');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseFloat(element.textContent);
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = start + (target - start) * easeOut;

        element.textContent = current.toFixed(1);

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ===============================
// Phone Input Formatting
// ===============================
function initPhoneFormatting() {
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
}

// ===============================
// Floating CTA
// ===============================
function initFloatingCTA() {
    const floatingCta = document.querySelector('.floating-cta');
    if (floatingCta) {
        floatingCta.style.opacity = '0';
        floatingCta.style.transform = 'translateY(20px)';
        floatingCta.style.transition = 'all 0.3s ease';
    }
}

// ===============================
// Form Validation
// ===============================
function validateForm(name, phone, fetalAge) {
    const errors = [];

    if (!name || name.trim().length < 2) {
        errors.push('이름을 2자 이상 입력해주세요.');
    }

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
// Form Submission Handler
// ===============================
async function handleFormSubmit(e) {
    e.preventDefault();
    console.log('📝 Form submission started');

    const submitBtn = document.getElementById('submitBtn');
    const form = document.getElementById('inquiryForm');

    // Get form values
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const fetalAge = document.getElementById('fetalAge').value;
    const destination = document.getElementById('destination')?.value || '';
    const message = document.getElementById('message')?.value || '';

    console.log('Form data:', { name, phone, fetalAge, destination, message });

    // Validate
    const errors = validateForm(name, phone, fetalAge);
    if (errors.length > 0) {
        showToast(errors[0], 'error');
        return false;
    }

    // Show loading state
    if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    }

    try {
        // Submit to Supabase
        if (supabaseClient) {
            console.log('📤 Submitting to Supabase...');
            const { data, error } = await supabaseClient
                .from('inquiries')
                .insert([{
                    name: name,
                    phone: phone,
                    fetal_age: fetalAge,
                    destination: destination,
                    message: message
                }]);

            if (error) {
                console.error('❌ Supabase error:', error);
            } else {
                console.log('✅ Supabase success:', data);
            }
        }

        // Show success modal
        showModal();
        if (form) form.reset();

    } catch (error) {
        console.error('❌ Submission error:', error);
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
// Toast Notification
// ===============================
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === 'error' ? '⚠️' : 'ℹ️'}</span>
        <span class="toast-message">${message}</span>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .toast {
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            background: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 3000;
            opacity: 0;
            animation: toastIn 0.3s ease forwards;
        }
        .toast--error {
            border-left: 4px solid #EF4444;
        }
        .toast--success {
            border-left: 4px solid #10B981;
        }
        .toast-message {
            font-weight: 500;
        }
        @keyframes toastIn {
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(toast);

    // Auto remove
    setTimeout(() => {
        toast.style.animation = 'toastIn 0.3s ease reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===============================
// Modal Functions
// ===============================
function showModal() {
    console.log('🎉 Showing success modal');
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Add confetti effect
        createConfetti();
    }
}

function closeModal() {
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
// Confetti Effect
// ===============================
function createConfetti() {
    const colors = ['#FF6B9D', '#9B6BFF', '#FFB84C', '#4FACFE', '#43E97B'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 10 + 5;
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const duration = Math.random() * 2 + 2;

        confetti.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: ${left}%;
            top: -20px;
            z-index: 2001;
            pointer-events: none;
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            animation: confettiFall ${duration}s ease-out forwards;
            animation-delay: ${delay}s;
        `;

        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), (duration + delay) * 1000);
    }

    // Add animation if not exists
    if (!document.getElementById('confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes confettiFall {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

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
        '.product-card, .why-card, .review__card, .trust-item'
    );

    animatedElements.forEach(function (el, index) {
        el.classList.add('fade-in');
        el.style.transitionDelay = (index % 4 * 0.1) + 's';
        observer.observe(el);
    });

    // Add fade-in styles
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// ===============================
// Utility: Debounce
// ===============================
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

console.log('🐰 Rabbit Travel script loaded');
