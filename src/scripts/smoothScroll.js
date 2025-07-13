// Smooth scroll for menu links
document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
        document.getElementById('menu-toggle').checked = false; // Close the menu
    });
});