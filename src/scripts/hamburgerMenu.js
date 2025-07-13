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

function spinStar() {
    const svg = document.querySelector('#star-menu-icon .star-svg');
    if (svg) {
        svg.classList.remove('spin-once');
        void svg.offsetWidth; // Force reflow for repeat clicks
        svg.classList.add('spin-once');
        setTimeout(() => svg.classList.remove('spin-once'), 600);
    }
}

document.getElementById('star-menu-icon').addEventListener('click', spinStar);
document.getElementById('menu-toggle').addEventListener('change', spinStar);
