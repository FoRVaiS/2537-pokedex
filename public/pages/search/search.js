'use strict';
(() => {
  const clearResultsSection = function clearResultsSection() {
    const resultsRef = document.querySelector("section[region='results'] > .u-center-evenly-spaced");
    resultsRef.innerHTML = '';
  };

  const getMode = function getMode() {
    const modeSelectorRef = document.querySelector("section[region='search'] .search__mode");

    return modeSelectorRef.options[modeSelectorRef.options.selectedIndex].value;
  };

  const resultsRef = document.querySelector("section[region='results'] > .u-center-evenly-spaced");

  const appendPreviewCard = function appendPreviewCard(pokemon) {
    if (!pokemon.sprites) return;

    const root = document.createElement('span');
        
    const img = document.createElement('img');
    img.style.cursor = 'pointer';
    img.src = pokemon.sprites.front_default;
    img.crossOrigin = 'cross-origin';
    // eslint-disable-next-line no-return-assign
    img.onclick = () => window.location.href = `/profile?id=${pokemon.id}`;
    root.append(img);

    if (pokemon.sprites.front_default !== null) resultsRef.append(root);
  };

  const deleteHistoryItem = function deleteHistoryItem(id) {
    // TODO: Convert history to a linked list so remove elements is more efficent.
    window.pokedex.history = window.pokedex.history.filter(entry => entry.id !== id);
    // #REASON: Circular dependencies
    // eslint-disable-next-line no-use-before-define
    renderHistoryList();
  };

  const renderPokemon = function renderPokemon(pokemon) {
    clearResultsSection();

    pokemon.forEach(appendPreviewCard);
  };

  const appendHistoryItem = function appendHistoryItem(id, pokemon, mode, query) {
    const historyRef = document.querySelector("section[region='history'] > .history");
        
    const root = document.createElement('div');
    root.onclick = renderPokemon.bind(null, pokemon);
    root.classList.add('history__item');

    const queryText = document.createElement('p');
    queryText.classList.add('history__query');
    queryText.textContent = `${mode}: ${query}`;
    root.append(queryText);

    const totalResultsText = document.createElement('p');
    totalResultsText.classList.add('history__quantity');
    totalResultsText.textContent = `(${pokemon.length.toString()})`;
    root.append(totalResultsText);

    const trashbinIcon = document.createElement('i');
    trashbinIcon.classList.add('history__remove', 'bi', 'bi-trash');
    trashbinIcon.onclick = deleteHistoryItem.bind(null, id);
    root.append(trashbinIcon);
        
    historyRef.append(root);
  };

  const clearHistoryList = function clearHistoryList() {
    const historyRef = document.querySelector("section[region='history'] > .history");
    historyRef.innerHTML = '';
  };

  const resetHistory = function resetHistory() {
    window.pokedex.history = [];
    clearHistoryList();
  };

  const renderHistoryList = function renderHistoryList() {
    clearHistoryList();
    window.pokedex.history.forEach(entry => appendHistoryItem(entry.id, entry.pokemon, entry.mode, entry.query));
  };

  const sendAlert = function sendAlert(msg) {
    const template = document.querySelector('#template-alert');
        
    const alertNode = template.content.cloneNode(true);
    alertNode.querySelector('.alert__msg').textContent = msg;
    document.querySelector('.container').prepend(alertNode);

    setTimeout(() => {
      document.querySelector('.alert').remove();
    }, 3e3);
  };

  const validateQueryInput = function validateQueryInput(query) {
    return !!query.match(/^(?:\d|\w)+$/g);
  };

  const processSearchQuery = async function processSearchQuery(ref, modeOptions) {
    const mode = getMode();
    const query = ref.value.toLowerCase();

    // Form validation
    if (query.length === 0) return sendAlert('An input of an integer or string is required.');
    if (!validateQueryInput(query)) return sendAlert(`"${query}" is not a valid input.`);

    try {
      const result = await modeOptions[mode](query);
      window.pokedex.addResultToHistory({ pokemon: result, mode, query });
      renderHistoryList();
      if (Array.isArray(result)) renderPokemon(result);
    } catch (e) {
      sendAlert(`Could not find the ${mode.toLowerCase()} '${query}'.`);
    }

    return null;
  };

  const modeOptions = {
    'Name': window.pokedex.fetchPokemonByName,
    'Ability': window.pokedex.fetchPokemonByAbility,
    'Type': window.pokedex.fetchPokemonByType,
    'Region': window.pokedex.fetchPokemonByRegion,
  };

  // Populate mode selector with with option keys
  Object.keys(modeOptions).forEach(optionKey => {
    const optionEl = document.createElement('option');
    optionEl.textContent = optionKey;
    document.querySelector("section[region='search'] .search__mode").append(optionEl);
  });

  // Invoke processSearchQuery when user presses the "Return" key in the text field
  const searchRef = document.querySelector("section[region='search'] .search__field");
  searchRef.addEventListener('keypress', e => {
    if (e.key === 'Enter') processSearchQuery(searchRef, modeOptions);
  });

  // Invoke processSearchQuery when user presses the execute query button
  const searchActionRef = document.querySelector("section[region='search'] .search__action");
  searchActionRef.onclick = processSearchQuery.bind(null, searchRef, modeOptions);

  const clearListRef = document.querySelector("section[region='history'] .history-header__clear");
  clearListRef.onclick = resetHistory.bind(null);
})();
