/**
 * DSAModeSelector
 * ---------------
 * Manages the "DSA Learning Mode" preference:
 *   "basic-medium"    — Easy ? Medium progression (default)
 *   "medium-advanced" — Medium ? Hard progression
 *
 * Persistence: localStorage key "dsa_learning_mode_v1"
 * This is intentionally separate from user-account storage so the
 * preference survives logout and is available before login.
 *
 * Usage (from HTML onclick): DSAModeSelector.select('basic-medium')
 * Usage (from JS):           const mode = DSAModeSelector.getMode();
 */

const DSAModeSelector = (function () {
    'use strict';

    const STORAGE_KEY   = 'dsa_learning_mode_v1';
    const DEFAULT_MODE  = 'basic-medium';
    const VALID_MODES   = ['basic-medium', 'medium-advanced'];

    // -- Internal helpers -----------------------------------------------------

    function _read() {
        try {
            const val = localStorage.getItem(STORAGE_KEY);
            return VALID_MODES.includes(val) ? val : DEFAULT_MODE;
        } catch (_) {
            return DEFAULT_MODE;
        }
    }

    function _write(mode) {
        try {
            localStorage.setItem(STORAGE_KEY, mode);
        } catch (_) {
            // Silently ignore storage errors (private browsing quotas, etc.)
        }
    }

    function _applyToDOM(mode) {
        VALID_MODES.forEach(function (m) {
            const card = document.getElementById('dsa-mode-card-' + m);
            if (!card) return;
            const isActive = (m === mode);
            card.classList.toggle('active', isActive);
            card.setAttribute('aria-pressed', String(isActive));
        });
    }

    // -- Public API -----------------------------------------------------------

    /**
     * Read the currently persisted mode value.
     * Returns 'basic-medium' | 'medium-advanced'.
     */
    function getMode() {
        return _read();
    }

    /**
     * Programmatically select a mode, persist it, and update the UI.
     * Safe to call before DOMContentLoaded (queues until DOM is ready).
     * @param {'basic-medium'|'medium-advanced'} mode
     */
    function select(mode) {
        if (!VALID_MODES.includes(mode)) {
            console.warn('[DSAModeSelector] Unknown mode:', mode);
            return;
        }
        _write(mode);
        _applyToDOM(mode);

        // Expose the current mode on window for other modules to read reactively
        window.dsaLearningMode = mode;

        // Dispatch a custom event so future modules can react without polling
        document.dispatchEvent(new CustomEvent('dsa-mode-changed', {
            bubbles: true,
            detail: { mode: mode }
        }));
    }

    /**
     * Initialise: read the persisted value and reflect it in the DOM.
     * Called automatically on DOMContentLoaded.
     */
    function init() {
        const mode = _read();
        window.dsaLearningMode = mode;
        _applyToDOM(mode);
    }

    // -- Auto-init ------------------------------------------------------------
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOMContentLoaded already fired (e.g. script is deferred)
        init();
    }

    return { getMode: getMode, select: select, init: init };
})();

window.DSAModeSelector = DSAModeSelector;
