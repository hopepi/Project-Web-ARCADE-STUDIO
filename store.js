
document.addEventListener('DOMContentLoaded', () => {
    
    const grid = document.querySelector('.game-grid');
    const searchInput = document.querySelector('.search-input');
    const filterSelect = document.querySelector('.filter-select');

    if (!grid) return;

    function renderGames(searchText = "", category = "all") {
        grid.innerHTML = ""; 

        const filtered = games.filter(game => {
            const matchText = game.title.toLowerCase().includes(searchText.toLowerCase());
            const matchCategory = category === "all" || game.genre === category;
            return matchText && matchCategory;
        });

        if (filtered.length > 0) {
            filtered.forEach(game => {
                grid.innerHTML += createGameCard(game);
            });
        } else {
            grid.innerHTML = '<p style="color:#aaa; text-align:center; width:100%;">Aradığınız oyun bulunamadı.</p>';
        }
    }

    if(searchInput) {
        searchInput.addEventListener('input', (e) => renderGames(e.target.value, filterSelect.value));
    }
    if(filterSelect) {
        filterSelect.addEventListener('change', (e) => renderGames(searchInput.value, e.target.value));
    }

    renderGames();
});