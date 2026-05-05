// ===== КАТАЛОГ ТОВАРОВ =====
const allProducts = [
    {id:1, name:'Классический синий пиджак', price:45900, category:'men', img:'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/d1d09039f9e41a87923b4dc67b6ff79d4b5c9db5.jpg'},
    {id:2, name:'Тёмно-синий костюм', price:54900, category:'men', img:'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/9d76366775a7ff95e9d36393564ea19cd3a30f32.jpg'},
    {id:3, name:'Белая классическая рубашка', price:18900, category:'men', img:'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/fda15c60da3b5673ada8915d5d8a5689020ef829.jpg'},
    {id:4, name:'Классические чёрные брюки', price:23900, category:'men', img:'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/9795c28dbf61c8a51d0021a64b0e68d5e00b3b64.jpg'},
    {id:5, name:'Тёмно-синее шерстяное пальто', price:59900, category:'men', img:'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/7545e31a2ff3bec2dc1038aa02e08454c68f507e.jpg'},
    {id:6, name:'Длинное чёрное пальто', price:62000, category:'men', img:'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/6f5d002dd60f0f1b17fe5cbf5a3485ad16761bec.jpg'},
    {id:7, name:'Белый классический блейзер', price:49900, category:'women', img:'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/44036ac7aac3ef98f4d7cbbc80c1d5c0277570da.jpg'},
    {id:8, name:'Бежевые брюки высокой талии', price:22900, category:'women', img:'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/4e3e27463161503daf28e68340398258ec5b2e55.jpg'},
    {id:9, name:'Синяя полосатая юбка миди', price:21900, category:'women', img:'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/767ac392c0b17e47ebc77565374634a0d0643c49.jpg'},
    {id:10, name:'Классический серый тренч', price:39900, category:'women', img:'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/ad941b0bd05b6c7de8dee9ab7bad896d5d97bc01.jpg'},
    {id:11, name:'Светло-серая водолазка', price:16900, category:'women', img:'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/fe1ebe5b37651f0c0ddf97069b6d0716b652f8d7.jpg'},
    {id:12, name:'Синий деловой блейзер', price:46900, category:'women', img:'https://pplx-res.cloudinary.com/image/upload/pplx_search_images/5a9a59268bfcfc76127cde18e233f9448e12ec35.jpg'},
];

// ===== КОРЗИНА =====
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentCategory = 'all';

function updateCartCount() {
    const count = cart.length;
    document.querySelector('.cart-count').textContent = count;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// ===== СЛАЙДЕР =====
let slideIndex = 0;
let slideTimer = null;

function autoSlide() {
    const slides = document.querySelectorAll('.slide');
    if(slides.length === 0) {
        if(slideTimer) clearInterval(slideTimer);
        return;
    }
    slides.forEach(s => s.classList.remove('active'));
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add('active');
}

// Запусти автослайдер если есть slides
if(document.querySelectorAll('.slide').length > 0) {
    slideTimer = setInterval(autoSlide, 5000);
}

const sliderNext = document.querySelector('.slider-next');
if(sliderNext) {
    sliderNext.onclick = () => {
        const slides = document.querySelectorAll('.slide');
        slides.forEach(s => s.classList.remove('active'));
        slideIndex = (slideIndex + 1) % slides.length;
        slides[slideIndex].classList.add('active');
    };
}

const sliderPrev = document.querySelector('.slider-prev');
if(sliderPrev) {
    sliderPrev.onclick = () => {
        const slides = document.querySelectorAll('.slide');
        slides.forEach(s => s.classList.remove('active'));
        slideIndex = (slideIndex - 1 + slides.length) % slides.length;
        slides[slideIndex].classList.add('active');
    };
}

// ===== ФИЛЬТРАЦИЯ И ОТОБРАЖЕНИЕ ТОВАРОВ =====
function displayProducts(productsToShow) {
    const grid = document.querySelector('.products-grid');
    grid.innerHTML = '';
    productsToShow.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product';
        const isFav = favorites.includes(p.id);
        div.innerHTML = `
            <div class="product-image">
                <img src="${p.img}" alt="${p.name}">
                <button class="favorite-btn ${isFav ? 'active' : ''}" data-id="${p.id}">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <div class="price">${p.price.toLocaleString('ru-RU')} ₸</div>
            </div>`;
        div.onclick = (e) => {
            if (!e.target.closest('.favorite-btn')) {
                openProductModal(p);
            }
        };
        grid.appendChild(div);
    });
    addFavoriteListeners();
}

