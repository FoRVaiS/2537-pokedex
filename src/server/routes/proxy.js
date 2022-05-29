const express = require('express');

const fetch = require('node-fetch');
const { pipeline } = require('node:stream');
const { promisify } = require('node:util');

const streamPipeline = promisify(pipeline);

const createProxyRouter = () => {
  const router = express.Router();

  router.get('/*', async (req, res) => {
    const [,, protocol, spacer, url, ...path] = req.originalUrl.split('/');
    let resp = null;

    try {
      resp = await fetch([protocol, spacer, url, ...path].join('/'));
    } catch (e) {
      return res.status(500).send(e);
    }

    await streamPipeline(resp.body, res);
  });

  return router;
};

module.exports = { createProxyRouter };
