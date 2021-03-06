'use strict';
(async () => {
  const { fetchTotalPokemon, fetchPokemonByName } = window.pokedex;
  const totalPokemon = await fetchTotalPokemon();
  const randomIds = Array.from(Array(9)).map(() => Math.round(Math.random() * totalPokemon - 1) + 1);
  const pokemon = await Promise.all(randomIds.map(id => fetchPokemonByName(id)));
  const galleryRef = document.querySelector('main > .gallery');

  for (let i = 0; i < 3; i++) {
    const section = document.createElement('div');
    section.classList.add('gallery__section');

    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      const [{ sprites, id }] = pokemon[index];

      const content = document.createElement('img');
      content.classList.add('gallery__content');
      content.src = sprites.other['official-artwork'].front_default;
      // eslint-disable-next-line no-return-assign
      content.onclick = () => window.location.href = `/profile?id=${id}`;
      content.style.cursor = 'pointer';
      content.crossOrigin = 'cross-origin';
      section.append(content);
    }

    galleryRef.append(section);
  }
})();
