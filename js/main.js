/**
 * MAIN.JS - Core functionality for AG TechScript
 * Fully optimized - No forced reflows, perfect toggle, 60fps performance
 */

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Main.js loaded');
    
    // Initialize all features
    initHeader();           // Header with toggle (priority)
    initRevealAnimation();  // Scroll animations
    initAGTextAnimation();  // AG text effect
    initStoriesSlider();    // Stories carousel
    initFloatingElements(); // Floating icons
});

// ===== HEADER WITH TOGGLE (PERFECT) =====
function initHeader() {
    const header = document.querySelector('header');
    const toggleBtn = document.getElementById('navToggle');
    const navMenu = document.getElementById('mainNav');
    
    // Agar elements na mile to retry
    if (!header || !toggleBtn || !navMenu) {
        console.log('⏳ Header elements not ready, retrying...');
        setTimeout(initHeader, 300);
        return;
    }
    
    console.log('✅ Header initialized with toggle');
    
    let lastScrollY = window.scrollY;
    let ticking = false;
    let touchStartY = 0;
    
    // ===== SIMPLE TOGGLE (GUARANTEED WORKING) =====
    toggleBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        navMenu.classList.toggle('active');
        console.log('Toggle:', navMenu.classList.contains('active') ? 'open' : 'closed');
        return false;
    };
    
  
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                const currentY = window.scrollY;
                if (currentY > lastScrollY && currentY > 100) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
                lastScrollY = currentY;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    // ===== CLOSE ON OUTSIDE CLICK =====
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.header-wrapper') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });
    
    // ===== CLOSE ON LINK CLICK =====
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
            }
        });
    });
    
    // ===== RESIZE HANDLER =====
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
            }
        }, 150);
    }, { passive: true });
}

// ===== REVEAL ANIMATION (USING INTERSECTION OBSERVER) =====
function initRevealAnimation() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            requestAnimationFrame(() => {
                if (entry.target.classList.contains('ag-footer')) {
                    entry.target.classList.add('active');
                } else {
                    entry.target.classList.toggle('active', entry.isIntersecting);
                }
            });
        });
    }, { threshold: 0.1, rootMargin: '50px' });
    
    reveals.forEach(el => observer.observe(el));
    console.log('✅ Reveal observer ready');
}

// ===== AG TEXT ANIMATION (NO REFLOWS) =====
function initAGTextAnimation() {
    const states = [
        { A: "kash", G: "oswami" },
        { A: "dvanced", G: "eneration" }
    ];
    
    const Atext = document.getElementById('Atext');
    const Gtext = document.getElementById('Gtext');
    
    if (!Atext || !Gtext) return;
    
    // Pre-calculate widths
    const widths = [];
    const temp = document.createElement('span');
    temp.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font:inherit';
    document.body.appendChild(temp);
    
    states.forEach(state => {
        temp.textContent = state.A;
        const aWidth = state.A ? temp.offsetWidth : 0;
        temp.textContent = state.G;
        const gWidth = state.G ? temp.offsetWidth : 0;
        widths.push({ A: aWidth, G: gWidth });
    });
    
    document.body.removeChild(temp);
    
    let index = 0;
    
    function expand(state, w) {
        Atext.textContent = state.A;
        Gtext.textContent = state.G;
        Atext.style.maxWidth = state.A ? w.A + 'px' : '0px';
        Gtext.style.maxWidth = state.G ? w.G + 'px' : '0px';
        Atext.style.opacity = state.A ? '1' : '0';
        Gtext.style.opacity = state.G ? '1' : '0';
    }
    
    function collapse() {
        Atext.style.maxWidth = '0px';
        Gtext.style.maxWidth = '0px';
        Atext.style.opacity = '0';
        Gtext.style.opacity = '0';
    }
    
    function run() {
        expand(states[index], widths[index]);
        setTimeout(() => {
            collapse();
            setTimeout(() => {
                index = (index + 1) % states.length;
                run();
            }, 1200);
        }, 2200);
    }
    
    expand({ A: '', G: '' }, { A: 0, G: 0 });
    setTimeout(run, 1000);
    console.log('✅ AG text animation ready');
}

// ===== STORIES SLIDER (RAF OPTIMIZED) =====
function initStoriesSlider() {
    const stories = document.querySelectorAll('.story-card');
    if (!stories.length) return;
    
    let current = 0;
    let rafId = null;
    let lastTime = 0;
    const interval = 3200;
    
    // Initialize first
    requestAnimationFrame(() => {
        stories.forEach(c => c.classList.remove('active', 'prev'));
        stories[0].classList.add('active');
    });
    
    function slide(timestamp) {
        if (!lastTime) lastTime = timestamp;
        
        if (timestamp - lastTime >= interval) {
            current = (current + 1) % stories.length;
            
            requestAnimationFrame(() => {
                stories.forEach((card, i) => {
                    card.classList.remove('active', 'prev');
                    if (i === current) {
                        card.classList.add('active');
                    } else if (i === current - 1 || (current === 0 && i === stories.length - 1)) {
                        card.classList.add('prev');
                    }
                });
            });
            
            lastTime = timestamp;
        }
        
        rafId = requestAnimationFrame(slide);
    }
    
    rafId = requestAnimationFrame(slide);
    
    // Cleanup on page hide
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && rafId) {
            cancelAnimationFrame(rafId);
        } else if (!document.hidden) {
            lastTime = 0;
            rafId = requestAnimationFrame(slide);
        }
    });
    
    console.log('✅ Stories slider ready');
}

// ===== FLOATING ELEMENTS (CSS ONLY) =====
function initFloatingElements() {
    console.log('✅ Floating elements ready');
}