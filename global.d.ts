interface EntityApiReference {
    name: string;
    url: string;
}

interface Name {
    name: string;
    language: EntityApiReference;
}

interface EffectEntry {
    effect: string;
    short_effect?: string;
    language: EntityApiReference;
}

interface EffectChange {
    version_group: EntityApiReference;
    effect_entries: EffectEntry[];
}

interface FlavorTextEntry {
    flavor_text: string;
    language: EntityApiReference;
    version_group: EntityApiReference;
}

interface PokemonReference {
    is_hidden?: boolean;
    slot: number;
    pokemon: EntityApiReference;
}

interface DamageRelations {
    no_damage_to: EntityApiReference[];
    half_damage_to: EntityApiReference[];
    double_damage_to: EntityApiReference[];
    no_damage_from: EntityApiReference[];
    half_damage_from: EntityApiReference[];
    double_damage_from: EntityApiReference[];
}

interface PastDamageRelation {
    generation: EntityApiReference;
    damage_relations: DamageRelations;
}

interface GameIndice {
    game_index: number;
    generation: EntityApiReference;
}

interface EntityApiReference {
    name: string;
    url: string;
}

interface Ability {
    is_hidden: boolean;
    slot: number;
    ability: EntityApiReference;
}

interface GameIndice {
    game_index: number;
    version: EntityApiReference;
}

interface VersionDetail {
    rarity: number;
    version: EntityApiReference;
}

interface HeldItem {
    item: EntityApiReference;
    version_details: VersionDetail[];
}

interface VersionGroupDetail {
    level_learned_at: number;
    version_group: EntityApiReference;
    move_learn_method: EntityApiReference;
}

interface Move {
    move: EntityApiReference;
    version_group_details: VersionGroupDetail[];
}

interface DreamWorld {
    front_default: string;
    front_female?: any;
}

interface Home {
    front_default: string;
    front_female?: any;
    front_shiny: string;
    front_shiny_female?: any;
}

interface OfficialArtwork {
    front_default: string;
}

interface Other {
    dream_world: DreamWorld;
    home: Home;
    "official-artwork": OfficialArtwork;
}

interface RedBlue {
    back_default: string;
    back_gray: string;
    front_default: string;
    front_gray: string;
}

interface Yellow {
    back_default: string;
    back_gray: string;
    front_default: string;
    front_gray: string;
}

interface GenerationI {
    "red-blue": RedBlue;
    yellow: Yellow;
}

interface Crystal {
    back_default: string;
    back_shiny: string;
    front_default: string;
    front_shiny: string;
}

interface Gold {
    back_default: string;
    back_shiny: string;
    front_default: string;
    front_shiny: string;
}

interface Silver {
    back_default: string;
    back_shiny: string;
    front_default: string;
    front_shiny: string;
}

interface GenerationIi {
    crystal: Crystal;
    gold: Gold;
    silver: Silver;
}

interface Emerald {
    front_default: string;
    front_shiny: string;
}

interface FireredLeafgreen {
    back_default: string;
    back_shiny: string;
    front_default: string;
    front_shiny: string;
}

interface RubySapphire {
    back_default: string;
    back_shiny: string;
    front_default: string;
    front_shiny: string;
}

interface GenerationIii {
    emerald: Emerald;
    "firered-leafgreen": FireredLeafgreen;
    "ruby-sapphire": RubySapphire;
}

interface DiamondPearl {
    back_default: string;
    back_female?: any;
    back_shiny: string;
    back_shiny_female?: any;
    front_default: string;
    front_female?: any;
    front_shiny: string;
    front_shiny_female?: any;
}

interface HeartgoldSoulsilver {
    back_default: string;
    back_female?: any;
    back_shiny: string;
    back_shiny_female?: any;
    front_default: string;
    front_female?: any;
    front_shiny: string;
    front_shiny_female?: any;
}

interface Platinum {
    back_default: string;
    back_female?: any;
    back_shiny: string;
    back_shiny_female?: any;
    front_default: string;
    front_female?: any;
    front_shiny: string;
    front_shiny_female?: any;
}

