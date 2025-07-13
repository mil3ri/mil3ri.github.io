document.addEventListener('keydown', function(e) {
    const menuToggle = document.getElementById('menu-toggle');
    const menuLinks = Array.from(document.querySelectorAll('.menu-link'));
    const isMenuOpen = menuToggle && menuToggle.checked;

    // Open menu with Enter if not open
    if (e.key === 'Enter' && !isMenuOpen) {
        menuToggle.checked = true;
        // Focus first menu link
        if (menuLinks.length) menuLinks[0].focus();
        e.preventDefault();
        return;
    }

    // If menu is open, handle arrow navigation
    if (isMenuOpen) {
        const focused = document.activeElement;
        let idx = menuLinks.indexOf(focused);

        if (e.key === 'ArrowDown') {
            idx = (idx + 1) % menuLinks.length;
            menuLinks[idx].focus();
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            idx = (idx - 1 + menuLinks.length) % menuLinks.length;
            menuLinks[idx].focus();
            e.preventDefault();
        } else if (e.key === 'Escape') {
            menuToggle.checked = false;
            document.body.focus(); // Restore focus to body
            e.preventDefault();
        }
        // Prevent page scroll when menu is open
        return;
    }

    // Page scroll controls when menu is closed
    const scrollAmount = 80;
    switch (e.key) {
        case 'ArrowDown':
        case 's':
        case 'S':
            window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
            break;
        case 'ArrowUp':
        case 'w':
        case 'W':
            window.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
            break;
        case 'PageDown':
            window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
            break;
        case 'PageUp':
            window.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
            break;
        case 'Home':
            window.scrollTo({ top: 0, behavior: 'smooth' });
            break;
        case 'End':
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            break;
    }
});

// Ensure body is focused on load for keyboard scroll controls
window.addEventListener('DOMContentLoaded', () => {
    document.body.focus();
});

// Restore focus to body when menu closes via mouse or other means
document.getElementById('menu-toggle').addEventListener('change', function() {
    if (!this.checked) {
        document.body.focus();
    }
});