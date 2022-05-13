const { Router } = require('express');

const pokemonController = require('../../controllers/pokemon.controller');
const typeController = require('../../controllers/type.controller');
const abilityController = require('../../controllers/ability.controller');

const createV2Router = (ctx) => {
  const router = Router();

  router.get('/pokemon/:id', pokemonController.fetchPokemon);
  router.get('/pokemon', pokemonController.fetchPokemon);
  router.get('/type/:id', typeController.fetchType);
  router.get('/ability/:id', abilityController.fetchAbility);

  return router;
}

module.exports = { createV2Router };
