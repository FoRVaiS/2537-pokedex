(() => {
  (self => {
    const fetchPokemonByName = self.fetchPokemonByName = async function fetchPokemonByName(name) {
      const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, {
        method: "GET",
      });

      return data.json() as Promise<Pokemon>;
    };

    self.fetchPokemonByType = async function fetchPokemonByType(type) {
      const pokeTypeResponse = await fetch(`https://pokeapi.co/api/v2/type/${type}`, {
        method: 'GET',
      });

      const pokeTypeData: PokemonType = await pokeTypeResponse.json();

      return Promise.all(pokeTypeData.pokemon.map(({ pokemon }) => fetchPokemonByName(pokemon.name)));
    };

    self.fetchPokemonByAbility = async function fetchPokemonByAbility(abilityName) {
      const pokeAbilityResponse = await fetch(`https://pokeapi.co/api/v2/ability/${abilityName}`, {
        method: 'GET',
      });

      const pokeAbilityData: PokemonAbility = await pokeAbilityResponse.json();

      return Promise.all(pokeAbilityData.pokemon.map(({ pokemon }) => fetchPokemonByName(pokemon.name)));
    };
  })(window.pokedex = window.pokedex || {});

})();
