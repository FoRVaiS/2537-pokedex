const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const config = require('config');

// Middleware
const helmet = require('helmet');
const morgan = require('morgan');

const { createV2Router } = require('./routes/v2');

const viewRoot = path.join(__dirname, '..', 'public');

const createExpressInstance = async () => {
  const app = express();

  try {
    console.log('Connecting to Mongodb database...');
    await mongoose.connect(config.get('mongo.connectionString'));
    console.log('Successfully connected to database');

    app.use(helmet());
    app.use(morgan('combined'));

    app.use(express.static(viewRoot));

    app.use('/api/v2/', createV2Router({ viewRoot }));

    return app;
  } catch (e) {
    console.error(e);
  }
};

module.exports = { createExpressInstance };
