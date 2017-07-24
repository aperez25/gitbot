'use strict'

const router = require('express').Router()
// const apiai = require('apiai')
// const apiaiRouter = apiai(process.env.APIAI_CLIENT_ACCESS_TOKEN)

// router
// .post('/', (req, res, next) => {
//   console.log(req)
//   ask(req.body.question)
// 	.then(response => {
// 		res.send(response.result.fulfillment.speech);
// 	})
//   .catch(error => {
// 		console.log(error)
// 	});
// })


// function ask(text, options) {
// 	return new Promise((resolve, reject) => {
// 		var defaultOptions = {
// 			sessionId: Math.floor((Math.random() + 1) * 1000) // can use any arbitrary id
// 		};
// 		let request = apiaiRouter.textRequest(text, Object.assign(defaultOptions, options));
// 		request.on('response', (response) => {
// 			return resolve(response);
// 		});

// 		request.on('error', (error) => {
// 			return reject(error);
// 		});

// 		request.end();
// 	})
// }
// ask something

// function getAllIntents(options) {
// 	return new Promise((resolve, reject) => {
// 		let request = apiaiRouter.intentGetRequest(options);
// 		request.on('response', (response) => {
// 			return resolve(response);
// 		});
// 		request.on('error', (error) => {
// 			return reject(error);
// 		});
// 		request.end();
// 	})
// }


// // get list of all intents
// getAllIntents()
// 	.then(intents => {
// 		console.log(intents);
// 	}).catch(error => {
// 		console.log(error)
// 	});
module.exports = router
