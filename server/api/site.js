'use strict'

const router = require('express').Router()
const apiai = require('apiai')
const apiaiRouter = apiai(process.env.APIAI_CLIENT_ACCESS_TOKEN)

router
.post('/', (req, res, next) => {
  ask(req.body.question)
	.then(response => {
		res.send(response.result.fulfillment.speech);
	})
  .catch(error => {
		console.log(error)
	});
})


function ask(text, options) {
	return new Promise((resolve, reject) => {
		var defaultOptions = {
			sessionId: Math.floor((Math.random() + 1) * 1000) // can use any arbitrary id
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

module.exports = router
