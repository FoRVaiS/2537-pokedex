(self => {
  self.fetchPokemonByName = async function fetchPokemonByName<T>(name: string) {
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, {
      method: "GET",
    });

    return data.json() as Promise<T>;
  };

  self.fetchPokemonByType = async function fetchPokemonByType<T>(type: string) {
    const data = await fetch(`https://pokeapi.co/api/v2/type/${type}`, {
      method: 'GET',
    });

    return data.json() as Promise<T>;
  };

  self.fetchPokemonByAbility = async function fetchPokemonByAbility<T>(abilityName: string) {
    const data = await fetch(`https://pokeapi.co/api/v2/ability/${abilityName}`, {
      method: 'GET',
    });

    return data.json() as Promise<T>;
  };
})(window.pokedex = window.pokedex || {});
