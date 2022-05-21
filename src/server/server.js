const path = require('path');

const express = require('express');
const sessions = require('express-session');
const mongoose = require('mongoose');
const config = require('config');

// Middleware
const helmet = require('helmet');
const morgan = require('morgan');

const { createV2Router } = require('./routes/v2/api');
const { createViewRouter } = require('./routes/views');

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
        imgSrc: ['raw.githubusercontent.com'],
      },
    }));
    app.use(morgan('combined'));
    app.use(sessions({
      secret: process.env.NODE_ENV === 'production' ? config.get('secret') : 'devsecret',
      resave: false,
      saveUninitialized: true,
    }));

    app.use(express.static(viewRoot));
    app.use(express.json());

    app.set('view engine', 'ejs');
    app.set('views', viewRoot);

    const ctx = { };

    app.use('/api/v2/', createV2Router(ctx));
    app.use('/', createViewRouter(ctx));

    return app;
  } catch (e) {
    console.error(e);
    
    return null;
  }
};

module.exports = { createExpressInstance };
