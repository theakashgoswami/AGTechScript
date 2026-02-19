document.addEventListener("DOMContentLoaded", () => {

    // HEADER
    fetch("/partials/header.html")
    .then(r => r.text())
    .then(html => {
        document.getElementById("header-container").innerHTML = html;
        initHeader();
    });

    // CONTACT
    fetch("/partials/contact.html")
    .then(r => r.text())
    .then(html => document.getElementById("contact").innerHTML = html);

    // FOOTER
    fetch("/partials/footer.html")
    .then(r => r.text())
    .then(html => {
        document.getElementById("footer-container").innerHTML = html;
        const Y = document.getElementById("year");
        if (Y) Y.textContent = new Date().getFullYear();
    });

    // DARK MODE
    fetch("/partials/darkmode-toggle.html")
    .then(r => r.text())
    .then(html => {
        document.getElementById("dark-mode-toggle-container").innerHTML = html;
        initializeDarkMode();
    });

    // AI ASSISTANT
    fetch("/partials/ai-assistant.html")
    .then(r => r.text())
    .then(html => {
        document.getElementById("ai-assistant-container").innerHTML = html;
        initializeAIAssistant();
    });

});
