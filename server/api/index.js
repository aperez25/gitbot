const router = require('express').Router()
const apiai = require('apiai');
const octokat = require('octokat')
const apiaiRouter = apiai(process.env.APIAI_CLIENT_ACCESS_TOKEN)

// const gitHubId = process.env.GH_CLIENT_ID
// const gitHubSecret = process.env.GH_CLIENT_SECRET
// const gitHubToken = process.env.GH_TOKEN
// const octo = new octokat({
// 	token: gitHubToken
// })

router.post('/webhook', (req, res, next) => {
	console.log('REQUEST: ', req, req.body)
	return res.json({ text: "Message received" })
})
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
			sessionId: '500', // use any arbitrary id - doesn't matter
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

// ask something
ask('What are SSH Keys?')
	.then(response => {
		console.log(response);
	}).catch(error => {
		console.log(error)
	});

// // get list of all intents
// getAllIntents()
// 	.then(intents => {
// 		console.log(intents);
// 	}).catch(error => {
// 		console.log(error)
// 	});

router.use(function (req, res, next) {
  const err = new Error('Not found.');
  err.status = 404;
  next(err);
})

module.exports = router
