// ===================================
// УНИВЕРСАЛЬНАЯ УСТАНОВКА PWA
// ===================================

(function () {
    const installButton = document.getElementById('installButton');
    let deferredPrompt = null;

    // Проверяем, установлено ли уже приложение
    function isPWAInstalled() {
        return window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true;
    }

    // Если уже установлено - скрываем кнопку
    if (isPWAInstalled()) {
        if (installButton) {
            installButton.style.display = 'none';
        }
        console.log('✅ PWA уже установлен');
        return;
    }

    // Пытаемся поймать событие от браузера
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('✅ Браузер поддерживает автоустановку');
        e.preventDefault();
        deferredPrompt = e;

        // Показываем кнопку (если была скрыта)
        if (installButton) {
            installButton.style.display = 'flex';
        }
    });

    // Обработчик клика на кнопку
    if (installButton) {
        installButton.addEventListener('click', async () => {
            console.log('🔘 Кнопка установки нажата');

            // Способ 1: Если браузер дал нам prompt
            if (deferredPrompt) {
                try {
                    await deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;

                    if (outcome === 'accepted') {
                        console.log('✅ Установка начата');
                        showSuccessMessage();
                    }

                    deferredPrompt = null;
                    return;
                } catch (error) {
                    console.log('Ошибка автоустановки:', error);
                }
            }

            // Способ 2: Создаём ярлык вручную
            createDesktopShortcut();
        });
    }

    // Функция создания ярлыка
    function createDesktopShortcut() {
        const currentURL = window.location.origin;
        const appName = 'PizzaExpress';

        // Создаём инструкцию для пользователя
        const instructions = `
📱 Установка PizzaExpress

Выберите ваш браузер:

━━━━━━━━━━━━━━━━━━━━━━━
🌐 OPERA GX / OPERA:
━━━━━━━━━━━━━━━━━━━━━━━

1. Нажмите на иконку Opera в левом верхнем углу
2. Наведите на "Страница"
3. Выберите "Установить PizzaExpress..."
4. Нажмите "Установить"

ИЛИ:

1. Нажмите Ctrl + Shift + I (открыть DevTools)
2. Нажмите Ctrl + Shift + P
3. Введите "install"
4. Выберите "Install Page as App"

━━━━━━━━━━━━━━━━━━━━━━━
🔷 MICROSOFT EDGE:
━━━━━━━━━━━━━━━━━━━━━━━

1. Нажмите на меню "..." (три точки справа)
2. Наведите на "Приложения"
3. Выберите "Установить этот сайт как приложение"
4. Нажмите "Установить"

ИЛИ:

1. В адресной строке справа найдите иконку 📲
2. Нажмите на неё
3. Нажмите "Установить"

━━━━━━━━━━━━━━━━━━━━━━━
🔧 АЛЬТЕРНАТИВНЫЙ СПОСОБ (работает везде):
━━━━━━━━━━━━━━━━━━━━━━━

Windows:
1. Откройте: ${currentURL}
2. Нажмите правой кнопкой на рабочем столе
3. Создать → Ярлык
4. Вставьте: ${currentURL} (сразу после укажите директорию, куда был установлен файл index.html)
5. Назовите: ${appName}

━━━━━━━━━━━━━━━━━━━━━━━

✅ После установки приложение откроется в отдельном окне!
        `;

        // Показываем инструкцию в красивом окне
        showInstallModal(instructions);
    }

    // Красивое модальное окно с инструкциями
    function showInstallModal(text) {
        // Создаём модальное окно
        const modal = document.createElement('div');
        modal.className = 'install-modal';
        modal.innerHTML = `
            <div class="install-modal__overlay"></div>
            <div class="install-modal__content">
                <button class="install-modal__close" onclick="this.closest('.install-modal').remove()">✕</button>
                <div class="install-modal__body">
                    <div class="install-modal__icon">📱</div>
                    <pre class="install-modal__text">${text}</pre>
                    <div class="install-modal__buttons">
                        <button class="button button--primary" onclick="this.closest('.install-modal').remove()">
                            Понятно
                        </button>
                        <button class="button button--secondary" onclick="copyInstallURL()">
                            📋 Копировать URL
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Добавляем стили для модального окна
        const style = document.createElement('style');
        style.textContent = `
            .install-modal {
                position: fixed;
                inset: 0;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }
            
            .install-modal__overlay {
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.8);
            }
            
            .install-modal__content {
                position: relative;
                background: white;
                border-radius: 12px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
                animation: slideUp 0.3s ease;
            }
            
            .install-modal__close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: #f0f0f0;
                border: none;
                border-radius: 50%;
                width: 36px;
                height: 36px;
                font-size: 1.5rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1;
            }
            
            .install-modal__close:hover {
                background: #e0e0e0;
            }
            
            .install-modal__body {
                padding: 2rem;
            }
            
            .install-modal__icon {
                font-size: 4rem;
                text-align: center;
                margin-bottom: 1rem;
            }
            
            .install-modal__text {
                background: #f8f9fa;
                padding: 1.5rem;
                border-radius: 8px;
                font-family: 'Courier New', monospace;
                font-size: 0.85rem;
                line-height: 1.6;
                white-space: pre-wrap;
                max-height: 400px;
                overflow-y: auto;
                margin-bottom: 1.5rem;
            }
            
            .install-modal__buttons {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
            }
            
            .install-modal__buttons .button {
                flex: 1;
                min-width: 150px;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from {
                    transform: translateY(50px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(modal);

        // Закрытие по клику на overlay
        modal.querySelector('.install-modal__overlay').addEventListener('click', () => {
            modal.remove();
        });
    }

    // Функция копирования URL
    window.copyInstallURL = function () {
        const url = window.location.origin;
        navigator.clipboard.writeText(url).then(() => {
            alert('✅ URL скопирован: ' + url + '\n\nТеперь можете создать ярлык вручную!');
        }).catch(() => {
            prompt('Скопируйте URL:', url);
        });
    };

    // Сообщение об успешной установке
    function showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-toast';
        message.innerHTML = '🎉 Приложение устанавливается!';
        message.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: #06d6a0;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(message);
        setTimeout(() => message.remove(), 3000);
    }

    // После установки скрываем кнопку
    window.addEventListener('appinstalled', () => {
        console.log('🎉 PWA установлен!');
        if (installButton) {
            installButton.style.display = 'none';
        }
        showSuccessMessage();
    });

    console.log('✅ Система установки PWA готова');
})();

