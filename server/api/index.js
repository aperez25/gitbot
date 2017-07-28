'use strict'

const api = module.exports = require('express').Router()

api
  .use('/github', require('./github'))
  .use('/apiai', require('./site'))

// No routes matched? 404.
api
.use((req, res) => res.status(404).end())
.use(function (req, res, next) {
  const err = new Error('Not found.');
  err.status = 404;
  next(err);
})
