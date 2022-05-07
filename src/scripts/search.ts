(() => {
  (self => {
    self.history = [];

    self.addResultToHistory = function addResultToHistory(result) {
        self.history!.push(result);
    }

    const fetchPokemonByName = self.fetchPokemonByName = async function fetchPokemonByName(name) {
      const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, {
        method: "GET",
      });

      return [await (data.json() as Promise<Pokemon>)];
    };

    self.fetchPokemonByType = async function fetchPokemonByType(type) {
      const pokeTypeResponse = await fetch(`https://pokeapi.co/api/v2/type/${type}`, {
        method: 'GET',
      });

      const pokeTypeData: PokemonType = await pokeTypeResponse.json();

      return (await Promise.all(pokeTypeData.pokemon.map(({ pokemon }) => fetchPokemonByName(pokemon.name)))).map(([result]) => result);
    };

    self.fetchPokemonByAbility = async function fetchPokemonByAbility(abilityName) {
      const pokeAbilityResponse = await fetch(`https://pokeapi.co/api/v2/ability/${abilityName}`, {
        method: 'GET',
      });

      const pokeAbilityData: PokemonAbility = await pokeAbilityResponse.json();

      return (await Promise.all(pokeAbilityData.pokemon.map(({ pokemon }) => fetchPokemonByName(pokemon.name)))).map(([result]) => result);
    };
  })(window.pokedex = window.pokedex || {});

  const clearResultsSection = function clearResultsSection(): void {
    const resultsRef: HTMLElement = document.querySelector("section[region='results'] > .u-center-evenly-spaced")!;

    resultsRef.innerHTML = '';
  }

  const getMode = function getMode(): string {
    const modeSelectorRef: HTMLSelectElement = document.querySelector("section[region='search'] .search__mode")!;

    return modeSelectorRef.options[modeSelectorRef.options.selectedIndex].value;
  }

  const resultsRef = document.querySelector("section[region='results'] > .u-center-evenly-spaced")!;

  const appendPreviewCard = function createPreviewCard(pokemon: Pokemon): void {
    const root: HTMLSpanElement = document.createElement('span');

    const img: HTMLImageElement = document.createElement('img');
    img.src = pokemon.sprites.front_default;
    root.append(img);

    if (pokemon.sprites.front_default !== null) resultsRef.append(root);
  }

  enum enumModeOptions { "Name", "Ability", "Type" }

  const processSearchQuery = async function processSearchQuery(
    ref: HTMLInputElement,
    modeOptions: { [index: string]: fetchPokemonFn }
  ): Promise<void> {
    clearResultsSection();

    const mode = getMode();
    const query = ref.value;

    try {
      const result = await modeOptions[mode](query);

      window.pokedex!.addResultToHistory!(result);      

      if (Array.isArray(result)) result.forEach(appendPreviewCard);
    } catch (e) {
      console.error(e);
    }
  };

  const modeOptions: { [key in keyof typeof enumModeOptions]: fetchPokemonFn } = {
    "Name": window.pokedex.fetchPokemonByName!,
    "Ability": window.pokedex.fetchPokemonByAbility!,
    "Type": window.pokedex.fetchPokemonByType!,
  };

  // Populate mode selector with with option keys
  Object.keys(modeOptions).forEach(optionKey => {
    const optionEl = document.createElement('option');
    optionEl.textContent = optionKey;

    document.querySelector("section[region='search'] .search__mode")!.append(optionEl);
  });

  // Invoke processSearchQuery when user presses the "Return" key in the text field
  const searchRef: HTMLInputElement = document.querySelector("section[region='search'] .search__field")!;
  searchRef.addEventListener('keypress', e => {
    if (e.key === 'Enter') processSearchQuery(searchRef, modeOptions);
  });

  // Invoke processSearchQuery when user presses the execute query button
  const searchActionRef: HTMLButtonElement = document.querySelector("section[region='search'] .search__action")!;
  searchActionRef.onclick = processSearchQuery.bind(null, searchRef, modeOptions);
})();
