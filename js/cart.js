// cart.js - Логика страницы корзины

function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const cartContent = document.getElementById('cartContent');
    const emptyCart = document.getElementById('emptyCart');
    const cart = window.cart || new Cart();

    if (cart.items.length === 0) {
        if (cartContent) cartContent.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'flex';
        return;
    }

    if (cartContent) cartContent.style.display = 'grid';
    if (emptyCart) emptyCart.style.display = 'none';

    // Отображение товаров
    if (cartItems) {
        cartItems.innerHTML = cart.items.map((item, index) => {
            let price = item.price;
            if (item.size === '30см') price += 100;
            if (item.size === '35см') price += 200;

            return `
                <div class="cart-item">
                    <div class="cart-item__image">${item.image || '🍕'}</div>
                    <div class="cart-item__info">
                        <h3 class="cart-item__name">${item.name}</h3>
                        <p class="cart-item__details">${item.size}, ${item.dough}</p>
                        <div class="cart-item__quantity">
                            <button class="cart-item__quantity-btn" onclick="changeQuantity(${index}, -1)">-</button>
                            <span class="cart-item__quantity-value">${item.quantity}</span>
                            <button class="cart-item__quantity-btn" onclick="changeQuantity(${index}, 1)">+</button>
                        </div>
                    </div>
                    <div class="cart-item__price-block">
                        <span class="cart-item__price">${price * item.quantity} ₽</span>
                        <button class="cart-item__remove" onclick="removeItem(${index})">🗑️</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Обновление итогов
    updateSummary();
}

function updateSummary() {
    const cart = window.cart || new Cart();
    const subtotal = cart.getTotal();
    const deliveryCost = 150;
    const total = subtotal + deliveryCost;

    const itemsCount = document.getElementById('itemsCount');
    const subtotalElement = document.getElementById('subtotal');
    const deliveryElement = document.getElementById('delivery');
    const totalElement = document.getElementById('total');

    if (itemsCount) itemsCount.textContent = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    if (subtotalElement) subtotalElement.textContent = subtotal + ' ₽';
    if (deliveryElement) deliveryElement.textContent = deliveryCost + ' ₽';
    if (totalElement) totalElement.textContent = total + ' ₽';
}

function changeQuantity(index, delta) {
    const cart = window.cart || new Cart();
    const newQuantity = cart.items[index].quantity + delta;
    cart.updateQuantity(index, newQuantity);
    displayCart();
}

function removeItem(index) {
    if (confirm('Удалить товар из корзины?')) {
        const cart = window.cart || new Cart();
        cart.removeItem(index);
        displayCart();
    }
}

// Очистка корзины
const clearCartBtn = document.getElementById('clearCartBtn');
if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
        if (confirm('Очистить всю корзину?')) {
            const cart = window.cart || new Cart();
            cart.clear();
            displayCart();
        }
    });
}

// Переход к оформлению
const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        const cart = window.cart || new Cart();
        if (cart.items.length > 0) {
            window.location.href = 'checkout.html';
        }
    });
}

// Экспорт функций
window.changeQuantity = changeQuantity;
window.removeItem = removeItem;

// Инициализация
displayCart();