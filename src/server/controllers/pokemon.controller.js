const { PokemonModel } = require("../models/pokemon.model");

const { isNumericalString } = require("../../utils/isNumericalString");
const { isAlphabeticalString } = require("../../utils/isAlphabeticalString");

const PokemonNotFoundErrorPayload = {
  success: false,
  data: {
      msg: 'Failed to find pokemon because it either does not exist or an internal server error has occurred.',
  }
}

const fetchPokemon = async (req, res) => {
  const { id } = req.params;

  if (isNumericalString(id)) await fetchPokemonById(id, req, res);
  else if (isAlphabeticalString(id)) await fetchPokemonByName(id, req, res);
  else return res.status(400).json({
    success: false,
    data: {
      msg: 'The :id parameter must only contain numbers or only contain letters.',
    },
  });
};

const fetchPokemonById = async (id, req, res) => {
  const [pokemon] = await PokemonModel.find({ id }, { _id: 9, __v: 0 });

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

module.exports = { fetchPokemon, fetchPokemonById, fetchPokemonByName };