function addFavoriteListeners() {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            if (favorites.includes(id)) {
                favorites = favorites.filter(x => x !== id);
            } else {
                favorites.push(id);
            }
            btn.classList.toggle('active');
            saveFavorites();
        };
    });
}

function updateCategoryButtons() {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === currentCategory);
    });
}

function filterProducts() {
    let filtered = allProducts;
    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }
    const searchTerm = document.querySelector('#search').value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm));
    }
    const sort = document.querySelector('#sort').value;
    if (sort === 'По цене (мин)') {
        filtered.sort((a,b) => a.price - b.price);
    } else if (sort === 'По цене (макс)') {
        filtered.sort((a,b) => b.price - a.price);
    }
    const minPrice = parseInt(document.querySelector('#price-min').value);
    const maxPrice = parseInt(document.querySelector('#price-max').value);
    filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);
    displayProducts(filtered);
    updateCategoryButtons();
}

// ===== МОДАЛЬНОЕ ОКНО ТОВАРА =====
function openProductModal(product) {
    const modal = document.createElement('div');
    modal.className = 'modal show product-modal';
    modal.innerHTML = `
        <div class="modal-content product-modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-product">
                <div class="modal-img">
                    <img src="${product.img}" alt="${product.name}">
                </div>
                <div class="modal-details">
                    <h2>${product.name}</h2>
                    <div class="price">${product.price.toLocaleString('ru-RU')} ₸</div>
                    <div class="size-grid">
                        <label><input type="radio" name="size"> XS</label>
                        <label><input type="radio" name="size"> S</label>
                        <label><input type="radio" name="size"> M</label>
                        <label><input type="radio" name="size"> L</label>
                        <label><input type="radio" name="size"> XL</label>
                    </div>
                    <button class="add-to-cart-btn" data-id="${product.id}">Добавить в корзину</button>
                </div>
            </div>
        </div>`;
    document.body.appendChild(modal);
    modal.querySelector('.close-modal').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    modal.querySelector('.add-to-cart-btn').onclick = () => {
        cart.push({...product, quantity: 1});
        saveCart();
        alert('Добавлено в корзину!');
        modal.remove();
    };
}

