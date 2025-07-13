const starsCanvas = document.getElementById('stars-canvas');
const starsCtx = starsCanvas.getContext('2d');

function resizeStarsCanvas() {
    starsCanvas.width = window.innerWidth;
    starsCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeStarsCanvas);
resizeStarsCanvas();

const STAR_COUNT = 40;
const stars = [];

for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
        x: Math.random() * starsCanvas.width,
        y: Math.random() * starsCanvas.height,
        radius: Math.random() * 1.2 + 0.3,
        glow: 0,
        glowTarget: 0,
        glowSpeed: Math.random() * 0.01 + 0.002,
        // Make glow 5x rarer and 10x less frequent
        nextGlow: Math.random() * 60000 + 20000 // 20-80 seconds
    });
}

function animateStars() {
    starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);

    for (const star of stars) {
        // Glow logic
        if (star.nextGlow <= 0 && star.glowTarget === 0) {
            // 5x rarer: only 1 in 5 chance to glow when timer hits
            if (Math.random() < 0.2) {
                star.glowTarget = 1;
            } else {
                star.nextGlow = Math.random() * 60000 + 20000;
            }
        }
        if (star.glowTarget === 1) {
            star.glow += star.glowSpeed;
            if (star.glow >= 1) {
                star.glow = 1;
                star.glowTarget = 2;
            }
        } else if (star.glowTarget === 2) {
            star.glow -= star.glowSpeed;
            if (star.glow <= 0) {
                star.glow = 0;
                star.glowTarget = 0;
                star.nextGlow = Math.random() * 60000 + 20000;
            }
        } else {
            star.nextGlow -= 16;
        }

        starsCtx.save();
        starsCtx.globalAlpha = 0.7 + star.glow * 0.7;
        starsCtx.shadowColor = "#fff";
        starsCtx.shadowBlur = star.glow * 16;
        starsCtx.beginPath();
        starsCtx.arc(star.x, star.y, star.radius + star.glow * 2, 0, Math.PI * 2);
        starsCtx.fillStyle = "#fff";
        starsCtx.fill();
        starsCtx.restore();
    }

    requestAnimationFrame(animateStars);
}
animateStars();