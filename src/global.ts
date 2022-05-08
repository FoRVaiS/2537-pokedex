(() => {
  (self => {
    self.history = [];

    function* generateHistoryId(): IterableIterator<number> {
      let id = 0;

      while(true) yield id++;
    };

    const idGenerator = generateHistoryId();

    self.addResultToHistory = function addResultToHistory(result) {
      self.history!.push({ id: idGenerator.next().value, ...result});
    }

    const fetchPokemonByName = self.fetchPokemonByName = async function fetchPokemonByName(id) {
      const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`, {
        method: "GET",
      });

      return [await (data.json() as Promise<Pokemon>)];
    };

    self.fetchPokemonByType = async function fetchPokemonByType(id) {
      const pokeTypeResponse = await fetch(`https://pokeapi.co/api/v2/type/${id}`, {
        method: 'GET',
      });

      const pokeTypeData: PokemonType = await pokeTypeResponse.json();

      return (await Promise.all(pokeTypeData.pokemon.map(({ pokemon }) => fetchPokemonByName(pokemon.name)))).map(([result]) => result);
    };

    self.fetchPokemonByAbility = async function fetchPokemonByAbility(id) {
      const pokeAbilityResponse = await fetch(`https://pokeapi.co/api/v2/ability/${id}`, {
        method: 'GET',
      });

      const pokeAbilityData: PokemonAbility = await pokeAbilityResponse.json();

      return (await Promise.all(pokeAbilityData.pokemon.map(({ pokemon }) => fetchPokemonByName(pokemon.name)))).map(([result]) => result);
    };

    /** Returns a value of 898 because the number of pokemon return by the API is not true. */
    self.fetchTotalPokemon = async function fetchTotalPokemon(): Promise<number> {
      // const response = await fetch(`https://pokeapi.co/api/v2/pokemon`, { method: "GET" });

      // const data: { count: number } = await response.json();

      // return data.count;

      return Promise.resolve(898);
    }
  })(window.pokedex = window.pokedex || {});

})();
