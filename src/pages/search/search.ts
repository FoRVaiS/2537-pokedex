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
  })(window.pokedex = window.pokedex || {});

  const clearResultsSection = function clearResultsSection(): void {
    const resultsRef: HTMLElement = document.querySelector("section[region='results'] > .u-center-evenly-spaced")!;

    resultsRef.innerHTML = '';
  }

  const getMode = function getMode(): keyof typeof enumModeOptions {
    const modeSelectorRef: HTMLSelectElement = document.querySelector("section[region='search'] .search__mode")!;

    return modeSelectorRef.options[modeSelectorRef.options.selectedIndex].value as keyof typeof enumModeOptions;
  }

  const resultsRef = document.querySelector("section[region='results'] > .u-center-evenly-spaced")!;

  const appendPreviewCard = function createPreviewCard(pokemon: Pokemon): void {
    const root: HTMLSpanElement = document.createElement('span');

    const img: HTMLImageElement = document.createElement('img');
    img.src = pokemon.sprites.front_default;
    root.append(img);

    if (pokemon.sprites.front_default !== null) resultsRef.append(root);
  }

  const deleteHistoryItem = function deleteHistoryItem(id: number) {
    // TODO: Convert history to a linked list so remove elements is more efficent.
    window.pokedex!.history = window.pokedex!.history!.filter(entry => entry.id !== id);

    renderHistoryList();
  }

  const renderPokemon = function renderPokemon(pokemon: Pokemon[]): void {
    clearResultsSection();

    pokemon.forEach(appendPreviewCard);
  }

  const appendHistoryItem = function appendHistoryItem(id: number, pokemon: Pokemon[], mode: keyof typeof enumModeOptions, query: string): void {
    const historyRef = document.querySelector("section[region='history'] > .history")!;
    const root = document.createElement('div');
    root.onclick = renderPokemon.bind(null, pokemon);
    root.classList.add('history__item');

    const queryText = document.createElement('p');
    queryText.classList.add('history__query');
    queryText.textContent = mode + ': ' + query;
    root.append(queryText);

    const totalResultsText = document.createElement('p');
    totalResultsText.classList.add('history__quantity');
    totalResultsText.textContent = '(' + pokemon.length.toString() + ')';
    root.append(totalResultsText);

    const trashbinIcon = document.createElement('i');
    trashbinIcon.classList.add('history__remove', 'bi', 'bi-trash');
    trashbinIcon.onclick = deleteHistoryItem.bind(null, id);
    root.append(trashbinIcon);

    historyRef.append(root);
  };

  const clearHistoryList = function clearHistoryList() {
    const historyRef = document.querySelector("section[region='history'] > .history")!;

    historyRef.innerHTML = '';
  };

  const resetHistory = function resetHistory() {
    window.pokedex!.history! = [];
    clearHistoryList();
  };

  const renderHistoryList = function renderHistoryList() {
    clearHistoryList();

    window.pokedex!.history!.forEach(entry => appendHistoryItem(entry.id, entry.pokemon, entry.mode, entry.query));
  };

  const processSearchQuery = async function processSearchQuery(
    ref: HTMLInputElement,
    modeOptions: { [index in keyof typeof enumModeOptions]: fetchPokemonFn }
  ): Promise<void> {
    const mode = getMode();
    const query = ref.value;

    try {
      const result = await modeOptions[mode](query);

      window.pokedex!.addResultToHistory!({ pokemon: result, mode, query });
      renderHistoryList();

      if (Array.isArray(result)) renderPokemon(result);
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

  const clearListRef: HTMLButtonElement = document.querySelector("section[region='history'] .history-header__clear")!;
  clearListRef.onclick = resetHistory.bind(null);
})();
