document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('vhs-bg');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    const trail = [];
    const maxTrailLength = 20;
    const trailSmoothing = 0.2;

    document.addEventListener('mousemove', function(event) {
        const targetX = event.clientX;
        const targetY = event.clientY;

        mouseX += (targetX - mouseX) * trailSmoothing;
        mouseY += (targetY - mouseY) * trailSmoothing;
    });

    function drawBackground() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const time = new Date().getTime() * 0.005;
        const circleRadius = 250;
        const centerX = canvas.width / 2 + Math.sin(time) * 200;
        const centerY = canvas.height / 2 + Math.cos(time) * 200;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
        ctx.fill();

        drawGrid();

        drawCursorTrail();
        requestAnimationFrame(drawBackground);
    }

    function drawGrid() {
        const lineCount = 20;
        const spacing = canvas.width / lineCount;

        ctx.strokeStyle = '#ff99cc';
        ctx.lineWidth = 1;

        for (let i = 0; i < lineCount; i++) {
            let x = i * spacing;
            let y = i * spacing;

            let dx = mouseX - x;
            let dy = mouseY - y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            let maxDist = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
            let distortion = (maxDist - dist) / maxDist * 50;

            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.quadraticCurveTo(x + distortion, mouseY, x, canvas.height);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.quadraticCurveTo(mouseX, y + distortion, canvas.width, y);
            ctx.stroke();
        }
    }

    function drawCursorTrail() {
        trail.push({ x: mouseX, y: mouseY });
        if (trail.length > maxTrailLength) {
            trail.shift();
        }

        ctx.save();
        ctx.globalCompositeOperation = 'difference';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) {
            ctx.lineTo(trail[i].x, trail[i].y);
        }
        ctx.stroke();
        ctx.restore();
    }

    drawBackground();

    const body = document.body;
    setInterval(() => {
        const hueShift = Math.random() * 10 - 5;
        body.style.filter = `contrast(${100 + Math.random() * 10}%) brightness(${100 + Math.random() * 10}%) hue-rotate(${hueShift}deg)`;
    }, 300);

    const phrases = [
        "monstre au boulevard de mes deux hanches",
        "qu'est-ce qui change cette fois devant la glace?",
        "une nouvelle douleur par semaine",
        "une nouvelle douleur par quart d'heure",
        "le cœur ouvert quand le ciel se ferme",
        "tu es le seul ange que je n'arriverai jamais à tuer"
    ];

    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    document.getElementById("random-text").innerText = randomPhrase;
});
