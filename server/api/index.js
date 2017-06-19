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

.post('/gitcommit', (req, res, next) => {
	const slackChannel = req.body.channel_id,
	// capture the username & reponame
	gitRequest = req.body.text.split(' '),
	userName = gitRequest[0],
	repoName = gitRequest[1]
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
					unixDate = date.getTime() / 1000,
					message = commit.message
					//link if broken
					url = response.items[0].htmlUrl
		const lastCommit = `<${url}|The last commit> was made <!date^${unixDate}^{date_short_pretty} at {time}|${date}>, by ${author}: "${message}".`
		return res.send({text: lastCommit, channel: slackChannel, response_type: 'in_channel' })
	})
	.catch(next)
})

.post('/gitbranches', (req, res, next) => {
	const slackChannel = req.body.channel_id,
	// if (req.body.command === '/gitlastcommit') {
	gitRequest = req.body.text.split(' '),
	// capture the username & reponame
	userName = gitRequest[0],
	repoName = gitRequest[1],
	branches = [],
	// fetches the repo's commit history
	repo = octo.repos(userName, repoName)
	repo.git.refs.fetch()
	//get the data we need
	.then(response => {
		// order the references
		return response.items.filter(item => {
			if (item.ref.startsWith('refs/heads')) {
				const itemRef = item.ref.split('/'),
				itemName = itemRef[3] ? itemRef[3] : itemRef[2]
				branches.push({name: itemName, sha: item.sha, url: ''})
				return item
			}
		})
	}).then(filteredItems => {
		filteredItems.forEach(item => {
			repo.commits.fetch(item.sha)
			.then(object => {
				index = branches.indexOf(object.sha)
				branches[index].url = object.html_url
			})
			.catch(next)
			return branches.map(branch =>
			`<${branch.url}|${branch.name}>`)
		})
	})
	.then(branchURLs => {
		console.log(branchURLs)
		branchList = `Here is a list of ${repoName}\'s current branches:\n${branchURLs.join('\n')}`
	// send a response back to slack
		res.send({text: branchList, channel: slackChannel, response_type: 'in_channel'})
	})
	.catch(next)

})

.post('/searchrepos', (req, res, next) => {
	const slackChannel = req.body.channel_id,
	repoRequest = req.body.text.split(', '),
	gitHubSearch = repoRequest[0],
	searchLanguage = repoRequest[1] || '',
	searchTopics = repoRequest.slice(2).join(' ') || null
	console.log(searchLanguage)
	let gitHubSearchURL = ''

	if (searchTopics)
  	gitHubSearchURL = `https://github.com/search?utf8=%E2%9C%93&type=Repositories&q=${gitHubSearch}+${encodeURI('topic:', searchTopics)}&l=${searchLanguage}`
	else
		gitHubSearchURL = `https://github.com/search?utf8=%E2%9C%93&type=Repositories&q=${gitHubSearch}&l=${searchLanguage}`
	// get gitHub results
	octo.search.repositories.fetch({
		q: `${gitHubSearch}+language:${searchLanguage}`,
		topic: searchTopics
	})
	.then(searchResults => {
		const searchItems = []
		for (var i = 1; i <= 5; i++) {
			const item = ({
				fullName: searchResults.items[i].fullName,
				// homepage: searchResults.items[i].homepage,
				htmlUrl: searchResults.items[i].htmlUrl,
				forks: searchResults.items[i].forks,
				language: searchResults.items[i].language,
				lastUpdated: new Date(searchResults.items[i].updatedAt),
				unixDate: new Date(searchResults.items[i].updatedAt).getTime() / 1000
			})
			searchItems.push(`${i}. <${item.htmlUrl}|${item.fullName}>: ${item.forks} forks,  language: ${item.language}, last updated: <!date^${item.unixDate}^{date_short_pretty}|${item.lastUpdated}>`)
		}

		const searchText = `Here are the first five results for your search *${req.body.text}*:\n${searchItems.join('\n')}\n<${gitHubSearchURL}|Search through all results here.>`
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
