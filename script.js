// Cart Functionality
let cart = [];
let total = 0;

function addToCart(gameName, price) {
    cart.push({ name: gameName, price: price });
    total += price;
    updateCartUI();

    // Show cart modal
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    cartModal.show();
}

function removeFromCart(index) {
    const item = cart[index];
    total -= item.price;
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.getElementById('cart-count');
    const cartEmptyElement = document.getElementById('cart-empty');

    cartItemsElement.innerHTML = '';

    if (cart.length === 0) {
        cartEmptyElement.style.display = 'block';
    } else {
        cartEmptyElement.style.display = 'none';
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <span>${item.name}</span>
                <div>
                    <span>${item.price}₴</span>
                    <button class="btn-remove ms-2" onclick="removeFromCart(${index})">✕</button>
                </div>
            `;
            cartItemsElement.appendChild(itemElement);
        });
    }

    cartTotalElement.innerText = total;
    cartCountElement.innerText = cart.length;
}

function checkout() {
    if (cart.length === 0) return;

    // Save to library (localStorage)
    const existingLibrary = JSON.parse(localStorage.getItem('steam_library')) || [];

    cart.forEach(item => {
        // Avoid duplicates
        if (!existingLibrary.some(game => game.name === item.name)) {
            existingLibrary.push(item);
        }
    });

    localStorage.setItem('steam_library', JSON.stringify(existingLibrary));

    // Clear cart
    cart = [];
    total = 0;
    updateCartUI();

    // Hide cart modal
    const cartModalEl = document.getElementById('cartModal');
    const cartModal = bootstrap.Modal.getInstance(cartModalEl);
    cartModal.hide();

    // Show success modal
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
}

// Load Library Function
function loadLibrary() {
    const libraryList = document.getElementById('library-list');
    if (!libraryList) return;

    const library = JSON.parse(localStorage.getItem('steam_library')) || [];

    libraryList.innerHTML = '';

    if (library.length === 0) {
        libraryList.innerHTML = '<div style="padding: 10px; color: #8f98a0;">Бібліотека порожня</div>';
        return;
    }

    library.forEach(game => {
        const gameItem = document.createElement('div');
        gameItem.className = 'game-list-item';
        // Simple icon path logic based on game name (demo purposes)
        let iconPath = 'images/logo_steam.png'; // fallback
        if (game.name.includes('Dota')) iconPath = 'images/dota2.jpg';
        else if (game.name.includes('CS')) iconPath = 'images/cs2.jpeg';
        else if (game.name.includes('Rust')) iconPath = 'images/rust.jpg';
        else if (game.name.includes('DayZ')) iconPath = 'images/dayz.png';
        else if (game.name.includes('Forest')) iconPath = 'images/the_forest.jpg';
        else if (game.name.includes('S.T.A.L.K.E.R.')) iconPath = 'images/stalker2.jpg';
        else if (game.name.includes('GTA')) iconPath = 'images/gtav_enhanced.png';
        else if (game.name.includes('Red Dead')) iconPath = 'images/rdd2.jpg';
        else if (game.name.includes('Elden')) iconPath = 'images/elden_ring.jpg';
        else if (game.name.includes('Portal')) iconPath = 'images/portal2.jpg';
        else if (game.name.includes('Witness')) iconPath = 'images/the_witness.png';
        else if (game.name.includes('Baba')) iconPath = 'images/baba_is_you.jpg';
        else if (game.name.includes('Team')) iconPath = 'images/tf2.png';

        gameItem.innerHTML = `
            <img src="${iconPath}" class="game-icon-small">
            ${game.name}
        `;
        libraryList.appendChild(gameItem);
    });
}

// Navigation scroll
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Profile Status Toggle
function toggleStatus() {
    const statusBadge = document.getElementById('status-badge');
    const statusText = document.getElementById('status-text');
    const statusDetail = document.getElementById('status-detail');

    if (statusBadge.classList.contains('online')) {
        // Switch to Away
        statusBadge.classList.remove('online');
        statusBadge.classList.add('away');
        statusText.innerText = '💤 Відійшов';
        statusDetail.style.display = 'none';
    } else if (statusBadge.classList.contains('away')) {
        // Switch to Busy
        statusBadge.classList.remove('away');
        statusBadge.classList.add('busy');
        statusText.innerText = '⛔ Не турбувати';
        statusDetail.style.display = 'none';
        statusDetail.innerText = '';
    } else {
        // Switch back to Online
        statusBadge.classList.remove('busy');
        statusBadge.classList.add('online');
        statusText.innerText = 'Зараз в мережі';
        statusDetail.style.display = 'block';
        statusDetail.innerText = 'В грі: Dota 2';
    }
}

// Post Comment Function
function postComment() {
    const input = document.getElementById('new-comment-text');
    const text = input.value.trim();

    if (text === "") return;

    const commentsList = document.getElementById('comments-list');

    // Create new comment element
    const newComment = document.createElement('div');
    newComment.className = 'comment';

    // Get headers for current date/time (simplified)
    const now = new Date();
    const timeString = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();

    newComment.innerHTML = `
        <div class="comment-avatar">
            <img src="https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg" alt="You">
        </div>
        <div class="comment-content">
            <div class="comment-header">
                <a href="#" class="comment-author">GamerUA</a>
                <span class="comment-date">Сьогодні, ${timeString}</span>
            </div>
            <div class="comment-text">
                ${text.replace(/\n/g, '<br>')}
            </div>
        </div>
    `;

    // Append to list
    commentsList.appendChild(newComment);

    // Clear input
    input.value = '';
}

let block = document.querySelector('.animated-card')
document.addEventListener('mousemove', function(e) {
    let dx = e.pageX - window.innerWidth / 2
    let dy = e.pageY - window.innerHeight / 2
    let angleX = 100 * dx / window.innerWidth / 2
    let angleY = 100 * dy / window.innerHeight / 2
    block.style.transform = `rotateX(${-angleY}deg) rotateY(${angleX}deg)`
})
