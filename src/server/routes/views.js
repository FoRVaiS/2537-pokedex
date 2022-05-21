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

  return router;
};

module.exports = { createViewRouter };
