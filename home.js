document.addEventListener('DOMContentLoaded', () => {
    
    
    if (!document.querySelector('#hero')) return;

    console.log("Ana sayfa yükleniyor...");

    const heroTitle = document.querySelector('.hero-content h1');
    const text = "NOSTALJİ YÜKLENİYOR...";
    heroTitle.innerHTML = ""; 
    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            heroTitle.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            heroTitle.innerHTML += '<span class="cursor"></span>';
        }
    }
    typeWriter();

    const featuredContainer = document.querySelector('#featured .game-grid');
    const featuredGames = games.filter(g => g.category === "featured");
    
    featuredGames.forEach(game => {
        featuredContainer.innerHTML += createGameCard(game);
    });

    const bestSellerContainer = document.querySelector('#best-sellers .horizontal-scroll');
    const bestSellers = games.filter(g => g.category === "bestseller");

    bestSellers.forEach(game => {
        bestSellerContainer.innerHTML += createHorizontalCard(game);
    });
});