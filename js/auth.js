// Enhanced Authentication functionality
class AuthManager {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('user')) || null;
        this.init();
    }

    init() {
        this.checkAutoLogin();
        this.initLogout();
    }

    checkAutoLogin() {
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        if (rememberMe && this.currentUser) {
            this.updateNavigation();
        }
    }

    // Login function
    async login(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Mock user validation - in real app, this would be API call
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    this.currentUser = { 
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        firstName: user.name.split(' ')[0],
                        lastName: user.name.split(' ')[1] || '',
                        joinDate: user.createdAt
                    };
                    localStorage.setItem('user', JSON.stringify(this.currentUser));
                    this.updateNavigation();
                    resolve(this.currentUser);
                } else {
                    reject(new Error('Invalid email or password'));
                }
            }, 1000);
        });
    }
    
    // Register function
    async register(userData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('users')) || [];
                
                // Check if user already exists
                if (users.find(u => u.email === userData.email)) {
                    reject(new Error('User already exists with this email'));
                    return;
                }
                
                // Create new user
                const newUser = {
                    id: Date.now().toString(),
                    name: userData.name,
                    email: userData.email,
                    password: userData.password, // In real app, this should be hashed
                    createdAt: new Date().toISOString()
                };
                
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                
                // Auto login after registration
                this.currentUser = {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    firstName: newUser.name.split(' ')[0],
                    lastName: newUser.name.split(' ')[1] || '',
                    joinDate: newUser.createdAt
                };
                localStorage.setItem('user', JSON.stringify(this.currentUser));
                this.updateNavigation();
                
                resolve(this.currentUser);
            }, 1500);
        });
    }
    
    // Logout function
    logout() {
        this.currentUser = null;
        localStorage.removeItem('user');
        localStorage.removeItem('rememberMe');
        this.updateNavigation();
        window.location.href = 'index.html';
    }
    
    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }
    
    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Update navigation based on login status
    updateNavigation() {
        const loginBtn = document.getElementById('loginBtn');
        const userMenu = document.getElementById('userMenu');
        
        if (loginBtn && userMenu) {
            if (this.currentUser) {
                // User is logged in
                loginBtn.innerHTML = `<i class="fas fa-user-circle"></i> ${this.currentUser.firstName}`;
                loginBtn.href = 'profile.html';
                userMenu.style.display = 'block';
                
                // Add click event to toggle user menu
                loginBtn.addEventListener('click', function(e) {
                    if (window.innerWidth > 768) {
                        e.preventDefault();
                        userMenu.style.display = userMenu.style.display === 'none' ? 'block' : 'none';
                    }
                });
                
                // Close user menu when clicking outside
                document.addEventListener('click', function(e) {
                    if (!e.target.closest('.auth-item')) {
                        userMenu.style.display = 'none';
                    }
                });
            } else {
                // User is not logged in
                loginBtn.innerHTML = '<i class="fas fa-user"></i> Login';
                loginBtn.href = 'login.html';
                userMenu.style.display = 'none';
            }
        }
    }

    initLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Update navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    authManager.updateNavigation();
});