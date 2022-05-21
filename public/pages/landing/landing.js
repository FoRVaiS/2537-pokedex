'use strict';
(async () => {
  'use strict';
  const randomIntBetweenRange = (min, max) => Math.round((Math.random() * (max - min)) + min);

  
  const verifyDreamworldSprite = pokemon => pokemon.sprites.other.dream_world.front_default !== null;
  const loadRandomDreamworldPokemon = async size => {
    const results = await window.pokedex.query(`/api/v2/pokemon?limit=${size}&offset=${randomIntBetweenRange(0, 868 - size)}`);

    // Check that all the pokemon have sprites
    return results.data.filter(_pokemon => !verifyDreamworldSprite(_pokemon)).length === 0
      ? results
      : loadRandomDreamworldPokemon(size);
  };

  // Load 5 random pokemon
  const pokemon = await loadRandomDreamworldPokemon(5);

  // Append the sprite of each pokemon into the showcase
  pokemon.data.forEach(_pokemon => {
    const spriteUrl = _pokemon.sprites.other.dream_world.front_default;
    
    console.log(_pokemon);

    const root = document.createElement('div');
    root.classList.add('showcase__item');
    
    const img = document.createElement('img');
    img.classList.add('showcase__img');
    img.crossOrigin = 'cross-origin';
    img.src = spriteUrl;
    root.append(img);

    document.querySelector('#pokemon-showcase').append(root);
  });
})();
