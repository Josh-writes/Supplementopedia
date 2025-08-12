// Supplementopedia Search Functionality
let searchData = null;

// Load search data on page load
document.addEventListener('DOMContentLoaded', function() {
    loadSearchData();
    initializeSearch();
});

async function loadSearchData() {
    try {
        const response = await fetch('/search.json');
        searchData = await response.json();
        console.log('Search data loaded:', searchData.meta?.total_items || 'unknown count');
    } catch (error) {
        console.error('Error loading search data:', error);
    }
}

function initializeSearch() {
    const searchInput = document.getElementById('global-search');
    const searchResults = document.getElementById('search-results');
    const searchOverlay = document.getElementById('search-overlay');
    
    if (!searchInput) return;
    
    // Search input handler
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.trim();
        
        if (query.length >= 2) {
            performSearch(query);
            showSearchResults();
        } else {
            hideSearchResults();
        }
    });
    
    // Close search on escape or click outside
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideSearchResults();
        }
    });
    
    if (searchOverlay) {
        searchOverlay.addEventListener('click', hideSearchResults);
    }
}

function performSearch(query) {
    if (!searchData) return;
    
    const results = [];
    const queryLower = query.toLowerCase();
    
    // Search ingredients
    if (searchData.ingredients) {
        searchData.ingredients.forEach(item => {
            const score = calculateRelevance(item, queryLower, 'ingredient');
            if (score > 0) {
                results.push({ ...item, type: 'ingredient', score });
            }
        });
    }
    
    // Search brands
    if (searchData.brands) {
        searchData.brands.forEach(item => {
            const score = calculateRelevance(item, queryLower, 'brand');
            if (score > 0) {
                results.push({ ...item, type: 'brand', score });
            }
        });
    }
    
    // Search products
    if (searchData.products) {
        searchData.products.forEach(item => {
            const score = calculateRelevance(item, queryLower, 'product');
            if (score > 0) {
                results.push({ ...item, type: 'product', score });
            }
        });
    }
    
    // Sort by relevance score
    results.sort((a, b) => b.score - a.score);
    
    // Display results
    displaySearchResults(results.slice(0, 10)); // Top 10 results
}

function calculateRelevance(item, query, type) {
    let score = 0;
    const name = item.name?.toLowerCase() || '';
    
    // Exact name match
    if (name === query) score += 100;
    
    // Name starts with query
    if (name.startsWith(query)) score += 50;
    
    // Name contains query
    if (name.includes(query)) score += 25;
    
    // Category/brand matches
    if (item.category?.toLowerCase().includes(query)) score += 15;
    if (item.brand?.toLowerCase().includes(query)) score += 15;
    
    // Description matches
    if (item.description?.toLowerCase().includes(query)) score += 10;
    
    return score;
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('search-results');
    if (!searchResults) return;
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="p-4 text-gray-500">No results found</div>';
        return;
    }
    
    const resultsHTML = results.map(result => {
        const url = getResultUrl(result);
        const typeLabel = result.type.charAt(0).toUpperCase() + result.type.slice(1);
        
        return `
            <div class="border-b border-gray-200 last:border-b-0">
                <a href="${url}" class="block p-4 hover:bg-gray-50 transition-colors">
                    <div class="flex items-start justify-between">
                        <div class="flex-1">
                            <h3 class="font-medium text-gray-900">${result.name}</h3>
                            <p class="text-sm text-gray-500 mt-1">
                                ${result.description || result.category || 'No description available'}
                            </p>
                        </div>
                        <span class="ml-3 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            ${typeLabel}
                        </span>
                    </div>
                </a>
            </div>
        `;
    }).join('');
    
    searchResults.innerHTML = resultsHTML;
}

function getResultUrl(result) {
    const slug = result.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    
    switch (result.type) {
        case 'ingredient':
            return `/ingredients/${slug}/`;
        case 'brand':
            return `/brands/${slug}/`;
        case 'product':
            return result.affiliate_url || `/products/${slug}/`;
        default:
            return '/';
    }
}

function showSearchResults() {
    const searchResults = document.getElementById('search-results');
    const searchOverlay = document.getElementById('search-overlay');
    
    if (searchResults) {
        searchResults.classList.remove('hidden');
    }
    if (searchOverlay) {
        searchOverlay.classList.remove('hidden');
    }
}

function hideSearchResults() {
    const searchResults = document.getElementById('search-results');
    const searchOverlay = document.getElementById('search-overlay');
    
    if (searchResults) {
        searchResults.classList.add('hidden');
    }
    if (searchOverlay) {
        searchOverlay.classList.add('hidden');
    }
}