const { PokemonModel } = require("../models/pokemon.model");

const { isNumericalString } = require("../../utils/isNumericalString");
const { isAlphabeticalString } = require("../../utils/isAlphabeticalString");

const PokemonNotFoundErrorPayload = {
  success: false,
  data: {
    msg: 'Failed to find pokemon because it either does not exist or an internal server error has occurred.',
  }
}

const InvalidIdErrorPayload = {
  success: false,
  data: {
    msg: 'The :id parameter must only contain numbers or only contain letters.',
  },
};

const fetchPokemon = async (req, res) => {
  const { id } = req.params;
  const { limit = 20, offset = 0 } = req.query;

  if (!id) return fetchAllPokemon(offset, limit, req, res)

  if (isNumericalString(id)) return fetchPokemonById(id, req, res);
  else if (isAlphabeticalString(id)) return fetchPokemonByName(id, req, res);

  res.status(400).json(InvalidIdErrorPayload);
};

const fetchPokemonById = async (id, req, res) => {
  const [pokemon] = await PokemonModel.find({ id }, { _id: 0, __v: 0 });

  if (!pokemon) return res.status(500).json(PokemonNotFoundErrorPayload);

  return res.status(200).json({
    success: true,
    data: pokemon,
  });
};

const fetchPokemonByName = async (name, req, res) => {
  const [pokemon] = await PokemonModel.find({ name }, { _id: 0, __v: 0 });

  if (!pokemon) return res.status(500).json(PokemonNotFoundErrorPayload);

  return res.status(200).json({
    success: true,
    data: pokemon,
  });
};

const fetchAllPokemon = async (offset, limit, req, res) => {
  const pokemon = await PokemonModel.find({}, { _id: 0, __v: 0 }).limit(limit).skip(offset);

  if (!pokemon) return res.status(500).json(PokemonNotFoundErrorPayload);

  return res.status(200).json({
    success: true,
    data: pokemon,
  });
};

module.exports = { fetchPokemon, fetchPokemonById, fetchPokemonByName, fetchAllPokemon };
