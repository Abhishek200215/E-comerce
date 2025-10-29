// Main JavaScript File
class FashionStore {
    constructor() {
        this.init();
    }

    init() {
        this.initNavigation();
        this.initHeroSlider();
        this.initAnimations();
        this.initCart();
        this.loadFeaturedProducts();
        this.initNewsletter();
    }

    // Navigation functionality
    initNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Hamburger menu toggle
        if (hamburger) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.classList.toggle('no-scroll');
            });
        }

        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });

        // Update active nav link based on current page
        this.updateActiveNavLink();
    }

    updateActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    // Hero slider functionality
    initHeroSlider() {
        const slides = document.querySelectorAll('.slide');
        const prevBtn = document.querySelector('.slider-btn.prev');
        const nextBtn = document.querySelector('.slider-btn.next');
        let currentSlide = 0;

        if (slides.length === 0) return;

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            slides[index].classList.add('active');
            currentSlide = index;
        }

        function nextSlide() {
            let next = currentSlide + 1;
            if (next >= slides.length) next = 0;
            showSlide(next);
        }

        function prevSlide() {
            let prev = currentSlide - 1;
            if (prev < 0) prev = slides.length - 1;
            showSlide(prev);
        }

        // Auto slide every 5 seconds
        setInterval(nextSlide, 5000);

        // Button events
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    }

    // Animation initialization
    initAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all elements with animation classes
        const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-fade-up, .animate-scale');
        animatedElements.forEach(el => observer.observe(el));
    }

    // Cart functionality
    initCart() {
        this.updateCartCount();
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCount = document.querySelector('.cart-count');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (cartCount) {
            cartCount.textContent = totalItems;
            if (totalItems > 0) {
                cartCount.classList.add('cart-bounce');
                setTimeout(() => cartCount.classList.remove('cart-bounce'), 500);
            }
        }
    }

    // Load featured products
    async loadFeaturedProducts() {
        const productsGrid = document.getElementById('featuredProducts');
        if (!productsGrid) return;

        try {
            // Simulated product data - in real app, this would be an API call
            const products = [
                {
                    id: 1,
                    name: "Classic White T-Shirt",
                    price: 29.99,
                    originalPrice: 39.99,
                    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
                    rating: 4.5,
                    badge: "Bestseller"
                },
                {
                    id: 2,
                    name: "Denim Jacket",
                    price: 79.99,
                    originalPrice: 99.99,
                    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    rating: 4.8,
                    badge: "New"
                },
                {
                    id: 3,
                    name: "Summer Dress",
                    price: 49.99,
                    originalPrice: 69.99,
                    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                    rating: 4.3,
                    badge: "Sale"
                },
                {
                    id: 4,
                    name: "Casual Sneakers",
                    price: 89.99,
                    originalPrice: 119.99,
                    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2012&q=80",
                    rating: 4.7,
                    badge: "Popular"
                }
            ];

            productsGrid.innerHTML = products.map(product => `
                <div class="product-card stagger-item">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                    </div>
                    <div class="product-content">
                        <h3 class="product-title">${product.name}</h3>
                        <div class="product-price">
                            <span class="current-price">$${product.price}</span>
                            ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
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

        } catch (error) {
            console.error('Error loading featured products:', error);
            productsGrid.innerHTML = '<p class="error-message">Failed to load products. Please try again later.</p>';
        }
    }

    generateStarRating(rating) {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push('<i class="fas fa-star"></i>');
        }

        if (hasHalfStar) {
            stars.push('<i class="fas fa-star-half-alt"></i>');
        }

        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push('<i class="far fa-star"></i>');
        }

        return stars.join('');
    }

    // Newsletter functionality
    initNewsletter() {
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('input[type="email"]').value;
                
                if (this.validateEmail(email)) {
                    this.showNotification('Successfully subscribed to newsletter!', 'success');
                    newsletterForm.reset();
                } else {
                    this.showNotification('Please enter a valid email address.', 'error');
                }
            });
        }
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Notification system
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Global add to cart function
function addToCart(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = getProductById(productId);
    
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        const store = new FashionStore();
        store.updateCartCount();
        store.showNotification('Product added to cart!', 'success');
    }
}

function getProductById(productId) {
    // This would typically come from an API
    const products = {
        1: { id: 1, name: "Classic White T-Shirt", price: 29.99, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80" },
        2: { id: 2, name: "Denim Jacket", price: 79.99, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" },
        3: { id: 3, name: "Summer Dress", price: 49.99, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" },
        4: { id: 4, name: "Casual Sneakers", price: 89.99, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2012&q=80" }
    };
    
    return products[productId];
}

// Initialize the store when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FashionStore();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FashionStore, addToCart };
}