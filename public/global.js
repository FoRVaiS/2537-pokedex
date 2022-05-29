'use strict';
(() => {
  (self => {
    self.history = [];
        
    function *generateHistoryId() {
      let id = 0;
      while (true) yield id++;
    }

    const idGenerator = generateHistoryId();

    const pokemonRegions = {
      'kanto': { offset: 0, limit: 151 },
      'johto': { offset: 151, limit: 100 },
      'hoenn': { offset: 251, limit: 135 },
      'sinnoh': { offset: 386, limit: 108 },
      'unova': { offset: 494, limit: 155 },
      'kalos': { offset: 649, limit: 72 },
      'alola': { offset: 721, limit: 88 },
      'galar': { offset: 809, limit: 89 },
    };

    self.addResultToHistory = function addResultToHistory(result) {
      self.history.push({ id: idGenerator.next().value, ...result });
    };

    self.fetchPokemonByName = async function fetchPokemonByName(id) {
      const pokeNameResponse = await fetch(`http://pokeapi.co/api/v2/pokemon/${id}`, {
        method: 'GET',
      });

      const data = await pokeNameResponse.json();

      return [data];
    };

    self.fetchPokemonByType = async function fetchPokemonByType(id) {
      const pokeTypeResponse = await fetch(`http://pokeapi.co/api/v2/type/${id}`, {
        method: 'GET',
      });
      const pokeTypeData = await pokeTypeResponse.json();
      return (await Promise.all(pokeTypeData.pokemon.map(({ pokemon }) => self.fetchPokemonByName(pokemon.name)))).map(([result]) => result);
    };

    self.fetchPokemonByAbility = async function fetchPokemonByAbility(id) {
      const pokeAbilityResponse = await fetch(`http://pokeapi.co/api/v2/ability/${id}`, {
        method: 'GET',
      });
      const pokeAbilityData = await pokeAbilityResponse.json();
      return (await Promise.all(pokeAbilityData.pokemon.map(({ pokemon }) => self.fetchPokemonByName(pokemon.name)))).map(([result]) => result);
    };

    self.fetchPokemonByRegion = async function fetchPokemonByRegion(region) {
      const { limit, offset } = pokemonRegions[region];
      const pokeRegionResponse = await fetch(`http://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`, {
        method: 'GET',
      });

      const pokemon = (await Promise.all((await pokeRegionResponse.json()).results
        .map(({ name }) => self.fetchPokemonByName(name))))
        .map(([_pokemon]) => _pokemon);
      return pokemon;
    };

    /** Returns a value of 898 because the number of pokemon return by the API is not true. */
    self.fetchTotalPokemon = async function fetchTotalPokemon() {
      // const response = await fetch(`http://pokeapi.co/api/v2/pokemon`, { method: "GET" });
      // const data: { count: number } = await response.json();
      // return data.count;
      return Promise.resolve(898);
    };

    self.query = async function query(endpoint, opts) {
      const response = await fetch(endpoint, opts);
      return response.json();
    };

    self.getRequiredValueFrom = function getRequiredValueFrom(selector, type) {
      const field = document.querySelector(selector);

      if (!field) {
        console.warn(`Could not find selector '${selector}'`);
        return null;
      }

      if (typeof type() === 'string' && typeof field.value === 'string' && field.value !== '') {
        field.classList.remove('form__error');
        return field.value;
      }

      if (typeof type() === 'number' && !isNaN(Number(field.value)) && field.value !== '') {
        field.classList.remove('form__error');
        return Number(field.value);
      }

      field.classList.add('form__error');
      return null;
    };
  })(window.pokedex = window.pokedex || {});

  const logoutBtn = document.querySelector('#in-logout');

  if (logoutBtn) {
    logoutBtn.onclick = async () => {
      await fetch('/api/v2/user/logout');

      window.location.href = '/';
    };
  }
})();
