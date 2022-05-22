const { Router } = require('express');

const createViewRouter = () => {
  const router = Router();

  router.get('/', (req, res) => {
    res.render('pages/index/index');
  });

  router.get('/search', (req, res) => {
    res.render('pages/search/search');
  });

  router.get('/profile', (req, res) => {
    res.render('pages/profile/profile');
  });

  router.get('/timeline', (req, res) => {
    res.render('pages/timeline/timeline');
  });

  router.get('/landing', (req, res) => {
    res.render('pages/landing/landing');
  });

  router.get('/register', (req, res) => {
    res.render('pages/register/register');
  });

  router.get('/login', (req, res) => {
    res.render('pages/login/login');
  });

  return router;
};

module.exports = { createViewRouter };
