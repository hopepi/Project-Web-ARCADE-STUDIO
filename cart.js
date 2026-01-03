document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});

function renderCart() {
    const grid = document.getElementById('cart-items');
    const summary = document.getElementById('cart-summary');
    const totalSpan = document.getElementById('total-price');

    const cartIds = JSON.parse(localStorage.getItem('cart')) || [];

    if (cartIds.length === 0) {
        grid.innerHTML = `
            <div style="text-align:center; width:100%; grid-column: 1 / -1;">
                <p style="font-family:'VT323'; font-size:2rem; color:#aaa; margin-bottom:20px;">
                    Sepetiniz bomboş...
                </p>
                <a href="store.html" class="hero-button">Mağazaya Dönüp Oyun Seç</a>
            </div>
        `;
        summary.style.display = 'none'; // Ödeme alanını gizle
        return;
    }

    const cartGames = games.filter(game => cartIds.includes(game.id));
    
    let totalPrice = 0;
    grid.innerHTML = "";

    cartGames.forEach(game => {
        totalPrice += game.price;
        grid.innerHTML += `
            <div class="game-card">
                <img src="${game.image}" alt="${game.title}">
                <h3>${game.title}</h3>
                <span class="game-price">${game.price} TL</span>
            </div>
        `;
    });

    totalSpan.innerText = totalPrice;
    summary.style.display = 'block';
}

function clearCart() {
    if(confirm("Sepeti tamamen boşaltmak istediğine emin misin?")) {
        localStorage.setItem('cart', JSON.stringify([])); 
        
        renderCart(); 
        
        updateCartCount(); 
        
        showNotification("ÇÖP KUTUSU: Sepet boşaltıldı.");
    }
}

function checkout() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let library = JSON.parse(localStorage.getItem('myLibrary')) || [];

    if (cart.length === 0) {
        showNotification("HATA: Sepet zaten boş!");
        return;
    }

    cart.forEach(id => {
        if (!library.includes(id)) {
            library.push(id);
        }
    });

    localStorage.setItem('myLibrary', JSON.stringify(library));
    localStorage.setItem('cart', JSON.stringify([]));
    
    updateCartCount();
    renderCart(); 

    showNotification("BAŞARILI: Ödeme alındı! Kütüphaneye gidiliyor...");
    
    setTimeout(() => {
        window.location.href = "library.html";
    }, 2000);
}