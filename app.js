// ============================================
// LANCHERIA DELÍCIA - JavaScript Principal
// ============================================

// Estado da aplicação
const state = {
    products: [],
    cart: {},
    searchTerm: '',
    categoryEmojis: {
        'Lanches': '🍔',
        'Bebidas': '🥤',
        'Porções': '🍟',
        'Sobremesas': '🍨'
    }
};

// Número do WhatsApp (substitua pelo seu)
const WHATSAPP_NUMBER = '5555996283243';

// Taxa de entrega fixa
const DELIVERY_FEE = 10.00;

// Horário de Funcionamento
const BUSINESS_HOURS = {
    // Dias da semana (0 = Domingo, 1 = Segunda, ..., 6 = Sábado)
    0: null, // Domingo - Fechado
    1: null, // Segunda - Fechado
    2: { open: '18:00', close: '23:00' }, // Terça
    3: { open: '18:00', close: '23:00' }, // Quarta
    4: { open: '18:00', close: '23:00' }, // Quinta
    5: { open: '18:00', close: '23:00' }, // Sexta
    6: { open: '18:00', close: '23:00' }  // Sábado
};

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupEventListeners();
    checkBusinessHours();
    loadOrderHistory();
});

// ============================================
// VERIFICAR HORÁRIO DE FUNCIONAMENTO
// ============================================
function checkBusinessHours() {
    const now = new Date();
    const day = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const statusBar = document.getElementById('status-bar');
    const hours = BUSINESS_HOURS[day];
    
    if (!hours) {
        // Fechado hoje
        statusBar.innerHTML = '⛔ Fechado hoje';
        statusBar.className = 'status-bar closed';
        disableOrdering(true);
        return false;
    }
    
    // Converter horários para minutos
    const [openHour, openMin] = hours.open.split(':').map(Number);
    const [closeHour, closeMin] = hours.close.split(':').map(Number);
    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;
    
    if (currentTime >= openTime && currentTime < closeTime) {
        // Aberto
        statusBar.innerHTML = `✅ Aberto - Fecha às ${hours.close}`;
        statusBar.className = 'status-bar open';
        disableOrdering(false);
        return true;
    } else {
        // Fechado
        statusBar.innerHTML = `⛔ Fechado - Abre às ${hours.open}`;
        statusBar.className = 'status-bar closed';
        disableOrdering(true);
        return false;
    }
}

