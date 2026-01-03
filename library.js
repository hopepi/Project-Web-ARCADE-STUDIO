document.addEventListener('DOMContentLoaded', () => {
    
    const grid = document.getElementById('my-games');
    const ownedGameIds = JSON.parse(localStorage.getItem('myLibrary')) || [];

    if (ownedGameIds.length === 0) {
        grid.innerHTML = `
            <div style="text-align:center; width:100%; grid-column: 1 / -1;">
                <p style="font-family:'VT323'; font-size:1.5rem; color:#aaa; margin-bottom:20px;">
                    Henüz hiç oyununuz yok :(
                </p>
                <a href="store.html" class="hero-button">Mağazaya Git</a>
            </div>
        `;
    } else {
        const myGames = games.filter(game => ownedGameIds.includes(game.id));
        myGames.forEach(game => {
            grid.innerHTML += `
                <div class="game-card">
                    <img src="${game.image}" alt="${game.title}">
                    <h3>${game.title}</h3>
                    <a href="play.html?id=${game.id}" class="play-button">OYNA</a>
                </div>
            `;
        });
    }

    const badgeGrid = document.getElementById('badge-grid');
    const myBadges = JSON.parse(localStorage.getItem('myBadges')) || [];

    if (myBadges.length === 0) {
        badgeGrid.innerHTML = '<p style="color:#555; font-family:\'VT323\';">Henüz hiç rozet kazanmadın.</p>';
    } else {
        myBadges.forEach(badge => {
            badgeGrid.innerHTML += `
                <div class="badge-card">
                    <span class="badge-icon">${badge.icon}</span>
                    <div class="badge-title">${badge.title}</div>
                    <div class="badge-desc">${badge.desc}</div>
                </div>
            `;
        });
    }

    const wishlistGrid = document.getElementById('wishlist-grid');
    const wishlistIds = JSON.parse(localStorage.getItem('wishlist')) || [];

    if (wishlistIds.length === 0) {
        wishlistGrid.innerHTML = '<p style="color:#aaa; width:100%; text-align:center;">İstek listen boş.</p>';
    } else {
        const wishlistGames = games.filter(game => wishlistIds.includes(game.id));
        wishlistGames.forEach(game => {
            wishlistGrid.innerHTML += createGameCard(game);
        });
    }
});