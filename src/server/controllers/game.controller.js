const fetch = require('node-fetch');

const { generateBoard } = require('../components/generateBoard');
const { scrambleArray } = require('../components/scrambleArray');

const hasBoardMiddleware = async (req, res, next) => {
  if (req.session.game && req.session.game.board) return next();

  return res.status(500).json({
    success: false,
    data: {
      msg: 'Missing game board.',
    },
  });
};

const clearGameMiddleware = async (req, _, next) => {
  delete req.session.game;

  next();
};

const createGameMiddleware = async (req, res) => {
  const { width, height } = req.body;

  // An array containing an int range consisting of 0 -> half the cards (floored) + 1
  const numUniquePokemon = Array.from(Array(Math.floor(width * height / 2))).map((_, index) => index);

  // While this algorithm does pick unique pokemon, the pokemon chosen is consistent based on the size of the grid.
  const pokemonIds = scrambleArray(numUniquePokemon)
    .map(randInt => randInt + 1)
    .map((randInt, _, _buf) => Math.floor(randInt / _buf.length * 868));

  // Fetch pokemon images
  const pokemonResponses = await Promise.all(pokemonIds.map(id => fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)));
  const pokemon = (await Promise.all(pokemonResponses.map(response => response.json()))).map(_pokemon => ({ hiddenId: _pokemon.id, sprite: _pokemon.sprites.front_default }));

  // Scramble a number range (eg [0, 1, 2, 3] => [2, 1, 0, 3] and use those numbers to create a scrambled array of pokemon
  const board = scrambleArray(generateBoard(width, height))
    .map(randInt => [...pokemon, ...pokemon][randInt])
    .map((card, index) => card && ({ publicId: index, ...card }));

  req.session.game = { board };

  return res.status(200).json({
    success: true,
    data: {
      board: req.session.game.board.map(card => {
        if (card) {
          const { hiddenId, ...rest } = card;
          return rest;
        }
      }),
    },
  });
};

const validateSelectionMiddleware = (req, res) => {
  const { board } = req.session.game;
  const { previousRegister, currentRegister } = req.body;

  const pokemonA = board.filter(({ publicId }) => publicId === previousRegister).pop();
  const pokemonB = board.filter(({ publicId }) => publicId === currentRegister).pop();

  return res.status(200).json({
    success: true,
    data: {
      correct: pokemonA.hiddenId === pokemonB.hiddenId,
    },
  });
};

module.exports = {
  hasBoard: hasBoardMiddleware,
  clearGame: clearGameMiddleware,
  createGame: createGameMiddleware,
  validateSelection: validateSelectionMiddleware,
};
