const canvas = document.getElementById('leaves-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const LEAF_COUNT = 4;
const leaves = [];

function randomColor() {
    // 96% green, 4% rare colors (10x rarer)
    const greens = [
        '#228B22', '#2E8B57', '#006400', '#32CD32', '#7CFC00', '#3CB371',
        '#90EE90', '#98FB98', '#00FF7F', '#00FA9A', '#66CDAA', '#8FBC8F',
        '#20B2AA', '#3CB371', '#2E8B57',
    ];
    const rares = [
        '#FFA500', // orange
        '#FF4500', // red-orange
        '#FF6347', // red
        '#FF69B4', // pink
    ];
    return Math.random() < 0.96
        ? greens[Math.floor(Math.random() * greens.length)]
        : rares[Math.floor(Math.random() * rares.length)];
}

function createLeaf() {
    // Add shape variation: 0 = classic, 1 = oval, 2 = jagged
    const shapeType = Math.floor(Math.random() * 3);
    // Make leaves 4 times smaller
    const width = (15 + Math.random() * 35) / 4;
    const height = (20 + Math.random() * 40) / 4;
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,
        width,
        height,
        size: Math.max(width, height), // for off-screen check
        speedY: 1 + Math.random() * 2,
        speedX: Math.random() * 1.5 - 0.75,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.02,
        sway: Math.random() * 2 + 1,
        swayPhase: Math.random() * Math.PI * 2,
        color: randomColor(),
        shapeType,
    };
}

function drawLeaf(leaf) {
    ctx.save();
    ctx.translate(leaf.x, leaf.y);
    ctx.rotate(leaf.angle);
    ctx.beginPath();
    if (leaf.shapeType === 0) {
        // Classic leaf (bezier)
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
            -leaf.width / 2, -leaf.height / 2,
            leaf.width / 2, -leaf.height / 2,
            0, leaf.height
        );
    } else if (leaf.shapeType === 1) {
        // Thinner, sharper oval leaf
        ctx.ellipse(
            0, leaf.height / 2,           // center
            leaf.width / 3, leaf.height / 2, // width much smaller for thinness
            0, 0, Math.PI * 2
        );
    } else {
        // Jagged leaf (more leaf-like, with pointed tip and base)
        const points = 7;
        ctx.moveTo(0, leaf.height); // base
        for (let i = 1; i < points; i++) {
            const angle = Math.PI * (i / (points - 1));
            // Make the tip sharper and sides jagged
            const r = (i % 2 === 0)
                ? leaf.width / 2
                : leaf.width / 2.5;
            const x = Math.cos(angle - Math.PI / 2) * r;
            const y = Math.sin(angle - Math.PI / 2) * leaf.height;
            ctx.lineTo(x, y);
        }
        ctx.lineTo(0, leaf.height); // close at base
    }
    ctx.closePath();
    ctx.fillStyle = leaf.color;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.restore();
}

function updateLeaf(leaf) {
    leaf.y += leaf.speedY;
    leaf.x += leaf.speedX + Math.sin(leaf.swayPhase + leaf.y / 50) * leaf.sway;
    leaf.angle += leaf.angularSpeed;
    if (leaf.y > canvas.height + leaf.size) {
        Object.assign(leaf, createLeaf());
        leaf.y = -leaf.size;
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const leaf of leaves) {
        updateLeaf(leaf);
        drawLeaf(leaf);
    }
    requestAnimationFrame(animate);
}

// Initialize leaves
for (let i = 0; i < LEAF_COUNT; i++) {
    leaves.push(createLeaf());
}

animate();

// Optional: handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});