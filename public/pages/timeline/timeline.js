'use strict';
(async () => {
  const capitalize = str => str[0].toUpperCase() + str.substr(1);

  const setNumberWidth = (number, width) => Array.from(Array(width)) // Create an array of size width, elements are undefined
    .fill(0) // Fill the entire array with 0s
    .join('') // Join all the elements as a single string
    .substr(number.toString().length) + // Cut away n (# digits in number) 0s
    number.toString(); // Append number to the end

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

      await fetch('/api/v2/timeline/remove', {
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

  const response = await fetch('/api/v2/timeline/event');
  const { data } = await response.json();

  data.results.forEach(async result => {
    const { lastUpdated, count } = result;

    if (result.name.toLowerCase() === 'view-profile') {
      const [pokemon] = await window.pokedex.fetchPokemonByName(result.data.profileId);

      document.querySelector('main').append(createViewProfileEventCard(pokemon, count, lastUpdated));
    }
  });
})();
