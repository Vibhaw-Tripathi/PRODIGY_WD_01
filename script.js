
document.addEventListener('DOMContentLoaded', function() {
    
    const navbar = document.getElementById('navbar');
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const body = document.body;
    
    
    let isScrolling = false;
    let currentScrollStage = 1;
    let isMenuOpen = false;
    
  
    const scrollThresholds = {
        stage1: 0,
        stage2: 0.2,
        stage3: 0.4,
        stage4: 0.6,
        stage5: 0.8
    };
    
    
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
  
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
    
   
    function getScrollPercentage() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        return Math.min(scrollTop / scrollHeight, 1);
    }
    
   
    function updateScrollEffects() {
        const scrollPercentage = getScrollPercentage();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        
        body.classList.remove('scroll-stage-1', 'scroll-stage-2', 'scroll-stage-3', 'scroll-stage-4', 'scroll-stage-5');
        navbar.classList.remove('scrolled-stage-1', 'scrolled-stage-2', 'scrolled-stage-3', 'scrolled-stage-4', 'scrolled-stage-5');
        
        
        let newStage = 1;
        if (scrollPercentage >= scrollThresholds.stage5) {
            newStage = 5;
        } else if (scrollPercentage >= scrollThresholds.stage4) {
            newStage = 4;
        } else if (scrollPercentage >= scrollThresholds.stage3) {
            newStage = 3;
        } else if (scrollPercentage >= scrollThresholds.stage2) {
            newStage = 2;
        } else {
            newStage = 1;
        }
        
       
        body.classList.add(`scroll-stage-${newStage}`);
        
        
        if (scrollTop > 50) {
            navbar.classList.add(`scrolled-stage-${newStage}`);
        }
        
       
        currentScrollStage = newStage;
        
       
        updateColorIndicators(newStage);
    }
    
   
    function updateColorIndicators(stage) {
        const colorIndicators = document.querySelectorAll('.color-indicator');
        colorIndicators.forEach((indicator, index) => {
            if (index + 1 === stage) {
                indicator.style.transform = 'scale(1.2)';
                indicator.style.opacity = '1';
            } else {
                indicator.style.transform = 'scale(1)';
                indicator.style.opacity = '0.7';
            }
        });
    }
    
   
    function scrollToSection(targetId) {
        const target = document.querySelector(targetId);
        if (target) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    
    function handleNavLinkClick(e) {
        const href = e.target.getAttribute('href');
        
       
        if (href && href.startsWith('#')) {
            e.preventDefault();
            scrollToSection(href);
            
            
            if (isMenuOpen) {
                toggleMobileMenu();
            }
        }
    }
    
   
    function addRippleEffect(e) {
        const link = e.currentTarget;
        const ripple = document.createElement('span');
        const rect = link.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
       
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleAnimation 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        
        link.style.position = 'relative';
        link.style.overflow = 'hidden';
        link.appendChild(ripple);
        
      
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
   
    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        
        
        const bars = hamburger.querySelectorAll('.bar');
        if (isMenuOpen) {
            bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        }
    }
    
    
    function handleResize() {
      
        if (window.innerWidth > 768 && isMenuOpen) {
            toggleMobileMenu();
        }
        
      
        updateScrollEffects();
    }
    
    
    function addDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rippleAnimation {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
            
            @keyframes fadeInOnScroll {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .fade-in-on-scroll {
                animation: fadeInOnScroll 0.8s ease-out;
            }
            
            .nav-link {
                position: relative;
                overflow: hidden;
            }
            
            .hamburger.active .bar:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }
            
            .hamburger.active .bar:nth-child(2) {
                opacity: 0;
            }
            
            .hamburger.active .bar:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }
        `;
        document.head.appendChild(style);
    }
    
   
    function initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-on-scroll');
                }
            });
        }, observerOptions);
        
        
        const observeElements = document.querySelectorAll('.feature-card, .tech-card, .contact-info, .contact-form');
        observeElements.forEach(el => observer.observe(el));
    }
    
    
    function initButtonEffects() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                this.style.setProperty('--mouse-x', x + 'px');
                this.style.setProperty('--mouse-y', y + 'px');
            });
            
            button.addEventListener('click', function(e) {
               
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const clickEffect = document.createElement('div');
                clickEffect.style.cssText = `
                    position: absolute;
                    left: ${x}px;
                    top: ${y}px;
                    width: 0;
                    height: 0;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.5);
                    transform: translate(-50%, -50%);
                    animation: buttonClickEffect 0.5s ease-out;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(clickEffect);
                
                setTimeout(() => {
                    if (clickEffect.parentNode) {
                        clickEffect.parentNode.removeChild(clickEffect);
                    }
                }, 500);
            });
        });
        
       
        const buttonStyle = document.createElement('style');
        buttonStyle.textContent = `
            @keyframes buttonClickEffect {
                to {
                    width: 200px;
                    height: 200px;
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(buttonStyle);
    }
    
    
    function initParallaxEffect() {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            const parallaxElements = heroSection.querySelectorAll('.hero-content, .scroll-indicator');
            
            const handleParallax = throttle(() => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                
                parallaxElements.forEach(element => {
                    element.style.transform = `translateY(${rate}px)`;
                });
            }, 16);
            
            window.addEventListener('scroll', handleParallax, { passive: true });
        }
    }
    
    
    function initEventListeners() {
       
        const throttledScrollHandler = throttle(updateScrollEffects, 16);
        window.addEventListener('scroll', throttledScrollHandler, { passive: true });
        
        
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavLinkClick);
            link.addEventListener('mousedown', addRippleEffect);
        });
        
      
        hamburger.addEventListener('click', toggleMobileMenu);
        
        
        const debouncedResizeHandler = debounce(handleResize, 250);
        window.addEventListener('resize', debouncedResizeHandler);
        
        
        const contactForm = document.querySelector('.contact-form form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                
                const successMessage = document.createElement('div');
                successMessage.textContent = 'Thank you for your message! (This is a demo)';
                successMessage.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(46, 204, 113, 0.9);
                    color: white;
                    padding: 1rem 2rem;
                    border-radius: 10px;
                    z-index: 10000;
                    animation: fadeInUp 0.5s ease-out;
                `;
                
                document.body.appendChild(successMessage);
                
                setTimeout(() => {
                    if (successMessage.parentNode) {
                        successMessage.parentNode.removeChild(successMessage);
                    }
                }, 3000);
                
                
                this.reset();
            });
        }
        
       
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isMenuOpen) {
                toggleMobileMenu();
            }
        });
    }
    
    
    function init() {
        console.log('🚀 Interactive Navigation Menu Initialized');
        
        
        addDynamicStyles();
        
        
        initEventListeners();
        initIntersectionObserver();
        initButtonEffects();
        initParallaxEffect();
        
        
        updateScrollEffects();
        
        
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);
        
        
        if (typeof performance !== 'undefined') {
            window.addEventListener('load', () => {
                const navTiming = performance.getEntriesByType('navigation')[0];
                if (navTiming) {
                    const loadTime = navTiming.loadEventEnd - navTiming.loadEventStart;
                    console.log(`📊 Page load time: ${loadTime.toFixed(2)}ms`);
                }
            });
        }
    }
    
   
    init();
    
   
    window.NavigationMenu = {
        scrollToSection,
        updateScrollEffects,
        getCurrentStage: () => currentScrollStage,
        getScrollPercentage
    };
});


window.addEventListener('load', function() {
    console.log('🎨 All resources loaded. Interactive navigation is ready!');
    
    
    const elementsToReveal = document.querySelectorAll('.hero-content > *, .feature-card, .tech-card');
    elementsToReveal.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
});


document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('👋 Page is now hidden');
    } else {
        console.log('👁️ Page is now visible');
      
        window.NavigationMenu?.updateScrollEffects();
    }
});


window.addEventListener('error', function(e) {
    console.error('❌ JavaScript Error:', e.error);
});


if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.entryType === 'measure') {
                console.log(`⏱️ Performance measure: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
            }
        });
    });
    
    observer.observe({ entryTypes: ['measure'] });
}
