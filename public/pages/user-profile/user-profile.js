'use strict';
(async () => {
  const capitalize = str => str[0].toUpperCase() + str.substr(1);

  const setNumberWidth = (number, width) => Array.from(Array(width)) // Create an array of size width, elements are undefined
    .fill(0) // Fill the entire array with 0s
    .join('') // Join all the elements as a single string
    .substr(number.toString().length) + // Cut away n (# digits in number) 0s
    number.toString(); // Append number to the end

  const createPreviousOrderPost = order => {
    const root = document.createElement('div');
    
    const left = document.createElement('div');
    left.classList.add('group');
    left.classList.add('group--inline');
    left.classList.add('item__left');
    root.append(left);

    const right = document.createElement('div');
    right.classList.add('group');
    right.classList.add('group--inline');
    right.classList.add('item__right');
    root.append(right);

    const previousOrderLink = document.createElement('a');
    previousOrderLink.href = `/cart/${Number(order.cartId)}`;
    previousOrderLink.textContent = 'Order#';
    left.append(previousOrderLink);

    const previousOrderNumber = document.createElement('span');
    previousOrderNumber.textContent = Number(order.cartId);
    previousOrderLink.append(previousOrderNumber);

    document.querySelector('#orders').append(root);
  };

  const createViewProfileEventCard = (pokemon, views, lastUpdated) => {
    const date = new Date(lastUpdated);
    const calendarDate = `${date.getMonth()}/${date.getDate()}`;
    const time = `${setNumberWidth(date.getHours(), 2)}:${setNumberWidth(date.getMinutes(), 2)}`;

    const card = document.createElement('div');
    card.classList.add('event-card');

    const title = document.createElement('h2');
    title.classList.add('event-card__title');
    title.textContent = 'View Profile Event';
    card.append(title);

    const img = document.createElement('img');
    img.src = pokemon.sprites.other['official-artwork'].front_default;
    // eslint-disable-next-line no-return-assign
    img.onclick = () => window.location.href = `/profile?id=${pokemon.id}`;
    img.crossOrigin = 'cross-origin';
    card.append(img);

    const body = document.createElement('div');
    card.append(body);

    const description = document.createElement('p');
    description.textContent = `Their profile has been viewed ${views} time${views > 1 ? 's' : ''}.`;
    body.append(description);

    const description2 = document.createElement('p');
    description2.textContent = `${capitalize(pokemon.name)} was last visited was on ${calendarDate} at ${time}`;
    body.append(description2);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Remove Event';
    deleteBtn.onclick = async e => {
      e.preventDefault();

      await fetch('/api/v2/user/timeline/remove', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'view-profile',
          data: {
            profileId: pokemon.id,
          },
        }),
      });

      card.remove();
    };
    card.append(deleteBtn);

    return card;
  };

  const { query } = window.pokedex;

  const cartsResponse = await query('/api/v2/user/carts/');

  if (cartsResponse.success) {
    cartsResponse.data.forEach(createPreviousOrderPost);
  }

  const { data } = await query('/api/v2/user/timeline/event');

  data.results.forEach(async result => {
    const { lastUpdated, count } = result;

    if (result.name.toLowerCase() === 'view-profile') {
      const [pokemon] = await window.pokedex.fetchPokemonByName(result.data.profileId);

      document.querySelector('#timeline').append(createViewProfileEventCard(pokemon, count, lastUpdated));
    }
  });
})();
