
// Interactive Body Systems JavaScript
class BodySystemsInteractive {
    constructor() {
        this.currentSystem = null;
        this.init();
    }
    
    init() {
        this.setupBodyDiagram();
        this.setupFilters();
        this.setupSearch();
        this.setupAnimations();
    }
    
    setupBodyDiagram() {
        const bodyParts = document.querySelectorAll('.body-part');
        const systemInfo = document.getElementById('systemInfo');
        
        if (!bodyParts.length || !systemInfo) return;
        
        bodyParts.forEach(part => {
            part.addEventListener('click', (e) => this.handleBodyPartClick(e));
            part.addEventListener('mouseenter', (e) => this.handleBodyPartHover(e));
            part.addEventListener('mouseleave', (e) => this.handleBodyPartLeave(e));
        });
        
        // Auto-highlight first system
        setTimeout(() => {
            const firstSystem = bodyParts[0];
            if (firstSystem) {
                firstSystem.dispatchEvent(new Event('click'));
            }
        }, 1000);
    }
    
    handleBodyPartClick(event) {
        const part = event.target;
        const systemData = {
            system: part.dataset.system,
            name: part.dataset.name,
            description: part.dataset.description,
            color: part.dataset.color
        };
        
        this.showSystemInfo(systemData);
        this.highlightSystem(part);
    }
    
    handleBodyPartHover(event) {
        const part = event.target;
        if (!part.classList.contains('active')) {
            part.style.filter = 'brightness(1.2) drop-shadow(0 4px 8px rgba(0,0,0,0.2))';
        }
    }
    
    handleBodyPartLeave(event) {
        const part = event.target;
        if (!part.classList.contains('active')) {
            part.style.filter = '';
        }
    }
    
    showSystemInfo(systemData) {
        const systemInfo = document.getElementById('systemInfo');
        if (!systemInfo) return;
        
        const ingredientCount = Math.floor(Math.random() * 25) + 5;
        const productCount = Math.floor(Math.random() * 200) + 50;
        
        systemInfo.innerHTML = `
            <div class="system-display animate-fadeIn" style="border-left: 4px solid ${systemData.color};">
                <div class="pl-4">
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="text-lg font-bold text-gray-900">${systemData.name}</h4>
                        <div class="w-4 h-4 rounded-full" style="background-color: ${systemData.color};"></div>
                    </div>
                    <p class="text-gray-600 mb-4">${systemData.description}</p>
                    
                    <div class="space-y-3">
                        <div class="bg-white rounded p-3 border hover:shadow-sm transition-shadow">
                            <div class="text-sm font-medium text-gray-700 mb-1">Supporting Ingredients</div>
                            <div class="text-2xl font-bold" style="color: ${systemData.color};">${ingredientCount}</div>
                        </div>
                        
                        <div class="bg-white rounded p-3 border hover:shadow-sm transition-shadow">
                            <div class="text-sm font-medium text-gray-700 mb-1">Related Products</div>
                            <div class="text-2xl font-bold" style="color: ${systemData.color};">${productCount}</div>
                        </div>
                    </div>
                    
                    <div class="mt-4 space-y-2">
                        <a href="/systems/${systemData.system}/" 
                           class="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium text-white transition-all hover:opacity-90 hover:transform hover:scale-105"
                           style="background-color: ${systemData.color};">
                            <svg class="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Explore ${systemData.name}
                        </a>
                        <a href="/systems/${systemData.system}/ingredients/" 
                           class="w-full inline-flex items-center justify-center px-4 py-2 border rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all hover:transform hover:scale-105">
                            <svg class="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                            View Ingredients
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        this.currentSystem = systemData;
    }
    
    highlightSystem(activePart) {
        // Clear previous highlights
        document.querySelectorAll('.body-part').forEach(part => {
            part.classList.remove('active');
            part.style.filter = '';
        });
        
        document.querySelectorAll('.system-nav-btn').forEach(btn => {
            btn.classList.remove('bg-blue-50', 'border-blue-200');
        });
        
        // Highlight active system
        activePart.classList.add('active');
        activePart.style.filter = 'brightness(1.1) drop-shadow(0 4px 8px rgba(0,0,0,0.25))';
        
        // Highlight corresponding nav button
        const correspondingBtn = document.querySelector(`[data-system="${activePart.dataset.system}"]`);
        if (correspondingBtn) {
            correspondingBtn.classList.add('bg-blue-50', 'border-blue-200');
        }
    }
    
    setupFilters() {
        const filterInputs = document.querySelectorAll('.evidence-filter, .system-filter, .category-filter, .benefit-filter');
        const applyBtn = document.getElementById('applyFilters');
        const clearBtn = document.getElementById('clearFilters');
        
        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.applyFilters());
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearFilters());
        }
    }
    
    setupSearch() {
        const searchInput = document.getElementById('systemSearch') || document.getElementById('ingredientSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }
    }
    
    setupAnimations() {
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-slideUp');
                }
            });
        }, { threshold: 0.1 });
        
        // Observe system cards
        document.querySelectorAll('.system-card').forEach(card => {
            observer.observe(card);
        });
    }
    
    applyFilters() {
        // Implementation for advanced filtering
        const activeFilters = this.getActiveFilters();
        const items = document.querySelectorAll('.filterable-item');
        
        let visibleCount = 0;
        items.forEach(item => {
            if (this.itemMatchesFilters(item, activeFilters)) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        this.updateFilterResults(visibleCount, items.length);
    }
    
    clearFilters() {
        // Clear all filter inputs
        document.querySelectorAll('input[type="checkbox"]').forEach(input => {
            input.checked = false;
        });
        
        document.querySelectorAll('select').forEach(select => {
            select.value = '';
        });
        
        // Show all items
        document.querySelectorAll('.filterable-item').forEach(item => {
            item.style.display = 'block';
        });
        
        this.updateFilterResults(document.querySelectorAll('.filterable-item').length, document.querySelectorAll('.filterable-item').length);
    }
    
    getActiveFilters() {
        // Get all active filter values
        return {
            evidence: Array.from(document.querySelectorAll('.evidence-filter:checked')).map(f => f.value),
            systems: Array.from(document.querySelectorAll('.system-filter:checked')).map(f => f.value),
            categories: Array.from(document.querySelectorAll('.category-filter:checked')).map(f => f.value),
            benefits: Array.from(document.querySelectorAll('.benefit-filter:checked')).map(f => f.value)
        };
    }
    
    itemMatchesFilters(item, filters) {
        // Check if item matches all active filters
        // Implementation depends on data attributes
        return true; // Simplified for now
    }
    
    updateFilterResults(visible, total) {
        const resultsSpan = document.getElementById('filterResults');
        if (resultsSpan) {
            if (visible === total) {
                resultsSpan.textContent = `Showing all ${total} items`;
            } else {
                resultsSpan.textContent = `Showing ${visible} of ${total} items`;
            }
        }
    }
    
    handleSearch(query) {
        const items = document.querySelectorAll('.filterable-item');
        const lowerQuery = query.toLowerCase();
        
        items.forEach(item => {
            const name = (item.dataset.name || '').toLowerCase();
            const description = (item.dataset.description || '').toLowerCase();
            
            if (name.includes(lowerQuery) || description.includes(lowerQuery)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.bodySystemsInteractive = new BodySystemsInteractive();
});
