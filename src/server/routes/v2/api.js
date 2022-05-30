const { Router } = require('express');

const timelineController = require('../../controllers/timeline.controller');
const userController = require('../../controllers/user.controller');
const cartController = require('../../controllers/cart.controller');

const createV2Router = () => {
  const router = Router();

  router.get('/user/timeline/event', timelineController.fetchEvents);
  router.get('/user/timeline/event/:name', timelineController.fetchEvent);
  router.post('/user/timeline/capture', timelineController.captureEvent);
  router.post('/user/timeline/remove', timelineController.deleteEvent);
  router.post('/user/register', userController.createUser);
  router.post('/user/edit', userController.editUser);
  router.post('/user/login', userController.login);
  router.get('/user/logout', userController.logout);
  router.get('/user/carts', cartController.fetchUserCarts);
  router.get('/user/cart/:id', cartController.fetchCart);
  router.post('/user/cart/quantity', cartController.updateItemQuantity);
  router.post('/user/cart/add', cartController.addToCart);
  router.post('/user/cart/remove', cartController.removeCart);
  router.post('/user/cart/remove/item', cartController.removeItem);
  router.post('/user/cart/checkout', cartController.checkout);

  return router;
};

module.exports = { createV2Router };
