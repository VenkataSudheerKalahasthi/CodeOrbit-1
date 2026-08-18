/**
 * rocket.js - Ambient Futuristic Rocket Animation (First Viewport 100vh)
 * Renders a small, elegant rocket traveling from left edge (x=-60, y=70vh)
 * to top-right corner (x=100vw, y=8vh) with an orange/pink glowing particle fire trail.
 */

(function () {
    'use strict';

    class RocketAnimation {
        constructor() {
            this.canvas = document.getElementById('rocket-canvas');
            if (!this.canvas) return;

            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.progress = 0; // 0 to 1
            this.speed = 0.00012; // ~14s duration per flight
            this.isAnimating = false;
            this.lastTime = 0;

            this.init();
        }

        init() {
            this.resize();
            window.addEventListener('resize', () => this.resize());

            // Handle tab visibility to save CPU/battery
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.isAnimating = false;
                } else {
                    if (!this.isAnimating) {
                        this.isAnimating = true;
                        this.lastTime = performance.now();
                        requestAnimationFrame((t) => this.animate(t));
                    }
                }
            });

            this.isAnimating = true;
            this.lastTime = performance.now();
            requestAnimationFrame((t) => this.animate(t));
        }

        resize() {
            this.width = window.innerWidth;
            this.height = Math.min(window.innerHeight, 900); // Confined to first viewport height
            this.canvas.width = this.width;
            this.canvas.height = this.height;
        }

        // Cubic Bezier position
        getPoint(t) {
            const p0 = { x: -60, y: this.height * 0.70 };
            const p1 = { x: this.width * 0.35, y: this.height * 0.38 };
            const p2 = { x: this.width * 0.70, y: this.height * 0.22 };
            const p3 = { x: this.width + 60, y: this.height * 0.08 };

            const cx = 3 * (p1.x - p0.x);
            const bx = 3 * (p2.x - p1.x) - cx;
            const ax = p3.x - p0.x - cx - bx;

            const cy = 3 * (p1.y - p0.y);
            const by = 3 * (p2.y - p1.y) - cy;
            const ay = p3.y - p0.y - cy - by;

            const x = ax * t * t * t + bx * t * t + cx * t + p0.x;
            const y = ay * t * t * t + by * t * t + cy * t + p0.y;

            return { x, y };
        }

        // Cubic Bezier derivative for angle orientation
        getTangent(t) {
            const p0 = { x: -60, y: this.height * 0.70 };
            const p1 = { x: this.width * 0.35, y: this.height * 0.38 };
            const p2 = { x: this.width * 0.70, y: this.height * 0.22 };
            const p3 = { x: this.width + 60, y: this.height * 0.08 };

            const cx = 3 * (p1.x - p0.x);
            const bx = 3 * (p2.x - p1.x) - cx;
            const ax = p3.x - p0.x - cx - bx;

            const cy = 3 * (p1.y - p0.y);
            const by = 3 * (p2.y - p1.y) - cy;
            const ay = p3.y - p0.y - cy - by;

            const dx = 3 * ax * t * t + 2 * bx * t + cx;
            const dy = 3 * ay * t * t + 2 * by * t + cy;

            return { dx, dy };
        }

        emitParticles(rx, ry, angle) {
            // Exhaust location at rear of rocket
            const exhaustDist = 14;
            const ex = rx - Math.cos(angle) * exhaustDist;
            const ey = ry - Math.sin(angle) * exhaustDist;

            // Emit 2-3 particles per frame
            for (let i = 0; i < 3; i++) {
                const spread = (Math.random() - 0.5) * 0.5;
                const particleAngle = angle + Math.PI + spread;
                const speed = 0.8 + Math.random() * 1.5;

                // Alternate colors: Hot Pink, Neon Orange, Magenta, Gold
                const colors = [
                    'rgba(255, 0, 128, ',
                    'rgba(255, 90, 0, ',
                    'rgba(236, 72, 153, ',
                    'rgba(255, 180, 0, ',
                    'rgba(0, 240, 255, '
                ];
                const colorBase = colors[Math.floor(Math.random() * colors.length)];

                this.particles.push({
                    x: ex + (Math.random() - 0.5) * 4,
                    y: ey + (Math.random() - 0.5) * 4,
                    vx: Math.cos(particleAngle) * speed,
                    vy: Math.sin(particleAngle) * speed,
                    size: 2.2 + Math.random() * 2.8,
                    colorBase: colorBase,
                    alpha: 0.9,
                    life: 1.0,
                    decay: 0.02 + Math.random() * 0.02
                });
            }
        }

        updateParticles() {
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.life -= p.decay;
                p.alpha = Math.max(0, p.life * 0.9);
                p.size *= 0.96;

                if (p.life <= 0 || p.size <= 0.3) {
                    this.particles.splice(i, 1);
                }
            }
        }

        drawParticles() {
            this.ctx.save();
            for (let i = 0; i < this.particles.length; i++) {
                const p = this.particles[i];
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = `${p.colorBase}${p.alpha})`;
                this.ctx.shadowColor = p.colorBase.replace(', ', ')');
                this.ctx.shadowBlur = 6;
                this.ctx.fill();
            }
            this.ctx.restore();
        }

        drawRocket(x, y, angle) {
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(angle);

            // Subtle outer thruster glow
            this.ctx.shadowColor = 'rgba(255, 90, 0, 0.8)';
            this.ctx.shadowBlur = 12;

            // Thruster flame cone
            this.ctx.beginPath();
            this.ctx.moveTo(-12, 0);
            this.ctx.lineTo(-22, -4);
            this.ctx.lineTo(-26, 0);
            this.ctx.lineTo(-22, 4);
            this.ctx.closePath();
            const flameGrad = this.ctx.createLinearGradient(-12, 0, -26, 0);
            flameGrad.addColorStop(0, '#ffffff');
            flameGrad.addColorStop(0.4, '#ff7700');
            flameGrad.addColorStop(1, '#ff007f');
            this.ctx.fillStyle = flameGrad;
            this.ctx.fill();

            // Metallic Rocket Body
            this.ctx.shadowBlur = 0;
            this.ctx.beginPath();
            this.ctx.moveTo(14, 0); // Nose tip
            this.ctx.quadraticCurveTo(4, -7, -10, -6); // Upper fuselage
            this.ctx.lineTo(-12, -3);
            this.ctx.lineTo(-12, 3);
            this.ctx.lineTo(-10, 6);
            this.ctx.quadraticCurveTo(4, 7, 14, 0); // Lower fuselage
            this.ctx.closePath();

            const bodyGrad = this.ctx.createLinearGradient(-12, -7, 14, 7);
            bodyGrad.addColorStop(0, '#1e293b');
            bodyGrad.addColorStop(0.5, '#e2e8f0');
            bodyGrad.addColorStop(1, '#00f0ff');
            this.ctx.fillStyle = bodyGrad;
            this.ctx.fill();

            // Neon Cyan accent outline
            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = '#00f0ff';
            this.ctx.stroke();

            // Wings / Fins
            this.ctx.beginPath();
            this.ctx.moveTo(-4, -6);
            this.ctx.lineTo(-12, -11);
            this.ctx.lineTo(-10, -4);
            this.ctx.closePath();
            this.ctx.fillStyle = '#ec4899';
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.moveTo(-4, 6);
            this.ctx.lineTo(-12, 11);
            this.ctx.lineTo(-10, 4);
            this.ctx.closePath();
            this.ctx.fillStyle = '#ec4899';
            this.ctx.fill();

            // Glass Canopy / Cockpit
            this.ctx.beginPath();
            this.ctx.ellipse(3, 0, 4, 2.5, 0, 0, Math.PI * 2);
            this.ctx.fillStyle = '#00f0ff';
            this.ctx.shadowColor = '#00f0ff';
            this.ctx.shadowBlur = 6;
            this.ctx.fill();

            this.ctx.restore();
        }

        animate(timestamp) {
            if (!this.isAnimating) return;

            const dt = timestamp - this.lastTime;
            this.lastTime = timestamp;

            // Clear canvas
            this.ctx.clearRect(0, 0, this.width, this.height);

            // Update flight progress
            this.progress += this.speed * Math.min(dt, 50);
            if (this.progress > 1) {
                this.progress = 0; // Reset loop smoothly
            }

            const pos = this.getPoint(this.progress);
            const tangent = this.getTangent(this.progress);
            const angle = Math.atan2(tangent.dy, tangent.dx);

            // Only draw rocket & emit particles when within visible screen bounds
            if (pos.x >= -60 && pos.x <= this.width + 60) {
                this.emitParticles(pos.x, pos.y, angle);
                this.updateParticles();
                this.drawParticles();
                this.drawRocket(pos.x, pos.y, angle);
            } else {
                this.updateParticles();
                this.drawParticles();
            }

            requestAnimationFrame((t) => this.animate(t));
        }
    }

    function initRocket() {
        if (document.getElementById('rocket-canvas')) {
            new RocketAnimation();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRocket);
    } else {
        initRocket();
    }
})();
