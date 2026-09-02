/* ============================================================
   COSMIC 3D BACKGROUND — Three.js WebGL Scene
   Visual target: Reference Image 1 & 2 (cinematic deep space)
   Composition:
     ① Large ringed planet  — upper-left edge (partially cropped)
     ② Very large dark planet — bottom-left edge (partially cropped)
     ③ Medium planet — upper-right edge (partially cropped)
     ④ Small/medium planet — right-center area
     ⑤ Small moon — near ringed planet
     ⑥ Scattered asteroid clusters (sparse)
   Dark theme only. pointer-events: none throughout.
   Adds class `cosmic-3d-ready` to body on success.
   ============================================================ */
(function () {
    'use strict';

    /* ── Wait for Three.js CDN ───────────────────────────────── */
    function waitForThree(cb) {
        if (typeof THREE !== 'undefined') { cb(); return; }
        var tries = 0;
        var t = setInterval(function () {
            tries++;
            if (typeof THREE !== 'undefined') { clearInterval(t); cb(); }
            if (tries > 120) clearInterval(t); // give up after 6 s
        }, 50);
    }

    /* ── Ring gradient texture (512×1 canvas, radial stops) ─── */
    function makeRingTex(stops) {
        var cv = document.createElement('canvas');
        cv.width = 512; cv.height = 1;
        var ctx = cv.getContext('2d');
        var g = ctx.createLinearGradient(0, 0, 512, 0);
        for (var i = 0; i < stops.length; i++) g.addColorStop(stops[i][0], stops[i][1]);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 512, 1);
        return new THREE.CanvasTexture(cv);
    }

    /* ── Atmospheric rim-glow shader (additive, back-face) ──── */
    function makeAtmosphere(radius, rimColor) {
        var geo = new THREE.SphereGeometry(radius * 1.07, 28, 28);
        var mat = new THREE.ShaderMaterial({
            uniforms: { uColor: { value: new THREE.Color(rimColor) } },
            vertexShader: [
                'varying vec3 vN; varying vec3 vV;',
                'void main(){',
                '  vN=normalize(normalMatrix*normal);',
                '  vec4 mvp=modelViewMatrix*vec4(position,1.);',
                '  vV=normalize(-mvp.xyz);',
                '  gl_Position=projectionMatrix*mvp;',
                '}'
            ].join('\n'),
            fragmentShader: [
                'uniform vec3 uColor; varying vec3 vN; varying vec3 vV;',
                'void main(){',
                '  float r=1.-clamp(dot(vN,vV),0.,1.);',
                '  r=pow(r,2.5);',
                '  gl_FragColor=vec4(uColor,r*0.88);',
                '}'
            ].join('\n'),
            transparent: true,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        return new THREE.Mesh(geo, mat);
    }

    /* ── Flat ring mesh with corrected radial UV ─────────────── */
    function makeRingMesh(innerR, outerR, tex, opacity) {
        var geo = new THREE.RingGeometry(innerR, outerR, 128, 1);
        var pos = geo.attributes.position;
        var uv  = geo.attributes.uv;
        for (var i = 0; i < pos.count; i++) {
            var x = pos.getX(i), y = pos.getY(i);
            var r = Math.sqrt(x * x + y * y);
            var u = (r - innerR) / (outerR - innerR);
            uv.setXY(i, Math.max(0, Math.min(1, u)), 0.5);
        }
        uv.needsUpdate = true;
        return new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
            map: tex,
            transparent: true,
            opacity: opacity !== undefined ? opacity : 0.75,
            side: THREE.DoubleSide,
            depthWrite: false,
        }));
    }

    /* ── Planet factory ─────────────────────────────────────── */
    function makePlanet(opts) {
        var grp = new THREE.Group();

        var body = new THREE.Mesh(
            new THREE.SphereGeometry(opts.radius, 64, 48),
            new THREE.MeshPhongMaterial({
                color:             opts.bodyColor,
                emissive:          opts.emissive   || 0x000000,
                emissiveIntensity: opts.emissiveInt || 0.10,
                shininess:         opts.shininess  !== undefined ? opts.shininess : 8,
                specular:          0x0d0022,
            })
        );
        grp.add(body);
        grp.userData.body = body;

        if (opts.rimColor) grp.add(makeAtmosphere(opts.radius, opts.rimColor));

        if (opts.rings) {
            var rGrp = new THREE.Group();
            var rTex = makeRingTex(opts.rings.stops);
            rGrp.add(makeRingMesh(opts.rings.inner, opts.rings.outer, rTex, opts.rings.opacity));
            if (opts.rings.outer2) {
                var rTex2 = makeRingTex(opts.rings.stops2 || opts.rings.stops);
                rGrp.add(makeRingMesh(
                    opts.rings.outer * 1.06, opts.rings.outer2,
                    rTex2,
                    (opts.rings.opacity || 0.72) * 0.48
                ));
            }
            rGrp.rotation.x = opts.ringTilt !== undefined ? opts.ringTilt : 1.12;
            grp.add(rGrp);
        }

        return grp;
    }

    /* ── Main init ──────────────────────────────────────────── */
    function init() {
        if (document.body.classList.contains('light-theme')) {
            var obs = new MutationObserver(function () {
                if (!document.body.classList.contains('light-theme')) { obs.disconnect(); init(); }
            });
            obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
            return;
        }

        var cosmicBg = document.getElementById('cosmic-bg');
        if (!cosmicBg) return;
        if (document.getElementById('cosmic-3d-canvas')) return;

        /* ── Canvas ── */
        var cv = document.createElement('canvas');
        cv.id = 'cosmic-3d-canvas';
        cosmicBg.appendChild(cv);

        var W = window.innerWidth, H = window.innerHeight;

        /* ── Renderer ── */
        var renderer;
        try {
            renderer = new THREE.WebGLRenderer({
                canvas: cv, alpha: true, antialias: W < 1600, powerPreference: 'low-power',
            });
        } catch (e) { cv.remove(); return; }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.setSize(W, H);
        renderer.setClearColor(0x000000, 0);

        /* ── Camera + Scene ── */
        var camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 2000);
        camera.position.z = 150;
        var scene = new THREE.Scene();

        var isMobile = W < 768;

        /* Visible world units at Z=0 */
        function vis() {
            var fvR = THREE.MathUtils.degToRad(camera.fov);
            var vH  = 2 * Math.tan(fvR / 2) * camera.position.z;
            return { w: vH * camera.aspect, h: vH };
        }

        /* ── Lighting — sun from upper-right (matches reference) ── */
        var sun = new THREE.DirectionalLight(0xfff0ee, 1.45);
        sun.position.set(3.0, 2.0, 1.5);
        scene.add(sun);

        // Deep navy ambient — very dark, keeps left side near-black
        scene.add(new THREE.AmbientLight(0x07051a, 0.55));

        // Purple fill from lower-left (tints shadow sides violet)
        var fill = new THREE.PointLight(0x7700dd, 1.10, 650);
        fill.position.set(-200, -120, 60);
        scene.add(fill);

        // Primary right-side MAGENTA nebula glow (strongest — matches CSS)
        var nebPt = new THREE.PointLight(0xcc00ff, 0.75, 550);
        nebPt.position.set(240, 30, 40);
        scene.add(nebPt);

        // Upper-right secondary magenta atmospheric bloom
        var nebPt2 = new THREE.PointLight(0xaa00ee, 0.38, 400);
        nebPt2.position.set(180, 120, 20);
        scene.add(nebPt2);

        // Lower-right violet tail
        var nebPt3 = new THREE.PointLight(0x6600cc, 0.30, 350);
        nebPt3.position.set(220, -100, 30);
        scene.add(nebPt3);

        /* ── Planet data ── */
        var V    = vis();
        var pArr = []; // { grp, bx, by, bz, ry, rx, os, op, orr }

        /* ══════════════════════════════════════════════════════
           ① LARGE RINGED PLANET — upper-left, partially cropped
              Matches reference: Saturn-like, blue-purple tones
           ══════════════════════════════════════════════════════ */
        var p1r = isMobile ? V.w * 0.14 : V.w * 0.12;
        var p1  = makePlanet({
            radius:     p1r,
            bodyColor:  0x09061e,
            emissive:   0x14044a,
            emissiveInt: 0.22,
            shininess:  5,
            rimColor:   0x3a18bb,
            rings: {
                inner:   p1r * 1.30,
                outer:   p1r * 2.15,
                outer2:  p1r * 2.65,
                opacity: 0.74,
                stops: [
                    [0.00, 'rgba(20, 5, 80, 0)'],
                    [0.04, 'rgba(60,25,160,0.48)'],
                    [0.18, 'rgba(100,50,200,0.78)'],
                    [0.38, 'rgba(72,28,158,0.52)'],
                    [0.55, 'rgba(95,45,190,0.68)'],
                    [0.72, 'rgba(62,20,145,0.44)'],
                    [0.88, 'rgba(40, 8,115,0.25)'],
                    [1.00, 'rgba(18, 3, 70, 0)'],
                ],
                stops2: [
                    [0.00, 'rgba(40,12,120, 0)'],
                    [0.30, 'rgba(72,32,158,0.30)'],
                    [0.65, 'rgba(55,18,138,0.22)'],
                    [1.00, 'rgba(28, 6,100, 0)'],
                ],
            },
            ringTilt: 1.12,
        });
        /* Position: upper-left, mostly off-screen — only right
           portion of sphere + rings visible in viewport        */
        p1.position.set(-V.w * 0.43, V.h * 0.38, -5);
        p1.rotation.z = 0.05;
        scene.add(p1);
        pArr.push({ grp: p1, bx: -V.w * 0.43, by: V.h * 0.38, bz: -5,
                    ry: 0.00042, rx: 0.00007, os: 0.025, op: 0, orr: 2.8 });

        /* ══════════════════════════════════════════════════════
           ② VERY LARGE DARK PLANET — bottom-left, partially cropped
              Matches reference: dark surface, bright violet rim
           ══════════════════════════════════════════════════════ */
        var p2r = isMobile ? V.w * 0.19 : V.w * 0.160;
        var p2  = makePlanet({
            radius:     p2r,
            bodyColor:  0x050312,
            emissive:   0x0f0535,
            emissiveInt: 0.18,
            shininess:  2,
            rimColor:   0x8800ee,  // bright violet rim
        });
        /* Position: bottom-left, mostly below viewport */
        p2.position.set(-V.w * 0.30, -V.h * 0.50, 10);
        scene.add(p2);
        pArr.push({ grp: p2, bx: -V.w * 0.30, by: -V.h * 0.50, bz: 10,
                    ry: 0.00028, rx: 0.0, os: 0.018, op: Math.PI * 0.38, orr: 2.2 });

        /* ══════════════════════════════════════════════════════
           ③ MEDIUM DARK PLANET — upper-right, partially cropped
              Matches reference: dark sphere at far right
           ══════════════════════════════════════════════════════ */
        if (!isMobile) {
            var p3r = V.w * 0.050;
            var p3  = makePlanet({
                radius:     p3r,
                bodyColor:  0x0c0920,
                emissive:   0x180750,
                emissiveInt: 0.18,
                shininess:  12,
                rimColor:   0x2a0ea8,
            });
            p3.position.set(V.w * 0.45, V.h * 0.36, -22);
            scene.add(p3);
            pArr.push({ grp: p3, bx: V.w * 0.45, by: V.h * 0.36, bz: -22,
                        ry: 0.00090, rx: 0.00015, os: 0.048, op: Math.PI, orr: 1.6 });
        }

        /* ══════════════════════════════════════════════════════
           ④ SMALL PLANET — right-center (near the nebula zone)
           ══════════════════════════════════════════════════════ */
        if (!isMobile) {
            var p4r = V.w * 0.030;
            var p4  = makePlanet({
                radius:     p4r,
                bodyColor:  0x0e0828,
                emissive:   0x1e0d52,
                emissiveInt: 0.24,
                shininess:  20,
                rimColor:   0x9922ee,
            });
            p4.position.set(V.w * 0.32, -V.h * 0.22, -18);
            scene.add(p4);
            pArr.push({ grp: p4, bx: V.w * 0.32, by: -V.h * 0.22, bz: -18,
                        ry: 0.0016, rx: 0.0, os: 0.070, op: Math.PI * 0.6, orr: 2.2 });
        }

        /* ══════════════════════════════════════════════════════
           ⑤ TINY MOON — near ringed planet (adds depth/scale)
           ══════════════════════════════════════════════════════ */
        if (!isMobile) {
            var p5r = V.w * 0.014;
            var p5  = makePlanet({
                radius:     p5r,
                bodyColor:  0x14102c,
                emissive:   0x0e0a24,
                emissiveInt: 0.08,
                shininess:  5,
                rimColor:   0x2a1590,
            });
            p5.position.set(-V.w * 0.28, V.h * 0.21, -9);
            scene.add(p5);
            pArr.push({ grp: p5, bx: -V.w * 0.28, by: V.h * 0.21, bz: -9,
                        ry: 0.0018, rx: 0.0, os: 0.10, op: Math.PI * 0.85, orr: 3.5 });
        }

        /* ══════════════════════════════════════════════════════
           ⑥ SPARSE ASTEROIDS — reference-style scattered debris
              Kept minimal: ~10 clusters, none in the center
           ══════════════════════════════════════════════════════ */
        var asteroids = [];
        if (!isMobile) {
            var aGeos = [
                new THREE.IcosahedronGeometry(1.2, 0),
                new THREE.IcosahedronGeometry(0.8, 0),
                new THREE.IcosahedronGeometry(0.55, 0),
            ];
            var aMat = new THREE.MeshPhongMaterial({
                color: 0x181028, emissive: 0x080516, shininess: 3,
            });
            /* Keep asteroids near the edges — NOT in the center */
            var astPts = [
                [-V.w * 0.14,  V.h * 0.24, -38],
                [-V.w * 0.24, -V.h * 0.16, -36],
                [-V.w * 0.38,  V.h * 0.14, -26],
                [ V.w * 0.40,  V.h * 0.14, -38],
                [ V.w * 0.38, -V.h * 0.12, -30],
                [-V.w * 0.06,  V.h * 0.44, -32],
                [ V.w * 0.24, -V.h * 0.40, -34],
                [-V.w * 0.04, -V.h * 0.30, -44],
                [ V.w * 0.18,  V.h * 0.30, -40],
                [ V.w * 0.12, -V.h * 0.16, -48],
            ];
            for (var ai = 0; ai < astPts.length; ai++) {
                var aGrp = new THREE.Group();
                var cnt  = 1 + Math.floor(Math.random() * 2);
                for (var ab = 0; ab < cnt; ab++) {
                    var aM = new THREE.Mesh(aGeos[Math.floor(Math.random() * aGeos.length)], aMat);
                    var sc = 0.4 + Math.random() * 1.8;
                    aM.scale.setScalar(sc);
                    aM.rotation.set(Math.random()*7, Math.random()*7, Math.random()*7);
                    aM.position.set((Math.random()-0.5)*3, (Math.random()-0.5)*3, 0);
                    aGrp.add(aM);
                }
                aGrp.position.set(astPts[ai][0], astPts[ai][1], astPts[ai][2]);
                aGrp.userData.ry = 0.001 + Math.random() * 0.003;
                aGrp.userData.rx = 0.0005 + Math.random() * 0.0015;
                scene.add(aGrp);
                asteroids.push(aGrp);
            }
        }

        /* ── Reduced-motion media query ── */
        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function (e) {
            reducedMotion = e.matches;
        });

        /* ── Animation loop ── */
        var clock = new THREE.Clock();

        function loop() {
            requestAnimationFrame(loop);

            if (document.body.classList.contains('light-theme')) {
                renderer.clear();
                return;
            }

            var t = clock.getElapsedTime();

            if (!reducedMotion) {
                /* Slow planet rotation + very gentle orbital drift */
                for (var i = 0; i < pArr.length; i++) {
                    var pd   = pArr[i];
                    var body = pd.grp.userData.body;
                    if (body) {
                        body.rotation.y += pd.ry;
                        if (pd.rx) body.rotation.x += pd.rx;
                    }
                    /* Elliptical drift — barely perceptible */
                    var ph = pd.op + t * pd.os;
                    pd.grp.position.x = pd.bx + Math.cos(ph) * (pd.orr || 2);
                    pd.grp.position.y = pd.by + Math.sin(ph) * (pd.orr || 2) * 0.5;
                }

                /* Asteroid slow tumble */
                for (var j = 0; j < asteroids.length; j++) {
                    asteroids[j].rotation.y += asteroids[j].userData.ry;
                    asteroids[j].rotation.x += asteroids[j].userData.rx;
                }
            }

            renderer.render(scene, camera);
        }

        loop();

        /* Mark body so CSS can coordinate */
        document.body.classList.add('cosmic-3d-ready');

        /* Resize */
        window.addEventListener('resize', function () {
            W = window.innerWidth; H = window.innerHeight;
            isMobile = W < 768;
            camera.aspect = W / H;
            camera.updateProjectionMatrix();
            renderer.setSize(W, H);
        });
    }

    /* ── Bootstrap ── */
    waitForThree(function () {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    });

})();
