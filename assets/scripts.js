/* ================================================================
   SUPPLEMENTOPEDIA - CUSTOM JAVASCRIPT
   Interactive functionality for the unified design system
   ================================================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ----------------------------------------------------------------
    // SEARCH FUNCTIONALITY
    // ----------------------------------------------------------------
    
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (searchInput) {
        let searchTimeout;
        let searchData = null;
        
        // Load search data
        fetch('/search.json')
            .then(response => response.json())
            .then(data => {
                searchData = data;
            })
            .catch(error => {
                console.log('Search data not available');
            });
        
        // Real-time search
        searchInput.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            
            clearTimeout(searchTimeout);
            
            if (query.length < 2) {
                hideSearchResults();
                return;
            }
            
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300);
        });
        
        // Hide results when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.search-container')) {
                hideSearchResults();
            }
        });
        
        function performSearch(query) {
            if (!searchData) return;
            
            const results = [];
            const maxResults = 8;
            
            // Search ingredients
            if (searchData.ingredients) {
                searchData.ingredients.forEach(item => {
                    if (item.name.toLowerCase().includes(query) || 
                        (item.category && item.category.toLowerCase().includes(query))) {
                        results.push({
                            ...item,
                            type: 'Ingredient',
                            url: `/ingredients/${item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/`
                        });
                    }
                });
            }
            
            // Search systems
            if (searchData.systems) {
                searchData.systems.forEach(item => {
                    if (item.name.toLowerCase().includes(query) || 
                        (item.description && item.description.toLowerCase().includes(query))) {
                        results.push({
                            ...item,
                            type: 'Body System',
                            url: `/systems/${item.slug}/`
                        });
                    }
                });
            }
            
            // Search brands
            if (searchData.brands) {
                searchData.brands.forEach(item => {
                    if (item.name.toLowerCase().includes(query)) {
                        results.push({
                            ...item,
                            type: 'Brand',
                            url: `/brands/${item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/`
                        });
                    }
                });
            }
            
            displaySearchResults(results.slice(0, maxResults));
        }
        
        function displaySearchResults(results) {
            if (!searchResults) return;
            
            if (results.length === 0) {
                searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
                searchResults.classList.remove('hidden');
                return;
            }
            
            const html = results.map(result => `
                <a href="${result.url}" class="search-result-item">
                    <div class="font-medium">${result.name}</div>
                    <div class="text-muted">${result.type}${result.category ? ' • ' + result.category : ''}</div>
                </a>
            `).join('');
            
            searchResults.innerHTML = html;
            searchResults.classList.remove('hidden');
        }
        
        function hideSearchResults() {
            if (searchResults) {
                searchResults.classList.add('hidden');
            }
        }
    }
    
    // ----------------------------------------------------------------
    // INTERACTIVE BODY DIAGRAM
    // ----------------------------------------------------------------
    
    const bodyParts = document.querySelectorAll('.body-part');
    const systemInfo = document.getElementById('system-info');
    
    if (bodyParts.length > 0 && systemInfo) {
        let currentSystem = null;
        
        // Setup body diagram interactions
        bodyParts.forEach(part => {
            part.addEventListener('click', handleBodyPartClick);
            part.addEventListener('mouseenter', handleBodyPartHover);
            part.addEventListener('mouseleave', handleBodyPartLeave);
        });
        
        // Auto-highlight first system after page load
        setTimeout(() => {
            if (bodyParts[0]) {
                bodyParts[0].dispatchEvent(new Event('click'));
            }
        }, 1000);
        
        function handleBodyPartClick(event) {
            const part = event.target;
            const systemData = {
                system: part.dataset.system,
                name: part.dataset.name,
                description: part.dataset.description,
                color: part.dataset.color
            };
            
            showSystemInfo(systemData);
            highlightSystem(part);
        }
        
        function handleBodyPartHover(event) {
            const part = event.target;
            if (!part.classList.contains('active')) {
                part.style.filter = 'brightness(1.2) drop-shadow(0 4px 8px rgba(0,0,0,0.2))';
            }
        }
        
        function handleBodyPartLeave(event) {
            const part = event.target;
            if (!part.classList.contains('active')) {
                part.style.filter = '';
            }
        }
        
        function showSystemInfo(systemData) {
            const ingredientCount = Math.floor(Math.random() * 25) + 5;
            const productCount = Math.floor(Math.random() * 200) + 50;
            
            systemInfo.innerHTML = `
                <div class="system-display fade-in" style="border-left-color: ${systemData.color};">
                    <div class="flex items-center justify-between mb-4">
                        <h4 class="text-xl font-bold">${systemData.name}</h4>
                        <div class="system-icon" style="background-color: ${systemData.color}20; color: ${systemData.color};">
                            🫀
                        </div>
                    </div>
                    <p class="text-muted mb-4">${systemData.description}</p>
                    
                    <div class="system-stats mb-4">
                        <div class="system-stat">
                            <div class="system-stat-number">${ingredientCount}</div>
                            <div class="system-stat-label">Ingredients</div>
                        </div>
                        <div class="system-stat">
                            <div class="system-stat-number">${productCount}</div>
                            <div class="system-stat-label">Products</div>
                        </div>
                    </div>
                    
                    <div class="btn-group">
                        <a href="/systems/${systemData.system}/" class="btn btn-primary">
                            Explore ${systemData.name}
                        </a>
                        <a href="/systems/${systemData.system}/ingredients/" class="btn btn-outline">
                            View Ingredients
                        </a>
                    </div>
                </div>
            `;
            
            currentSystem = systemData;
        }
        
        function highlightSystem(activePart) {
            // Clear previous highlights
            bodyParts.forEach(part => {
                part.classList.remove('active');
                part.style.filter = '';
            });
            
            // Highlight active system
            activePart.classList.add('active');
        }
    }
    
    // ----------------------------------------------------------------
    // SMOOTH SCROLLING FOR ANCHOR LINKS
    // ----------------------------------------------------------------
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ----------------------------------------------------------------
    // SCROLL-BASED ANIMATIONS
    // ----------------------------------------------------------------
    
    const observeElements = document.querySelectorAll('.system-card, .nav-section, .card');
    
    if (observeElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('slide-up');
                }
            });
        }, { threshold: 0.1 });
        
        observeElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    // ----------------------------------------------------------------
    // MOBILE NAVIGATION TOGGLE
    // ----------------------------------------------------------------
    
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('hidden');
            
            // Update toggle icon
            const icon = navToggle.querySelector('svg');
            if (navMenu.classList.contains('hidden')) {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            } else {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
            }
        });
    }
    
    // ----------------------------------------------------------------
    // DYNAMIC CONTENT LOADING
    // ----------------------------------------------------------------
    
    function loadDynamicCounts() {
        // Update homepage statistics if elements exist
        const ingredientCount = document.getElementById('ingredient-count');
        const productCount = document.getElementById('product-count');
        const brandCount = document.getElementById('brand-count');
        
        // These would typically come from an API endpoint
        if (ingredientCount) ingredientCount.textContent = '242';
        if (productCount) productCount.textContent = '2,848';
        if (brandCount) brandCount.textContent = '499';
    }
    
    loadDynamicCounts();
    
    // ----------------------------------------------------------------
    // FORM ENHANCEMENTS
    // ----------------------------------------------------------------
    
    // Add focus effects to form inputs
    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // ----------------------------------------------------------------
    // TOOLTIP SYSTEM
    // ----------------------------------------------------------------
    
    function createTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: #1f2937;
            color: white;
            padding: 0.5rem 0.75rem;
            border-radius: 0.25rem;
            font-size: 0.875rem;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease;
        `;
        
        document.body.appendChild(tooltip);
        
        element.addEventListener('mouseenter', function(e) {
            const rect = element.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) + 'px';
            tooltip.style.top = rect.top - 35 + 'px';
            tooltip.style.transform = 'translateX(-50%)';
            tooltip.style.opacity = '1';
        });
        
        element.addEventListener('mouseleave', function() {
            tooltip.style.opacity = '0';
        });
        
        // Clean up tooltip when element is removed
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.removedNodes.forEach(function(node) {
                    if (node === element) {
                        tooltip.remove();
                        observer.disconnect();
                    }
                });
            });
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    // Add tooltips to elements with data-tooltip attribute
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        createTooltip(element, element.dataset.tooltip);
    });
    
    // ----------------------------------------------------------------
    // PERFORMANCE MONITORING
    // ----------------------------------------------------------------
    
    // Log performance metrics (development only)
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('dev')) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Performance:', {
                    'DOM Content Loaded': perfData.domContentLoadedEventEnd - perfData.navigationStart + 'ms',
                    'Full Load': perfData.loadEventEnd - perfData.navigationStart + 'ms',
                    'First Paint': performance.getEntriesByType('paint')[0]?.startTime + 'ms'
                });
            }, 0);
        });
    }
    
    // ----------------------------------------------------------------
    // ACCESSIBILITY ENHANCEMENTS
    // ----------------------------------------------------------------
    
    // Keyboard navigation for interactive elements
    document.addEventListener('keydown', function(e) {
        // ESC key closes modals and dropdowns
        if (e.key === 'Escape') {
            hideSearchResults();
            // Close any open modals or dropdowns
            document.querySelectorAll('.modal.active, .dropdown.active').forEach(el => {
                el.classList.remove('active');
            });
        }
        
        // Enter key activates clickable elements with tabindex
        if (e.key === 'Enter' && e.target.hasAttribute('tabindex') && e.target.onclick) {
            e.target.click();
        }
    });
    
    // Add focus indicators for keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('using-keyboard');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('using-keyboard');
    });
    
});

// ----------------------------------------------------------------
// UTILITY FUNCTIONS
// ----------------------------------------------------------------

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    }
}

// Animate number counters
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);
        element.textContent = current.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Format numbers with appropriate suffixes
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// ----------------------------------------------------------------
// GLOBAL EXPORTS (if needed by other scripts)
// ----------------------------------------------------------------

window.Supplementopedia = {
    debounce,
    throttle,
    animateCounter,
    formatNumber
};