// ===================================
// МОБИЛЬНОЕ МЕНЮ
// ===================================

const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

if (burger) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('header__burger--active');
        nav.classList.toggle('header__nav--active');
    });
}

// Закрытие меню при клике вне его
document.addEventListener('click', (e) => {
    if (nav && burger) {
        if (!nav.contains(e.target) && !burger.contains(e.target)) {
            nav.classList.remove('header__nav--active');
            burger.classList.remove('header__burger--active');
        }
    }
});

// ===================================
// КНОПКА ПРОФИЛЯ (ИСПРАВЛЕНИЕ!)
// ===================================

const profileBtn = document.getElementById('profileBtn');
if (profileBtn) {
    profileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'profile.html';
    });
}

// ===================================
// ДАННЫЕ ПИЦЦ
// ===================================

const pizzasData = [
    {
        id: 1,
        name: 'Маргарита',
        description: 'Томатный соус, моцарелла, базилик',
        price: 450,
        category: 'popular',
        image: '🧀',
        sizes: ['25см', '30см', '35см'],
        dough: ['Тонкое', 'Традиционное']
    },
    {
        id: 2,
        name: 'Пепперони',
        description: 'Томатный соус, моцарелла, пепперони',
        price: 550,
        category: 'meat',
        image: '🍖',
        sizes: ['25см', '30см', '35см'],
        dough: ['Тонкое', 'Традиционное']
    },
    {
        id: 3,
        name: 'Четыре сыра',
        description: 'Моцарелла, пармезан, горгонзола, чеддер',
        price: 600,
        category: 'popular',
        image: '🧀',
        sizes: ['25см', '30см', '35см'],
        dough: ['Тонкое', 'Традиционное']
    },
    {
        id: 4,
        name: 'Вегетарианская',
        description: 'Томаты, перец, грибы, оливки, лук',
        price: 500,
        category: 'veg',
        image: '🥗',
        sizes: ['25см', '30см', '35см'],
        dough: ['Тонкое', 'Традиционное']
    },
    {
        id: 5,
        name: 'Мексиканская',
        description: 'Острая салями, перец халапеньо, лук',
        price: 580,
        category: 'spicy',
        image: '🌶️',
        sizes: ['25см', '30см', '35см'],
        dough: ['Тонкое', 'Традиционное']
    },
    {
        id: 6,
        name: 'Гавайская',
        description: 'Ветчина, ананасы, моцарелла',
        price: 520,
        category: 'meat',
        image: '🍍',
        sizes: ['25см', '30см', '35см'],
        dough: ['Тонкое', 'Традиционное']
    }
];

// ===================================
// КОРЗИНА
// ===================================

