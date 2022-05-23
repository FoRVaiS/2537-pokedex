const { Router } = require('express');
const { requireAuth } = require('../decorators/requireAuthentication');
const { UserModel } = require('../models/user.model');

const redirectToLogin = (req, res) => res.redirect('/login');

const createViewRouter = () => {
  const router = Router();

  router.get('/', (req, res) => (req.session.isAuthenticated
    ? res.redirect('/user')
    : res.render('pages/landing/landing')));

  router.get('/search', requireAuth(redirectToLogin), (req, res) => {
    res.render('pages/search/search');
  });

  router.get('/profile', requireAuth(redirectToLogin), (req, res) => {
    res.render('pages/profile/profile');
  });

  router.get('/timeline', requireAuth(redirectToLogin), (req, res) => {
    res.render('pages/timeline/timeline');
  });

  router.get('/register', (req, res) => {
    res.render('pages/register/register');
  });

  router.get('/login', (req, res) => (req.session.isAuthenticated
    ? res.redirect('/user')
    : res.render('pages/login/login')));

  router.get('/user', requireAuth(redirectToLogin), async (req, res) => {
    const [user] = await UserModel.find({ _id: req.session._id });

    res.render('pages/user-profile/user-profile', {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      gender: user.gender,
    });
  });

  router.get('/cart', requireAuth(redirectToLogin), async (req, res) => {
    const { _id } = req.session;
    const user = await UserModel.findById(_id);
    if (user && user.activeCart) {
      res.redirect(`/cart/${user.activeCart}`);
    } else {
      res.redirect('/404');
    }
  });

  router.get('/cart/:id', requireAuth(redirectToLogin), async (req, res) => {
    res.render('pages/cart/cart');
  });

  router.get('/404', async (req, res) => {
    res.render('pages/errors/404');
  });

  return router;
};

module.exports = { createViewRouter };
