const { Router } = require('express');
const { UserModel } = require('../models/user.model');

const createViewRouter = () => {
  const router = Router();

  router.get('/', (req, res) => (req.session.isAuthenticated
    ? res.render('pages/index/index')
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

  router.get('/login', (req, res) => {
    res.render('pages/login/login');
  });

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

  return router;
};

module.exports = { createViewRouter };
