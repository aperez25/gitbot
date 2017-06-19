const router = require('express').Router()
const octokat = require('octokat')
const moment = require('moment')
const Promise = require("bluebird")
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
	repoName = gitRequest[1]
	let branches = []
	// fetches the repo's commit history
	repo = octo.repos(userName, repoName)

	repo.git.refs.fetch()
	//get the data we need
	.then(response => {
		// order the references
		return response.items.filter(item => {
			if (item.ref.startsWith('refs/heads')) {
				return item
			}
		})
	})
	.then(filteredBranches =>{
		filteredBranches.forEach(b => {
			repo.commit.fetch(b.sha) //was searching commits not commit :O
			.then(object => {
					const formattedBranch = {name: b.name, url: object.html_url}
					branches.push(`<${formattedBranch.url}|${formattedBranch.name}>`)
			})
		})
	})
	.then(filteredBranches => {
				// branches = filteredBranches.map(branch => {
				// 	const branchRef = branch.ref.split('/'),
				// 	branchName = branchRef[3] ? branchRef[3] : branchRef[2]
				// 	// branches.push({name: branchName, sha: branch.sha})
				// 	return branchName
				// })
		branchList = `Here is a list of ${repoName}\'s current branches:\n`
	// send a response back to slack
		res.send({text: branchList,
			attachments: [{
				color: '#02B0D8',
				text: `${branches.join('\n')}`,
				mrkdwn_in: 'text'
      }],
		channel: slackChannel, response_type: 'in_channel'})
	})
	.catch(next)
})

.post('/searchrepos', (req, res, next) => {
	const slackChannel = req.body.channel_id,
	repoRequest = req.body.text.split(', '),
	gitHubSearch = repoRequest[0],
	searchLanguage = repoRequest[1] || '',

	searchTopic = repoRequest[2] || ''

	let gitHubSearchURL = ''

	if (searchTopic !== '')
  	gitHubSearchURL = `https://github.com/search?utf8=%E2%9C%93&type=Repositories&q=${gitHubSearch}+${encodeURI('topic:', searchTopic)}&l=${searchLanguage}`
	else
		gitHubSearchURL = `https://github.com/search?utf8=%E2%9C%93&type=Repositories&q=${gitHubSearch}&l=${searchLanguage}`
	// get gitHub results - NEED TO SORT BY BEST MATCH
	octo.search.repositories.fetch({
		q: `${gitHubSearch}+language:${searchLanguage}`,
		topic: searchTopic,
		order: 'desc'
	})
	.then(searchResults => {
		const searchItems = []
		for (var i = 0; i <= 4; i++) {
			const item = ({
				fullName: searchResults.items[i].fullName,
				htmlUrl: searchResults.items[i].htmlUrl,
				forks: searchResults.items[i].forks,
				language: searchResults.items[i].language,
				lastUpdated: new Date(searchResults.items[i].updatedAt),
				unixDate: new Date(searchResults.items[i].updatedAt).getTime() / 1000
			})
			searchItems.push(`${i+1}. <${item.htmlUrl}|${item.fullName}>: ${item.forks} forks,  language: ${item.language}, last updated: <!date^${item.unixDate}^{date_short_pretty}|${item.lastUpdated}>`)
		}

		const searchText = `Here are the first five results for your search *${req.body.text}*:`
		// response back to Slack
		res.send({
			text: searchText,
			attachments: [{
					color: '#02B0D8',
					text: `${searchItems.join('\n')}\n<${gitHubSearchURL}|Search through all results here.>`,
					mrkdwn_in: 'text'
      }],
			channel: slackChannel, response_type: 'in_channel'})
	})
	.catch(next)
})

.post('/popular', (req, res, next) => {
	const slackChannel = req.body.channel_id,
	last7 = moment().subtract(7, 'days').format("YYYY-MM-DD")
	let gitHubSearchURL = `https://github.com/search?utf8=%E2%9C%93&type=Repositories&q=created:${last7}`

	octo.search.repositories.fetch({
		q: `created:${last7}`,
		sort: 'stars',
		order: 'desc'
	})
	.then(searchResults => {
		const searchItems = []
		for (var i = 0; i <= 4; i++) {
			const item = ({
				fullName: searchResults.items[i].fullName,
				htmlUrl: searchResults.items[i].htmlUrl,
				description: searchResults.items[i].description,
				language: searchResults.items[i].language,
				stars: searchResults.items[i].stargazersCount,
			})
			searchItems.push(`${i+1}. <${item.htmlUrl}|${item.fullName}>: *${item.stars}* stars, language: ${item.language},\n_${item.description}_`)
		}

		const searchText = `The five most popular projects in the last week are:\n>`
		// response back to Slack
		res.send({
			text: searchText,
			attachments: [{
					color: '#02B0D8',
					text: `${searchItems.join('\n')}\n<${gitHubSearchURL}|Search through all results here.>`,
					mrkdwn_in: 'text'
      }],
			channel: slackChannel, response_type: 'in_channel'})
	})
	.catch(next)
})

module.exports = router
