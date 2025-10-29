// Shop Page Functionality
class ShopManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentView = 'grid';
        this.currentSort = 'default';
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.init();
    }

    init() {
        this.loadProducts();
        this.initEventListeners();
        this.initFilters();
        this.updateURLParams();
    }

    async loadProducts() {
        try {
            // Simulated product data - in real app, this would be an API call
            this.products = this.generateSampleProducts(50);
            this.filteredProducts = [...this.products];
            this.renderProducts();
            this.updateProductsCount();
        } catch (error) {
            console.error('Error loading products:', error);
            this.showError('Failed to load products. Please try again later.');
        }
    }

    generateSampleProducts(count) {
        const categories = ['men', 'women', 'kids', 'accessories'];
        const sizes = ['S', 'M', 'L', 'XL'];
        const colors = ['black', 'white', 'blue', 'red', 'green', 'yellow'];
        const brands = ['FashionFusion', 'StyleCraft', 'UrbanThreads', 'EliteWear'];
        
        return Array.from({ length: count }, (_, i) => {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const price = Math.floor(Math.random() * 200) + 20;
            const hasDiscount = Math.random() > 0.7;
            const discountPrice = hasDiscount ? price * 0.8 : null;
            
            return {
                id: i + 1,
                name: `${this.capitalize(category)} ${this.getProductType(category)} ${i + 1}`,
                price: discountPrice || price,
                originalPrice: hasDiscount ? price : null,
                category: category,
                brand: brands[Math.floor(Math.random() * brands.length)],
                sizes: this.getRandomSizes(sizes),
                colors: this.getRandomColors(colors),
                image: this.getProductImage(category, i),
                rating: (Math.random() * 1 + 4).toFixed(1),
                reviews: Math.floor(Math.random() * 100),
                badge: this.getRandomBadge(),
                inStock: Math.random() > 0.1
            };
        });
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    getProductType(category) {
        const types = {
            men: ['T-Shirt', 'Shirt', 'Jeans', 'Jacket', 'Shorts'],
            women: ['Dress', 'Blouse', 'Skirt', 'Jacket', 'Pants'],
            kids: ['T-Shirt', 'Dress', 'Shorts', 'Sweater', 'Pants'],
            accessories: ['Hat', 'Bag', 'Belt', 'Scarf', 'Watch']
        };
        const categoryTypes = types[category] || types.men;
        return categoryTypes[Math.floor(Math.random() * categoryTypes.length)];
    }

    getRandomSizes(sizes) {
        return sizes.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 1);
    }

    getRandomColors(colors) {
        return colors.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 1);
    }

    getProductImage(category, index) {
        const categoryImages = {
            men: [
                'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
                'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
            ],
            women: [
                'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                'https://images.unsplash.com/photo-1485231183945-fffde7cb34f0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80'
            ],
            kids: [
                'https://images.unsplash.com/photo-1519457431-44ccd64a579b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
            ],
            accessories: [
                'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2012&q=80'
            ]
        };
        
        const images = categoryImages[category] || categoryImages.men;
        return images[index % images.length];
    }

    getRandomBadge() {
        const badges = ['Bestseller', 'New', 'Sale', 'Popular', 'Limited'];
        return Math.random() > 0.5 ? badges[Math.floor(Math.random() * badges.length)] : null;
    }

    initEventListeners() {
        // View controls
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setView(e.target.closest('.view-btn').dataset.view);
            });
        });

        // Sort controls
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.setSort(e.target.value);
            });
        }

        // Filter toggle
        const filterToggle = document.getElementById('filterToggle');
        if (filterToggle) {
            filterToggle.addEventListener('click', () => {
                this.toggleFilters();
            });
        }

        // Apply filters
        const applyBtn = document.querySelector('.apply-filters');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.applyFilters();
            });
        }

        // Reset filters
        const resetBtn = document.querySelector('.reset-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetFilters();
            });
        }

        // Pagination
        document.querySelectorAll('.pagination-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const direction = e.target.closest('.pagination-btn').classList.contains('prev') ? 'prev' : 'next';
                this.changePage(direction);
            });
        });

        document.querySelectorAll('.page-number').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = parseInt(e.target.textContent);
                this.goToPage(page);
            });
        });
    }

    initFilters() {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        if (category) {
            const checkbox = document.querySelector(`input[name="category"][value="${category}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        }
        
        this.applyFilters();
    }

    setView(view) {
        this.currentView = view;
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        const container = document.getElementById('productsContainer');
        container.className = `products-container ${view}-view`;
        
        this.renderProducts();
    }

    setSort(sort) {
        this.currentSort = sort;
        this.applySorting();
        this.renderProducts();
    }

    applySorting() {
        switch (this.currentSort) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'newest':
                this.filteredProducts.sort((a, b) => b.id - a.id);
                break;
            case 'popular':
                this.filteredProducts.sort((a, b) => b.reviews - a.reviews);
                break;
            default:
                this.filteredProducts.sort((a, b) => a.id - b.id);
        }
    }

    toggleFilters() {
        const sidebar = document.getElementById('filtersSidebar');
        sidebar.classList.toggle('active');
    }

    applyFilters() {
        const selectedCategories = this.getSelectedValues('category');
        const selectedSizes = this.getSelectedValues('size');
        const selectedColors = this.getSelectedValues('color');
        const priceRange = document.getElementById('priceRange').value;

        this.filteredProducts = this.products.filter(product => {
            // Category filter
            if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
                return false;
            }

            // Size filter
            if (selectedSizes.length > 0 && !selectedSizes.some(size => product.sizes.includes(size))) {
                return false;
            }

            // Color filter
            if (selectedColors.length > 0 && !selectedColors.some(color => product.colors.includes(color))) {
                return false;
            }

            // Price filter
            if (product.price > priceRange) {
                return false;
            }

            return true;
        });

        this.applySorting();
        this.currentPage = 1;
        this.renderProducts();
        this.updateProductsCount();
        this.updateURLParams();
    }

    getSelectedValues(name) {
        const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
        return Array.from(checkboxes).map(cb => cb.value);
    }

    resetFilters() {
        // Uncheck all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });

        // Reset price range
        document.getElementById('priceRange').value = 500;

        // Reapply filters
        this.applyFilters();
    }

    renderProducts() {
        const container = document.getElementById('productsContainer');
        if (!container) return;

        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        if (productsToShow.length === 0) {
            container.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or search terms</p>
                    <button class="btn btn-primary" onclick="shopManager.resetFilters()">Reset Filters</button>
                </div>
            `;
            return;
        }

        container.innerHTML = productsToShow.map(product => `
            <div class="product-card stagger-item">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                    ${!product.inStock ? `<span class="product-badge out-of-stock">Out of Stock</span>` : ''}
                </div>
                <div class="product-content">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-brand">${product.brand}</p>
                    <div class="product-price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <div class="product-rating">
                        ${this.generateStarRating(product.rating)}
                        <span>(${product.reviews})</span>
                    </div>
                    <div class="product-meta">
                        <span class="product-sizes">Sizes: ${product.sizes.join(', ')}</span>
                    </div>
                    <button class="btn btn-primary add-to-cart" 
                            onclick="addToCart(${product.id})"
                            ${!product.inStock ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i> 
                        ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        `).join('');

        this.updatePagination();
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

    updateProductsCount() {
        const countElement = document.getElementById('productsCount');
        if (countElement) {
            countElement.textContent = `Showing ${this.filteredProducts.length} products`;
        }
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        const paginationNumbers = document.querySelector('.pagination-numbers');
        const prevBtn = document.querySelector('.pagination-btn.prev');
        const nextBtn = document.querySelector('.pagination-btn.next');

        if (paginationNumbers) {
            let paginationHTML = '';
            for (let i = 1; i <= totalPages; i++) {
                if (i <= 3 || i === totalPages || Math.abs(i - this.currentPage) <= 1) {
                    paginationHTML += `<span class="page-number ${i === this.currentPage ? 'active' : ''}">${i}</span>`;
                } else if (paginationHTML.slice(-1) !== '...') {
                    paginationHTML += '<span>...</span>';
                }
            }
            paginationNumbers.innerHTML = paginationHTML;

            // Reattach event listeners
            paginationNumbers.querySelectorAll('.page-number').forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    const page = parseInt(btn.textContent);
                    if (!isNaN(page)) {
                        this.goToPage(page);
                    }
                });
            });
        }

        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
        }
        if (nextBtn) {
            nextBtn.disabled = this.currentPage === totalPages || totalPages === 0;
        }
    }

    changePage(direction) {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        
        if (direction === 'prev' && this.currentPage > 1) {
            this.currentPage--;
        } else if (direction === 'next' && this.currentPage < totalPages) {
            this.currentPage++;
        }
        
        this.renderProducts();
        this.scrollToProducts();
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderProducts();
            this.scrollToProducts();
        }
    }

    scrollToProducts() {
        const productsSection = document.querySelector('.products-main');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    updateURLParams() {
        const urlParams = new URLSearchParams();
        const selectedCategories = this.getSelectedValues('category');
        
        if (selectedCategories.length === 1) {
            urlParams.set('category', selectedCategories[0]);
        }
        
        const newUrl = window.location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '');
        window.history.replaceState({}, '', newUrl);
    }

    showError(message) {
        const container = document.getElementById('productsContainer');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Something went wrong</h3>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="shopManager.loadProducts()">Try Again</button>
                </div>
            `;
        }
    }
}

// Initialize shop manager when DOM is loaded
let shopManager;
document.addEventListener('DOMContentLoaded', () => {
    shopManager = new ShopManager();
});