// Create animated background particles
function createParticles() {
    const particleCount = 15;
    const body = document.body;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 100 + 50;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';

        body.appendChild(particle);
    }
}

// Add ripple effect on button click
function createRipple(event) {
    const button = event.currentTarget;
    const box = button.closest('.box');

    const ripple = document.createElement('span');
    ripple.className = 'ripple';

    const rect = box.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = event.clientX - rect.left - size / 2 + 'px';
    ripple.style.top = event.clientY - rect.top - size / 2 + 'px';

    box.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

// Add 3D tilt effect on mouse move
function handleMouseMove(event) {
    const boxes = document.querySelectorAll('.box');

    boxes.forEach(box => {
        const rect = box.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        if (box.matches(':hover')) {
            box.style.transform = `translateY(-15px) scale(1.05) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
    });
}

// Reset transform on mouse leave
function handleMouseLeave(event) {
    event.currentTarget.style.transform = '';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createParticles();

    const buttons = document.querySelectorAll('input[type="submit"]');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });

    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
        box.addEventListener('mousemove', handleMouseMove);
        box.addEventListener('mouseleave', handleMouseLeave);
    });
});