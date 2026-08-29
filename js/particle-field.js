/* ============================================================
   PARTICLE FIELD — Interactive 3D Floating Particle Background
   Visual target: dark space, tiny violet/purple/magenta dots,
   soft glow, cursor repulsion, smooth return-to-origin.
   v2: spatial colour zones + sparkle layer.

   Rules:
   • Dark theme ONLY — hides/clears when body.light-theme present.
   • pointer-events: none  — never blocks clicks / scroll / hover.
   • Uses Three.js (already on page via cosmic-3d CDN script).
   • Two THREE.Points objects (main field + sparkle layer).
   • Mouse repulsion via JS; smooth lerp back to home positions.
   • Sparkle twinkle driven by uTime uniform + per-vertex attrs.
   • Respects prefers-reduced-motion.
   • Pauses via Page Visibility API.
   • Responsive: smaller count on mobile/tablet.
   ============================================================ */
(function () {
    'use strict';

    /* ── Wait for Three.js (loaded async from CDN) ─────────── */
    function waitForThree(cb) {
        if (typeof THREE !== 'undefined') { cb(); return; }
        var tries = 0;
        var t = setInterval(function () {
            tries++;
            if (typeof THREE !== 'undefined') { clearInterval(t); cb(); }
            if (tries > 200) clearInterval(t);
        }, 50);
    }

    /* ── Main init ────────────────────────────────────────── */
    function init() {
        /* Only start in dark theme; observe for switch */
        if (document.body.classList.contains('light-theme')) {
            var obsTheme = new MutationObserver(function () {
                if (!document.body.classList.contains('light-theme')) {
                    obsTheme.disconnect();
                    init();
                }
            });
            obsTheme.observe(document.body, { attributes: true, attributeFilter: ['class'] });
            return;
        }

        var cosmicBg = document.getElementById('cosmic-bg');
        if (!cosmicBg) return;
        if (document.getElementById('particle-field-canvas')) return;

        /* ── Canvas ── */
        var cv = document.createElement('canvas');
        cv.id = 'particle-field-canvas';
        cv.setAttribute('aria-hidden', 'true');
        cv.style.cssText = [
            'position:fixed',
            'inset:0',
            'width:100%',
            'height:100%',
            'pointer-events:none',
            'z-index:1',
            'display:block',
            'transition:opacity 0.5s ease',
        ].join(';');
        cosmicBg.insertBefore(cv, cosmicBg.firstChild);

        var W = window.innerWidth;
        var H = window.innerHeight;
        var isMobile   = W < 768;
        var isTablet   = W < 1200;
        var reducedMot = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        /* ── Renderer ── */
        var renderer;
        try {
            renderer = new THREE.WebGLRenderer({
                canvas: cv,
                alpha: true,
                antialias: false,
                powerPreference: 'low-power',
            });
        } catch (e) { cv.remove(); return; }

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setSize(W, H);
        renderer.setClearColor(0x000000, 0);

        /* ── Scene & Camera ── */
        var scene  = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(60, W / H, 1, 2000);
        camera.position.z = 350;

        /* ── World bounds at z=0 ── */
        var fovR   = THREE.MathUtils.degToRad(camera.fov);
        var worldH = 2 * Math.tan(fovR / 2) * camera.position.z;
        var worldW = worldH * (W / H);

        function rand(lo, hi) { return Math.random() * (hi - lo) + lo; }
        function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

        /* ═══════════════════════════════════════════════════════
           SPATIAL COLOUR ZONES
           Each screen region is biased toward a colour family.
           Zones overlap softly so there are no hard boundaries.
           Zone 0=left  (purple/violet)    Zone 1=right (magenta/pink)
           Zone 2=top   (blue/cyan)        Zone 3=bottom (indigo)
           Zone 4=centre (wide mix)
           Each zone palette entry: [weight, r, g, b]  (0-1 float)
           ═══════════════════════════════════════════════════════ */
        var ZONE_PAL = [
            [[32,0.19,0.45,0.98],[28,0.44,0.54,1.00],[20,0.12,0.30,0.85],
             [12,0.30,0.50,0.95],[ 8,0.55,0.65,1.00]],
            [[30,0.44,0.54,1.00],[26,0.19,0.45,0.98],[20,0.25,0.40,0.92],
             [14,0.50,0.60,0.98],[10,0.15,0.35,0.88]],
            [[30,0.19,0.45,0.98],[24,0.25,0.55,0.98],[20,0.44,0.54,1.00],
             [16,0.15,0.38,0.90],[10,0.35,0.60,0.98]],
            [[28,0.12,0.25,0.80],[24,0.19,0.45,0.98],[20,0.44,0.54,1.00],
             [16,0.15,0.30,0.75],[12,0.30,0.48,0.92]],
            [[18,0.19,0.45,0.98],[16,0.44,0.54,1.00],[14,0.25,0.50,0.95],
             [12,0.50,0.62,1.00],[10,0.15,0.32,0.85],[ 8,0.35,0.55,0.98],
             [ 8,0.58,0.68,1.00],[ 8,0.18,0.42,0.92],[ 6,0.22,0.38,0.88]],
        ];

        var ZONE_WHEELS = ZONE_PAL.map(function (pal) {
            var w = [];
            for (var pi = 0; pi < pal.length; pi++) {
                for (var wi = 0; wi < pal[pi][0]; wi++) { w.push(pi); }
            }
            return w;
        });

        function zoneWeights(nx, ny) {
            var left   = Math.max(0, 1.0 - nx * 3.5);
            var right  = Math.max(0, (nx - 0.65) * 3.0);
            var top    = Math.max(0, 1.0 - ny * 3.5);
            var bottom = Math.max(0, (ny - 0.65) * 3.0);
            var edge   = left + right + top + bottom;
            var centre = Math.max(0, 1.0 - edge);
            var total  = left + right + top + bottom + centre || 1.0;
            return [left/total, right/total, top/total, bottom/total, centre/total];
        }

        function pickZoneColor(z) {
            var pal  = ZONE_PAL[z];
            var ci   = ZONE_WHEELS[z][Math.floor(Math.random() * ZONE_WHEELS[z].length)];
            return pal[ci];
        }

        function sampleColor(nx, ny) {
            var w = zoneWeights(nx, ny);
            var r = 0, g = 0, b = 0;
            for (var z = 0; z < 5; z++) {
                if (w[z] < 0.01) continue;
                var c = pickZoneColor(z);
                r += c[1] * w[z];
                g += c[2] * w[z];
                b += c[3] * w[z];
            }
            return [clamp01(r + rand(-0.08,0.08)),
                    clamp01(g + rand(-0.04,0.04)),
                    clamp01(b + rand(-0.08,0.08))];
        }

        /* ═══════════════════════════════════════════════════════
           LAYER 1 — MAIN PARTICLE FIELD
           ═══════════════════════════════════════════════════════ */
        var BASE  = isMobile ? 800 : isTablet ? 1900 : 2900;
        var COUNT = reducedMot ? Math.floor(BASE * 0.25) : BASE;

        var positions = new Float32Array(COUNT * 3);
        var colors    = new Float32Array(COUNT * 3);
        var sizes     = new Float32Array(COUNT);
        var origX     = new Float32Array(COUNT);
        var origY     = new Float32Array(COUNT);
        var origZ     = new Float32Array(COUNT);
        var velX      = new Float32Array(COUNT);
        var velY      = new Float32Array(COUNT);
        var velZ      = new Float32Array(COUNT);
        var dispX     = new Float32Array(COUNT);
        var dispY     = new Float32Array(COUNT);

        for (var i = 0; i < COUNT; i++) {
            var px = rand(-worldW * 0.56, worldW * 0.56);
            var py = rand(-worldH * 0.56, worldH * 0.56);
            var pz = rand(-180, 60);

            origX[i] = px; origY[i] = py; origZ[i] = pz;
            positions[i*3] = px; positions[i*3+1] = py; positions[i*3+2] = pz;

            var col = sampleColor((px/worldW)+0.5, (-py/worldH)+0.5);
            colors[i*3] = col[0]; colors[i*3+1] = col[1]; colors[i*3+2] = col[2];

            var sr = Math.random();
            sizes[i] = sr < 0.76 ? rand(0.9,2.4) : sr < 0.94 ? rand(2.4,4.0) : rand(4.0,6.5);

            var ang = Math.random() * Math.PI * 2;
            var spd = reducedMot ? 0 : rand(0.006, 0.040);
            velX[i] = Math.cos(ang)*spd; velY[i] = Math.sin(ang)*spd;
            velZ[i] = reducedMot ? 0 : rand(-0.008, 0.008);
            dispX[i] = 0; dispY[i] = 0;
        }

        var geo     = new THREE.BufferGeometry();
        var posAttr = new THREE.BufferAttribute(positions, 3);
        posAttr.setUsage(THREE.DynamicDrawUsage);
        geo.setAttribute('position', posAttr);
        geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
        geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

        var mat = new THREE.ShaderMaterial({
            uniforms: { uGlobalAlpha: { value: 1.0 } },
            vertexShader: [
                'attribute float size; varying vec3 vColor;',
                'void main(){',
                '  vColor=color;',
                '  vec4 mv=modelViewMatrix*vec4(position,1.);',
                '  gl_PointSize=clamp(size*(300./-mv.z),0.5,11.);',
                '  gl_Position=projectionMatrix*mv;',
                '}',
            ].join('\n'),
            fragmentShader: [
                'varying vec3 vColor; uniform float uGlobalAlpha;',
                'void main(){',
                '  vec2 uv=gl_PointCoord-vec2(.5);',
                '  float d=dot(uv,uv);',
                '  if(d>.25)discard;',
                '  float a=pow(1.-smoothstep(.05,.25,d),1.7);',
                '  gl_FragColor=vec4(vColor,a*uGlobalAlpha*0.54);',
                '}',
            ].join('\n'),
            transparent: true, vertexColors: true,
            blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false,
        });

        scene.add(new THREE.Points(geo, mat));

        /* ═══════════════════════════════════════════════════════
           CURSOR REPULSION
           ═══════════════════════════════════════════════════════ */
        var mx3d = 1e9, my3d = 1e9;
        var REPEL_R  = isMobile ? 0 : worldW * 0.065;
        var REPEL_F  = 0.26;
        var RETURN_K = 0.040;

        function screenToWorld(sx, sy) {
            return {
                x: ((sx/W)*2-1)*worldW*0.5,
                y: -(((sy/H)*2-1))*worldH*0.5,
            };
        }

        if (!isMobile) {
            document.addEventListener('mousemove', function(e) {
                var w=screenToWorld(e.clientX,e.clientY); mx3d=w.x; my3d=w.y;
            }, {passive:true});
            document.addEventListener('mouseleave', function() {
                mx3d=1e9; my3d=1e9;
            }, {passive:true});
        }

        /* ── Page Visibility ── */
        var paused = false;
        document.addEventListener('visibilitychange', function() { paused=document.hidden; });
        window.matchMedia('(prefers-reduced-motion: reduce)')
            .addEventListener('change', function(e){ reducedMot=e.matches; });

        /* ═══════════════════════════════════════════════════════
           RENDER LOOP
           ═══════════════════════════════════════════════════════ */
        var clock = new THREE.Clock();

        function loop() {
            requestAnimationFrame(loop);
            if (document.body.classList.contains('light-theme')) { renderer.clear(); return; }
            if (paused) return;

            var elapsed = clock.getElapsedTime();
            var pos = posAttr.array;
            var rr2 = REPEL_R * REPEL_R;
            var hw = worldW*0.59, hh = worldH*0.59;

            /* ── Main particle drift + repulsion ── */
            for (var i = 0; i < COUNT; i++) {
                if (!reducedMot) {
                    origX[i]+=velX[i]; origY[i]+=velY[i]; origZ[i]+=velZ[i];
                    if(origX[i]> hw) origX[i]=-hw; if(origX[i]<-hw) origX[i]= hw;
                    if(origY[i]> hh) origY[i]=-hh; if(origY[i]<-hh) origY[i]= hh;
                    if(origZ[i]> 65) origZ[i]=-180; if(origZ[i]<-185) origZ[i]=62;
                }
                var dx=origX[i]-mx3d, dy=origY[i]-my3d, d2=dx*dx+dy*dy;
                if(d2<rr2 && d2>0.001 && !reducedMot){
                    var d=Math.sqrt(d2), f=REPEL_F*(1.-d/REPEL_R);
                    if(f>.50)f=.50;
                    dispX[i]+=(dx/d)*f; dispY[i]+=(dy/d)*f;
                }
                var md=REPEL_R*0.60;
                if(dispX[i]> md)dispX[i]= md; if(dispX[i]<-md)dispX[i]=-md;
                if(dispY[i]> md)dispY[i]= md; if(dispY[i]<-md)dispY[i]=-md;
                dispX[i]*=(1.-RETURN_K); dispY[i]*=(1.-RETURN_K);
                var i3=i*3;
                pos[i3]  =origX[i]+dispX[i];
                pos[i3+1]=origY[i]+dispY[i];
                pos[i3+2]=origZ[i];
            }
            posAttr.needsUpdate=true;
            mat.uniforms.uGlobalAlpha.value = reducedMot ? 0.28 : 1.0;

            renderer.render(scene, camera);
        }

        loop();

        /* ── Resize ── */
        window.addEventListener('resize', function() {
            W=window.innerWidth; H=window.innerHeight;
            isMobile=W<768; isTablet=W<1200;
            camera.aspect=W/H; camera.updateProjectionMatrix();
            renderer.setSize(W,H);
            fovR=THREE.MathUtils.degToRad(camera.fov);
            worldH=2*Math.tan(fovR/2)*camera.position.z;
            worldW=worldH*(W/H);
            REPEL_R=isMobile?0:worldW*0.065;
        });

        /* ── Theme watch ── */
        var obsLight = new MutationObserver(function() {
            cv.style.opacity=document.body.classList.contains('light-theme')?'0':'1';
        });
        obsLight.observe(document.body,{attributes:true,attributeFilter:['class']});
    }

    /* ── Bootstrap ── */
    waitForThree(function() {
        if (document.readyState==='loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    });

})();
