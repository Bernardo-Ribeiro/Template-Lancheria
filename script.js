// Cart State
let cart = {};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    updateCartDisplay();
});

// Toggle Cart Drawer
function toggleCart() {
    const overlay = document.getElementById('cartOverlay');
    const drawer = document.getElementById('cartDrawer');
    
    overlay.classList.toggle('active');
    drawer.classList.toggle('active');
    
    if (drawer.classList.contains('active')) {
        updateCartDisplay();
    }
}

// Add Item to Cart
function addToCart(productId) {
    const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
    const name = productCard.dataset.name;
    const price = parseFloat(productCard.dataset.price);
    
    if (!cart[productId]) {
        cart[productId] = {
            id: productId,
            name: name,
            price: price,
            quantity: 0
        };
    }
    
    cart[productId].quantity++;
    
    updateProductCard(productId);
    updateCartBadge();
    updateCartDisplay();
}

// Remove Item from Cart
function removeFromCart(productId) {
    if (cart[productId]) {
        cart[productId].quantity--;
        
        if (cart[productId].quantity <= 0) {
            delete cart[productId];
        }
        
        updateProductCard(productId);
        updateCartBadge();
        updateCartDisplay();
    }
}

// Update Product Card Display
function updateProductCard(productId) {
    const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
    const addButton = productCard.querySelector('.btn-add');
    const controls = productCard.querySelector('.product-controls');
    const quantitySpan = productCard.querySelector('.product-quantity');
    
    if (cart[productId] && cart[productId].quantity > 0) {
        addButton.style.display = 'none';
        controls.style.display = 'flex';
        quantitySpan.textContent = cart[productId].quantity;
    } else {
        addButton.style.display = 'block';
        controls.style.display = 'none';
    }
}

// Update Cart Badge
function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
}

// Update Cart Display
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const totalValue = document.getElementById('totalValue');
    
    // Clear current display
    cartItems.innerHTML = '';
    
    const items = Object.values(cart);
    
    if (items.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>Seu carrinho está vazio</p>
                <p class="empty-cart-subtitle">Adicione itens para começar!</p>
            </div>
        `;
        cartFooter.style.display = 'none';
        return;
    }
    
    // Display cart items
    let total = 0;
    items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">R$ ${formatPrice(itemTotal)}</div>
            </div>
            <div class="cart-item-controls">
                <button onclick="removeFromCart(${item.id})">−</button>
                <span class="cart-item-quantity">${item.quantity}</span>
                <button onclick="addToCart(${item.id})">+</button>
            </div>
        `;
        cartItems.appendChild(itemElement);
    });
    
    // Update total
    totalValue.textContent = `R$ ${formatPrice(total)}`;
    cartFooter.style.display = 'block';
}

// Format Price
function formatPrice(price) {
    return price.toFixed(2).replace('.', ',');
}

// Finalize Order (Send to WhatsApp)
function finalizeOrder() {
    const items = Object.values(cart);
    
    if (items.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    // Build WhatsApp message
    let message = '🍔 *Novo Pedido - Lancheria*\n\n';
    let total = 0;
    
    items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `▪️ ${item.quantity}x ${item.name}\n`;
        message += `   R$ ${formatPrice(itemTotal)}\n\n`;
    });
    
    message += `━━━━━━━━━━━━━━━━\n`;
    message += `💰 *Total: R$ ${formatPrice(total)}*\n\n`;
    message += `📍 _Aguardando confirmação de endereço de entrega_`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Replace with your WhatsApp number (format: country code + number, no spaces or special chars)
    // Example: 5511999999999 for Brazil
    const whatsappNumber = '5511999999999';
    
    // Open WhatsApp
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
    
    // Optional: Clear cart after sending
    // cart = {};
    // updateCartBadge();
    // updateCartDisplay();
    // toggleCart();
}

// Close cart when clicking outside
document.getElementById('cartOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'cartOverlay') {
        toggleCart();
    }
});

// Close cart with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const drawer = document.getElementById('cartDrawer');
        if (drawer.classList.contains('active')) {
            toggleCart();
        }
    }
});
