(async () => {
  const { query } = window.pokedex;

  const width = 2;
  const height = 2;

  // Create the game board
  const { success: createBoardSuccess, data: { board } } = await query('/game/create', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      width,
      height,
    }),
  });

  if (createBoardSuccess) {
    const cardTemplate = document.querySelector('#t-card');
    const cardContainerRef = document.querySelector('#panel--game');

    cardContainerRef.setAttribute('style', Object.entries({
      '--board-width': width,
      '--board-height': height,
    }).map(([key, value]) => `${key}: ${value};`).join(' '));

    if (!cardTemplate) return console.warn('Could not find card template');
    if (!cardContainerRef) return console.warn('Could not find card panel');

    // Render the board onto the page
    board.forEach(card => {
      const root = cardTemplate.content.cloneNode(true);
      
      const cardRoot = root.querySelector('.card');

      if (card) {
        cardRoot.setAttribute('data-id', card.publicId);

        const faceCard = root.querySelector('.card__front');
        faceCard.src = `/proxy/${card.sprite}`;
      } else {
        cardRoot.classList.add('card--disabled');
      }

      cardContainerRef.append(root);
    });
  }
})();
