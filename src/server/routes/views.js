const path = require('path');

const { Router } = require('express');

const createViewRouter = ({ viewRoot }) => {
  const router = Router();

  router.get('/', (req, res) => {
    res.sendFile(path.join(viewRoot, 'pages/index/index.html'));
  });

  router.get('/search', (req, res) => {
    res.sendFile(path.join(viewRoot, 'pages/search/search.html'));
  });

  router.get('/profile', (req, res) => {
    res.sendFile(path.join(viewRoot, 'pages/profile/profile.html'));
  });

  router.get('/timeline', (req, res) => {
    res.sendFile(path.join(viewRoot, 'pages/timeline/timeline.html'));
  });

  return router;
};

module.exports = { createViewRouter };
