interface Window {
  pokedex?: Pokedex;
}

interface Pokedex {
  fetchPokemonByName?: <T = { [name: string]: unknown }>(name: string) => Promise<T>;
}

(self => {
  self.fetchPokemonByName = async function fetchPokemonByName<T>(name: string) {
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, {
      method: "GET",
    });

    return data.json() as Promise<T>;
  };

})(window.pokedex = window.pokedex || {});