class Cart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartCount();
    }

    loadCart() {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount();
    }

    addItem(pizza, size, dough) {
        const existingItem = this.items.find(item =>
            item.id === pizza.id &&
            item.size === size &&
            item.dough === dough
        );

        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push({
                ...pizza,
                size,
                dough,
                quantity: 1
            });
        }

        this.saveCart();
        this.showNotification('Пицца добавлена в корзину');
    }

    removeItem(index) {
        this.items.splice(index, 1);
        this.saveCart();
    }

    updateQuantity(index, quantity) {
        if (quantity <= 0) {
            this.removeItem(index);
        } else {
            this.items[index].quantity = quantity;
            this.saveCart();
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => {
            let price = item.price;
            // Добавляем наценку за размер
            if (item.size === '30см') price += 100;
            if (item.size === '35см') price += 200;
            return total + (price * item.quantity);
        }, 0);
    }

    clear() {
        this.items = [];
        this.saveCart();
    }

    updateCartCount() {
        const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('#cartCount');
        cartCountElements.forEach(el => {
            el.textContent = count;
            if (count > 0) {
                el.style.display = 'inline-block';
            } else {
                el.style.display = 'none';
            }
        });
    }

    showNotification(message) {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('notification--show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('notification--show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }
}

// Инициализация корзины
const cart = new Cart();
window.cart = cart;

// ===================================
// ЗАГРУЗКА ПОПУЛЯРНЫХ ПИЦЦ НА ГЛАВНОЙ
// ===================================

const popularPizzasContainer = document.getElementById('popularPizzas');
if (popularPizzasContainer) {
    const popularPizzas = pizzasData.filter(p => p.category === 'popular').slice(0, 3);

    popularPizzasContainer.innerHTML = popularPizzas.map(pizza => `
        <div class="pizza-card">
            <div class="pizza-card__image">${pizza.image}</div>
            <h3 class="pizza-card__title">${pizza.name}</h3>
            <p class="pizza-card__description">${pizza.description}</p>
            <div class="pizza-card__footer">
                <span class="pizza-card__price">от ${pizza.price} ₽</span>
                <button class="pizza-card__button button button--primary" onclick="showPizzaModal(${pizza.id})">
                    Выбрать
                </button>
            </div>
        </div>
    `).join('');
}

// ===================================
// МОДАЛЬНОЕ ОКНО ПИЦЦЫ
// ===================================

function showPizzaModal(pizzaId) {
    const pizza = pizzasData.find(p => p.id === pizzaId);
    if (!pizza) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal__overlay"></div>
        <div class="modal__content">
            <button class="modal__close">&times;</button>
            <div class="modal__body">
                <div class="modal__image">${pizza.image}</div>
                <h2 class="modal__title">${pizza.name}</h2>
                <p class="modal__description">${pizza.description}</p>
                
                <div class="modal__options">
                    <div class="modal__option">
                        <label class="modal__label">Размер:</label>
                        <div class="modal__buttons">
                            ${pizza.sizes.map((size, i) => `
                                <button class="modal__option-btn ${i === 0 ? 'modal__option-btn--active' : ''}" 
                                        data-size="${size}">${size}</button>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="modal__option">
                        <label class="modal__label">Тесто:</label>
                        <div class="modal__buttons">
                            ${pizza.dough.map((dough, i) => `
                                <button class="modal__option-btn ${i === 0 ? 'modal__option-btn--active' : ''}" 
                                        data-dough="${dough}">${dough}</button>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="modal__footer">
                    <span class="modal__price">от ${pizza.price} ₽</span>
                    <button class="button button--primary" id="addToCartBtn">Добавить в корзину</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('modal--show'), 10);

    // Обработка выбора опций
    modal.querySelectorAll('[data-size]').forEach(btn => {
        btn.addEventListener('click', () => {
            modal.querySelectorAll('[data-size]').forEach(b => b.classList.remove('modal__option-btn--active'));
            btn.classList.add('modal__option-btn--active');
        });
    });

    modal.querySelectorAll('[data-dough]').forEach(btn => {
        btn.addEventListener('click', () => {
            modal.querySelectorAll('[data-dough]').forEach(b => b.classList.remove('modal__option-btn--active'));
            btn.classList.add('modal__option-btn--active');
        });
    });

    // Добавление в корзину
    modal.querySelector('#addToCartBtn').addEventListener('click', () => {
        const selectedSize = modal.querySelector('[data-size].modal__option-btn--active').dataset.size;
        const selectedDough = modal.querySelector('[data-dough].modal__option-btn--active').dataset.dough;

        cart.addItem(pizza, selectedSize, selectedDough);
        closeModal(modal);
    });

    // Закрытие модального окна
    modal.querySelector('.modal__close').addEventListener('click', () => closeModal(modal));
    modal.querySelector('.modal__overlay').addEventListener('click', () => closeModal(modal));
}

function closeModal(modal) {
    modal.classList.remove('modal--show');
    setTimeout(() => modal.remove(), 300);
}

// ===================================
// УТИЛИТЫ
// ===================================

// Форматирование цены
function formatPrice(price) {
    return price.toLocaleString('ru-RU') + ' ₽';
}

// Экспорт данных для других страниц
window.pizzasData = pizzasData;
window.showPizzaModal = showPizzaModal;

console.log('PizzaExpress App загружен');
console.log('Корзина инициализирована:', cart.items.length, 'товаров');