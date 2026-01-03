document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);
    const gameId = parseInt(params.get('id'));

    const game = games.find(g => g.id === gameId);

    if (game) {
        document.title = `${game.title} | Hope's Arcade`;
        document.querySelector('#page-header h2').innerText = `// ${game.title.toUpperCase()} //`;

        const coverImg = document.querySelector('.detail-cover');
        coverImg.src = game.image;
        coverImg.alt = game.title;

        document.querySelector('.detail-info p').innerText = game.description;

        const buyBtn = document.querySelector('.buy-button');
        buyBtn.innerText = `SEPETE EKLE (${game.price} TL)`;
        
        buyBtn.onclick = (e) => {
            e.preventDefault();
            addToCart(game.id); 
        };

        const specTable = document.querySelector('.spec-table');
        if (game.specs) {
            specTable.innerHTML = `
                <tr><td>İşletim Sistemi:</td><td>${game.specs.os}</td></tr>
                <tr><td>İşlemci:</td><td>${game.specs.cpu}</td></tr>
                <tr><td>Bellek:</td><td>${game.specs.ram}</td></tr>
                <tr><td>Depolama:</td><td>${game.specs.storage}</td></tr>
            `;
        } else {
            specTable.innerHTML = "<tr><td colspan='2'>Sistem bilgisi bulunamadı.</td></tr>";
        }

        loadReviews(gameId); 

        const reviewForm = document.getElementById('review-form');
        if (reviewForm) {
            reviewForm.addEventListener('submit', (e) => {
                e.preventDefault();
                addReview(gameId);
            });
        }

    } else {
        document.querySelector('main').innerHTML = "<h2 style='text-align:center; color:red; margin-top:50px;'>Oyun bulunamadı :(</h2>";
    }
});

function addReview(gameId) {
    const nameInput = document.getElementById('review-name');
    const textInput = document.getElementById('review-text');
    const ratingInput = document.getElementById('review-rating');

    const newReview = {
        id: Date.now(),
        user: nameInput.value,
        text: textInput.value,
        rating: parseInt(ratingInput.value),
        date: new Date().toLocaleDateString('tr-TR')
    };

    const storageKey = `comments_${gameId}`;
    let reviews = JSON.parse(localStorage.getItem(storageKey)) || [];

    reviews.unshift(newReview); 
    localStorage.setItem(storageKey, JSON.stringify(reviews));

    nameInput.value = "";
    textInput.value = "";
    
    if(typeof showNotification === 'function') {
        showNotification("BAŞARILI: Yorumunuz kaydedildi!");
    } else {
        alert("Yorumunuz kaydedildi!");
    }
    
    loadReviews(gameId); // Listeyi tekrar çiz
}

// Yorumları Listeleme Fonksiyonu
function loadReviews(gameId) {
    const listContainer = document.getElementById('review-list');
    const storageKey = `comments_${gameId}`;
    const reviews = JSON.parse(localStorage.getItem(storageKey)) || [];

    if (reviews.length === 0) {
        listContainer.innerHTML = '<p class="no-reviews">Henüz hiç yorum yok. İlk yorumu sen yap!</p>';
        return;
    }

    listContainer.innerHTML = ""

    reviews.forEach(review => {
        let starsHtml = "";
        for (let i = 0; i < 5; i++) {
            starsHtml += i < review.rating ? "★" : "☆";
        }

        // HTML kartını oluştur
        const html = `
            <div class="review-item">
                <div class="review-header">
                    <span class="review-user">${review.user}</span>
                    <span class="review-stars">${starsHtml}</span>
                </div>
                <div class="review-text">
                    ${review.text}
                </div>
                <small style="color:#555; font-family:'VT323'; display:block; margin-top:10px;">
                    Tarih: ${review.date}
                </small>
            </div>
        `;
        listContainer.innerHTML += html;
    });
}