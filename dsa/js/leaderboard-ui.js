/**
 * Competitive Leaderboard UI Controller for CodeOrbit Challenges
 * 
 * Features:
 * - Subtle futuristic vertical rail on the left side of the Challenges page
 * - Smooth hover expansion on desktop & tap interaction on mobile/tablet
 * - Multi-category tabs: [ WEEKLY ] [ MONTHLY ] [ ALL TIME ]
 * - 100% real Supabase data with zero mock/fake users
 * - Deterministic tie-breaking, rank movement tracking, and sticky current-user rank bar
 * - Single managed Realtime channel with 500ms debounce
 */

const LeaderboardUI = (function () {
    'use strict';

    let _currentCategory = 'all-time';
    let _isLoading = false;
    let _isExpanded = false;
    let _hoverTimeout = null;
    let _eventsBound = false;
    let _realtimeSubscribed = false;

    function getContainer() {
        return document.getElementById('challenges-leaderboard-rail');
    }

    function getCurrentUserId() {
        if (typeof StorageManager !== 'undefined' && StorageManager.getCurrentUser) {
            const u = StorageManager.getCurrentUser();
            return u?.id || null;
        }
        return null;
    }

    function getInitials(name) {
        if (!name || typeof name !== 'string') return 'U';
        const parts = name.trim().split(/[\s_-]+/);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    return {
        init() {
            this.renderRailStructure();
            this.bindEvents();
            this.loadLeaderboard(_currentCategory, false);
            this.initRealtime();
        },

        renderRailStructure() {
            let container = getContainer();
            const challengesView = document.getElementById('view-challenges');
            if (!container) {
                if (!challengesView) return;
                
                container = document.createElement('aside');
                container.id = 'challenges-leaderboard-rail';
                container.className = 'leaderboard-rail-wrap';
                container.setAttribute('aria-label', 'Competitive Leaderboard');
                challengesView.insertBefore(container, challengesView.firstChild);
            }

            // Ensure mobile backdrop is mounted directly on document.body
            // so CSS transforms on the rail container do not create a containing block trap
            let backdrop = document.getElementById('leaderboard-backdrop');
            if (!backdrop) {
                backdrop = document.createElement('div');
                backdrop.id = 'leaderboard-backdrop';
                backdrop.className = 'leaderboard-mobile-backdrop';
                document.body.appendChild(backdrop);
            }

            container.innerHTML = `
                <!-- Expanded Futuristic Glassmorphism Panel (Attached on Left) -->
                <div class="leaderboard-panel-expanded" id="leaderboard-panel" aria-hidden="true">
                    <!-- Panel Header -->
                    <div class="lb-panel-header">
                        <div class="lb-header-title-row">
                            <div class="lb-title-group">
                                <span class="lb-trophy-header-icon">🏆</span>
                                <h3 class="lb-panel-title">TOP CONTESTANTS</h3>
                                <span class="lb-live-badge"><span class="lb-pulse-dot"></span> LIVE</span>
                            </div>
                            <button class="lb-close-btn" id="leaderboard-close-btn" aria-label="Close Leaderboard" title="Close Leaderboard">&times;</button>
                        </div>
                        
                        <!-- Category Switcher Tabs -->
                        <div class="lb-category-tabs" role="tablist">
                            <button class="lb-category-tab ${ _currentCategory === 'weekly' ? 'active' : '' }" data-category="weekly" role="tab">WEEKLY</button>
                            <button class="lb-category-tab ${ _currentCategory === 'monthly' ? 'active' : '' }" data-category="monthly" role="tab">MONTHLY</button>
                            <button class="lb-category-tab ${ _currentCategory === 'all-time' ? 'active' : '' }" data-category="all-time" role="tab">ALL TIME</button>
                        </div>
                    </div>

                    <!-- Panel Scrollable Body -->
                    <div class="lb-panel-body" id="leaderboard-list-container">
                        ${ this.renderSkeletons() }
                    </div>

                    <!-- Sticky Bottom User Rank Bar -->
                    <div class="lb-panel-footer" id="leaderboard-user-footer">
                        ${ this.renderUserFooter(null) }
                    </div>
                </div>

                <!-- Attached Vertical Rail Handle Tab -->
                <button class="leaderboard-rail-collapsed" id="leaderboard-rail-trigger" aria-label="Expand Top Contestants Leaderboard" aria-expanded="false" role="button" tabindex="0">
                    <div class="rail-glow-bar"></div>
                    <div class="rail-icon-wrap">
                        <span class="rail-trophy-icon">🏆</span>
                        <span class="rail-live-pulse" title="Live Competition"></span>
                    </div>
                    <div class="rail-vertical-text">
                        <span>TOP CONTESTANTS</span>
                    </div>
                    <div class="rail-expand-arrow">›</div>
                </button>
            `;
        },

        renderSkeletons() {
            return `
                <div class="lb-skeleton-list">
                    <div class="lb-skeleton-card">
                        <div class="lb-sk-rank"></div>
                        <div class="lb-sk-avatar"></div>
                        <div class="lb-sk-content">
                            <div class="lb-sk-line lb-sk-name"></div>
                            <div class="lb-sk-line lb-sk-stats"></div>
                        </div>
                        <div class="lb-sk-score"></div>
                    </div>
                    <div class="lb-skeleton-card">
                        <div class="lb-sk-rank"></div>
                        <div class="lb-sk-avatar"></div>
                        <div class="lb-sk-content">
                            <div class="lb-sk-line lb-sk-name"></div>
                            <div class="lb-sk-line lb-sk-stats"></div>
                        </div>
                        <div class="lb-sk-score"></div>
                    </div>
                    <div class="lb-skeleton-card">
                        <div class="lb-sk-rank"></div>
                        <div class="lb-sk-avatar"></div>
                        <div class="lb-sk-content">
                            <div class="lb-sk-line lb-sk-name"></div>
                            <div class="lb-sk-line lb-sk-stats"></div>
                        </div>
                        <div class="lb-sk-score"></div>
                    </div>
                </div>
            `;
        },

        renderUserFooter(userPos) {
            const currentUserId = getCurrentUserId();
            if (!currentUserId) {
                return `
                    <div class="lb-user-rank-box unauthenticated">
                        <div class="lb-unauth-text">
                            <span class="lb-unauth-icon">🔒</span>
                            <span>Log in to track your competitive rank</span>
                        </div>
                        <button class="btn-lb-login" onclick="AuthManager.openModal('login')">Log In</button>
                    </div>
                `;
            }

            if (!userPos) {
                return `
                    <div class="lb-user-rank-box loading">
                        <span>Calculating your position...</span>
                    </div>
                `;
            }

            return `
                <div class="lb-user-rank-box authenticated">
                    <div class="lb-user-rank-left">
                        <div class="lb-user-avatar-mini">${getInitials(userPos.displayName || userPos.username)}</div>
                        <div class="lb-user-rank-info">
                            <div class="lb-user-rank-badge">YOUR RANK: <strong>#${userPos.rank}</strong></div>
                            <div class="lb-user-mini-stats">
                                <span>⭐ ${userPos.stars}</span>
                                <span>🔥 ${userPos.currentStreak}d</span>
                                <span>✓ ${userPos.completedProblems}</span>
                            </div>
                        </div>
                    </div>
                    <div class="lb-user-rank-right">
                        <span class="lb-user-score-val">${userPos.competitiveScore}</span>
                        <span class="lb-user-score-lbl">pts</span>
                    </div>
                </div>
            `;
        },

        renderUserCards(users, currentUserId) {
            if (!users || users.length === 0) {
                return `
                    <div class="lb-empty-state">
                        <div class="lb-empty-icon">🏆</div>
                        <div class="lb-empty-title">No contestants yet.</div>
                        <p class="lb-empty-desc">Be the first to solve today's challenge and claim the #1 rank!</p>
                    </div>
                `;
            }

            return `
                <div class="lb-contestants-list">
                    ${users.map((u) => {
                        const isMe = currentUserId && (u.userId === currentUserId || String(u.userId) === String(currentUserId));
                        const rankClass = u.rank === 1 ? 'rank-gold' : (u.rank === 2 ? 'rank-silver' : (u.rank === 3 ? 'rank-bronze' : 'rank-standard'));
                        const rankMedal = u.rank === 1 ? '🥇' : (u.rank === 2 ? '🥈' : (u.rank === 3 ? '🥉' : `#${u.rank}`));

                        let deltaClass = 'delta-neutral';
                        let deltaIcon = '—';
                        if (u.movement > 0) {
                            deltaClass = 'delta-up';
                            deltaIcon = `↑+${u.movement}`;
                        } else if (u.movement < 0) {
                            deltaClass = 'delta-down';
                            deltaIcon = `↓${Math.abs(u.movement)}`;
                        }

                        const initials = getInitials(u.displayName || u.username);

                        return `
                            <div class="lb-contestant-card ${rankClass} ${isMe ? 'is-current-user' : ''}">
                                <!-- Rank & Movement -->
                                <div class="lb-card-rank-col">
                                    <span class="lb-rank-badge ${rankClass}">${rankMedal}</span>
                                    <span class="lb-rank-delta ${deltaClass}" title="Rank change">${deltaIcon}</span>
                                </div>

                                <!-- Avatar -->
                                <div class="lb-card-avatar-wrap">
                                    ${u.avatarUrl ? `
                                        <img src="${escapeHtml(u.avatarUrl)}" alt="${escapeHtml(u.username)}" class="lb-card-avatar-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                                        <div class="lb-card-avatar-initials" style="display:none;">${initials}</div>
                                    ` : `
                                        <div class="lb-card-avatar-initials">${initials}</div>
                                    `}
                                </div>

                                <!-- Username & Stats -->
                                <div class="lb-card-info-col">
                                    <div class="lb-card-name-row">
                                        <span class="lb-card-username" title="${escapeHtml(u.username)}">
                                            ${escapeHtml(u.displayName || u.username)}
                                        </span>
                                        ${isMe ? '<span class="lb-you-tag">YOU</span>' : ''}
                                    </div>
                                    <div class="lb-card-stats-row">
                                        <span class="lb-stat-chip" title="Stars earned">⭐ ${u.stars}</span>
                                        <span class="lb-stat-chip" title="Current streak">🔥 ${u.currentStreak}d</span>
                                        <span class="lb-stat-chip" title="Problems completed">✓ ${u.completedProblems}</span>
                                    </div>
                                </div>

                                <!-- Competitive Score -->
                                <div class="lb-card-score-col">
                                    <span class="lb-score-number">${u.competitiveScore}</span>
                                    <span class="lb-score-unit">pts</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        },

        async loadLeaderboard(category = _currentCategory, isSilent = false) {
            _currentCategory = category;
            const container = document.getElementById('leaderboard-list-container');
            const footer = document.getElementById('leaderboard-user-footer');
            const currentUserId = getCurrentUserId();

            if (!isSilent && container) {
                container.innerHTML = this.renderSkeletons();
            }

            _isLoading = true;

            try {
                if (typeof window.LeaderboardService === 'undefined') {
                    throw new Error('LeaderboardService not loaded.');
                }

                const result = await window.LeaderboardService.getLeaderboard(category, 10, currentUserId);

                if (!result.success) {
                    if (container) {
                        container.innerHTML = `
                            <div class="lb-error-state">
                                <div class="lb-error-icon">⚠️</div>
                                <div class="lb-error-title">Unable to load leaderboard right now.</div>
                                <button class="btn-lb-retry" onclick="LeaderboardUI.loadLeaderboard('${category}', false)">Retry</button>
                            </div>
                        `;
                    }
                    return;
                }

                if (container) {
                    container.innerHTML = this.renderUserCards(result.users, currentUserId);
                }

                if (footer) {
                    footer.innerHTML = this.renderUserFooter(result.currentUserPosition);
                }
            } catch (err) {
                console.warn('LeaderboardUI load error:', err);
                if (container) {
                    container.innerHTML = `
                        <div class="lb-error-state">
                            <div class="lb-error-icon">⚠️</div>
                            <div class="lb-error-title">Unable to load leaderboard right now.</div>
                            <button class="btn-lb-retry" onclick="LeaderboardUI.loadLeaderboard('${category}', false)">Retry</button>
                        </div>
                    `;
                }
            } finally {
                _isLoading = false;
            }
        },

        expand() {
            _isExpanded = true;
            const railWrap = getContainer();
            const panel = document.getElementById('leaderboard-panel');
            const trigger = document.getElementById('leaderboard-rail-trigger');
            const backdrop = document.getElementById('leaderboard-backdrop');

            if (railWrap) railWrap.classList.add('expanded');
            if (panel) {
                panel.setAttribute('aria-hidden', 'false');
            }
            if (trigger) {
                trigger.setAttribute('aria-expanded', 'true');
            }
            if (backdrop) {
                backdrop.classList.add('active');
            }
        },

        collapse() {
            _isExpanded = false;
            const railWrap = getContainer();
            const panel = document.getElementById('leaderboard-panel');
            const trigger = document.getElementById('leaderboard-rail-trigger');
            const backdrop = document.getElementById('leaderboard-backdrop');

            if (railWrap) railWrap.classList.remove('expanded');
            if (panel) {
                panel.setAttribute('aria-hidden', 'true');
            }
            if (trigger) {
                trigger.setAttribute('aria-expanded', 'false');
            }
            if (backdrop) {
                backdrop.classList.remove('active');
            }
        },

        toggle() {
            if (_isExpanded) {
                this.collapse();
            } else {
                this.expand();
            }
        },

        bindEvents() {
            if (_eventsBound) return;
            const railWrap = getContainer();
            if (!railWrap) return;
            _eventsBound = true;

            // Desktop Hover Expansion
            railWrap.addEventListener('mouseenter', () => {
                if (window.innerWidth > 768) {
                    if (_hoverTimeout) clearTimeout(_hoverTimeout);
                    this.expand();
                }
            });

            railWrap.addEventListener('mouseleave', () => {
                if (window.innerWidth > 768) {
                    if (_hoverTimeout) clearTimeout(_hoverTimeout);
                    _hoverTimeout = setTimeout(() => {
                        this.collapse();
                    }, 280);
                }
            });

            // Trigger Button Click (Mobile tap / Desktop click)
            railWrap.addEventListener('click', (e) => {
                const triggerBtn = e.target.closest('#leaderboard-rail-trigger');
                if (triggerBtn) {
                    e.stopPropagation();
                    this.toggle();
                    return;
                }

                const closeBtn = e.target.closest('#leaderboard-close-btn');
                if (closeBtn) {
                    e.stopPropagation();
                    this.collapse();
                    return;
                }

                const catTab = e.target.closest('.lb-category-tab');
                if (catTab) {
                    e.stopPropagation();
                    const cat = catTab.dataset.category;
                    if (cat && cat !== _currentCategory) {
                        railWrap.querySelectorAll('.lb-category-tab').forEach(t => t.classList.remove('active'));
                        catTab.classList.add('active');
                        this.loadLeaderboard(cat, false);
                    }
                    return;
                }
            });

            // Mobile backdrop click
            const backdrop = document.getElementById('leaderboard-backdrop');
            if (backdrop) {
                backdrop.addEventListener('click', () => {
                    this.collapse();
                });
            }

            // Keyboard navigation on trigger button
            const triggerEl = document.getElementById('leaderboard-rail-trigger');
            if (triggerEl) {
                triggerEl.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggle();
                    }
                });
            }

            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (_isExpanded && e.key === 'Escape') {
                    this.collapse();
                }
            });
        },

        initRealtime() {
            if (_realtimeSubscribed || typeof window.RealtimeService === 'undefined') return;
            _realtimeSubscribed = true;

            // Single managed subscription listening to database updates
            window.RealtimeService.subscribeToLeaderboard(() => {
                // Silently refresh data on real database updates without disturbing user UI
                this.loadLeaderboard(_currentCategory, true);
            });
        },

        destroy() {
            if (_realtimeSubscribed && typeof window.RealtimeService !== 'undefined') {
                window.RealtimeService.unsubscribe('public:user_stats_leaderboard');
                _realtimeSubscribed = false;
            }
            this.collapse();
        }
    };
})();

window.LeaderboardUI = LeaderboardUI;
