const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const config = require('config');

// Middleware
const helmet = require('helmet');
const morgan = require('morgan');

const { createV2Router } = require('./routes/v2');

const viewRoot = path.join(__dirname, '..', '..', 'public');

const createExpressInstance = async () => {
  const app = express();

  try {
    console.log('Connecting to Mongodb database...');
    await mongoose.connect(config.get('mongo.connectionString'));
    console.log('Successfully connected to database');

    app.use(helmet());
    app.use(helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'", 'pokeapi.co'],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        imgSrc: ['raw.githubusercontent.com']
      },
    }));
    app.use(morgan('combined'));

    app.use(express.static(viewRoot));

    app.use('/api/v2/', createV2Router({ viewRoot }));

    app.get('/', (req, res) => {
      res.sendFile(path.join(viewRoot, 'pages/index/index.html'));
    });

    app.get('/search', (req, res) => {
      res.sendFile(path.join(viewRoot, 'pages/search/search.html'));
    });

    app.get('/profile', (req, res) => {
      res.sendFile(path.join(viewRoot, 'pages/profile/profile.html'));
    });

    return app;
  } catch (e) {
    console.error(e);
  }
};

module.exports = { createExpressInstance };
