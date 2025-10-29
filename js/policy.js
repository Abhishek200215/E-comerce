// Policy Pages Functionality
class PolicyManager {
    constructor() {
        this.init();
    }

    init() {
        this.initNavigation();
        this.initFAQ();
        this.initScrollSpy();
    }

    initNavigation() {
        const navLinks = document.querySelectorAll('.policy-nav .nav-link, .size-guide-nav .nav-link');
        const sections = document.querySelectorAll('.policy-section, .size-section');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });

        // Handle URL hash on page load
        const hash = window.location.hash.substring(1);
        if (hash) {
            this.scrollToSection(hash);
        }
    }

    initScrollSpy() {
        const sections = document.querySelectorAll('.policy-section, .size-section');
        const navLinks = document.querySelectorAll('.policy-nav .nav-link, .size-guide-nav .nav-link');

        const observerOptions = {
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.setActiveNavLink(id);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    setActiveNavLink(sectionId) {
        const navLinks = document.querySelectorAll('.policy-nav .nav-link, .size-guide-nav .nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });

        // Update URL hash without scrolling
        window.history.replaceState(null, null, `#${sectionId}`);
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        // Update active nav link
        this.setActiveNavLink(sectionId);

        // Scroll to section
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        });
    }
}

// Size Guide Specific Functionality
class SizeGuideManager {
    constructor() {
        this.init();
    }

    init() {
        this.initCategoryNavigation();
        this.initSizeTabs();
        this.initMeasurementTool();
    }

    initCategoryNavigation() {
        const navLinks = document.querySelectorAll('.size-guide-nav .nav-link');
        const sections = document.querySelectorAll('.size-section');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.switchCategory(targetId);
            });
        });
    }

    switchCategory(categoryId) {
        // Update navigation
        document.querySelectorAll('.size-guide-nav .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[href="#${categoryId}"]`).classList.add('active');

        // Update sections
        document.querySelectorAll('.size-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(categoryId).classList.add('active');
    }

    initSizeTabs() {
        const tabContainers = document.querySelectorAll('.size-tabs');
        
        tabContainers.forEach(container => {
            const tabBtns = container.querySelectorAll('.size-tab-btn');
            const parentSection = container.closest('.size-tab-content') || container.closest('.size-section');
            
            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const tabId = btn.getAttribute('data-tab');
                    this.switchSizeTab(tabId, parentSection);
                });
            });
        });
    }

    switchSizeTab(tabId, parentSection) {
        // Update tab buttons
        const tabBtns = parentSection.querySelectorAll('.size-tab-btn');
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        parentSection.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Update tab content
        const tabContents = parentSection.querySelectorAll('.size-tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        parentSection.querySelector(`#${tabId}`).classList.add('active');
    }

    initMeasurementTool() {
        const downloadBtn = document.querySelector('.measurement-tool .btn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.downloadMeasurementGuide();
            });
        }
    }

    downloadMeasurementGuide() {
        // In a real app, this would download a PDF
        this.showNotification('Measurement guide download started!', 'success');
        
        // Simulate download
        setTimeout(() => {
            this.showNotification('Measurement guide downloaded successfully!', 'success');
        }, 2000);
    }

    showNotification(message, type = 'success') {
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize policy manager for all policy pages
    if (document.querySelector('.policy-content')) {
        new PolicyManager();
    }
    
    // Initialize size guide manager for size guide page
    if (document.querySelector('.size-guide-content')) {
        new SizeGuideManager();
    }
});