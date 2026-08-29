/* ============================================================
   METEORS — Subtle Falling Comet/Asteroid Layer
   Occasional tiny white/lavender comets drifting top → bottom.

   Rules:
   • Dark theme ONLY — same body.light-theme check used by all
     other background layers.
   • pointer-events: none — never intercepts any input.
   • Canvas 2D — no Three.js needed; trivially lightweight.
   • Hard cap: max 3 simultaneous meteors.
   • Irregular spawn intervals (4–20 s) so it feels rare/natural.
   • Trails drawn as gradient-opacity segments (thin & elegant).
   • prefers-reduced-motion → completely disabled.
   • Page Visibility API → stops rendering when tab is hidden.
   • z-index: 0 — rendered BEHIND particle field (z-index:1)
     and behind all stars/planets layers.
   ============================================================ */
(function () {
    'use strict';

    function ready(cb) {
        if (document.readyState !== 'loading') { cb(); return; }
        document.addEventListener('DOMContentLoaded', cb);
    }

    function init() {
        /* ── Dark theme gate ── */
        if (document.body.classList.contains('light-theme')) {
            var obs = new MutationObserver(function () {
                if (!document.body.classList.contains('light-theme')) {
                    obs.disconnect(); init();
                }
            });
            obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
            return;
        }

        var cosmicBg = document.getElementById('cosmic-bg');
        if (!cosmicBg) return;
        if (document.getElementById('meteor-canvas')) return;

        /* ── Canvas ── */
        var cv = document.createElement('canvas');
        cv.id = 'meteor-canvas';
        cv.setAttribute('aria-hidden', 'true');
        cv.style.cssText = [
            'position:fixed',
            'inset:0',
            'width:100%',
            'height:100%',
            'pointer-events:none',
            'z-index:0',                  /* behind particle-field-canvas (z:1) */
            'display:block',
            'transition:opacity 0.6s ease',
        ].join(';');
        /* Insert as very first child → deepest background layer */
        cosmicBg.insertBefore(cv, cosmicBg.firstChild);

        var ctx = cv.getContext('2d');
        var W, H;
        var isMobile   = false;
        var reducedMot = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var paused     = false;

        function resize() {
            W = cv.width  = window.innerWidth;
            H = cv.height = window.innerHeight;
            isMobile = W < 768;
        }
        resize();
        window.addEventListener('resize', resize, { passive: true });

        /* ── Palette ── */
        /* Soft whites and cool lavenders — no neon, no fire */
        var COLORS = [
            [255, 255, 255],   /* pure white         */
            [242, 246, 255],   /* cool white         */
            [228, 228, 255],   /* pale lavender      */
            [210, 220, 255],   /* pale blue-lavender */
            [238, 235, 255],   /* soft lavender      */
            [245, 248, 255],   /* icy white          */
        ];

        /* ── Helpers ── */
        function rand(lo, hi) { return Math.random() * (hi - lo) + lo; }

        /* ── Meteor object ──────────────────────────────────────
           Each meteor stores its own trail as a circular buffer
           for efficient push/shift without GC pressure.
        ── */
        var MAX_TRAIL = 120;       /* max trail history length */
        var MAX_METEORS = 3;

        function Meteor() {
            this.active = false;
            /* Pre-allocate trail buffer arrays */
            this.trailX = new Float32Array(MAX_TRAIL);
            this.trailY = new Float32Array(MAX_TRAIL);
            this.trailHead = 0;   /* write index (circular) */
            this.trailLen  = 0;   /* current count (≤ MAX_TRAIL) */
        }

        Meteor.prototype.spawn = function () {
            var col = COLORS[Math.floor(Math.random() * COLORS.length)];

            /* Spawn from top strip — random horizontal position */
            this.x  = rand(W * 0.04, W * 0.96);
            this.y  = rand(-30, H * 0.10);

            /* Primarily downward, gentle diagonal deviation ±22° */
            var deviation = rand(-22, 22) * Math.PI / 180;
            var speed     = rand(isMobile ? 1.0 : 1.4,
                                 isMobile ? 2.5 : 3.8);
            this.vx = Math.sin(deviation) * speed;
            this.vy = Math.cos(deviation) * speed;   /* vy always positive → down */

            this.r          = col[0];
            this.g          = col[1];
            this.b          = col[2];
            this.size       = rand(0.9, 2.2);         /* head radius, px */
            /* Trail: how many history points make up the visible tail */
            this.trailLen   = 0;
            this.trailHead  = 0;
            this.trailPts   = Math.floor(rand(28, 72)); /* desired visible length */

            this.opacity    = 0;                      /* fade in from 0 */
            this.maxOpacity = rand(0.40, 0.72);
            this.fadeIn     = true;
            this.fadeOut    = false;
            this.active     = true;
        };

        /* Push one (x,y) into the circular trail buffer */
        Meteor.prototype.pushTrail = function (x, y) {
            var idx = this.trailHead;
            this.trailX[idx] = x;
            this.trailY[idx] = y;
            this.trailHead   = (idx + 1) % MAX_TRAIL;
            if (this.trailLen < MAX_TRAIL) this.trailLen++;
        };

        /* Get trail point at position i (0 = oldest visible, trailLen-1 = newest) */
        Meteor.prototype.getTrail = function (i) {
            /* Map logical index i to physical circular index */
            var pts  = Math.min(this.trailLen, this.trailPts);
            /* Start from (trailHead - pts) going forward */
            var base = (this.trailHead - pts + MAX_TRAIL) % MAX_TRAIL;
            var phys = (base + i) % MAX_TRAIL;
            return { x: this.trailX[phys], y: this.trailY[phys] };
        };

        /* Pre-allocate the pool */
        var pool = [];
        for (var pi = 0; pi < MAX_METEORS; pi++) {
            pool.push(new Meteor());
        }

        /* ── Spawn scheduling ── */
        var nextSpawnAt  = 0;   /* ms timestamp for next spawn attempt */
        var rngSpawnGap  = function () { return rand(4000, 20000); }; /* 4–20 s gap */
        var SPAWN_CHANCE = 0.80; /* probability of actually spawning when gap passes */

        function scheduleNextSpawn(now) {
            nextSpawnAt = now + rngSpawnGap();
        }

        function trySpawn(now) {
            if (reducedMot || isMobile && Math.random() < 0.4) {
                /* On mobile: even rarer */
                scheduleNextSpawn(now); return;
            }
            if (Math.random() > SPAWN_CHANCE) {
                scheduleNextSpawn(now); return;
            }
            /* Find an inactive slot */
            for (var i = 0; i < MAX_METEORS; i++) {
                if (!pool[i].active) {
                    pool[i].spawn();
                    break;
                }
            }
            scheduleNextSpawn(now);
        }

        /* ── Draw a single meteor and its trail ── */
        function drawMeteor(m) {
            var pts = Math.min(m.trailLen, m.trailPts);
            if (pts < 2) return;

            var alpha = m.opacity;
            var r = m.r, g = m.g, b = m.b;

            /* ── Trail ──────────────────────────────────────────
               Drawn as segments from tail (dim) to head (bright).
               Each segment: opacity = alpha × (progress)² × 0.7
               Line width tapers from 0.2px at tail to size×0.55 at head.
            ── */
            ctx.lineCap  = 'round';
            ctx.lineJoin = 'round';

            for (var i = 0; i < pts - 1; i++) {
                var p0 = m.getTrail(i);
                var p1 = m.getTrail(i + 1);

                /* progress: 0 at tail, 1 at head */
                var progress  = (i + 1) / pts;
                var segAlpha  = alpha * progress * progress * 0.68;
                var segWidth  = Math.max(0.15, m.size * 0.55 * progress);

                ctx.beginPath();
                ctx.moveTo(p0.x, p0.y);
                ctx.lineTo(p1.x, p1.y);
                ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + segAlpha + ')';
                ctx.lineWidth   = segWidth;
                ctx.stroke();
            }

            /* ── Meteor head: soft glow + bright core ── */
            var hx = m.x, hy = m.y;

            /* Outer glow (radial gradient) */
            var glowR = m.size * 4.5;
            var grd   = ctx.createRadialGradient(hx, hy, 0, hx, hy, glowR);
            grd.addColorStop(0,   'rgba(' + r + ',' + g + ',' + b + ',' + (alpha * 0.45) + ')');
            grd.addColorStop(0.5, 'rgba(' + r + ',' + g + ',' + b + ',' + (alpha * 0.12) + ')');
            grd.addColorStop(1,   'rgba(' + r + ',' + g + ',' + b + ',0)');
            ctx.beginPath();
            ctx.arc(hx, hy, glowR, 0, Math.PI * 2);
            ctx.fillStyle = grd;
            ctx.fill();

            /* Inner bright core */
            ctx.beginPath();
            ctx.arc(hx, hy, m.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
            ctx.fill();
        }

        /* ── Main render loop ── */
        var lastTs = 0;

        function loop(ts) {
            requestAnimationFrame(loop);

            if (document.body.classList.contains('light-theme')) {
                ctx.clearRect(0, 0, W, H); return;
            }
            if (paused || reducedMot) {
                ctx.clearRect(0, 0, W, H); return;
            }

            /* Cap dt to avoid jumps after tab refocus */
            var dt = Math.min(ts - lastTs, 60);
            lastTs = ts;

            ctx.clearRect(0, 0, W, H);

            /* Spawn check */
            if (ts >= nextSpawnAt) {
                /* Count active */
                var active = 0;
                for (var k = 0; k < MAX_METEORS; k++) { if (pool[k].active) active++; }
                if (active < MAX_METEORS) trySpawn(ts);
                else scheduleNextSpawn(ts);
            }

            /* Update + draw each meteor */
            for (var i = 0; i < MAX_METEORS; i++) {
                var m = pool[i];
                if (!m.active) continue;

                /* Store current position into trail BEFORE moving */
                m.pushTrail(m.x, m.y);

                /* Move */
                m.x += m.vx;
                m.y += m.vy;

                /* Fade in */
                if (m.fadeIn) {
                    m.opacity += 0.035;
                    if (m.opacity >= m.maxOpacity) {
                        m.opacity  = m.maxOpacity;
                        m.fadeIn   = false;
                    }
                }

                /* Start fade out when approaching bottom or edges */
                if (!m.fadeOut) {
                    var edgeDist = Math.min(
                        m.y / H,                       /* distance down as fraction */
                        1 - Math.abs(m.x - W/2) / (W/2) /* closeness to horizontal edge */
                    );
                    /* Begin fade when 78% down the screen, or near horizontal edges */
                    if (m.y > H * 0.78 || m.x < -60 || m.x > W + 60) {
                        m.fadeOut = true;
                        m.fadeIn  = false;
                    }
                }

                /* Fade out */
                if (m.fadeOut) {
                    m.opacity -= 0.025;
                    if (m.opacity <= 0) {
                        m.active  = false;
                        m.trailLen = 0;
                        continue;
                    }
                }

                drawMeteor(m);
            }
        }

        /* Initialise spawn timer a little after page load */
        nextSpawnAt = performance.now() + rand(2000, 7000);

        requestAnimationFrame(loop);

        /* ── Page Visibility ── */
        document.addEventListener('visibilitychange', function () {
            paused = document.hidden;
        });

        /* ── prefers-reduced-motion live listener ── */
        window.matchMedia('(prefers-reduced-motion: reduce)')
            .addEventListener('change', function (e) { reducedMot = e.matches; });

        /* ── Theme watch ── */
        var obsLight = new MutationObserver(function () {
            cv.style.opacity = document.body.classList.contains('light-theme') ? '0' : '1';
        });
        obsLight.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }

    ready(init);

})();
