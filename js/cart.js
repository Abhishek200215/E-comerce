// Cart Page Functionality
class CartManager {
    constructor() {
        this.cart = [];
        this.suggestedProducts = [];
        this.promoCode = null;
        this.init();
    }

    init() {
        this.loadCart();
        this.loadSuggestedProducts();
        this.initEventListeners();
        this.updateCartDisplay();
    }

    loadCart() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    loadSuggestedProducts() {
        // Load suggested products based on cart items
        this.suggestedProducts = [
            {
                id: 5,
                name: "Casual Hoodie",
                price: 49.99,
                image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                rating: 4.4
            },
            {
                id: 6,
                name: "Sports Shorts",
                price: 34.99,
                image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2036&q=80",
                rating: 4.6
            },
            {
                id: 7,
                name: "Designer Sunglasses",
                price: 89.99,
                image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
                rating: 4.8
            },
            {
                id: 8,
                name: "Leather Belt",
                price: 29.99,
                image: "https://images.unsplash.com/photo-1601679147132-ef649c6c77d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                rating: 4.3
            }
        ];

        this.renderSuggestedProducts();
    }

    initEventListeners() {
        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.proceedToCheckout();
            });
        }
    }

    updateCartDisplay() {
        this.renderCartItems();
        this.updateCartSummary();
        this.updateCartCount();
        this.updateCheckoutButton();
    }

    renderCartItems() {
        const container = document.getElementById('cartItemsList');
        if (!container) return;

        if (this.cart.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some items to get started</p>
                    <a href="shop.html" class="btn btn-primary">Continue Shopping</a>
                </div>
            `;
            return;
        }

        container.innerHTML = this.cart.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-header">
                        <div>
                            <h3 class="cart-item-name">${item.name}</h3>
                            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        </div>
                        <button class="cart-item-remove" onclick="cartManager.removeFromCart(${item.id})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="cart-item-options">
                        <span>Color: Black</span>
                        <span>Size: M</span>
                    </div>
                    
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                               onchange="cartManager.updateQuantity(${item.id}, parseInt(this.value))">
                        <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    
                    <div class="cart-item-total">
                        Total: $${(item.price * item.quantity).toFixed(2)}
                    </div>
                </div>
            </div>
        `).join('');

        document.getElementById('cartItemsCount').textContent = this.getTotalItems();
    }

    updateCartSummary() {
        const subtotal = this.calculateSubtotal();
        const shipping = this.calculateShipping(subtotal);
        const tax = this.calculateTax(subtotal);
        const discount = this.calculateDiscount(subtotal);
        const total = subtotal + shipping + tax - discount;

        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('discount').textContent = `-$${discount.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }

    calculateSubtotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    calculateShipping(subtotal) {
        return subtotal >= 50 ? 0 : 5.99;
    }

    calculateTax(subtotal) {
        return subtotal * 0.08; // 8% tax
    }

    calculateDiscount(subtotal) {
        if (!this.promoCode) return 0;

        const promo = this.getPromoCode(this.promoCode);
        if (!promo) return 0;

        if (promo.type === 'percentage') {
            return subtotal * (promo.value / 100);
        } else {
            return promo.value;
        }
    }

    getPromoCode(code) {
        const promoCodes = {
            'SAVE10': { type: 'percentage', value: 10, minOrder: 50 },
            'WELCOME15': { type: 'percentage', value: 15, minOrder: 30 },
            'FREESHIP': { type: 'shipping', value: 5.99, minOrder: 0 },
            'SAVE20': { type: 'percentage', value: 20, minOrder: 100 }
        };
        return promoCodes[code.toUpperCase()];
    }

    applyPromoCode() {
        const codeInput = document.getElementById('promoCode');
        const messageElement = document.getElementById('promoMessage');
        const code = codeInput.value.trim();

        if (!code) {
            messageElement.textContent = 'Please enter a promo code';
            messageElement.className = 'promo-message error';
            return;
        }

        const promo = this.getPromoCode(code);
        if (!promo) {
            messageElement.textContent = 'Invalid promo code';
            messageElement.className = 'promo-message error';
            return;
        }

        const subtotal = this.calculateSubtotal();
        if (subtotal < promo.minOrder) {
            messageElement.textContent = `Minimum order of $${promo.minOrder} required`;
            messageElement.className = 'promo-message error';
            return;
        }

        this.promoCode = code;
        messageElement.textContent = 'Promo code applied successfully!';
        messageElement.className = 'promo-message success';
        this.updateCartSummary();
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity < 1) {
            this.removeFromCart(productId);
            return;
        }

        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.updateCartDisplay();
            this.showNotification('Quantity updated', 'success');
        }
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification('Item removed from cart', 'success');
    }

    clearCart() {
        if (this.cart.length === 0) return;

        if (confirm('Are you sure you want to clear your cart?')) {
            this.cart = [];
            this.saveCart();
            this.updateCartDisplay();
            this.showNotification('Cart cleared', 'success');
        }
    }

    getTotalItems() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = this.getTotalItems();
        }
    }

    updateCheckoutButton() {
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.disabled = this.cart.length === 0;
        }
    }

    proceedToCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty', 'error');
            return;
        }

        // Check if user is logged in
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            this.showNotification('Please log in to proceed to checkout', 'error');
            setTimeout(() => {
                window.location.href = 'login.html?redirect=checkout';
            }, 1500);
            return;
        }

        // In a real app, this would redirect to checkout page
        this.showNotification('Proceeding to checkout...', 'success');
        
        // Simulate checkout process
        setTimeout(() => {
            // Create order
            const order = {
                id: 'ORD-' + Date.now(),
                date: new Date().toISOString(),
                items: [...this.cart],
                total: this.calculateSubtotal() + this.calculateShipping(this.calculateSubtotal()) + this.calculateTax(this.calculateSubtotal()) - this.calculateDiscount(this.calculateSubtotal()),
                status: 'processing'
            };

            // Save order to user's order history
            const userOrders = JSON.parse(localStorage.getItem('userOrders')) || [];
            userOrders.unshift(order);
            localStorage.setItem('userOrders', JSON.stringify(userOrders));

            // Clear cart
            this.cart = [];
            this.saveCart();
            this.updateCartDisplay();

            this.showNotification('Order placed successfully!', 'success');
            
            // Redirect to order confirmation
            setTimeout(() => {
                window.location.href = 'profile.html?tab=orders';
            }, 2000);
        }, 2000);
    }

    renderSuggestedProducts() {
        const container = document.getElementById('suggestedProducts');
        if (!container) return;

        container.innerHTML = this.suggestedProducts.map(product => `
            <div class="product-card stagger-item">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-content">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                    </div>
                    <div class="product-rating">
                        ${this.generateStarRating(product.rating)}
                        <span>(${product.rating})</span>
                    </div>
                    <button class="btn btn-primary add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }

    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let stars = '';
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        return stars;
    }

    showNotification(message, type = 'success') {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// Global add to cart function (updated)
function addToCart(productId) {
    const product = getProductById(productId);
    if (!product) return;

    const cartManager = window.cartManager;
    const existingItem = cartManager.cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartManager.cart.push({
            ...product,
            quantity: 1
        });
    }

    cartManager.saveCart();
    cartManager.updateCartDisplay();
    cartManager.showNotification('Product added to cart!', 'success');
}

function getProductById(productId) {
    const products = {
        1: { id: 1, name: "Classic White T-Shirt", price: 29.99, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80" },
        2: { id: 2, name: "Denim Jacket", price: 79.99, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" },
        3: { id: 3, name: "Summer Dress", price: 49.99, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" },
        4: { id: 4, name: "Casual Sneakers", price: 89.99, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2012&q=80" },
        5: { id: 5, name: "Casual Hoodie", price: 49.99, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" },
        6: { id: 6, name: "Sports Shorts", price: 34.99, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2036&q=80" },
        7: { id: 7, name: "Designer Sunglasses", price: 89.99, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80" },
        8: { id: 8, name: "Leather Belt", price: 29.99, image: "https://images.unsplash.com/photo-1601679147132-ef649c6c77d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" }
    };
    
    return products[productId];
}

// Initialize cart manager when DOM is loaded
let cartManager;
document.addEventListener('DOMContentLoaded', () => {
    cartManager = new CartManager();
});