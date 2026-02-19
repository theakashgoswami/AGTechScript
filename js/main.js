/** ================================
 *   AG TECHSCRIPT • MAIN.JS
 *   Ultra-Optimized – No Reflow – 60fps
 * ================================= */
document.addEventListener("DOMContentLoaded", () => {

    // Header will load via include → so wait for it
    loadHeaderFooter().then(() => {
        initHeader();
    });

    initRevealAnimation();
    initAGTextAnimation();
    initStoriesSlider();
    initFloatingElements();
});


/* ============================
   HEADER + MOBILE TOGGLE
============================ */
function initHeader() {
    const header = document.querySelector("header");
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("mainNav");

    if (!header || !navToggle || !navMenu) {
        console.warn("Header not loaded yet… retrying");
        setTimeout(initHeader, 200);
        return;
    }

    let lastScroll = window.scrollY;
    let ticking = false;

    // Toggle
    navToggle.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        navMenu.classList.toggle("active");
    });

    // Hide/show on scroll
    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const y = window.scrollY;
                if (y > lastScroll && y > 100) {
                    header.classList.add("header-hidden");
                } else {
                    header.classList.remove("header-hidden");
                }
                lastScroll = y;
                ticking = false;
            });
            ticking = true;
        }
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".header-wrapper") && navMenu.classList.contains("active")) {
            navMenu.classList.remove("active");
        }
    });

    // Close on link click (mobile)
    document.querySelectorAll(".nav-menu a").forEach(link => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 768) navMenu.classList.remove("active");
        });
    });

    // Close on resize
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) navMenu.classList.remove("active");
    });
}


/* ==============================================
   HEADER / FOOTER AUTO INCLUDE (GLOBAL)
============================================== */
function loadHeaderFooter() {
    return new Promise((resolve) => {
        // Header Load
        fetch("/header.html")
            .then(r => r.text())
            .then(html => {
                const div = document.getElementById("header-include");
                if (div) div.innerHTML = html;
            })
            .then(() => {
                // Footer Load
                return fetch("/footer.html");
            })
            .then(r => r.text())
            .then(html => {
                const f = document.getElementById("footer-include");
                if (f) f.innerHTML = html;
                resolve();
            });
    });
}


/* =============================================
   REVEAL ANIMATION (IntersectionObserver)
============================================= */
function initRevealAnimation() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) e.target.classList.add("active");
        });
    }, { threshold: 0.2 });

    items.forEach(i => observer.observe(i));
}


/* =============================================
    AG TEXT ANIMATION (MINIFY-PROOF)
============================================= */
function initAGTextAnimation() {
    const states = [
        { A: "kash", G: "oswami" },
        { A: "dvanced", G: "eneration" }
    ];

    const A = document.getElementById("Atext");
    const G = document.getElementById("Gtext");

    if (!A || !G) return;

    let widths = [];
    const temp = document.createElement("span");
    temp.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;font:inherit";
    document.body.appendChild(temp);

    states.forEach(s => {
        temp.textContent = s.A;
        let wA = temp.offsetWidth;
        temp.textContent = s.G;
        let wG = temp.offsetWidth;
        widths.push({ A: wA, G: wG });
    });

    document.body.removeChild(temp);

    let i = 0;

    function expand(s, w) {
        A.textContent = s.A;
        G.textContent = s.G;

        A.style.setProperty("max-width", w.A + "px");
        G.style.setProperty("max-width", w.G + "px");
        A.style.opacity = "1";
        G.style.opacity = "1";
    }

    function collapse() {
        A.style.setProperty("max-width", "0px");
        G.style.setProperty("max-width", "0px");
        A.style.opacity = "0";
        G.style.opacity = "0";
    }

    function loop() {
        expand(states[i], widths[i]);

        setTimeout(() => {
            collapse();
            setTimeout(() => {
                i = (i + 1) % states.length;
                loop();
            }, 1200);
        }, 2200);
    }

    collapse();
    setTimeout(loop, 1000);
}


/* =============================================
    STORIES SLIDER
============================================= */
function initStoriesSlider() {
    const cards = document.querySelectorAll(".story-card");
    if (!cards.length) return;

    let i = 0;
    let last = 0;
    const interval = 3200;

    function loop(time) {
        if (!last) last = time;

        if (time - last >= interval) {
            let prev = i;
            i = (i + 1) % cards.length;

            cards.forEach((c, idx) => {
                c.classList.remove("active", "prev");
                if (idx === i) c.classList.add("active");
                if (idx === prev) c.classList.add("prev");
            });

            last = time;
        }
        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}


/* =============================================
    FLOATING ELEMENTS
============================================= */
function initFloatingElements() {
    console.log("Floating elements loaded");
}
