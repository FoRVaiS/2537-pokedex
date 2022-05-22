const { Router } = require('express');

const pokemonController = require('../../controllers/pokemon.controller');
const typeController = require('../../controllers/type.controller');
const abilityController = require('../../controllers/ability.controller');
const timelineController = require('../../controllers/timeline.controller');
const userController = require('../../controllers/user.controller');

const createV2Router = () => {
  const router = Router();

  router.get('/pokemon/:id', pokemonController.fetchPokemon);
  router.get('/pokemon', pokemonController.fetchPokemon);
  router.get('/type/:id', typeController.fetchType);
  router.get('/ability/:id', abilityController.fetchAbility);
  router.get('/timeline/event', timelineController.fetchEvents);
  router.get('/timeline/event/:name', timelineController.fetchEvent);
  router.post('/timeline/capture', timelineController.captureEvent);
  router.post('/timeline/remove', timelineController.deleteEvent);
  router.post('/user/register', userController.createUser);
  router.post('/user/login', userController.login);

  return router;
};

module.exports = { createV2Router };
