// Privacy Policy Page Functionality
class PrivacyManager {
    constructor() {
        this.init();
    }

    init() {
        this.initNavigation();
        this.initScrollSpy();
        this.initPrintButton();
    }

    initNavigation() {
        const navLinks = document.querySelectorAll('.privacy-nav .nav-link');
        const sections = document.querySelectorAll('.privacy-section');

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
        const sections = document.querySelectorAll('.privacy-section');
        const navLinks = document.querySelectorAll('.privacy-nav .nav-link');

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
        const navLinks = document.querySelectorAll('.privacy-nav .nav-link');
        
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

    initPrintButton() {
        // Add print button functionality if needed
        const printButton = document.createElement('button');
        printButton.className = 'btn btn-primary print-btn';
        printButton.innerHTML = '<i class="fas fa-print"></i> Print Policy';
        printButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
        `;
        
        printButton.addEventListener('click', () => {
            window.print();
        });

        document.body.appendChild(printButton);
    }
}

// Initialize privacy manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PrivacyManager();
});