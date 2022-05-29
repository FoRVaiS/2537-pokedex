'use strict';
(async () => {
  'use strict';
  const randomIntBetweenRange = (min, max) => Math.round((Math.random() * (max - min)) + min);

  
  const verifyDreamworldSprite = pokemon => pokemon.sprites.other.dream_world.front_default !== null;
  const loadRandomDreamworldPokemon = async size => {
    const { results: pokemonRefObjs } = await window.pokedex.query(`http://pokeapi.co/api/v2/pokemon?limit=${size}&offset=${randomIntBetweenRange(0, 868 - size)}`);
    const pokemon = await Promise.all(pokemonRefObjs.map(ref => window.pokedex.query(ref.url)));

    // Check that all the pokemon have sprites
    return pokemon.filter(_pokemon => !verifyDreamworldSprite(_pokemon)).length === 0
      ? pokemon
      : loadRandomDreamworldPokemon(size);
  };

  // Load 5 random pokemon
  const pokemon = await loadRandomDreamworldPokemon(5);

  // Append the sprite of each pokemon into the showcase
  pokemon.forEach(_pokemon => {
    const spriteUrl = _pokemon.sprites.other.dream_world.front_default;
    
    const root = document.createElement('div');
    root.classList.add('showcase__item');
    
    const img = document.createElement('img');
    img.classList.add('showcase__img');
    img.crossOrigin = 'cross-origin';
    img.src = spriteUrl;
    root.append(img);

    document.querySelector('#pokemon-showcase').append(root);
  });

  // eslint-disable-next-line no-return-assign
  document.querySelector('#in-login').onclick = () => window.location.href = '/login';
})();
