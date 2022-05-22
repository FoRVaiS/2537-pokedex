const { Router } = require('express');
const { UserModel } = require('../models/user.model');

const createViewRouter = () => {
  const router = Router();

  router.get('/', (req, res) => (req.session.isAuthenticated
    ? res.redirect('/user')
    : res.render('pages/landing/landing')));

  router.get('/search', (req, res) => {
    res.render('pages/search/search');
  });

  router.get('/profile', (req, res) => {
    res.render('pages/profile/profile');
  });

  router.get('/timeline', (req, res) => {
    res.render('pages/timeline/timeline');
  });

  router.get('/register', (req, res) => {
    res.render('pages/register/register');
  });

  router.get('/login', (req, res) => (req.session.isAuthenticated
    ? res.redirect('/user')
    : res.render('pages/login/login')));

  router.get('/user', async (req, res) => {
    const [user] = await UserModel.find({ _id: req.session._id });

    res.render('pages/user-profile/user-profile', {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      gender: user.gender,
    });
  });

  router.get('/cart', async (req, res) => {
    const { _id } = req.session;
    const user = await UserModel.findById(_id);
    if (user && user.activeCart) {
      res.redirect(`/cart/${user.activeCart}`);
    } else {
      res.redirect('/404');
    }
  });

  router.get('/cart/:id', async (req, res) => {
    res.render('pages/cart/cart');
  });

  return router;
};

module.exports = { createViewRouter };
