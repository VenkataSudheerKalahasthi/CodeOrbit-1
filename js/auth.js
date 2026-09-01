/**
 * Auth Manager for DSA Practice Tracker & CodeOrbit
 * Handles Login/Signup/Password-Reset modals, Supabase authentication integration,
 * double-submission guards, and user session state management.
 */

const AuthManager = {
    _initialized: false,
    _isSubmitting: false,

    async init() {
        if (this._initialized) return;
        this._initialized = true;

        this.bindEvents();

        // 1. Initialize Supabase Auth Session listener if configured
        if (typeof AuthService !== 'undefined') {
            AuthService.onAuthStateChange(async (event, session) => {
                if (event === 'SIGNED_IN' && session?.user) {
                    await this.syncAuthSession(session.user);
                } else if (event === 'SIGNED_OUT') {
                    if (window.RealtimeService) {
                        window.RealtimeService.unsubscribeAll();
                    }
                    StorageManager.setCurrentUserId(null);
                    if (window.UIManager) {
                        window.UIManager.renderApp();
                    }
                }
            });

            // Check existing active session on startup
            const session = await AuthService.getSession();
            if (session?.user) {
                await this.syncAuthSession(session.user);
            }
        }
    },

    async syncAuthSession(user) {
        if (!user) return;
        try {
            // Instant local cache initialization with auth user metadata to eliminate flicker
            const currentCachedUser = StorageManager.getCurrentUser();
            const metaUsername = user.user_metadata?.username;
            if (metaUsername && (!currentCachedUser || currentCachedUser.id !== user.id)) {
                StorageManager.saveCurrentUserLocally({
                    id: user.id,
                    username: metaUsername,
                    displayName: user.user_metadata?.display_name || metaUsername,
                    completedProblems: [],
                    dailyMissionStars: 0,
                    currentStreak: 0,
                    longestStreak: 0,
                    favorites: [],
                    notes: {},
                    completionDates: {}
                });
                StorageManager.setCurrentUserId(user.id);
                if (window.UIManager) {
                    window.UIManager.renderApp();
                }
            }

            // Always restore authoritative cloud state
            if (window.MigrationService) {
                await window.MigrationService.restoreFromCloud(user.id);
            }

            // Subscribe to real-time progress changes across tabs/devices
            if (window.RealtimeService && user.id) {
                window.RealtimeService.subscribeToUserSync(user.id, async () => {
                    if (window.MigrationService) {
                        await window.MigrationService.restoreFromCloud(user.id);
                    }
                    if (window.UIManager) {
                        window.UIManager.renderApp();
                    }
                });
            }
        } catch (e) {
            console.error('AuthManager.syncAuthSession error:', e);
        }

        if (window.UIManager) {
            window.UIManager.renderApp();
        }
    },

    bindEvents() {
        const loginBtn = document.getElementById("nav-login-btn");
        const profileBtn = document.getElementById("nav-profile-btn");
        const modalOverlay = document.getElementById("auth-modal-overlay");
        const closeModalBtn = document.getElementById("close-auth-modal");
        const authForm = document.getElementById("auth-form");
        const authSwitchLink = document.getElementById("auth-switch-link");
        const forgotLink = document.getElementById("auth-forgot-link");
        const logoutBtn = document.getElementById("nav-logout-btn");
        const passwordInput = document.getElementById("auth-password");

        if (loginBtn) {
            loginBtn.addEventListener("click", () => this.openModal("login"));
        }

        if (profileBtn) {
            profileBtn.addEventListener("click", () => {
                const modal = document.getElementById("settings-modal-overlay");
                if (modal) modal.classList.add("active");
            });
        }

        if (closeModalBtn && modalOverlay) {
            closeModalBtn.addEventListener("click", () => this.closeModal());
            modalOverlay.addEventListener("click", (e) => {
                if (e.target === modalOverlay) this.closeModal();
            });
        }

        if (authSwitchLink) {
            authSwitchLink.addEventListener("click", () => {
                const currentMode = authForm.dataset.mode || "login";
                if (currentMode === "reset") {
                    this.switchMode("login");
                } else {
                    this.switchMode(currentMode === "login" ? "signup" : "login");
                }
            });
        }

        if (forgotLink) {
            forgotLink.addEventListener("click", (e) => {
                e.preventDefault();
                this.switchMode("reset");
            });
        }

        // Real-time password strength evaluator on typing
        if (passwordInput) {
            passwordInput.addEventListener("input", (e) => {
                const mode = authForm ? authForm.dataset.mode : "login";
                if (mode === "signup") {
                    this.evaluatePasswordStrength(e.target.value);
                }
            });
        }

        if (authForm) {
            authForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                await this.handleSubmit();
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener("click", async () => {
                if (typeof AuthService !== 'undefined') {
                    await AuthService.signOut();
                }
                StorageManager.logout();
                if (window.UIManager) {
                    window.UIManager.showToast("Logged out successfully.");
                    window.UIManager.renderApp();
                }
                const modal = document.getElementById("settings-modal-overlay");
                if (modal) modal.classList.remove("active");
            });
        }
    },

    evaluatePasswordStrength(password) {
        const wrap = document.getElementById("auth-password-strength-wrap");
        if (!wrap) return { isValid: false, score: 0 };

        const hasLength = password.length >= 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNum = /[0-9]/.test(password);
        const hasSpec = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const updateReq = (id, valid) => {
            const el = document.getElementById(id);
            if (el) {
                el.style.color = valid ? '#22c55e' : '#ef4444';
                el.innerHTML = valid ? `<span>✓</span> ${el.textContent.replace(/^[✓✕]\s*/, '')}` : `<span>✕</span> ${el.textContent.replace(/^[✓✕]\s*/, '')}`;
            }
        };

        updateReq('pwd-req-len', hasLength);
        updateReq('pwd-req-upper', hasUpper);
        updateReq('pwd-req-lower', hasLower);
        updateReq('pwd-req-num', hasNum);
        updateReq('pwd-req-spec', hasSpec);

        let score = 0;
        if (hasLength) score++;
        if (hasUpper) score++;
        if (hasLower) score++;
        if (hasNum) score++;
        if (hasSpec) score++;

        const bar = document.getElementById("pwd-strength-bar");
        const label = document.getElementById("pwd-strength-label");

        if (bar && label) {
            if (password.length === 0) {
                bar.style.width = '0%';
                bar.style.background = '#ef4444';
                label.textContent = 'Too Weak';
                label.style.color = '#ef4444';
            } else if (score <= 2) {
                bar.style.width = '25%';
                bar.style.background = '#ef4444';
                label.textContent = 'Weak';
                label.style.color = '#ef4444';
            } else if (score <= 4) {
                bar.style.width = '65%';
                bar.style.background = '#f59e0b';
                label.textContent = 'Medium';
                label.style.color = '#f59e0b';
            } else {
                bar.style.width = '100%';
                bar.style.background = '#22c55e';
                label.textContent = 'Strong';
                label.style.color = '#22c55e';
            }
        }

        return {
            isValid: (hasLength && hasUpper && hasLower && hasNum && hasSpec),
            score: score
        };
    },

    openModal(mode = "login") {
        const overlay = document.getElementById("auth-modal-overlay");
        if (!overlay) return;
        this.switchMode(mode);
        this.clearError();
        overlay.classList.add("active");
    },

    closeModal() {
        const overlay = document.getElementById("auth-modal-overlay");
        if (overlay) overlay.classList.remove("active");
        this.clearError();
    },

    switchMode(mode) {
        const form = document.getElementById("auth-form");
        const title = document.getElementById("auth-modal-title");
        const submitBtn = document.getElementById("auth-submit-btn");
        const switchText = document.getElementById("auth-switch-prompt");
        const switchLink = document.getElementById("auth-switch-link");
        const usernameGroup = document.getElementById("auth-username-group");
        const emailGroup = document.getElementById("auth-email-group");
        const passwordGroup = document.getElementById("auth-password-group");
        const confirmGroup = document.getElementById("auth-confirm-group");
        const forgotWrap = document.getElementById("auth-forgot-wrap");
        const strengthWrap = document.getElementById("auth-password-strength-wrap");

        if (!form) return;
        form.dataset.mode = mode;
        this.clearError();

        if (mode === "signup") {
            title.textContent = "Create Account";
            submitBtn.textContent = "Create Account";
            switchText.textContent = "Already have an account?";
            switchLink.textContent = "Log In";
            if (usernameGroup) usernameGroup.style.display = "block";
            if (emailGroup) emailGroup.style.display = "block";
            if (passwordGroup) passwordGroup.style.display = "block";
            if (confirmGroup) confirmGroup.style.display = "block";
            if (forgotWrap) forgotWrap.style.display = "none";
            if (strengthWrap) {
                strengthWrap.style.display = "block";
                const pwdInput = document.getElementById("auth-password");
                this.evaluatePasswordStrength(pwdInput ? pwdInput.value : "");
            }
        } else if (mode === "reset") {
            title.textContent = "Reset Password";
            submitBtn.textContent = "Send Reset Link";
            switchText.textContent = "Remember your password?";
            switchLink.textContent = "Log In";
            if (usernameGroup) usernameGroup.style.display = "none";
            if (emailGroup) emailGroup.style.display = "block";
            if (passwordGroup) passwordGroup.style.display = "none";
            if (confirmGroup) confirmGroup.style.display = "none";
            if (forgotWrap) forgotWrap.style.display = "none";
            if (strengthWrap) strengthWrap.style.display = "none";
        } else { // login
            title.textContent = "Welcome Back";
            submitBtn.textContent = "Log In";
            switchText.textContent = "Don't have an account?";
            switchLink.textContent = "Sign Up";
            if (usernameGroup) usernameGroup.style.display = "none";
            if (emailGroup) emailGroup.style.display = "block";
            if (passwordGroup) passwordGroup.style.display = "block";
            if (confirmGroup) confirmGroup.style.display = "none";
            if (forgotWrap) forgotWrap.style.display = "block";
            if (strengthWrap) strengthWrap.style.display = "none";
        }
    },

    showError(msg) {
        const err = document.getElementById("auth-error-msg");
        if (err) {
            err.textContent = msg;
            err.classList.add("active");
        }
    },

    clearError() {
        const err = document.getElementById("auth-error-msg");
        if (err) {
            err.textContent = "";
            err.classList.remove("active");
        }
    },

    async handleSubmit() {
        if (this._isSubmitting) return;

        const form = document.getElementById("auth-form");
        const mode = form.dataset.mode || "login";
        const usernameInput = document.getElementById("auth-username");
        const emailInput = document.getElementById("auth-email");
        const passwordInput = document.getElementById("auth-password");
        const confirmInput = document.getElementById("auth-confirm-password");
        const submitBtn = document.getElementById("auth-submit-btn");

        const username = usernameInput ? usernameInput.value.trim() : "";
        const email = emailInput ? emailInput.value.trim() : "";
        const password = passwordInput ? passwordInput.value : "";
        const confirmPass = confirmInput ? confirmInput.value : "";

        this.clearError();

        this._isSubmitting = true;
        const prevBtnText = submitBtn ? submitBtn.textContent : "";
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Processing...";
        }

        try {
            const isSupabase = typeof window.SupabaseConfig !== 'undefined' && window.SupabaseConfig.isConfigured();

            if (mode === "signup") {
                if (!username) throw new Error("Please choose a unique username.");
                if (username.length < 3) throw new Error("Username must be at least 3 characters.");
                if (!email) throw new Error("Please enter an email address.");
                
                // Validate password strength policy
                const strength = this.evaluatePasswordStrength(password);
                if (!strength.isValid) {
                    throw new Error("Password must meet all 5 security requirements (8+ chars, uppercase, lowercase, number, and special character).");
                }

                if (password !== confirmPass) throw new Error("Passwords do not match.");

                if (isSupabase) {
                    const signupRes = await AuthService.signUp(email, password, username);
                    if (window.UIManager) {
                        if (signupRes?.user && signupRes?.session) {
                            window.UIManager.showToast(`Welcome to CodeOrbit, ${username}! 🚀`);
                        } else {
                            window.UIManager.showToast(`Account created! You can now log in.`);
                        }
                    }
                } else {
                    await StorageManager.registerUser(username, password);
                    if (window.UIManager) {
                        window.UIManager.showToast(`Account created for ${username}!`);
                    }
                }
            } else if (mode === "reset") {
                if (!email) throw new Error("Please enter your registered email address.");
                if (isSupabase) {
                    await AuthService.resetPassword(email);
                    if (window.UIManager) {
                        window.UIManager.showToast("If an account exists for this email, a password reset link has been sent.");
                    }
                    this.switchMode("login");
                    this.closeModal();
                    return;
                } else {
                    throw new Error("Password reset is only available with Supabase cloud connection.");
                }
            } else { // login
                if (!email) throw new Error("Please enter your email or username.");
                if (!password) throw new Error("Please enter your password.");

                if (isSupabase) {
                    await AuthService.signIn(email, password);
                    if (window.UIManager) {
                        window.UIManager.showToast("Welcome back!");
                    }
                } else {
                    await StorageManager.loginUser(email, password);
                    if (window.UIManager) {
                        window.UIManager.showToast(`Welcome back, ${email}!`);
                    }
                }
            }

            this.closeModal();
            if (usernameInput) usernameInput.value = "";
            if (emailInput) emailInput.value = "";
            if (passwordInput) passwordInput.value = "";
            if (confirmInput) confirmInput.value = "";

            if (window.UIManager) {
                window.UIManager.renderApp();
            }
        } catch (err) {
            let msg = err.message || "Authentication error occurred.";
            if (err.message && (err.message.toLowerCase().includes("email rate limit") || err.message.toLowerCase().includes("over_email_send_rate_limit"))) {
                msg = "Supabase email rate limit reached. Please disable 'Confirm email' in Supabase Dashboard (Authentication → Providers → Email) so signups complete immediately without sending confirmation emails.";
            } else if (err.message && err.message.toLowerCase().includes("rate limit")) {
                msg = "Rate limit reached on Supabase. Please wait a moment before trying again.";
            } else if (err.message && err.message.toLowerCase().includes("email not confirmed")) {
                msg = "Your email has not been confirmed yet. Please disable 'Confirm email' in Supabase Dashboard (Authentication → Providers → Email) to enable direct sign in.";
            }
            this.showError(msg);
        } finally {
            this._isSubmitting = false;
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = prevBtnText;
            }
        }
    }
};

window.AuthManager = AuthManager;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}
