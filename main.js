
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let lastHoverTime = 0; 

function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume(); 
    
    if (type === 'hover') {
        const now = Date.now();
        if (now - lastHoverTime < 150) return; 
        lastHoverTime = now;
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (type === 'hover') {
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(300, audioCtx.currentTime); 
        gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime); 
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.03); 
    } 
    else if (type === 'click') {
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.03, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    }
    else if (type === 'success') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(500, audioCtx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(1000, audioCtx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
    }
}


function attachSoundEffects() {
    const buttons = document.querySelectorAll('a, button, .game-card, .game-card-horizontal, .nav-button');
    buttons.forEach(btn => {
        btn.removeEventListener('mouseenter', hoverHandler);
        btn.removeEventListener('click', clickHandler);
        
        btn.addEventListener('mouseenter', hoverHandler);
        btn.addEventListener('click', clickHandler);
    });
}

const hoverHandler = () => playSound('hover');
const clickHandler = () => playSound('click');



function updateCartCount() {
    const cartBtn = document.querySelector('.cart');
    if (cartBtn) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartBtn.textContent = `Sepet (${cart.length})`;
        cartBtn.href = "cart.html";
    }
}

function addToCart(gameId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let library = JSON.parse(localStorage.getItem('myLibrary')) || [];

    if (cart.includes(gameId)) {
        showNotification("HATA: Bu oyun zaten sepette!");
        return;
    }
    if (library.includes(gameId)) {
        showNotification("BİLGİ: Bu oyuna zaten sahipsin.");
        return;
    }

    cart.push(gameId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(); 
    playSound('success');
    showNotification("BAŞARILI: Oyun sepete eklendi!");
}

function toggleWishlist(e, gameId) {
    e.preventDefault();
    e.stopPropagation(); 
    
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const btn = e.target;

    if (wishlist.includes(gameId)) {
        wishlist = wishlist.filter(id => id !== gameId);
        btn.classList.remove('active');
        btn.innerHTML = '♡';
        showNotification("İstek listesinden çıkarıldı.");
    } else {
        wishlist.push(gameId);
        btn.classList.add('active');
        btn.innerHTML = '♥';
        playSound('success');
        showNotification("İstek listesine eklendi!");
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function checkout() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let library = JSON.parse(localStorage.getItem('myLibrary')) || [];

    if (cart.length === 0) {
        showNotification("HATA: Sepet zaten boş!");
        return;
    }

    cart.forEach(id => {
        if (!library.includes(id)) library.push(id);
    });

    localStorage.setItem('myLibrary', JSON.stringify(library));
    localStorage.setItem('cart', JSON.stringify([]));
    
    checkBadges();

    updateCartCount();
    playSound('success');
    showNotification("BAŞARILI: Ödeme alındı! Kütüphaneye gidiliyor...");
    
    setTimeout(() => { window.location.href = "library.html"; }, 2000);
}

function createGameCard(game) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const isWished = wishlist.includes(game.id);
    const heartClass = isWished ? 'wishlist-btn active' : 'wishlist-btn';
    const heartSymbol = isWished ? '♥' : '♡';

    return `
        <a href="game-detail.html?id=${game.id}" class="game-card">
            <button class="${heartClass}" onclick="toggleWishlist(event, ${game.id})">${heartSymbol}</button>
            <img src="${game.image}" alt="${game.title}">
            <h3>${game.title}</h3>
            <span class="game-price">${game.price} TL</span>
        </a>
    `;
}

function createHorizontalCard(game) {
    return `
        <a href="game-detail.html?id=${game.id}" class="game-card-horizontal">
            <img src="${game.image}" alt="${game.title}">
            <h4>${game.title}</h4>
        </a>
    `;
}

function checkBadges() {
    let library = JSON.parse(localStorage.getItem('myLibrary')) || [];
    let myBadges = JSON.parse(localStorage.getItem('myBadges')) || [];
    
    // Rozet Tanımları
    const availableBadges = [
        { id: 'first_game', title: 'Hoş Geldin', desc: 'İlk oyununu aldın.', icon: '👾', condition: () => library.length >= 1 },
        { id: 'collector', title: 'Koleksiyoncu', desc: '3 oyuna sahipsin.', icon: '📚', condition: () => library.length >= 3 },
        { id: 'master', title: 'Atari Ustası', desc: '5 oyuna sahipsin!', icon: '👑', condition: () => library.length >= 5 }
    ];

    let newBadgeEarned = false;

    availableBadges.forEach(badge => {
        if (!myBadges.find(b => b.id === badge.id) && badge.condition()) {
            myBadges.push(badge);
            newBadgeEarned = true;
            
            setTimeout(() => {
                playSound('success');
                showNotification(`🏆 YENİ ROZET: ${badge.title}`);
            }, 1000);
        }
    });

    if (newBadgeEarned) {
        localStorage.setItem('myBadges', JSON.stringify(myBadges));
    }
}

function showNotification(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = `> ${message}`;
    container.appendChild(toast);
    setTimeout(() => { toast.classList.add('show'); }, 100);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => { toast.remove(); }, 500); }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {

    updateCartCount();
    attachSoundEffects(); 

    const observer = new MutationObserver(() => {
        attachSoundEffects();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // İletişim Formu
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            contactForm.reset();
            playSound('success');
            showNotification(`MESAJ İLETİLDİ: Teşekkürler ${name}!`);
        });
    }
});