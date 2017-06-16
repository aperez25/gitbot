const router = require('express').Router()
const token = require('../../.config')

var apiai = require('apiai');

var apiaiRouter = apiai(token.APIAI_CLIENT_ACCESS_TOKEN);

// var request = apiaiRouter.textRequest('What is git?', {
//     sessionId: '304'
// });

// request.on('response', function(response) {
//     console.log(response);
// });

// // request.on('error', function(error) {
// //     console.log(error);
// // });

// request.end();

function ask(text, options) {
	return new Promise((resolve, reject) => {
		var defaultOptions = {
			sessionId: '<unique session id>', // use any arbitrary id - doesn't matter
		};

		let request = apiaiRouter.textRequest(text, Object.assign(defaultOptions, options));
		request.on('response', (response) => {
			return resolve(response);
		});

		request.on('error', (error) => {
			return reject(error);
		});

		request.end();
	})
}

function getAllIntents(options) {
	return new Promise((resolve, reject) => {
		let request = apiaiRouter.intentGetRequest(options);
		request.on('response', (response) => {
			return resolve(response);
		});
		request.on('error', (error) => {
			return reject(error);
		});
		request.end();
	})
}

// ask something
ask('<Your text query>')
	.then(response => {
		console.log(response);
	}).catch(error => {
		console.log(error)
	});

// get list of all intents
getAllIntents()
	.then(intents => {
		console.log(intents);
	}).catch(error => {
		console.log(error)
	});

router.use(function (req, res, next) {
  const err = new Error('Not found.');
  err.status = 404;
  next(err);
})

module.exports = router
