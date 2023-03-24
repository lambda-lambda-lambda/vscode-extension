'use strict';

const config = require('../config.json');

/**
 * Middleware example.
 */
module.exports = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Accept,Authorization,Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT');

  // Set CORS restrictions.
  res.setHeader('Access-Control-Allow-Origin',
    (config.development === true) ? '*' : config.origin.siteUrl
  );

  // Handle preflight requests.
  if (req.method() === 'OPTIONS') {
    res.status(204).send();
  } else {
    next();
  }
};
