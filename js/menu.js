// menu.js - Логика страницы меню

let currentFilters = {
    category: 'all',
    sort: 'default',
    search: ''
};

// Загрузка и отображение пицц
function displayPizzas() {
    const menuGrid = document.getElementById('menuGrid');
    const emptyState = document.getElementById('emptyState');

    if (!menuGrid) return;

    // Фильтрация
    let filtered = window.pizzasData;

    // По категории
    if (currentFilters.category !== 'all') {
        filtered = filtered.filter(p => p.category === currentFilters.category);
    }

    // По поиску
    if (currentFilters.search) {
        const search = currentFilters.search.toLowerCase();
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(search) ||
            p.description.toLowerCase().includes(search)
        );
    }

    // Сортировка
    switch (currentFilters.sort) {
        case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }

    // Отображение
    if (filtered.length === 0) {
        menuGrid.style.display = 'none';
        emptyState.style.display = 'block';
    } else {
        menuGrid.style.display = 'grid';
        emptyState.style.display = 'none';

        menuGrid.innerHTML = filtered.map(pizza => `
            <div class="pizza-card">
                <div class="pizza-card__image">${pizza.image}</div>
                <h3 class="pizza-card__title">${pizza.name}</h3>
                <p class="pizza-card__description">${pizza.description}</p>
                <div class="pizza-card__footer">
                    <span class="pizza-card__price">от ${pizza.price} ₽</span>
                    <button class="pizza-card__button button button--primary" 
                            onclick="showPizzaModal(${pizza.id})">
                        Выбрать
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Фильтр по категории
const categoryFilter = document.getElementById('categoryFilter');
if (categoryFilter) {
    categoryFilter.addEventListener('change', (e) => {
        currentFilters.category = e.target.value;
        displayPizzas();
    });
}

// Сортировка
const sortFilter = document.getElementById('sortFilter');
if (sortFilter) {
    sortFilter.addEventListener('change', (e) => {
        currentFilters.sort = e.target.value;
        displayPizzas();
    });
}

// Поиск
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        currentFilters.search = e.target.value;
        displayPizzas();
    });
}

// Загрузка категории из URL
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category');
if (category && categoryFilter) {
    categoryFilter.value = category;
    currentFilters.category = category;
}

// Инициализация
displayPizzas();