/**
 * SplashCursor.js - Smooth Cursor-Following Light Engine
 * Small, subtle purple/violet/magenta glowing light that smoothly follows the mouse.
 */

(function () {
    'use strict';

    if (window.__cursorGlowInitialized) return;
    window.__cursorGlowInitialized = true;

    // Inject Cursor Light Styles
    const style = document.createElement('style');
    style.textContent = `
        #cursor-glow-light {
            position: fixed;
            top: 0;
            left: 0;
            width: 70px;
            height: 70px;
            margin-top: -35px;
            margin-left: -35px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 999999;
            opacity: 0;
            will-change: transform, opacity;
            transition: opacity 0.3s ease;
            background: radial-gradient(
                circle at center,
                rgba(192, 132, 252, 0.55) 0%,
                rgba(168, 85, 247, 0.30) 32%,
                rgba(217, 70, 239, 0.15) 58%,
                transparent 72%
            );
            filter: blur(5px) brightness(1.35);
            mix-blend-mode: screen;
        }

        body.light-theme #cursor-glow-light {
            display: none !important;
        }

        #cursor-glow-light.is-hovering {
            background: radial-gradient(
                circle at center,
                rgba(192, 132, 252, 0.70) 0%,
                rgba(168, 85, 247, 0.40) 32%,
                rgba(217, 70, 239, 0.20) 58%,
                transparent 72%
            );
            filter: blur(5px) brightness(1.45);
        }
    `;
    document.head.appendChild(style);

    // Create Cursor Glow Element
    const glow = document.createElement('div');
    glow.id = 'cursor-glow-light';
    glow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(glow);

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let isVisible = false;
    let isHovering = false;

    // Smooth Lerp Loop via requestAnimationFrame
    function animate() {
        if (isVisible) {
            currentX += (mouseX - currentX) * 0.22;
            currentY += (mouseY - currentY) * 0.22;

            const scaleStr = isHovering ? 'scale(1.22)' : 'scale(1)';
            glow.style.transform =
                `translate3d(${currentX}px, ${currentY}px, 0) ${scaleStr}`;
        }

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    // Event Listeners
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isVisible) {
            isVisible = true;
            glow.style.opacity = '1';
        }

        // Subtle Hover Detection over Interactive Elements
        const target = e.target;

        if (
            target &&
            target.closest &&
            target.closest(
                'button, a, input, select, textarea, [role="button"], .card, .glass-card, .compact-contest-btn, .nav-tab'
            )
        ) {
            if (!isHovering) {
                isHovering = true;
                glow.classList.add('is-hovering');
            }
        } else {
            if (isHovering) {
                isHovering = false;
                glow.classList.remove('is-hovering');
            }
        }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        isVisible = false;
        glow.style.opacity = '0';
    });

    document.addEventListener('mouseenter', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        currentX = mouseX;
        currentY = mouseY;
        isVisible = true;
        glow.style.opacity = '1';
    });
})();