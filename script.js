// Скрол по категоріям
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Корзина
var cart = [];

function addToCart(name, price) {
    cart.push({ name: name, price: price });
    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    var cartItems = document.getElementById('cart-items');
    var cartCount = document.getElementById('cart-count');
    var cartTotal = document.getElementById('cart-total');
    var cartEmpty = document.getElementById('cart-empty');

    cartCount.textContent = cart.length;

    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartItems.innerHTML = '';
        cartTotal.textContent = '0';
    } else {
        cartEmpty.style.display = 'none';
        var html = '';
        var total = 0;

        for (var i = 0; i < cart.length; i++) {
            html += '<div class="cart-item">';
            html += '<span>' + cart[i].name + '</span>';
            html += '<span>' + cart[i].price + ' ₴</span>';
            html += '<button class="btn-remove" onclick="removeFromCart(' + i + ')">✕</button>';
            html += '</div>';
            total += cart[i].price;
        }

        cartItems.innerHTML = html;
        cartTotal.textContent = total;
    }
}

function checkout() {
    if (cart.length > 0) {
        var library = JSON.parse(localStorage.getItem('steam_library')) || [];

        for (var i = 0; i < cart.length; i++) {
            library.push(cart[i]);
        }

        localStorage.setItem('steam_library', JSON.stringify(library));

        var cartModalEl = document.getElementById('cartModal');
        var cartModal = bootstrap.Modal.getInstance(cartModalEl);
        cartModal.hide();

        cart = [];
        updateCart();

        var successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
    } else {
        alert('Корзина порожня!');
    }
}

function loadLibrary() {
    var library = JSON.parse(localStorage.getItem('steam_library')) || [];
    var listContainer = document.getElementById('library-list');

    if (!listContainer) return;

    listContainer.innerHTML = '';

    if (library.length === 0) {
        listContainer.innerHTML = '<div style="padding: 10px; color: #8f98a0;">Немає ігор</div>';
        return;
    }

    for (var i = 0; i < library.length; i++) {
        var item = document.createElement('div');
        item.className = 'game-list-item';
        item.innerHTML = '<img src="' + getGameImage(library[i].name) + '" class="game-icon-small">' + library[i].name;
        item.onclick = (function (index) {
            return function () {
                selectGame(index);
            };
        })(i);
        listContainer.appendChild(item);
    }

    if (library.length > 0) {
        selectGame(0);
    }
}

function selectGame(index) {
    var library = JSON.parse(localStorage.getItem('steam_library')) || [];
    var game = library[index];
    var detailsContainer = document.getElementById('library-details');
    var listItems = document.getElementsByClassName('game-list-item');

    for (var i = 0; i < listItems.length; i++) {
        listItems[i].classList.remove('active');
    }
    if (listItems[index]) {
        listItems[index].classList.add('active');
    }

    var html = '';
    html += '<img src="' + getGameImage(game.name) + '" class="game-banner">';
    html += '<div class="game-details-container">';
    html += '<h2 class="library-game-title">' + game.name + '</h2>';
    html += '<div class="play-bar">';
    html += '<button class="btn-play">▶ Грати</button>';
    html += '<div class="game-stats">';
    html += '<div class="stat-item"><span>ОСТАННІЙ ЗАПУСК</span><span class="stat-value">Ніколи</span></div>';
    html += '<div class="stat-item"><span>ЧАС У ГРІ</span><span class="stat-value">0 год.</span></div>';
    html += '</div>'; // game-stats
    html += '</div>'; // play-bar
    html += '<div style="margin-top: 20px; color: #c7d5e0;">';
    html += '<p>Ви придбали цю гру і вона тепер у вашій бібліотеці Steam.</p>';
    html += '</div>';
    html += '</div>'; // game-details-container

    detailsContainer.innerHTML = html;
}

function getGameImage(name) {
    if (name === 'Dota 2') return 'images/dota2.jpg';
    if (name === 'Counter Strike 2' || name === 'CS2') return 'images/cs2.jpeg';
    if (name === 'Team Fortress 2') return 'images/tf2.png';
    if (name === 'Rust') return 'images/rust.jpg';
    if (name === 'S.T.A.L.K.E.R. 2') return 'https://via.placeholder.com/300x150'; // Placeholder logic if user didn't provide image
    return 'https://via.placeholder.com/300x150';
}
