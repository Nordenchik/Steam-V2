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
    var container = document.getElementById('library-container');

    if (!container) return;

    if (library.length === 0) {
        container.innerHTML = '<p style="color: white; text-align: center;">Ваша бібліотека порожня</p>';
        return;
    }

    var html = '';
    for (var i = 0; i < library.length; i++) {
        html += '<div class="col-md-3" style="margin-bottom: 20px;">';
        html += '<div class="game-card">';
        html += '<div class="game-card-body">';
        html += '<h5 class="game-card-title">' + library[i].name + '</h5>';
        html += '<button class="btn-buy" style="width: 100%;">Запустити</button>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
    }

    container.innerHTML = html;
}
