const gamesContainer = document.getElementById('games-container');

fetch('/data/games.json').then(response => response.json()).then(games => {games.forEach((game, index) => {

    const card = document.createElement('div');
    card.classList.add('game-card');

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('image-container');

    const img = document.createElement('img');
    img.src = game.image;
    img.alt = game.title;
    imgContainer.appendChild(img);
    card.appendChild(imgContainer);

    const title = document.createElement('h2');
    title.textContent = game.title;
    card.appendChild(title);

    const desc = document.createElement('p');
    desc.textContent = game.description;
    card.appendChild(desc);

    const button = document.createElement('a');
    button.href = game.link;
    button.classList.add('game-button');
    button.textContent = "button-text" in game ? game["button-text"] : 'Play Now';
    card.appendChild(button);

    gamesContainer.appendChild(card);

    setTimeout(() => {
        card.classList.add('visible');
    }, index * 250);

})}).catch(error => console.error('Error loading games:', error));

