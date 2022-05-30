(async () => {
  const { query } = window.pokedex;

  const width = 2;
  const height = 2;
  const winCondition = Math.floor((width * height) / 2);
  let points = 0;

  let lockRegisters = false;
  let previousRegister = null;
  let currentRegister = null;

  const setRegister = id => {
    if (previousRegister === null && currentRegister !== null) {
      previousRegister = currentRegister;
      currentRegister = null;
    }

    currentRegister = id;
  };

  const clearRegister = id => {
    if (previousRegister === id) {
      previousRegister = null;
    } else if (currentRegister === id) {
      currentRegister = null;
    }
  };

  const clearAllRegisters = () => {
    previousRegister = null;
    currentRegister = null;
  };

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
        cardRoot.setAttribute('data-flipped', 0);
        cardRoot.onclick = async () => {
          if (lockRegisters) return;

          lockRegisters = true;
          const isFlippedUp = Number(cardRoot.getAttribute('data-flipped'));
          if (isFlippedUp) {
            cardRoot.setAttribute('data-flipped', 0);
            cardRoot.classList.remove('card--flip');
            clearRegister(card.publicId);
          } else {
            cardRoot.setAttribute('data-flipped', 1);
            cardRoot.classList.add('card--flip');
            setRegister(card.publicId);
          }

          if (previousRegister !== null && currentRegister !== null) {
            const { data: { correct } } = await query('/game/validate', {
              method: 'post',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ previousRegister, currentRegister }),
            });
            
            const previousCard = document.querySelector(`.card[data-id="${previousRegister}"]`);
            const currentCard = document.querySelector(`.card[data-id="${currentRegister}"]`);

            clearAllRegisters();

            if (correct) {
              previousCard.onclick = () => { };
              currentCard.onclick = () => { };
              points++;
              lockRegisters = false;
            } else {
              setTimeout(() => {
                previousCard.classList.remove('card--flip');
                previousCard.setAttribute('data-flipped', 0);
                currentCard.classList.remove('card--flip');
                currentCard.setAttribute('data-flipped', 0);
                lockRegisters = false;
              }, 1.2e3);
            }

            if (points >= winCondition) {
              const banner = document.createElement('h2');
              banner.textContent = 'Congratulations, you\'ve won!';
              document.querySelector('.u-flex-spacer').append(banner);
            }
          } else {
            setTimeout(() => lockRegisters = false, 150);
          }
        };

        const faceCard = root.querySelector('.card__front');
        faceCard.src = `/proxy/${card.sprite}`;
      } else {
        cardRoot.classList.add('card--disabled');
      }

      cardContainerRef.append(root);
    });
  }
})();
