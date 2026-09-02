/**
 * Main Application Orchestrator for Ctrl+Alt+Career & DSA Practice Tracker
 * Initializes dataset, auth, contest UI, POTD, global theme, and default initial view.
 */

document.addEventListener("DOMContentLoaded", () => {
    console.log("Initializing Ctrl+Alt+Career Application...");

    // Validate dataset fidelity
    if (typeof PROBLEMS === "undefined" || !Array.isArray(PROBLEMS)) {
        console.error("CRITICAL ERROR: PROBLEMS dataset failed to load!");
        alert("CRITICAL ERROR: Problem database is missing.");
        return;
    }

    console.log(`Loaded master dataset with ${PROBLEMS.length} problems.`);

    // 1. Restore Auth & Session state
    AuthManager.init();

    // 2. Initialize Contest UI telemetry
    ContestUI.init();

    // 3. Initialize Problem of the Day (POTD)
    POTDManager.init();

    // 4. Initialize UI & restore global theme preference
    UIManager.init();

    // 5. Initialize Full-Year Streak Calendar
    if (typeof StreakCalendar !== "undefined") {
        StreakCalendar.init();
    }

    // 5b. Initialize Daily DSA Mission
    if (typeof DailyMissionManager !== "undefined") {
        DailyMissionManager.init();
    }

    // 5c. Initialize Competitive Leaderboard
    if (typeof LeaderboardUI !== "undefined") {
        LeaderboardUI.init();
    }

    // 6. Force default initial route to Challenges / Ctrl+Alt+Career Home Page
    UIManager.switchTab("challenges");

    console.log("Ctrl+Alt+Career initialized successfully with default view: CHALLENGES.");
});

// ── Scroll glass navbar ─────────────────────────────────────────────────────
// Toggles .is-scrolled / .navbar--glass when scrollY > 5px in light/dark themes.
// Only modifies DOM when threshold state actually changes.
(function () {
    'use strict';
    var navbar = null;
    var ticking = false;
    var isScrolledState = null;
    var THRESHOLD = 5;

    function updateGlass() {
        if (!navbar) return;
        var shouldBeScrolled = window.scrollY > THRESHOLD;
        if (shouldBeScrolled !== isScrolledState) {
            isScrolledState = shouldBeScrolled;
            if (shouldBeScrolled) {
                navbar.classList.add('is-scrolled', 'navbar--glass');
            } else {
                navbar.classList.remove('is-scrolled', 'navbar--glass');
            }
        }
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(updateGlass);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        navbar = document.querySelector('.navbar');
        if (navbar) {
            window.addEventListener('scroll', onScroll, { passive: true });
            updateGlass();
        }
    });
})();

