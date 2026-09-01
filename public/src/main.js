// @helix:story USER-791000
// Small page-level enhancements shared across the landing page.
document.addEventListener("DOMContentLoaded", () => {
    const yearEl = document.getElementById("current-year");
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }
});