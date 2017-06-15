const router = require('express').Router()
const token = require('../../.config')

var apiai = require('apiai');

var apiaiRouter = apiai(token.APIAI_CLIENT_ACCESS_TOKEN);

var request = apiaiRouter.textRequest('What is git?', {
    sessionId: '304'
});

request.on('response', function(response) {
    console.log(response);
});

request.on('error', function(error) {
    console.log(error);
});

request.end();


router.use(function (req, res, next) {
  const err = new Error('Not found.');
  err.status = 404;
  next(err);
})

module.exports = router
