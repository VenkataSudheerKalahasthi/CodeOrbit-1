/**
 * CodeOrbit — Admin Authentication & Portal Gate Controller
 * Enforces authoritative Supabase Auth + PostgreSQL RLS verification.
 */

document.addEventListener('DOMContentLoaded', async () => {
    const loadingEl = document.getElementById('admin-gate-loading');
    const loginEl = document.getElementById('admin-gate-login');
    const deniedEl = document.getElementById('admin-gate-denied');
    const deniedReason = document.getElementById('admin-denied-reason');
    const deniedAccount = document.getElementById('admin-denied-account');
    const switchAccountBtn = document.getElementById('admin-switch-account-btn');

    // 1. Password Visibility Toggle
    const toggleBtn = document.getElementById('toggle-admin-password');
    const passInput = document.getElementById('admin-login-password');
    if (toggleBtn && passInput) {
        const eyeOpenSvg = `
            <svg class="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            </svg>`;
        const eyeSlashSvg = `
            <svg class="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>`;

        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isPassword = passInput.type === 'password';
            passInput.type = isPassword ? 'text' : 'password';
            toggleBtn.innerHTML = isPassword ? eyeSlashSvg : eyeOpenSvg;
            const label = isPassword ? 'Hide password' : 'Show password';
            toggleBtn.setAttribute('aria-label', label);
            toggleBtn.setAttribute('title', label);
        });
    }

    // 2. Direct Admin Sign In Submit
    const loginForm = document.getElementById('admin-direct-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('admin-login-email');
            const errBox = document.getElementById('admin-login-error');
            const submitBtn = document.getElementById('admin-login-submit');

            const identifier = emailInput ? emailInput.value.trim() : '';
            const password = passInput ? passInput.value : '';

            if (!identifier || !password) return;

            errBox.style.display = 'none';
            submitBtn.disabled = true;
            submitBtn.textContent = 'Verifying Admin Credentials...';

            try {
                await AuthService.signIn(identifier, password);
                const isAdmin = await AdminService.checkIsAdmin();
                if (!isAdmin) {
                    await AuthService.signOut();
                    throw new Error('You are not authorized to access the Admin Portal.');
                }
                window.location.href = 'dashboard.html';
            } catch (err) {
                errBox.textContent = err.message || 'Authentication failed.';
                errBox.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Sign In to Admin Portal';
            }
        });
    }

    // 3. Admin Forgot Password Flow
    const forgotLink = document.getElementById('admin-forgot-link');
    const backToLoginLink = document.getElementById('admin-back-to-login');
    const resetForm = document.getElementById('admin-direct-reset-form');
    const resetEmailInput = document.getElementById('admin-reset-email');
    const resetStatus = document.getElementById('admin-reset-status');
    const resetSubmitBtn = document.getElementById('admin-reset-submit');

    if (forgotLink && loginForm && resetForm) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            const loginEmail = document.getElementById('admin-login-email');
            if (loginEmail && resetEmailInput) {
                resetEmailInput.value = loginEmail.value.trim();
            }
            loginForm.style.display = 'none';
            resetForm.style.display = 'block';
            if (resetStatus) resetStatus.style.display = 'none';
        });
    }

    if (backToLoginLink && loginForm && resetForm) {
        backToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            resetForm.style.display = 'none';
            loginForm.style.display = 'block';
            const errBox = document.getElementById('admin-login-error');
            if (errBox) errBox.style.display = 'none';
        });
    }

    if (resetForm) {
        resetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const identifier = resetEmailInput ? resetEmailInput.value.trim() : '';
            if (!identifier) return;

            if (resetStatus) resetStatus.style.display = 'none';
            if (resetSubmitBtn) {
                resetSubmitBtn.disabled = true;
                resetSubmitBtn.textContent = 'Sending Reset Link...';
            }

            try {
                await AuthService.resetPassword(identifier);
                if (resetStatus) {
                    resetStatus.style.display = 'block';
                    resetStatus.style.background = 'rgba(34, 197, 94, 0.12)';
                    resetStatus.style.border = '1px solid rgba(34, 197, 94, 0.35)';
                    resetStatus.style.color = '#86efac';
                    resetStatus.textContent = 'Password reset email sent. Check your inbox.';
                }
            } catch (err) {
                if (resetStatus) {
                    resetStatus.style.display = 'block';
                    resetStatus.style.background = 'rgba(239, 68, 68, 0.12)';
                    resetStatus.style.border = '1px solid rgba(239, 68, 68, 0.35)';
                    resetStatus.style.color = '#fca5a5';
                    resetStatus.textContent = err.message || 'Failed to send password reset email.';
                }
            } finally {
                if (resetSubmitBtn) {
                    resetSubmitBtn.disabled = false;
                    resetSubmitBtn.textContent = 'Send Password Reset Link';
                }
            }
        });
    }

    if (switchAccountBtn) {
        switchAccountBtn.addEventListener('click', async () => {
            await AuthService.signOut();
            deniedEl.style.display = 'none';
            loginEl.style.display = 'flex';
        });
    }

    // 4. Initial Session & Authorization Check
    try {
        let session = await AuthService.getSession();
        if (session?.user) {
            const isAdmin = await AdminService.checkIsAdmin();
            if (isAdmin) {
                // Already authenticated authorized admin -> redirect to dashboard
                window.location.href = 'dashboard.html';
                return;
            } else {
                // Authenticated as non-admin -> show 403 denied screen
                if (loadingEl) loadingEl.style.display = 'none';
                if (loginEl) loginEl.style.display = 'none';
                if (deniedReason) {
                    deniedReason.innerHTML = 'You do not have administrative privileges to access this control center.<br>This account is authenticated, but is not provisioned with the <code>admin</code> role in <code>public.user_roles</code>.';
                }
                if (deniedAccount) {
                    deniedAccount.style.display = 'block';
                    deniedAccount.innerHTML = `
                        <strong>Authenticated Account:</strong><br>
                        Email: <code>${session.user.email || 'N/A'}</code><br>
                        User UUID: <code>${session.user.id}</code>
                    `;
                }
                if (deniedEl) deniedEl.style.display = 'flex';
                return;
            }
        }

        // Not authenticated -> show login card
        if (loadingEl) loadingEl.style.display = 'none';
        if (deniedEl) deniedEl.style.display = 'none';
        if (loginEl) loginEl.style.display = 'flex';
    } catch (e) {
        console.error('Admin Auth Init error:', e);
        if (loadingEl) loadingEl.style.display = 'none';
        if (loginEl) loginEl.style.display = 'flex';
    }
});
