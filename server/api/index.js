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

router

.post('/gitlastcommit', (req, res, next) => {
	console.log('~~~~~~HERE IS THE BODY ~~~~~: ', req.body)
	const slackChannel = req.body.channel_id
	const gitRequest = req.body.text.split(' ')
	// capture the username & reponame
	const userName = gitRequest[0]
	const repoName = gitRequest[1]
	// fetches the repo's commit history
	octo.repos(userName, repoName)
	.commits.fetch({"sha": "master"})
	//get the data we need
	.then(response => {
		console.log(response)
		const commit = response.items[0].commit
		const author = commit.author.name,
					email = commit.author.email
					date = new Date(commit.author.date)
					unixDate = date.getTime(),
					message = commit.message
					//link if broken
					url = response.items[0].htmlUrl
		const lastCommit = `<${url}|The last commit> was made by ${author} on <!date^${unixDate}^{date} at {time}|${date}>, with the message: '${message}'.`
		return res.send({text: lastCommit, channel: slackChannel, response_type: 'in_channel' })
	})
	.catch(next)
})

.post('/gitbranches', (req, res, next) => {
	const slackChannel = req.body.channel_id
	// if (req.body.command === '/gitlastcommit') {
	const gitRequest = req.body.text.split(' ')
	// capture the username & reponame
	const userName = gitRequest[0]
	const repoName = gitRequest[1]
	// fetches the repo's commit history
	octo.repos(userName, repoName)
	.git.refs.fetch()
	//get the data we need
	.then(response => {
		// console.log(response)
		// order the references
		const refs = response.items.filter(item => {
			if (item.ref.startsWith('refs/heads'))
			itemName = item.ref.split('/')[3]
			return `<${item.url}|${itemName}>`})
		const listOfRefs = `Here is a list of ${repoName}\'s current branches:\n' + refs.join('\n')`
	// send a response back to slack
		res.send({text: listOfRefs, channel: slackChannel, response_type: 'in_channel'})
	})
	.catch(next)
})

.post('/repos', (req, res, next) => {
	const slackChannel = req.body.channel_id,
	repoRequest = req.body.text.split(', '),
	gitHubSearch = repoRequest[0],
	searchLanguage = repoRequest[1] || '',
	searchTopics = repoRequest.slice(2).join(' ') || ''

	octo.search.repositories.fetch({
		q: gitHubSearch,
		language: searchLanguage,
		topic: searchTopics
	})
	.then(res => {
		const itemResults = []
		for (var i = 1; i <= 5; i++) {
			const item = ({
				description: res.items[i].description,
				// homepage: res.items[i].homepage,
				htmlUrl: res.items[i].htmlUrl,
				forks: res.items[i].forks,
				language: res.items[i].language,
				lastUpdated: res.items[i].updatedAt
			})
			itemResults.push(`${i}. <${item.htmlUrl}|${item.description}> has ${item.forks} forks and is written in ${language}. Last updated: ${new Date(item.lastUpdated)}`)
		}

		const searchText = `For your search on ${req.body.text}, there are ${res.totalCount} results. The first five are:\n + ${itemResults.join('\n')}\n<${res.url}|Search through all results here.>`
		// response back to Slack
		res.send({text: searchText, channel: slackChannel, response_type: 'in_channel'})
	})
	.catch(next)
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

// function ask(text, options) {
// 	return new Promise((resolve, reject) => {
// 		var defaultOptions = {
// 			sessionId: '500', // use any arbitrary id - doesn't matter
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

// // function getAllIntents(options) {
// // 	return new Promise((resolve, reject) => {
// // 		let request = apiaiRouter.intentGetRequest(options);
// // 		request.on('response', (response) => {
// // 			return resolve(response);
// // 		});
// // 		request.on('error', (error) => {
// // 			return reject(error);
// // 		});
// // 		request.end();
// // 	})
// // }

// // ask something
// ask('What are SSH Keys?')
// 	.then(response => {
// 		console.log(response);
// 	}).catch(error => {
// 		console.log(error)
// 	});

// // // get list of all intents
// // getAllIntents()
// // 	.then(intents => {
// // 		console.log(intents);
// // 	}).catch(error => {
// // 		console.log(error)
// // 	});

// router.use(function (req, res, next) {
//   const err = new Error('Not found.');
//   err.status = 404;
//   next(err);
// })

module.exports = router
