// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    // Throttle function for better performance
    function throttle(func, wait) {
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

    // Handle scroll events
    function handleScroll() {
        const scrolled = window.pageYOffset;
        const threshold = 50;

        // Change navbar appearance on scroll
        if (scrolled > threshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active navigation link based on scroll position
        updateActiveNavLink();
    }

    // Update active navigation link
    function updateActiveNavLink() {
        const scrollPos = window.pageYOffset + 100;

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current section link
                const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    // Smooth scroll to section
    function smoothScrollTo(targetId) {
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    // Handle navigation link clicks
    function handleNavLinkClick(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('data-section');
        
        // Close mobile menu if open
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        
        // Smooth scroll to section
        smoothScrollTo(targetId);
        
        // Update active link
        navLinks.forEach(link => link.classList.remove('active'));
        this.classList.add('active');
    }

    // Toggle mobile menu
    function toggleMobileMenu() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    // Close mobile menu when clicking outside
    function closeMobileMenuOnOutsideClick(e) {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // Enhanced hover effects for navigation links
    function addHoverEffects() {
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            link.addEventListener('mouseleave', function() {
                if (!this.classList.contains('active')) {
                    this.style.transform = 'translateY(0)';
                }
            });
        });
    }

    // Add floating animation to CTA buttons
    function addButtonAnimations() {
        const ctaButtons = document.querySelectorAll('.cta-button');
        
        ctaButtons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.05)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
            
            button.addEventListener('mousedown', function() {
                this.style.transform = 'translateY(-1px) scale(1.02)';
            });
            
            button.addEventListener('mouseup', function() {
                this.style.transform = 'translateY(-3px) scale(1.05)';
            });
        });
    }

    // Add parallax effect to sections
    function addParallaxEffect() {
        const parallaxElements = document.querySelectorAll('.hero-content, .section-title');
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach((element, index) => {
                const rate = scrolled * -0.5;
                const section = element.closest('.section');
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrolled + window.innerHeight > sectionTop && scrolled < sectionTop + sectionHeight) {
                    element.style.transform = `translateY(${rate * 0.1}px)`;
                }
            });
        }
        
        window.addEventListener('scroll', throttle(updateParallax, 10));
    }

    // Add intersection observer for fade-in animations
    function addScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe service cards and other elements
        const animatedElements = document.querySelectorAll('.service-card, .section-text');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // Initialize all functionality
    function init() {
        // Add event listeners
        window.addEventListener('scroll', throttle(handleScroll, 10));
        navToggle.addEventListener('click', toggleMobileMenu);
        document.addEventListener('click', closeMobileMenuOnOutsideClick);
        
        // Add click listeners to navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavLinkClick);
        });
        
        // Initialize enhancements
        addHoverEffects();
        addButtonAnimations();
        addParallaxEffect();
        addScrollAnimations();
        
        // Set initial state
        handleScroll();
        updateActiveNavLink();
    }

    // Handle window resize
    function handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    window.addEventListener('resize', throttle(handleResize, 100));

    // Start the application
    init();

    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Press 'Escape' to close mobile menu
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Add touch support for mobile hover effects
    if ('ontouchstart' in window) {
        navLinks.forEach(link => {
            link.addEventListener('touchstart', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            link.addEventListener('touchend', function() {
                setTimeout(() => {
                    if (!this.classList.contains('active')) {
                        this.style.transform = 'translateY(0)';
                    }
                }, 100);
            });
        });
    }
});