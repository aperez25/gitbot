const router = require('express').Router()
const apiai = require('apiai');
const octokat = require('octokat')
const apiaiRouter = apiai(process.env.APIAI_CLIENT_ACCESS_TOKEN)

const gitHubId = process.env.GH_CLIENT_ID
const gitHubSecret = process.env.GH_CLIENT_SECRET
const gitHubToken = process.env.GH_TOKEN
const octo = new octokat({
	token: gitHubToken
})

/*
REQUEST:  { originalRequest:
   { source: 'slack',
     data:
      { authed_users: [Object],
        event_id: 'Ev5VAFB84C',
        api_app_id: 'A5UK39MGT',
        team_id: 'T5UNPJXTN',
        event: [Object],
        type: 'event_callback',
        event_time: 1497677339,
        token: '1FidgJHI5DKFMw4K7y0auXgh' } },
  id: '81fd55d3-605c-4890-b906-59318f3f5d19',
  timestamp: '2017-06-17T05:29:00.563Z',
  lang: 'en',
  result:
   { source: 'agent',
     resolvedQuery: 'aperez25',
     speech: '',
     action: 'find_commits_by_date',
     actionIncomplete: false,
     parameters:
      { date: 'today',
        number: '',
        project: 'what was the last commit for guessing-game',
        username: 'aperez25' },
     contexts: [],
     metadata:
      { intentId: '52b876ed-7a75-4619-bc76-9d1c58ec0e6d',
        webhookUsed: 'true',
        webhookForSlotFillingUsed: 'true',
        intentName: 'Get last project commit' },
     fulfillment:
      { speech: 'Doesn\'t seem like GitHub is responding right now :(',
    messages: [Object] },
 score: 1 },
status: { code: 200, errorType: 'success' },
  sessionId: 'e16420b0-5639-4fea-94ea-3dd50207667b' }

*/

router.post('/webhook', (req, res, next) => {
	if (req.body.command === '/gitlastcommit') {
	const gitRequest = req.body.text.split(' ')
	// capture the username & reponame
	const userName = gitRequest[0]
	const repoName = gitRequest[1]
	// fetches the repo's commit history
	octo.repos(userName, repoName)
	.commits.fetch()
	//get the data we need
	.then(response => {
		const author = response.commit.author.name,
					email = response.commit.author.email
					date = new Date(response.commit.author.date),
					message = response.commit.message
					url = response.commit.url
		return `The last commit was made by ${author} on ${date}, with
		the message: ${message}. You can find more details here: ${url}`
	})
	// send a response back to slack
	.then(lastCommit => {
		return res.json({text: lastCommit})
	})
	.catch(next)
}
	else res.json({text: 'Error! Try a different command!'})
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