// ===== КОРЗИНА МОДАЛЬНОЕ ОКНО =====
function openCart() {
    const modal = document.createElement('div');
    modal.className = 'modal show cart-modal';
    let cartHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Корзина</h2>
                <span class="close-modal">&times;</span>
            </div>
            <div class="cart-items">`;
    
    let total = 0;
    if (cart.length === 0) {
        cartHTML += '<p style="padding:2rem;text-align:center;color:#999;">Корзина пуста</p>';
    } else {
        cart.forEach((item, idx) => {
            total += item.price;
            cartHTML += `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.price.toLocaleString('ru-RU')} ₸</p>
                    </div>
                    <button class="remove-item" data-idx="${idx}">✕</button>
                </div>`;
        });
    }
    cartHTML += `
            </div>
            <div class="cart-footer">
                <div class="total">Итого: ${total.toLocaleString('ru-RU')} ₸</div>
                <button class="checkout">Оформить заказ</button>
            </div>
        </div>`;
    modal.innerHTML = cartHTML;
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').onclick = () => modal.remove();
    modal.querySelectorAll('.remove-item').forEach(btn => {
        btn.onclick = () => {
            cart.splice(parseInt(btn.dataset.idx), 1);
            saveCart();
            openCart();
            modal.remove();
        };
    });
    modal.querySelector('.checkout').onclick = () => {
        alert('Спасибо за покупку! Заказ создан.');
        cart = [];
        saveCart();
        modal.remove();
    };
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
}

function getSavedUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
}

function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function clearCurrentUser() {
    localStorage.removeItem('currentUser');
}

function updateAuthUI() {
    const currentUser = getCurrentUser();
    const loginLink = document.querySelector('.login');
    const registerLink = document.querySelector('.register');
    if (currentUser) {
        if (loginLink) {
            loginLink.innerHTML = `<i class="fas fa-user-circle"></i> Профиль`;
            loginLink.classList.add('user-logged');
            loginLink.removeAttribute('href');
        }
        if (registerLink) {
            registerLink.innerHTML = `<i class="fas fa-sign-out-alt"></i> Выйти`;
            registerLink.classList.add('logout');
            registerLink.removeAttribute('href');
        }
    } else {
        if (loginLink) {
            loginLink.innerHTML = `<i class="fas fa-user-circle"></i> Войти`;
            loginLink.classList.remove('user-logged');
            loginLink.setAttribute('href', '#');
        }
        if (registerLink) {
            registerLink.innerHTML = `<i class="fas fa-user-plus"></i> Регистрация`;
            registerLink.classList.remove('logout');
            registerLink.setAttribute('href', '#');
        }
    }
}

function openAuthModal(type = 'login') {
    const modal = document.createElement('div');
    modal.className = 'modal show auth-modal';
    modal.innerHTML = `
        <div class="modal-content auth-content">
            <div class="modal-header">
                <h2>${type === 'register' ? 'Создать аккаунт' : 'Вход в аккаунт'}</h2>
                <span class="close-modal">&times;</span>
            </div>
            <div class="auth-tabs">
                <button type="button" class="auth-tab ${type === 'login' ? 'active' : ''}" data-type="login">Вход</button>
                <button type="button" class="auth-tab ${type === 'register' ? 'active' : ''}" data-type="register">Регистрация</button>
            </div>
            <div class="auth-body"></div>
        </div>`;
    document.body.appendChild(modal);

    const renderBody = (mode) => {
        const body = modal.querySelector('.auth-body');
        const title = modal.querySelector('.modal-header h2');
        title.textContent = mode === 'register' ? 'Создать аккаунт' : 'Вход в аккаунт';
        modal.querySelectorAll('.auth-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.type === mode);
        });
        body.innerHTML = mode === 'register' ? `
            <form class="auth-form" id="auth-form">
                <div class="form-group">
                    <label for="auth-name">Имя</label>
                    <input type="text" id="auth-name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="auth-email">E-mail</label>
                    <input type="email" id="auth-email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="auth-password">Пароль</label>
                    <input type="password" id="auth-password" name="password" required>
                </div>
                <div class="form-group">
                    <label for="auth-password-confirm">Повторите пароль</label>
                    <input type="password" id="auth-password-confirm" name="passwordConfirm" required>
                </div>
                <div class="auth-message"></div>
                <button type="submit" class="auth-submit">Зарегистрироваться</button>
                <div class="auth-footer">Уже есть аккаунт? <span class="auth-toggle" data-type="login">Войти</span></div>
            </form>` : `
            <form class="auth-form" id="auth-form">
                <div class="form-group">
                    <label for="auth-email">E-mail</label>
                    <input type="email" id="auth-email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="auth-password">Пароль</label>
                    <input type="password" id="auth-password" name="password" required>
                </div>
                <div class="auth-message"></div>
                <button type="submit" class="auth-submit">Войти</button>
                <div class="auth-footer">Нет аккаунта? <span class="auth-toggle" data-type="register">Регистрация</span></div>
            </form>`;

        modal.querySelectorAll('.auth-tab').forEach(tab => {
            tab.onclick = () => renderBody(tab.dataset.type);
        });

        modal.querySelectorAll('.auth-toggle').forEach(link => {
            link.onclick = () => renderBody(link.dataset.type);
        });

        modal.querySelector('.auth-form').onsubmit = (e) => {
            e.preventDefault();
            const email = modal.querySelector('[name="email"]').value.trim().toLowerCase();
            const password = modal.querySelector('[name="password"]').value;
            const message = modal.querySelector('.auth-message');
            if (mode === 'register') {
                const name = modal.querySelector('[name="name"]').value.trim();
                const confirm = modal.querySelector('[name="passwordConfirm"]').value;
                if (!name || !email || !password) {
                    message.textContent = 'Заполните все поля, пожалуйста.';
                    return;
                }
                if (password.length < 6) {
                    message.textContent = 'Пароль должен содержать минимум 6 символов.';
                    return;
                }
                if (password !== confirm) {
                    message.textContent = 'Пароли не совпадают.';
                    return;
                }
                const users = getSavedUsers();
                if (users.some(user => user.email === email)) {
                    message.textContent = 'Пользователь с таким e-mail уже есть.';
                    return;
                }
                const user = { name, email, password };
                users.push(user);
                saveUsers(users);
                setCurrentUser(user);
                updateAuthUI();
                alert('Регистрация прошла успешно!');
                modal.remove();
            } else {
                const users = getSavedUsers();
                const user = users.find(user => user.email === email && user.password === password);
                if (!user) {
                    message.textContent = 'Неверный e-mail или пароль.';
                    return;
                }
                setCurrentUser(user);
                updateAuthUI();
                alert(`Добро пожаловать, ${user.name}!`);
                modal.remove();
            }
        };
    };

    renderBody(type);
    modal.querySelector('.close-modal').onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
}

function openProfileModal() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    const modal = document.createElement('div');
    modal.className = 'modal show auth-modal';
    modal.innerHTML = `
        <div class="modal-content auth-content">
            <div class="modal-header">
                <h2>Профиль</h2>
                <span class="close-modal">&times;</span>
            </div>
            <div class="auth-body">
                <div class="profile-info">
                    <p><strong>Имя:</strong> ${currentUser.name}</p>
                    <p><strong>E-mail:</strong> ${currentUser.email}</p>
                </div>
                <button class="auth-submit profile-logout">Выйти</button>
            </div>
        </div>`;
    document.body.appendChild(modal);
    modal.querySelector('.close-modal').onclick = () => modal.remove();
    modal.querySelector('.profile-logout').onclick = () => {
        logout();
        modal.remove();
    };
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
}

function logout() {
    clearCurrentUser();
    updateAuthUI();
    alert('Вы вышли из аккаунта.');
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    // Обнови счетчик корзины если элемент существует
    const cartCount = document.querySelector('.cart-count');
    if(cartCount) updateCartCount();
    updateAuthUI();

    const loginLink = document.querySelector('.login');
    if (loginLink) {
        loginLink.onclick = (e) => {
            e.preventDefault();
            if (getCurrentUser()) {
                openProfileModal();
                return;
            }
            openAuthModal('login');
        };
    }

    const registerLink = document.querySelector('.register');
    if (registerLink) {
        registerLink.onclick = (e) => {
            e.preventDefault();
            if (getCurrentUser()) {
                logout();
                return;
            }
            openAuthModal('register');
        };
    }
    
    // Отображение товаров если существует grid
    const productsGrid = document.querySelector('.products-grid');
    if(productsGrid) {
        displayProducts(allProducts);
        
        // Навигация по категориям
        document.querySelectorAll('[data-category]').forEach(link => {
            link.onclick = (e) => {
                e.preventDefault();
                currentCategory = link.dataset.category;
                filterProducts();
            };
        });
        updateCategoryButtons();
        
        // Фильтры
        const sortSelect = document.querySelector('#sort');
        if(sortSelect) sortSelect.onchange = filterProducts;
        
        const searchInput = document.querySelector('#search');
        if(searchInput) searchInput.oninput = filterProducts;
        
        const priceMin = document.querySelector('#price-min');
        const priceMax = document.querySelector('#price-max');
        const priceDisplay = document.querySelector('#price-display');
        
        if(priceMin) {
            priceMin.oninput = () => {
                if(priceDisplay) {
                    priceDisplay.textContent = 
                        `${parseInt(priceMin.value).toLocaleString('ru-RU')} - ${parseInt(priceMax.value).toLocaleString('ru-RU')} ₸`;
                }
                filterProducts();
            };
        }
        
        if(priceMax) {
            priceMax.oninput = () => {
                if(priceDisplay) {
                    priceDisplay.textContent = 
                        `${parseInt(priceMin.value).toLocaleString('ru-RU')} - ${parseInt(priceMax.value).toLocaleString('ru-RU')} ₸`;
                }
                filterProducts();
            };
        }
    }
    
    // Корзина
    const cartBtn = document.querySelector('.cart');
    if(cartBtn) cartBtn.onclick = openCart;
});