// ── Mobile Hamburger Navigation ──────────────────────────────────────────────
// Self-contained IIFE. Exposes window.MobileNav for inline onclick handlers.
// Reuses UIManager.switchTab for navigation — no duplicate routing logic.
var MobileNav = (function () {
    'use strict';

    var btn     = null;
    var drawer  = null;
    var isOpen  = false;

    // ── Sync active state on drawer items ──
    function syncActiveTab(tab) {
        if (!drawer) return;
        drawer.querySelectorAll('.mobile-nav-item[data-tab]').forEach(function (el) {
            el.classList.toggle('active', el.getAttribute('data-tab') === tab);
        });
    }

    // ── Sync auth state (mirror desktop login/profile visibility) ──
    function syncAuth() {
        var desktopLogin   = document.getElementById('nav-login-btn');
        var desktopProfile = document.getElementById('nav-profile-btn');
        var mobileLogin    = document.getElementById('mobile-nav-login-btn');
        var mobileProfile  = document.getElementById('mobile-nav-profile-btn');
        var mobileAvatar   = document.getElementById('mobile-nav-user-avatar');
        var mobileUsername = document.getElementById('mobile-nav-username-display');

        if (!desktopLogin || !mobileLogin) return;

        var showingProfile = desktopProfile && desktopProfile.style.display !== 'none';
        mobileLogin.style.display  = showingProfile ? 'none'  : '';
        mobileProfile.style.display = showingProfile ? '' : 'none';

        if (showingProfile) {
            var da = document.getElementById('nav-user-avatar');
            var dn = document.getElementById('nav-username-display');
            var ds = document.getElementById('nav-stars-count');
            var ms = document.getElementById('mobile-nav-stars-count');
            if (da && mobileAvatar)   mobileAvatar.textContent   = da.textContent;
            if (dn && mobileUsername) mobileUsername.textContent = dn.textContent;
            if (ds && ms)             ms.textContent             = ds.textContent;
        }
    }

    // ── Open drawer ──
    function open() {
        isOpen = true;
        btn.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        btn.setAttribute('aria-label', 'Close navigation menu');
        drawer.classList.add('is-open');
        drawer.setAttribute('aria-hidden', 'false');
        syncAuth();
    }

    // ── Close drawer ──
    function close() {
        isOpen = false;
        btn.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Open navigation menu');
        drawer.classList.remove('is-open');
        drawer.setAttribute('aria-hidden', 'true');
    }

    // ── Toggle ──
    function toggle() {
        isOpen ? close() : open();
    }

    // ── Close and navigate (used by inline onclick) ──
    function closeAndSwitch(tab) {
        close();
        if (typeof UIManager !== 'undefined') {
            UIManager.switchTab(tab);
        }
        syncActiveTab(tab);
    }

    // ── Sync theme toggle emoji between desktop + mobile ──
    function syncThemeIcon() {
        var desktopBtn = document.getElementById('theme-toggle-btn');
        var mobileBtn  = document.getElementById('mobile-theme-toggle-btn');
        if (desktopBtn && mobileBtn) {
            mobileBtn.textContent = desktopBtn.textContent;
        }
    }

    // ── Init ──
    function init() {
        btn    = document.getElementById('mobile-menu-btn');
        drawer = document.getElementById('mobile-nav-drawer');
        if (!btn || !drawer) return;

        // Hamburger toggle
        btn.addEventListener('click', toggle);

        // Mirror theme-toggle click on mobile button
        var mobileThemeBtn = document.getElementById('mobile-theme-toggle-btn');
        var desktopThemeBtn = document.getElementById('theme-toggle-btn');
        if (mobileThemeBtn && desktopThemeBtn) {
            mobileThemeBtn.addEventListener('click', function () {
                desktopThemeBtn.click(); // delegate to existing handler
                setTimeout(syncThemeIcon, 50);
            });
            // Keep icon in sync when desktop theme changes
            desktopThemeBtn.addEventListener('click', function () {
                setTimeout(syncThemeIcon, 50);
            });
        }

        // Mirror auth button clicks
        var mobileLoginBtn = document.getElementById('mobile-nav-login-btn');
        var desktopLoginBtn = document.getElementById('nav-login-btn');
        if (mobileLoginBtn && desktopLoginBtn) {
            mobileLoginBtn.addEventListener('click', function () {
                close();
                desktopLoginBtn.click();
            });
        }

        var mobileProfileBtn = document.getElementById('mobile-nav-profile-btn');
        var desktopProfileBtn = document.getElementById('nav-profile-btn');
        if (mobileProfileBtn && desktopProfileBtn) {
            mobileProfileBtn.addEventListener('click', function () {
                close();
                desktopProfileBtn.click();
            });
        }

        // Close on outside click
        document.addEventListener('click', function (e) {
            if (isOpen && !btn.contains(e.target) && !drawer.contains(e.target)) {
                close();
            }
        });

        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (isOpen && e.key === 'Escape') {
                close();
                btn.focus();
            }
        });

        // Close drawer when viewport grows past mobile breakpoint
        window.addEventListener('resize', function () {
            if (window.innerWidth > 768 && isOpen) {
                close();
            }
        });

        // Sync active tab on init
        var activeTab = document.querySelector('.nav-tab.active');
        if (activeTab) {
            syncActiveTab(activeTab.getAttribute('data-tab'));
        }

        // Observe desktop nav-tab clicks to keep mobile active state in sync
        document.querySelectorAll('.nav-tab[data-tab]').forEach(function (el) {
            el.addEventListener('click', function () {
                syncActiveTab(el.getAttribute('data-tab'));
            });
        });
    }

    document.addEventListener('DOMContentLoaded', init);

    return { closeAndSwitch: closeAndSwitch, syncAuth: syncAuth };
})();
