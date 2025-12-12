// Global state
let menuData = null;
let currentFilter = 'all';

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadMenu();
        setupEventListeners();
    } catch (error) {
        displayError('Erro ao carregar o cardápio. Por favor, tente novamente mais tarde.');
        console.error('Initialization error:', error);
    }
});

// Load menu data from produtos.json
async function loadMenu() {
    try {
        const response = await fetch('produtos.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        menuData = await response.json();
        
        // Display establishment information
        displayEstablishmentInfo();
        
        // Create category filters
        createCategoryFilters();
        
        // Display all products initially
        displayProducts();
    } catch (error) {
        console.error('Error loading menu:', error);
        throw error;
    }
}

// Display establishment information
function displayEstablishmentInfo() {
    const info = menuData.informacoes;
    
    // Header info
    document.getElementById('telefone').textContent = info.telefone;
    document.getElementById('horario').textContent = info.horario;
    
    // Footer info
    document.getElementById('endereco').textContent = info.endereco;
    document.getElementById('telefone-footer').textContent = info.telefone;
    document.getElementById('horario-footer').textContent = info.horario;
}

// Create category filter buttons
function createCategoryFilters() {
    const filtersContainer = document.getElementById('category-filters');
    
    menuData.categorias.forEach(categoria => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.textContent = categoria.nome;
        button.setAttribute('data-categoria', categoria.id);
        filtersContainer.appendChild(button);
    });
}

// Display products based on current filter
function displayProducts(filterCategory = 'all') {
    const menuContainer = document.getElementById('menu');
    menuContainer.innerHTML = '';
    
    menuData.categorias.forEach(categoria => {
        // Filter by category if needed
        if (filterCategory !== 'all' && categoria.id !== filterCategory) {
            return;
        }
        
        categoria.produtos.forEach(produto => {
            const productCard = createProductCard(produto, categoria.nome);
            menuContainer.appendChild(productCard);
        });
    });
    
    // Show message if no products
    if (menuContainer.children.length === 0) {
        menuContainer.innerHTML = '<p class="loading">Nenhum produto encontrado.</p>';
    }
}

// Create a product card element
function createProductCard(produto, categoriaNome) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-categoria', categoriaNome.toLowerCase());
    
    // Product image
    const imageDiv = document.createElement('div');
    imageDiv.className = 'product-image';
    
    // Try to load image, fallback to emoji if not found
    const img = document.createElement('img');
    img.src = produto.imagem;
    img.alt = produto.nome;
    img.onerror = function() {
        // Remove img and show emoji instead
        this.style.display = 'none';
        imageDiv.innerHTML = getProductEmoji(categoriaNome);
    };
    imageDiv.appendChild(img);
    
    // Product info
    const infoDiv = document.createElement('div');
    infoDiv.className = 'product-info';
    
    const category = document.createElement('div');
    category.className = 'product-category';
    category.textContent = categoriaNome;
    
    const name = document.createElement('h3');
    name.className = 'product-name';
    name.textContent = produto.nome;
    
    const description = document.createElement('p');
    description.className = 'product-description';
    description.textContent = produto.descricao;
    
    const price = document.createElement('div');
    price.className = 'product-price';
    price.textContent = `R$ ${produto.preco.toFixed(2).replace('.', ',')}`;
    
    infoDiv.appendChild(category);
    infoDiv.appendChild(name);
    infoDiv.appendChild(description);
    infoDiv.appendChild(price);
    
    card.appendChild(imageDiv);
    card.appendChild(infoDiv);
    
    return card;
}

// Get emoji based on category
function getProductEmoji(categoria) {
    const emojis = {
        'Sanduíches': '🍔',
        'Bebidas': '🥤',
        'Porções': '🍟',
        'default': '🍽️'
    };
    return emojis[categoria] || emojis['default'];
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', handleFilterClick);
    });
}

// Handle filter button clicks
function handleFilterClick(event) {
    const button = event.target;
    const categoria = button.getAttribute('data-categoria');
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');
    
    // Update current filter and display products
    currentFilter = categoria;
    displayProducts(categoria);
}

// Display error message
function displayError(message) {
    const menuContainer = document.getElementById('menu');
    menuContainer.innerHTML = `<div class="error">${message}</div>`;
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        loadMenu,
        displayProducts,
        createProductCard,
        getProductEmoji
    };
}
