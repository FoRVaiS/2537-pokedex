const express = require('express');

const GameController = require('../controllers/game.controller');

const createGameRouter = () => {
  const router = express.Router();

  // Generate the playing field, based on a grid size input from user
  router.post('/create', GameController.clearGame, GameController.createGame);
  
  // Validate the answers chosen by the player
  router.post('/validate', GameController.hasBoard, GameController.validateSelection);

  return router;
};

module.exports = { createGameRouter };
