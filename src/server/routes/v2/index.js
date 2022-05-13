const { Router } = require('express');

const pokemonController = require('../../controllers/pokemon.controller');

const createV2Router = (ctx) => {
  const router = Router();

  router.get('/pokemon/:id', pokemonController.fetchPokemon);

  return router;
}

module.exports = { createV2Router };
