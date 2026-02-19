/** ================================
 *   AG TECHSCRIPT • MAIN.JS (FINAL)
 *   Fully Optimized • Include Ready
 * =================================
*/

// MAIN INIT ON DOM READY
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Main.js Loaded");

    initRevealAnimation();
    initAGTextAnimation();
    initStoriesSlider();
    initFloatingElements();
});

/* ========================================
   1️⃣ HEADER + MOBILE TOGGLE + SCROLL HIDE
======================================== */
function initHeader() {
    const navToggle = document.getElementById("navToggle");
    const mainNav = document.getElementById("mainNav");
    const customHeader = document.getElementById("header");

    if (!navToggle || !mainNav || !customHeader) {
        console.warn("⏳ Header not found. Retrying...");
        setTimeout(initHeader, 300);
        return;
    }

    console.log("✅ Header Ready");

    let lastScrollY = window.scrollY;
    let ticking = false;
    let touchStartY = 0;
    let touchEndY = 0;
    const swipeThreshold = 50;

    // MOBILE TOGGLE
    navToggle.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        mainNav.classList.toggle("active");
    });

    // SCROLL HIDE/SHOW
    function updateHeader() {
        const sy = window.scrollY;

        if (sy > lastScrollY && sy > 100) {
            customHeader.style.transform = "translateY(-100%)";
        } else {
            customHeader.style.transform = "translateY(0)";
        }

        lastScrollY = sy;
        ticking = false;
    }

    window.addEventListener(
        "scroll",
        () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        },
        { passive: true }
    );

    // SWIPE GESTURE
    document.addEventListener("touchstart", (e) => {
        touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener("touchend", (e) => {
        touchEndY = e.changedTouches[0].screenY;
        const diff = touchEndY - touchStartY;

        if (diff > swipeThreshold)
            customHeader.style.transform = "translateY(0)";
        if (diff < -swipeThreshold)
            customHeader.style.transform = "translateY(-100%)";
    });

    // CLOSE ON OUTSIDE CLICK
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".header-wrapper")) {
            mainNav.classList.remove("active");
        }
    });

    // CLOSE MENU ON NAV LINK CLICK (MOBILE)
    document.querySelectorAll(".nav-menu a").forEach((link) => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 768) {
                mainNav.classList.remove("active");
            }
        });
    });

    // SPACEBAR SHORTCUT
    document.addEventListener("keydown", (e) => {
        if (
            e.code === "Space" &&
            !e.target.matches("input, textarea, button, a")
        ) {
            e.preventDefault();
            customHeader.style.transform =
                customHeader.style.transform === "translateY(-100%)"
                    ? "translateY(0)"
                    : "translateY(-100%)";
        }
    });
}

/* ========================================
   2️⃣ REVEAL ANIMATION
======================================== */
function initRevealAnimation() {
    const reveals = document.querySelectorAll(".reveal");
    if (!reveals.length) return;

    function reveal() {
        const windowH = window.innerHeight;

        reveals.forEach((el) => {
            const rect = el.getBoundingClientRect();
            const offset = el.classList.contains("ag-footer") ? 50 : 150;

            if (rect.top < windowH - offset && rect.bottom > offset) {
                el.classList.add("active");
            } else {
                el.classList.remove("active");
            }
        });
    }

    window.addEventListener("scroll", reveal);
    window.addEventListener("resize", reveal);
    reveal();
}

/* ========================================
   3️⃣ AG TEXT ANIMATION (BUGLESS)
======================================== */
function initAGTextAnimation() {
    const Atext = document.getElementById("Atext");
    const Gtext = document.getElementById("Gtext");

    if (!Atext || !Gtext) return;

    const states = [
        { A: "kash", G: "oswami" }, // Akash Goswami
        { A: "dvanced", G: "eneration" }, // Advanced Generation
    ];

    let i = 0;

    function expand(A, G) {
        Atext.textContent = A;
        Gtext.textContent = G;

        Atext.style.maxWidth = A ? Atext.scrollWidth + "px" : "0px";
        Gtext.style.maxWidth = G ? Gtext.scrollWidth + "px" : "0px";

        Atext.style.opacity = A ? "1" : "0";
        Gtext.style.opacity = G ? "1" : "0";
    }

    function collapse() {
        Atext.style.maxWidth = Atext.scrollWidth + "px";
        Gtext.style.maxWidth = Gtext.scrollWidth + "px";

        Atext.getBoundingClientRect();
        Gtext.getBoundingClientRect();

        Atext.style.maxWidth = "0px";
        Gtext.style.maxWidth = "0px";
        Atext.style.opacity = "0";
        Gtext.style.opacity = "0";
    }

    function run() {
        const s = states[i];

        expand(s.A, s.G);

        setTimeout(() => {
            collapse();
            setTimeout(() => {
                i = (i + 1) % states.length;
                run();
            }, 1200);
        }, 2200);
    }

    expand("", "");
    setTimeout(run, 1000);
}

/* ========================================
   4️⃣ STORIES SLIDER
======================================== */
function initStoriesSlider() {
    const stories = document.querySelectorAll(".story-card");
    if (!stories.length) return;

    let index = 0;

    function show(i) {
        stories.forEach((el, idx) => {
            el.classList.remove("active", "prev");
            if (idx === i) el.classList.add("active");
            else if (idx === i - 1 || (i === 0 && idx === stories.length - 1))
                el.classList.add("prev");
        });
    }

    show(index);

    setInterval(() => {
        index = (index + 1) % stories.length;
        show(index);
    }, 3200);
}

/* ========================================
   5️⃣ FLOATING ELEMENTS (CSS-Controlled)
======================================== */
function initFloatingElements() {
    console.log("Floating elements ready");
}

/* ========================================
   6️⃣ ENCRYPTED GOOGLE SHEET URL (Optional)
======================================== */
function getEncryptedSheetURL() {
    const encrypted = "12LdHpXyaV32tc4gZaDz8yawfsvSv_sA1-tlx0tzmHvc";
    let decrypted = "";

    for (let i = 0; i < encrypted.length; i++) {
        decrypted += String.fromCharCode(encrypted.charCodeAt(i) - 1);
    }

    return `https://docs.google.com/spreadsheets/d/${decrypted}/gviz/tq?tqx=out:json`;
}
