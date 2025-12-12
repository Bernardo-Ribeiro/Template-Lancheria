// ============================================
// LANCHERIA DELÍCIA - JavaScript Principal
// ============================================

// Estado da aplicação
const state = {
    products: [],
    cart: {},
    categoryEmojis: {
        'Lanches': '🍔',
        'Bebidas': '🥤',
        'Porções': '🍟',
        'Sobremesas': '🍨'
    }
};

// Número do WhatsApp (substitua pelo seu)
const WHATSAPP_NUMBER = 'xxxxxxxxxxx'; // Exemplo: '5511999999999'

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupEventListeners();
});

// ============================================
// CARREGAR PRODUTOS DO JSON
// ============================================
async function loadProducts() {
    try {
        const response = await fetch('produtos.json');
        state.products = await response.json();
        renderMenu();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        document.getElementById('menu-container').innerHTML = 
            '<p style="text-align: center; padding: 40px; color: #999;">Erro ao carregar o cardápio. Tente novamente mais tarde.</p>';
    }
}

// ============================================
// RENDERIZAR MENU POR CATEGORIAS
// ============================================
function renderMenu() {
    const menuContainer = document.getElementById('menu-container');
    
    // Agrupar produtos por categoria
    const categories = {};
    state.products.forEach(product => {
        if (!categories[product.categoria]) {
            categories[product.categoria] = [];
        }
        categories[product.categoria].push(product);
    });

    // Renderizar cada categoria
    let html = '';
    Object.keys(categories).forEach(category => {
        const emoji = state.categoryEmojis[category] || '🍽️';
        html += `
            <section class="category-section">
                <div class="category-header">
                    <span class="category-emoji">${emoji}</span>
                    <h2 class="category-title">${category}</h2>
                </div>
                <div class="products-grid">
                    ${categories[category].map(product => createProductCard(product)).join('')}
                </div>
            </section>
        `;
    });

    menuContainer.innerHTML = html;
}

// ============================================
// CRIAR CARD DE PRODUTO
// ============================================
function createProductCard(product) {
    const quantity = state.cart[product.id]?.quantity || 0;
    const isInCart = quantity > 0;

    return `
        <div class="product-card" data-product-id="${product.id}">
            <img src="${product.imagem}" alt="${product.nome}" class="product-image" 
                 onerror="this.src='https://via.placeholder.com/300x300/FFFDF8/FF5F57?text=${encodeURIComponent(product.nome)}'">
            <div class="product-info">
                <h3 class="product-name">${product.nome}</h3>
                <p class="product-description">${product.descricao}</p>
                <div class="product-footer">
                    <span class="product-price">R$ ${product.preco.toFixed(2).replace('.', ',')}</span>
                    <button class="add-button" onclick="addToCart(${product.id})" ${isInCart ? 'style="display: none;"' : ''}>
                        + Adicionar
                    </button>
                    <div class="quantity-controls ${isInCart ? 'active' : ''}" id="qty-${product.id}">
                        <button class="qty-btn minus" onclick="decreaseQuantity(${product.id})">−</button>
                        <span class="quantity-value" id="qty-value-${product.id}">${quantity}</span>
                        <button class="qty-btn plus" onclick="increaseQuantity(${product.id})">+</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// ADICIONAR AO CARRINHO
// ============================================
function addToCart(productId) {
    const product = state.products.find(p => p.id === productId);
    
    if (!state.cart[productId]) {
        state.cart[productId] = {
            product: product,
            quantity: 0
        };
    }
    
    state.cart[productId].quantity = 1;
    
    updateProductCard(productId);
    updateCartUI();
}

// ============================================
// AUMENTAR QUANTIDADE
// ============================================
function increaseQuantity(productId) {
    if (!state.cart[productId]) {
        addToCart(productId);
        return;
    }
    
    state.cart[productId].quantity++;
    updateProductCard(productId);
    updateCartUI();
}

// ============================================
// DIMINUIR QUANTIDADE
// ============================================
function decreaseQuantity(productId) {
    if (!state.cart[productId]) return;
    
    state.cart[productId].quantity--;
    
    if (state.cart[productId].quantity <= 0) {
        delete state.cart[productId];
    }
    
    updateProductCard(productId);
    updateCartUI();
}

// ============================================
// ATUALIZAR CARD DO PRODUTO
// ============================================
function updateProductCard(productId) {
    const quantity = state.cart[productId]?.quantity || 0;
    const card = document.querySelector(`[data-product-id="${productId}"]`);
    
    if (!card) return;
    
    const addButton = card.querySelector('.add-button');
    const qtyControls = card.querySelector(`#qty-${productId}`);
    const qtyValue = card.querySelector(`#qty-value-${productId}`);
    
    if (quantity > 0) {
        addButton.style.display = 'none';
        qtyControls.classList.add('active');
        qtyValue.textContent = quantity;
    } else {
        addButton.style.display = 'block';
        qtyControls.classList.remove('active');
    }
}

// ============================================
// ATUALIZAR UI DO CARRINHO
// ============================================
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartTotalSection = document.getElementById('cart-total-section');
    const orderForm = document.getElementById('order-form');
    
    // Calcular quantidade total de itens
    const totalItems = Object.values(state.cart).reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Se o carrinho estiver vazio
    if (totalItems === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio 😢</p>';
        cartTotalSection.style.display = 'none';
        orderForm.style.display = 'none';
        return;
    }
    
    // Renderizar itens do carrinho
    let itemsHtml = '';
    let total = 0;
    
    Object.values(state.cart).forEach(item => {
        const subtotal = item.product.preco * item.quantity;
        total += subtotal;
        
        itemsHtml += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.product.nome}</h4>
                    <p class="cart-item-quantity">${item.quantity}x</p>
                </div>
                <span class="cart-item-price">R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
        `;
    });
    
    cartItems.innerHTML = itemsHtml;
    cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    cartTotalSection.style.display = 'block';
    orderForm.style.display = 'block';
}

// ============================================
// ABRIR/FECHAR CARRINHO
// ============================================
function openCart() {
    document.getElementById('cart-drawer').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cart-drawer').classList.remove('open');
    document.body.style.overflow = '';
}

// ============================================
// CONFIGURAR EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Botão do carrinho
    document.getElementById('cart-button').addEventListener('click', openCart);
    
    // Botão fechar carrinho
    document.getElementById('close-cart').addEventListener('click', closeCart);
    
    // Overlay do carrinho
    document.getElementById('cart-overlay').addEventListener('click', closeCart);
    
    // Formulário de pedido
    document.getElementById('order-form').addEventListener('submit', handleOrderSubmit);
}

// ============================================
// PROCESSAR PEDIDO
// ============================================
function handleOrderSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('customer-name').value.trim();
    const address = document.getElementById('customer-address').value.trim();
    const notes = document.getElementById('customer-notes').value.trim();
    
    if (!name || !address) {
        alert('Por favor, preencha seu nome e endereço.');
        return;
    }
    
    // Gerar mensagem do WhatsApp
    let message = '*Pedido:*\n\n';
    let total = 0;
    
    Object.values(state.cart).forEach(item => {
        const subtotal = item.product.preco * item.quantity;
        total += subtotal;
        message += `• ${item.product.nome} (${item.quantity}x) - R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
    });
    
    message += `\n*Total: R$ ${total.toFixed(2).replace('.', ',')}*\n\n`;
    message += `*Nome:* ${name}\n`;
    message += `*Endereço:* ${address}\n`;
    
    if (notes) {
        message += `*Observações:* ${notes}\n`;
    }
    
    // Abrir WhatsApp
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}
