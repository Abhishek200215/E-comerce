// Profile Page Functionality
class ProfileManager {
    constructor() {
        this.currentUser = null;
        this.currentTab = 'personal';
        this.addresses = [];
        this.orders = [];
        this.wishlist = [];
        this.init();
    }

    init() {
        this.loadUserData();
        this.initTabNavigation();
        this.initForms();
        this.loadAddresses();
        this.loadOrders();
        this.loadWishlist();
        this.initAvatarUpload();
    }

    loadUserData() {
        this.currentUser = JSON.parse(localStorage.getItem('user')) || this.getDefaultUser();
        this.updateProfileDisplay();
    }

    getDefaultUser() {
        return {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            birthdate: '1990-01-01',
            gender: 'male'
        };
    }

    updateProfileDisplay() {
        // Update profile summary
        document.getElementById('userName').textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
        document.getElementById('userEmail').textContent = this.currentUser.email;
        
        // Update form fields
        document.getElementById('firstName').value = this.currentUser.firstName || '';
        document.getElementById('lastName').value = this.currentUser.lastName || '';
        document.getElementById('email').value = this.currentUser.email || '';
        document.getElementById('phone').value = this.currentUser.phone || '';
        document.getElementById('birthdate').value = this.currentUser.birthdate || '';
        
        // Set gender radio
        if (this.currentUser.gender) {
            const genderRadio = document.querySelector(`input[name="gender"][value="${this.currentUser.gender}"]`);
            if (genderRadio) genderRadio.checked = true;
        }
    }