interface GenerationIv {
    "diamond-pearl": DiamondPearl;
    "heartgold-soulsilver": HeartgoldSoulsilver;
    platinum: Platinum;
}

interface Animated {
    back_default: string;
    back_female?: any;
    back_shiny: string;
    back_shiny_female?: any;
    front_default: string;
    front_female?: any;
    front_shiny: string;
    front_shiny_female?: any;
}

interface BlackWhite {
    animated: Animated;
    back_default: string;
    back_female?: any;
    back_shiny: string;
    back_shiny_female?: any;
    front_default: string;
    front_female?: any;
    front_shiny: string;
    front_shiny_female?: any;
}

interface GenerationV {
    "black-white": BlackWhite;
}

interface OmegarubyAlphasapphire {
    front_default: string;
    front_female?: any;
    front_shiny: string;
    front_shiny_female?: any;
}

interface XY {
    front_default: string;
    front_female?: any;
    front_shiny: string;
    front_shiny_female?: any;
}

interface GenerationVi {
    "omegaruby-alphasapphire": OmegarubyAlphasapphire;
    "x-y": XY;
}

interface Icons {
    front_default: string;
    front_female?: any;
}

interface UltraSunUltraMoon {
    front_default: string;
    front_female?: any;
    front_shiny: string;
    front_shiny_female?: any;
}

interface GenerationVii {
    icons: Icons;
    "ultra-sun-ultra-moon": UltraSunUltraMoon;
}

interface GenerationViii {
    icons: Icons;
}

interface Versions {
    "generation-i": GenerationI;
    "generation-ii": GenerationIi;
    "generation-iii": GenerationIii;
    "generation-iv": GenerationIv;
    "generation-v": GenerationV;
    "generation-vi": GenerationVi;
    "generation-vii": GenerationVii;
    "generation-viii": GenerationViii;
}

interface Sprites {
    back_default: string;
    back_female?: any;
    back_shiny: string;
    back_shiny_female?: any;
    front_default: string;
    front_female?: any;
    front_shiny: string;
    front_shiny_female?: any;
    other: Other;
    versions: Versions;
}

interface Stat {
    base_stat: number;
    effort: number;
    stat: EntityApiReference;
}

interface Type {
    slot: number;
    type: EntityApiReference;
}

interface PastType {
    generation: EntityApiReference;
    types: Type[];
}

interface Window {
  pokedex?: Partial<Pokedex>;
}

type fetchPokemonFn = (id: string | number) => Promise<Pokemon[]>

enum enumModeOptions { "Name", "Ability", "Type" }

interface HistoryEntry {
  pokemon: Pokemon[];
  mode: keyof typeof enumModeOptions;
  query: string
}

interface Pokedex {
  history: (HistoryEntry & { id: number })[];
  addResultToHistory: (entry: HistoryEntry) => void;
  fetchPokemonByName: fetchPokemonFn;
  fetchPokemonByType: fetchPokemonFn;
  fetchPokemonByAbility: fetchPokemonFn
}

interface Pokemon {
    id: number;
    name: string;
    base_experience: number;
    height: number;
    is_default: boolean;
    order: number;
    weight: number;
    abilities: Ability[];
    forms: EntityApiReference[];
    game_indices: GameIndice[];
    held_items: HeldItem[];
    location_area_encounters: string;
    moves: Move[];
    species: EntityApiReference;
    sprites: Sprites;
    stats: Stat[];
    types: Type[];
    past_types: PastType[];
}

interface PokemonAbility {
    id: number;
    name: string;
    is_main_series: boolean;
    generation: EntityApiReference;
    names: Name[];
    effect_entries: EffectEntry[];
    effect_changes: EffectChange[];
    flavor_text_entries: FlavorTextEntry[];
    pokemon: PokemonReference[];
}

interface PokemonType {
    id: number;
    name: string;
    damage_relations: DamageRelations;
    past_damage_relations: PastDamageRelation[];
    game_indices: GameIndice[];
    generation: EntityApiReference;
    move_damage_class: EntityApiReference;
    names: Name[];
    pokemon: PokemonReference[];
    moves: EntityApiReference[];
}
