const { PokemonModel } = require("../models/pokemon.model");

const { isNumericalString } = require("../../utils/isNumericalString");
const { isAlphabeticalString } = require("../../utils/isAlphabeticalString");

const fetchPokemon = async (req, res) => {
  const { id } = req.params;

  let pokemon = null;

  if (isNumericalString(id)) pokemon = (await PokemonModel.find({ id }, { _id: 0, __v: 0 }))[0];
  else if (isAlphabeticalString(id)) pokemon = (await PokemonModel.find({ name: id }, { _id: 0, __v: 0 }))[0];
  else return res.status(400).json({
    success: false,
    data: {
      msg: 'The :id parameter must only contain numbers or only contain letters.',
    },
  });


  if (!pokemon) return res.status(500).json({
    success: false,
    data: {
      msg: 'Failed to find pokemon because it either does not exist or an internal server error has occurred.',
    },
  });

  return res.status(200).json({
    success: true,
    data: pokemon,
  });
};

module.exports = { fetchPokemon };