    initTabNavigation() {
        const navItems = document.querySelectorAll('.profile-nav .nav-item');
        const tabs = document.querySelectorAll('.profile-tab');
        
        // Check URL parameters for tab
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');
        if (tabParam) {
            this.switchTab(tabParam);
        }

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = item.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });
    }

    switchTab(tab) {
        // Update navigation
        document.querySelectorAll('.profile-nav .nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // Update tabs
        document.querySelectorAll('.profile-tab').forEach(tabElement => {
            tabElement.classList.remove('active');
        });
        document.getElementById(`${tab}Tab`).classList.add('active');

        this.currentTab = tab;
        
        // Update URL without page reload
        const newUrl = window.location.pathname + `?tab=${tab}`;
        window.history.replaceState({}, '', newUrl);
    }

    initForms() {
        // Personal information form
        const personalForm = document.getElementById('personalForm');
        if (personalForm) {
            personalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.savePersonalInfo();
            });
        }

        // Password form
        const passwordForm = document.getElementById('passwordForm');
        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updatePassword();
            });
        }

        // Address form
        const addressForm = document.getElementById('addressForm');
        if (addressForm) {
            addressForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveAddress();
            });
        }
    }

    savePersonalInfo() {
        const formData = new FormData(document.getElementById('personalForm'));
        const data = Object.fromEntries(formData.entries());

        // Update user data
        this.currentUser = { ...this.currentUser, ...data };
        localStorage.setItem('user', JSON.stringify(this.currentUser));
        
        this.updateProfileDisplay();
        this.showNotification('Personal information updated successfully!', 'success');
    }

    updatePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            this.showNotification('Please fill in all password fields', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showNotification('New passwords do not match', 'error');
            return;
        }

        if (newPassword.length < 6) {
            this.showNotification('Password must be at least 6 characters long', 'error');
            return;
        }

        // Simulate password update
        setTimeout(() => {
            document.getElementById('passwordForm').reset();
            this.showNotification('Password updated successfully!', 'success');
        }, 1000);
    }

    loadAddresses() {
        // Load from localStorage or use sample data
        this.addresses = JSON.parse(localStorage.getItem('userAddresses')) || [
            {
                id: 1,
                label: 'Home',
                street: '123 Main Street',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                country: 'US',
                isDefault: true
            }
        ];
        
        this.renderAddresses();
        this.updateAddressCount();
    }

    renderAddresses() {
        const container = document.getElementById('addressesGrid');
        if (!container) return;

        if (this.addresses.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-map-marker-alt"></i>
                    <h3>No addresses saved</h3>
                    <p>Add your first address to get started</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.addresses.map(address => `
            <div class="address-card ${address.isDefault ? 'default' : ''}">
                <div class="address-header">
                    <span class="address-label">${address.label}</span>
                    ${address.isDefault ? '<span class="default-badge">Default</span>' : ''}
                </div>
                <div class="address-details">
                    <p>${address.street}</p>
                    <p>${address.city}, ${address.state} ${address.zipCode}</p>
                    <p>${this.getCountryName(address.country)}</p>
                </div>
                <div class="address-actions">
                    <button class="btn btn-text" onclick="profileManager.editAddress(${address.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    ${!address.isDefault ? `
                        <button class="btn btn-text" onclick="profileManager.setDefaultAddress(${address.id})">
                            <i class="fas fa-star"></i> Set Default
                        </button>
                        <button class="btn btn-text text-danger" onclick="profileManager.deleteAddress(${address.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    getCountryName(countryCode) {
        const countries = {
            'US': 'United States',
            'CA': 'Canada',
            'UK': 'United Kingdom'
        };
        return countries[countryCode] || countryCode;
    }

    showAddressForm(addressId = null) {
        const modal = document.getElementById('addressModal');
        const title = document.getElementById('addressModalTitle');
        const form = document.getElementById('addressForm');
        
        if (addressId) {
            // Edit mode
            const address = this.addresses.find(addr => addr.id === addressId);
            if (address) {
                title.textContent = 'Edit Address';
                form.elements.label.value = address.label;
                form.elements.street.value = address.street;
                form.elements.city.value = address.city;
                form.elements.state.value = address.state;
                form.elements.zipCode.value = address.zipCode;
                form.elements.country.value = address.country;
                form.elements.isDefault.checked = address.isDefault;
                form.dataset.editId = addressId;
            }
        } else {
            // Add mode
            title.textContent = 'Add New Address';
            form.reset();
            delete form.dataset.editId;
        }
        
        modal.classList.add('active');
    }

    hideAddressForm() {
        document.getElementById('addressModal').classList.remove('active');
    }

    saveAddress() {
        const form = document.getElementById('addressForm');
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const isEdit = form.dataset.editId;

        if (isEdit) {
            // Update existing address
            const addressIndex = this.addresses.findIndex(addr => addr.id === parseInt(isEdit));
            if (addressIndex !== -1) {
                this.addresses[addressIndex] = {
                    ...this.addresses[addressIndex],
                    ...data,
                    isDefault: data.isDefault === 'on'
                };
            }
        } else {
            // Add new address
            const newAddress = {
                id: Date.now(),
                ...data,
                isDefault: data.isDefault === 'on'
            };
            
            if (newAddress.isDefault) {
                this.addresses.forEach(addr => addr.isDefault = false);
            }
            
            this.addresses.push(newAddress);
        }

        // Save to localStorage
        localStorage.setItem('userAddresses', JSON.stringify(this.addresses));
        
        this.renderAddresses();
        this.updateAddressCount();
        this.hideAddressForm();
        this.showNotification(`Address ${isEdit ? 'updated' : 'added'} successfully!`, 'success');
    }

    editAddress(addressId) {
        this.showAddressForm(addressId);
    }

    setDefaultAddress(addressId) {
        this.addresses.forEach(addr => {
            addr.isDefault = addr.id === addressId;
        });
        
        localStorage.setItem('userAddresses', JSON.stringify(this.addresses));
        this.renderAddresses();
        this.showNotification('Default address updated!', 'success');
    }

    deleteAddress(addressId) {
        if (confirm('Are you sure you want to delete this address?')) {
            this.addresses = this.addresses.filter(addr => addr.id !== addressId);
            localStorage.setItem('userAddresses', JSON.stringify(this.addresses));
            this.renderAddresses();
            this.updateAddressCount();
            this.showNotification('Address deleted successfully!', 'success');
        }
    }

    loadOrders() {
        // Load from localStorage or use sample data
        this.orders = JSON.parse(localStorage.getItem('userOrders')) || [
            {
                id: 'ORD-001',
                date: '2024-01-15',
                status: 'delivered',
                items: [
                    { name: 'Classic White T-Shirt', price: 29.99, quantity: 2, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80' },
                    { name: 'Denim Jacket', price: 79.99, quantity: 1, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' }
                ],
                total: 139.97
            }
        ];
        
        this.renderOrders();
        this.updateOrdersCount();
    }

    renderOrders() {
        const container = document.getElementById('ordersContainer');
        if (!container) return;

        if (this.orders.length === 0) {
            return; // Keep the empty state
        }

        const ordersHTML = this.orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <div class="order-id">Order #${order.id}</div>
                        <div class="order-date">Placed on ${new Date(order.date).toLocaleDateString()}</div>
                    </div>
                    <span class="order-status status-${order.status}">${this.formatOrderStatus(order.status)}</span>
                </div>
                
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.name}">
                            <div>
                                <div class="item-name">${item.name}</div>
                                <div class="item-quantity">Qty: ${item.quantity}</div>
                                <div class="item-price">$${item.price}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="order-footer">
                    <div class="order-total">Total: $${order.total}</div>
                    <div class="order-actions">
                        <button class="btn btn-outline" onclick="profileManager.viewOrderDetails('${order.id}')">
                            View Details
                        </button>
                        <button class="btn btn-primary" onclick="profileManager.reorder('${order.id}')">
                            Reorder
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = ordersHTML;
    }

    formatOrderStatus(status) {
        const statusMap = {
            'delivered': 'Delivered',
            'shipped': 'Shipped',
            'processing': 'Processing',
            'cancelled': 'Cancelled'
        };
        return statusMap[status] || status;
    }

    loadWishlist() {
        // Load from localStorage or use sample data
        this.wishlist = JSON.parse(localStorage.getItem('userWishlist')) || [];
        this.renderWishlist();
        this.updateWishlistCount();
    }

    renderWishlist() {
        const container = document.getElementById('wishlistContainer');
        if (!container) return;

        if (this.wishlist.length === 0) {
            return; // Keep the empty state
        }

        const wishlistHTML = `
            <div class="wishlist-grid">
                ${this.wishlist.map(item => `
                    <div class="product-card">
                        <div class="product-image">
                            <img src="${item.image}" alt="${item.name}">
                            <button class="remove-wishlist" onclick="profileManager.removeFromWishlist(${item.id})">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="product-content">
                            <h3 class="product-title">${item.name}</h3>
                            <div class="product-price">
                                <span class="current-price">$${item.price}</span>
                            </div>
                            <button class="btn btn-primary add-to-cart" onclick="addToCart(${item.id})">
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        container.innerHTML = wishlistHTML;
    }

    removeFromWishlist(productId) {
        this.wishlist = this.wishlist.filter(item => item.id !== productId);
        localStorage.setItem('userWishlist', JSON.stringify(this.wishlist));
        this.renderWishlist();
        this.updateWishlistCount();
        this.showNotification('Item removed from wishlist', 'success');
    }

    updateOrdersCount() {
        const count = this.orders.length;
        document.getElementById('ordersCount').textContent = count;
        document.getElementById('ordersBadge').textContent = count;
    }

    updateWishlistCount() {
        const count = this.wishlist.length;
        document.getElementById('wishlistCount').textContent = count;
        document.getElementById('wishlistBadge').textContent = count;
    }

    updateAddressCount() {
        // You can add address count to profile stats if needed
    }

    initAvatarUpload() {
        const avatarInput = document.getElementById('avatarInput');
        if (avatarInput) {
            avatarInput.addEventListener('change', (e) => {
                this.handleAvatarUpload(e.target.files[0]);
            });
        }
    }

    handleAvatarUpload(file) {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            this.showNotification('Please select an image file', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            this.showNotification('Image size should be less than 5MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('profileAvatar').src = e.target.result;
            // Save to localStorage
            localStorage.setItem('userAvatar', e.target.result);
            this.showNotification('Profile picture updated successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }

    resetForm() {
        this.updateProfileDisplay();
        this.showNotification('Form reset to saved values', 'info');
    }

    viewOrderDetails(orderId) {
        // In a real app, this would show order details
        this.showNotification(`Showing details for order ${orderId}`, 'info');
    }

    reorder(orderId) {
        // In a real app, this would add all items from the order to cart
        this.showNotification('Items added to cart from order', 'success');
    }

    showDeleteConfirmation() {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            this.deleteAccount();
        }
    }

    deleteAccount() {
        // Simulate account deletion
        setTimeout(() => {
            localStorage.removeItem('user');
            localStorage.removeItem('userAddresses');
            localStorage.removeItem('userOrders');
            localStorage.removeItem('userWishlist');
            localStorage.removeItem('userAvatar');
            
            this.showNotification('Account deleted successfully', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }, 1500);
    }

    showNotification(message, type = 'success') {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// Initialize profile manager when DOM is loaded
let profileManager;
document.addEventListener('DOMContentLoaded', () => {
    profileManager = new ProfileManager();
    
    // Load saved avatar
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
        document.getElementById('profileAvatar').src = savedAvatar;
    }
});