// ============================================
// DESABILITAR/HABILITAR PEDIDOS
// ============================================
function disableOrdering(disable) {
    state.orderingDisabled = disable;
    
    // Atualizar botões de adicionar
    document.querySelectorAll('.add-button').forEach(btn => {
        btn.disabled = disable;
        if (disable) {
            btn.textContent = 'Fechado';
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        }
    });
    
    // Atualizar botões de quantidade
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.disabled = disable;
        if (disable) {
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        }
    });
}

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
    
    // Filtrar produtos pela busca
    let filteredProducts = state.products;
    if (state.searchTerm) {
        const term = state.searchTerm.toLowerCase();
        filteredProducts = state.products.filter(product => 
            product.nome.toLowerCase().includes(term) ||
            product.descricao.toLowerCase().includes(term) ||
            product.categoria.toLowerCase().includes(term)
        );
    }
    
    if (filteredProducts.length === 0) {
        menuContainer.innerHTML = '<p class="no-results">🔍 Nenhum produto encontrado</p>';
        return;
    }
    
    // Agrupar produtos por categoria
    const categories = {};
    filteredProducts.forEach(product => {
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
    
    // Reaplica o estado de desabilitação se necessário
    if (state.orderingDisabled) {
        disableOrdering(true);
    }
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
// BUSCA DE PRODUTOS
// ============================================
function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const clearButton = document.getElementById('clear-search');
    
    state.searchTerm = searchInput.value.trim();
    
    if (state.searchTerm) {
        clearButton.style.display = 'block';
    } else {
        clearButton.style.display = 'none';
    }
    
    renderMenu();
}

function clearSearch() {
    const searchInput = document.getElementById('search-input');
    const clearButton = document.getElementById('clear-search');
    
    searchInput.value = '';
    state.searchTerm = '';
    clearButton.style.display = 'none';
    
    renderMenu();
}

// ============================================
// ADICIONAR AO CARRINHO
// ============================================
function addToCart(productId) {
    if (state.orderingDisabled) {
        alert('⛔ Desculpe, estamos fechados no momento!');
        return;
    }
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
    const cartSubtotal = document.getElementById('cart-subtotal');
    const deliveryFeeDisplay = document.getElementById('delivery-fee');
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
    let subtotal = 0;
    
    Object.values(state.cart).forEach(item => {
        const itemSubtotal = item.product.preco * item.quantity;
        subtotal += itemSubtotal;
        
        itemsHtml += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.product.nome}</h4>
                    <p class="cart-item-quantity">${item.quantity}x</p>
                </div>
                <span class="cart-item-price">R$ ${itemSubtotal.toFixed(2).replace('.', ',')}</span>
            </div>
        `;
    });
    
    // Usar taxa de entrega fixa
    const deliveryFee = DELIVERY_FEE;
    const total = subtotal + deliveryFee;
    
    cartItems.innerHTML = itemsHtml;
    cartSubtotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    deliveryFeeDisplay.textContent = `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`;
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
    
    // Mostrar campo de troco quando selecionar "Dinheiro"
    document.getElementById('payment-method').addEventListener('change', function() {
        const changeGroup = document.getElementById('change-group');
        if (this.value === 'Dinheiro') {
            changeGroup.style.display = 'block';
        } else {
            changeGroup.style.display = 'none';
            document.getElementById('change-for').value = '';
        }
    });
    
    // Busca de produtos
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', handleSearch);
    
    document.getElementById('clear-search').addEventListener('click', clearSearch);
    
    // Histórico de pedidos
    document.getElementById('history-button').addEventListener('click', showOrderHistory);
}

// ============================================
// HISTÓRICO DE PEDIDOS
// ============================================
function loadOrderHistory() {
    const history = localStorage.getItem('orderHistory');
    return history ? JSON.parse(history) : [];
}

function saveOrderToHistory(order) {
    let history = loadOrderHistory();
    history.unshift(order); // Adiciona no início
    
    // Manter apenas os últimos 10 pedidos
    if (history.length > 10) {
        history = history.slice(0, 10);
    }
    
    localStorage.setItem('orderHistory', JSON.stringify(history));
}

function showOrderHistory() {
    const history = loadOrderHistory();
    
    if (history.length === 0) {
        alert('📋 Você ainda não fez nenhum pedido.');
        return;
    }
    
    let html = `
        <div class="history-modal" id="history-modal">
            <div class="history-content">
                <div class="history-header">
                    <h2>📋 Histórico de Pedidos</h2>
                    <button class="close-history" onclick="closeHistory()">✕</button>
                </div>
                <div class="history-list">
    `;
    
    history.forEach((order, index) => {
        html += `
            <div class="history-item">
                <div class="history-item-header">
                    <span class="history-date">${new Date(order.date).toLocaleString('pt-BR')}</span>
                    <span class="history-total">R$ ${order.total.toFixed(2).replace('.', ',')}</span>
                </div>
                <div class="history-items">
                    ${order.items.map(item => `<p>• ${item.nome} (${item.quantity}x)</p>`).join('')}
                </div>
                <button class="btn-repeat" onclick="repeatOrder(${index})">🔁 Repetir Pedido</button>
            </div>
        `;
    });
    
    html += `
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', html);
}

function closeHistory() {
    const modal = document.getElementById('history-modal');
    if (modal) {
        modal.remove();
    }
}

function repeatOrder(index) {
    const history = loadOrderHistory();
    const order = history[index];
    
    if (!order) return;
    
    // Limpar carrinho atual
    state.cart = {};
    
    // Adicionar itens do pedido anterior
    order.items.forEach(item => {
        const product = state.products.find(p => p.id === item.id);
        if (product) {
            state.cart[item.id] = {
                product: product,
                quantity: item.quantity
            };
        }
    });
    
    // Atualizar UI
    renderMenu();
    updateCartUI();
    closeHistory();
    openCart();
    
    alert('✅ Pedido anterior adicionado ao carrinho!');
}

// ============================================
// PROCESSAR PEDIDO
// ============================================
function handleOrderSubmit(e) {
    if (state.orderingDisabled) {
        alert('⛔ Desculpe, estamos fechados no momento!');
        return;
    }
    e.preventDefault();
    
    const name = document.getElementById('customer-name').value.trim();
    const address = document.getElementById('customer-address').value.trim();
    const paymentMethod = document.getElementById('payment-method').value;
    const notes = document.getElementById('customer-notes').value.trim();
    const changeFor = document.getElementById('change-for').value;
    
    if (!name || !address) {
        alert('Por favor, preencha seu nome e endereço.');
        return;
    }
    
    if (!paymentMethod) {
        alert('Por favor, selecione a forma de pagamento.');
        return;
    }
    
    // Gerar mensagem do WhatsApp
    let message = '*Pedido:*\n\n';
    let subtotal = 0;
    
    Object.values(state.cart).forEach(item => {
        const itemSubtotal = item.product.preco * item.quantity;
        subtotal += itemSubtotal;
        message += `• ${item.product.nome} (${item.quantity}x) - R$ ${itemSubtotal.toFixed(2).replace('.', ',')}\n`;
    });
    
    const deliveryFee = DELIVERY_FEE;
    const total = subtotal + deliveryFee;
    
    message += `\n*Subtotal:* R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
    message += `*Taxa de Entrega:* R$ ${deliveryFee.toFixed(2).replace('.', ',')}\n`;
    message += `*Total Final: R$ ${total.toFixed(2).replace('.', ',')}*\n\n`;
    message += `*Nome:* ${name}\n`;
    message += `*Endereço:* ${address}\n`;
    message += `*Forma de Pagamento:* ${paymentMethod}\n`;
    
    if (paymentMethod === 'Dinheiro' && changeFor) {
        const change = parseFloat(changeFor) - total;
        message += `*Troco para:* R$ ${parseFloat(changeFor).toFixed(2).replace('.', ',')}\n`;
        if (change > 0) {
            message += `*Troco:* R$ ${change.toFixed(2).replace('.', ',')}\n`;
        }
    }
    
    if (notes) {
        message += `*Observações:* ${notes}\n`;
    }
    
    // Salvar pedido no histórico
    const orderData = {
        date: new Date().toISOString(),
        items: Object.values(state.cart).map(item => ({
            id: item.product.id,
            nome: item.product.nome,
            quantity: item.quantity,
            preco: item.product.preco
        })),
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total,
        customerName: name,
        address: address,
        paymentMethod: paymentMethod
    };
    
    saveOrderToHistory(orderData);
    
    // Abrir WhatsApp
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Limpar carrinho após enviar
    state.cart = {};
    updateCartUI();
    renderMenu();
    closeCart();
}
