// Login Page Functionality
class LoginManager {
    constructor() {
        this.currentTab = 'login';
        this.init();
    }

    init() {
        this.initTabSwitching();
        this.initFormValidation();
        this.initPasswordToggles();
        this.initPasswordStrength();
        this.initForgotPassword();
        this.checkRedirect();
    }

    initTabSwitching() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const forms = document.querySelectorAll('.login-form');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });

        // Check if there's a preferred tab in URL
        const urlParams = new URLSearchParams(window.location.search);
        const preferredTab = urlParams.get('tab');
        if (preferredTab && (preferredTab === 'login' || preferredTab === 'register')) {
            this.switchTab(preferredTab);
        }
    }

    switchTab(tab) {
        // Update tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // Update forms
        document.querySelectorAll('.login-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById(`${tab}Form`).classList.add('active');

        this.currentTab = tab;

        // Update URL without reload
        const newUrl = window.location.pathname + `?tab=${tab}`;
        window.history.replaceState({}, '', newUrl);
    }

    initFormValidation() {
        // Login form validation
        const loginForm = document.getElementById('loginFormElement');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });

            // Real-time validation
            this.initRealTimeValidation('loginEmail', this.validateEmail);
            this.initRealTimeValidation('loginPassword', this.validatePassword);
        }

        // Register form validation
        const registerForm = document.getElementById('registerFormElement');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegistration();
            });

            // Real-time validation
            this.initRealTimeValidation('registerFirstName', this.validateName);
            this.initRealTimeValidation('registerLastName', this.validateName);
            this.initRealTimeValidation('registerEmail', this.validateEmail);
            this.initRealTimeValidation('registerPassword', this.validatePasswordStrength);
            this.initRealTimeValidation('registerConfirmPassword', this.validatePasswordMatch);
        }
    }

    initRealTimeValidation(fieldId, validationFunction) {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', () => {
                validationFunction.call(this, fieldId);
            });
            field.addEventListener('input', () => {
                this.clearFieldError(fieldId);
            });
        }
    }

    validateEmail(fieldId) {
        const field = document.getElementById(fieldId);
        const value = field.value.trim();
        const errorElement = document.getElementById(`${fieldId}Error`);

        if (!value) {
            this.showFieldError(fieldId, 'Email is required');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            this.showFieldError(fieldId, 'Please enter a valid email address');
            return false;
        }

        this.showFieldSuccess(fieldId);
        return true;
    }

    validatePassword(fieldId) {
        const field = document.getElementById(fieldId);
        const value = field.value;
        const errorElement = document.getElementById(`${fieldId}Error`);

        if (!value) {
            this.showFieldError(fieldId, 'Password is required');
            return false;
        }

        if (value.length < 6) {
            this.showFieldError(fieldId, 'Password must be at least 6 characters');
            return false;
        }

        this.showFieldSuccess(fieldId);
        return true;
    }

    validateName(fieldId) {
        const field = document.getElementById(fieldId);
        const value = field.value.trim();
        const errorElement = document.getElementById(`${fieldId}Error`);

        if (!value) {
            this.showFieldError(fieldId, 'This field is required');
            return false;
        }

        if (value.length < 2) {
            this.showFieldError(fieldId, 'Must be at least 2 characters');
            return false;
        }

        this.showFieldSuccess(fieldId);
        return true;
    }

    validatePasswordStrength(fieldId) {
        const field = document.getElementById(fieldId);
        const value = field.value;
        const strength = this.calculatePasswordStrength(value);

        this.updatePasswordStrength(strength);

        if (!value) {
            this.showFieldError(fieldId, 'Password is required');
            return false;
        }

        if (value.length < 6) {
            this.showFieldError(fieldId, 'Password must be at least 6 characters');
            return false;
        }

        if (strength.score < 2) {
            this.showFieldError(fieldId, 'Password is too weak');
            return false;
        }

        this.showFieldSuccess(fieldId);
        return true;
    }

    validatePasswordMatch(fieldId) {
        const field = document.getElementById(fieldId);
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = field.value;
        const errorElement = document.getElementById(`${fieldId}Error`);

        if (!confirmPassword) {
            this.showFieldError(fieldId, 'Please confirm your password');
            return false;
        }

        if (password !== confirmPassword) {
            this.showFieldError(fieldId, 'Passwords do not match');
            return false;
        }

        this.showFieldSuccess(fieldId);
        return true;
    }

    calculatePasswordStrength(password) {
        let score = 0;
        let feedback = [];

        if (password.length >= 8) score++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) score++;
        if (password.match(/\d/)) score++;
        if (password.match(/[^a-zA-Z\d]/)) score++;

        if (score === 0) {
            feedback = ['Very weak'];
        } else if (score === 1) {
            feedback = ['Weak'];
        } else if (score === 2) {
            feedback = ['Medium'];
        } else if (score === 3) {
            feedback = ['Strong'];
        } else {
            feedback = ['Very strong'];
        }

        return { score, feedback: feedback[0] };
    }

    updatePasswordStrength(strength) {
        const fill = document.getElementById('passwordStrengthFill');
        const text = document.getElementById('passwordStrengthText');

        if (!fill || !text) return;

        fill.className = 'strength-fill';
        text.className = 'strength-text';

        switch (strength.score) {
            case 0:
            case 1:
                fill.classList.add('strength-weak');
                text.classList.add('text-weak');
                text.textContent = 'Weak';
                break;
            case 2:
                fill.classList.add('strength-medium');
                text.classList.add('text-medium');
                text.textContent = 'Medium';
                break;
            case 3:
            case 4:
                fill.classList.add('strength-strong');
                text.classList.add('text-strong');
                text.textContent = 'Strong';
                break;
        }
    }

    showFieldError(fieldId, message) {
        this.clearFieldError(fieldId);
        
        const field = document.getElementById(fieldId);
        field.classList.add('error');
        field.classList.remove('success');
        
        const errorElement = document.getElementById(`${fieldId}Error`);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}Error`);
        
        if (field) {
            field.classList.remove('error', 'success');
        }
        
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    showFieldSuccess(fieldId) {
        const field = document.getElementById(fieldId);
        field.classList.remove('error');
        field.classList.add('success');
    }

    initPasswordToggles() {
        // Login password toggle
        const loginToggle = document.getElementById('loginPasswordToggle');
        if (loginToggle) {
            loginToggle.addEventListener('click', () => {
                this.togglePasswordVisibility('loginPassword', loginToggle);
            });
        }

        // Register password toggle
        const registerToggle = document.getElementById('registerPasswordToggle');
        if (registerToggle) {
            registerToggle.addEventListener('click', () => {
                this.togglePasswordVisibility('registerPassword', registerToggle);
            });
        }

        // Confirm password toggle
        const confirmToggle = document.getElementById('registerConfirmPasswordToggle');
        if (confirmToggle) {
            confirmToggle.addEventListener('click', () => {
                this.togglePasswordVisibility('registerConfirmPassword', confirmToggle);
            });
        }
    }

    togglePasswordVisibility(fieldId, toggleBtn) {
        const field = document.getElementById(fieldId);
        const icon = toggleBtn.querySelector('i');
        
        if (field.type === 'password') {
            field.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            field.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }

    initPasswordStrength() {
        const passwordField = document.getElementById('registerPassword');
        if (passwordField) {
            passwordField.addEventListener('input', () => {
                const strength = this.calculatePasswordStrength(passwordField.value);
                this.updatePasswordStrength(strength);
            });
        }
    }

    initForgotPassword() {
        const forgotLink = document.querySelector('.forgot-password');
        if (forgotLink) {
            forgotLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showForgotPassword();
            });
        }

        const forgotForm = document.getElementById('forgotPasswordForm');
        if (forgotForm) {
            forgotForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleForgotPassword();
            });
        }
    }

    showForgotPassword() {
        document.getElementById('forgotPasswordModal').classList.add('active');
    }

    hideForgotPassword() {
        document.getElementById('forgotPasswordModal').classList.remove('active');
    }

    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        const submitBtn = document.getElementById('loginSubmit');

        // Validate form
        if (!this.validateEmail('loginEmail') || !this.validatePassword('loginPassword')) {
            this.showNotification('Please fix the errors in the form', 'error');
            return;
        }

        // Show loading state
        this.setButtonLoading(submitBtn, true);

        try {
            // Use the auth manager from auth.js
            if (typeof authManager !== 'undefined') {
                const user = await authManager.login(email, password);
                this.showNotification('Login successful!', 'success');
                
                // Remember me functionality
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                }

                // Redirect based on URL parameter or default
                this.redirectAfterLogin();
                
            } else {
                throw new Error('Authentication system not available');
            }
        } catch (error) {
            this.showNotification(error.message, 'error');
            this.setButtonLoading(submitBtn, false);
        }
    }

    async handleRegistration() {
        const formData = new FormData(document.getElementById('registerFormElement'));
        const data = Object.fromEntries(formData.entries());
        const submitBtn = document.getElementById('registerSubmit');

        // Validate all fields
        const isValid = 
            this.validateName('registerFirstName') &&
            this.validateName('registerLastName') &&
            this.validateEmail('registerEmail') &&
            this.validatePasswordStrength('registerPassword') &&
            this.validatePasswordMatch('registerConfirmPassword');

        // Check terms acceptance
        const termsAccepted = document.getElementById('acceptTerms').checked;
        if (!termsAccepted) {
            this.showFieldError('acceptTerms', 'You must accept the terms and conditions');
            isValid = false;
        }

        if (!isValid) {
            this.showNotification('Please fix the errors in the form', 'error');
            return;
        }

        // Show loading state
        this.setButtonLoading(submitBtn, true);

        try {
            // Use the auth manager from auth.js
            if (typeof authManager !== 'undefined') {
                const user = await authManager.register({
                    name: `${data.firstName} ${data.lastName}`,
                    email: data.email,
                    password: data.password
                });

                this.showNotification('Account created successfully!', 'success');
                
                // Redirect after registration
                this.redirectAfterLogin();
                
            } else {
                throw new Error('Registration system not available');
            }
        } catch (error) {
            this.showNotification(error.message, 'error');
            this.setButtonLoading(submitBtn, false);
        }
    }

    async handleForgotPassword() {
        const email = document.getElementById('forgotEmail').value;
        
        if (!this.validateEmail('forgotEmail')) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Simulate sending reset email
        this.showNotification('Reset link sent to your email!', 'success');
        this.hideForgotPassword();

        // In a real app, this would be an API call
        setTimeout(() => {
            document.getElementById('forgotEmail').value = '';
        }, 1000);
    }

    setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.classList.add('loading');
        } else {
            button.disabled = false;
            button.classList.remove('loading');
        }
    }

    redirectAfterLogin() {
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');
        
        setTimeout(() => {
            if (redirect === 'checkout') {
                window.location.href = 'cart.html';
            } else if (redirect === 'profile') {
                window.location.href = 'profile.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 1500);
    }

    checkRedirect() {
        // Check if user is already logged in
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get('redirect');
            
            if (redirect) {
                this.redirectAfterLogin();
            } else {
                window.location.href = 'profile.html';
            }
        }
    }

    showNotification(message, type = 'success') {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            // Fallback notification
            alert(message);
        }
    }
}

// Initialize login manager when DOM is loaded
let loginManager;
document.addEventListener('DOMContentLoaded', () => {
    loginManager = new LoginManager();
});