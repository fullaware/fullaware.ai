/**
 * Full Aware - Website JavaScript
 * Theme toggle and scroll animations
 */

(function() {
    'use strict';

    // ============================================
    // Theme Management
    // ============================================
    const ThemeManager = {
        STORAGE_KEY: 'fullaware-theme',
        LIGHT: 'light',
        DARK: 'dark',

        init() {
            this.toggle = document.getElementById('themeToggle');
            this.html = document.documentElement;
            
            // Get saved theme or default to light
            const savedTheme = localStorage.getItem(this.STORAGE_KEY);
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const initialTheme = savedTheme || (prefersDark ? this.DARK : this.LIGHT);
            
            this.setTheme(initialTheme);
            this.bindEvents();
        },

        setTheme(theme) {
            this.html.setAttribute('data-theme', theme);
            localStorage.setItem(this.STORAGE_KEY, theme);
        },

        toggleTheme() {
            const currentTheme = this.html.getAttribute('data-theme');
            const newTheme = currentTheme === this.LIGHT ? this.DARK : this.LIGHT;
            this.setTheme(newTheme);
        },

        bindEvents() {
            if (this.toggle) {
                this.toggle.addEventListener('click', () => this.toggleTheme());
            }

            // Listen for system theme changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem(this.STORAGE_KEY)) {
                    this.setTheme(e.matches ? this.DARK : this.LIGHT);
                }
            });
        }
    };

    // ============================================
    // Scroll Animations
    // ============================================
    const ScrollAnimations = {
        init() {
            this.elements = document.querySelectorAll('.service-card');
            this.observer = null;
            
            if ('IntersectionObserver' in window) {
                this.createObserver();
                this.observe();
            } else {
                // Fallback: show all elements
                this.elements.forEach(el => el.style.opacity = '1');
            }
        },

        createObserver() {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 100);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
        },

        observe() {
            this.elements.forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
                this.observer.observe(el);
            });
        }
    };

    // ============================================
    // Initialize Everything
    // ============================================
    function init() {
        ThemeManager.init();
        ScrollAnimations.init();
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
