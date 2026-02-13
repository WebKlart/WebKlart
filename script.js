// ===================================
// WEBKLAR - PREMIUM JAVASCRIPT
// Interactive & Smooth Animations
// ===================================

// --- SMOOTH SCROLL FOR ANCHOR LINKS ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Skip if href is just "#"
        if (href === '#') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
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

// --- HEADER SCROLL EFFECT ---
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// --- PARALLAX HERO EFFECT ---
const hero = document.querySelector('.hero');

if (hero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        // Only apply parallax on desktop
        if (window.innerWidth > 768) {
            hero.style.backgroundPositionY = `${scrolled * parallaxSpeed}px`;
        }
    });
}

// --- SCROLL REVEAL ANIMATIONS ---
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Unobserve after animation to improve performance
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements that should fade in
const fadeElements = document.querySelectorAll('.service-card, .project-card, .section-title, .why-card, .process-step');
fadeElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// --- FORM HANDLING WITH PREMIUM FEEDBACK ---
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const form = e.target;
        const data = new FormData(form);
        const button = form.querySelector('button');
        const originalText = button.innerText;

        // Add loading state
        button.innerHTML = `
            <span style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                <svg style="animation: spin 1s linear infinite;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" opacity="0.25"/>
                    <path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"/>
                </svg>
                Sender...
            </span>
        `;
        button.disabled = true;

        // Add CSS for spinner animation
        if (!document.getElementById('spinner-style')) {
            const style = document.createElement('style');
            style.id = 'spinner-style';
            style.textContent = `
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success animation
                form.innerHTML = `
                    <div style="text-align: center; padding: 40px 20px; animation: fadeInScale 0.6s ease-out;">
                        <div style="font-size: 4rem; margin-bottom: 24px;">✨</div>
                        <h3 style="color: white; margin-bottom: 16px; font-size: 1.75rem; font-weight: 700;">Takk for din henvendelse!</h3>
                        <p style="color: #D1D5DB; font-size: 1.1rem; line-height: 1.6;">Vi har mottatt meldingen din og svarer så snart som mulig.</p>
                    </div>
                `;

                // Add success animation CSS
                if (!document.getElementById('success-style')) {
                    const successStyle = document.createElement('style');
                    successStyle.id = 'success-style';
                    successStyle.textContent = `
                        @keyframes fadeInScale {
                            from {
                                opacity: 0;
                                transform: scale(0.9);
                            }
                            to {
                                opacity: 1;
                                transform: scale(1);
                            }
                        }
                    `;
                    document.head.appendChild(successStyle);
                }
            } else {
                let errorMessage = 'Ukjent feil';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    errorMessage = 'Kunne ikke behandle svar fra serveren';
                }
                
                showErrorMessage('Noe gikk galt. Prøv igjen senere. (' + errorMessage + ')');
                button.innerHTML = originalText;
                button.disabled = false;
            }
        } catch (error) {
            showErrorMessage('Kunne ikke sende meldingen. Sjekk nettverkstilkoblingen din og prøv igjen.');
            button.innerHTML = originalText;
            button.disabled = false;
        }
    });
}

// --- PREMIUM ERROR MESSAGE ---
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
        color: white;
        padding: 16px 32px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(239, 68, 68, 0.4);
        z-index: 10000;
        animation: slideDown 0.4s ease-out, slideUp 0.4s ease-in 3s forwards;
        font-weight: 600;
        max-width: 90%;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    // Add animation styles
    if (!document.getElementById('error-animation-style')) {
        const animStyle = document.createElement('style');
        animStyle.id = 'error-animation-style';
        animStyle.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
            @keyframes slideUp {
                to {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
            }
        `;
        document.head.appendChild(animStyle);
    }

    // Remove after animation
    setTimeout(() => {
        errorDiv.remove();
    }, 3500);
}

// --- SMOOTH HOVER EFFECTS FOR CARDS ---
const cards = document.querySelectorAll('.service-card, .project-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        // Only apply on desktop
        if (window.innerWidth > 768) {
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
        }
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// --- ADD CLICK RIPPLE EFFECT TO BUTTONS ---
const buttons = document.querySelectorAll('.cta-button, .submit-btn');

buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: rippleEffect 0.6s ease-out;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        // Add ripple animation
        if (!document.getElementById('ripple-style')) {
            const rippleStyle = document.createElement('style');
            rippleStyle.id = 'ripple-style';
            rippleStyle.textContent = `
                @keyframes rippleEffect {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(rippleStyle);
        }

        setTimeout(() => ripple.remove(), 600);
    });
});

// --- PRELOAD IMAGES FOR BETTER PERFORMANCE ---
window.addEventListener('load', () => {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
    });
});

// --- PERFORMANCE: Debounce scroll events ---
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

// --- SCROLL TO TOP BUTTON ---
const scrollTopBtn = document.getElementById('scrollTopBtn');

if (scrollTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top when clicked
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// --- CONSOLE BRANDING ---
console.log(
    '%c🚀 WebKlar ',
    'background: linear-gradient(135deg, #5B8DBE 0%, #4A7AA8 100%); color: white; padding: 12px 20px; border-radius: 8px; font-size: 16px; font-weight: bold;'
);
console.log(
    '%cModerne nettsider som leverer resultater ✨',
    'color: #5B8DBE; font-size: 14px; font-weight: 600; margin-top: 8px;'
);

// --- LOADING ANIMATION (Optional) ---
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Log initialization
console.log('✅ WebKlar Premium scripts initialized');
