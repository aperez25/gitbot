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

.post('/commit', (req, res, next) => {
	const slackChannel = req.body.channel_id,
	gitRequest = req.body.text.split(' '),
	userName = gitRequest[0],
	repoName = gitRequest[1]

	octo.repos(userName, repoName)
	.commits.fetch({"sha": "master"})
	.then(response => {
		const commit = response.items[0].commit,
			author = commit.author.name,
			date = new Date(commit.author.date),
			unixDate = date.getTime() / 1000,
			message = commit.message,
			url = response.items[0].htmlUrl

		const lastCommit = `<${url}|The last commit> was made <!date^${unixDate}^{date_short_pretty} at {time}|${date}>, by ${author}: "${message}".`

		return res.send({text: lastCommit, channel: slackChannel, response_type: 'in_channel' })
	})
	.catch(next)
})

.post('/branches', (req, res, next) => {
	const slackChannel = req.body.channel_id,
	gitRequest = req.body.text.split(' '),
	userName = gitRequest[0],
	repoName = gitRequest[1]
	let branches = []

	octo.repos(userName, repoName).git.refs.fetch()
	.then(response => {
		return response.items.filter(item => {
			if (item.ref.startsWith('refs/heads')) {
				return item
			}
		})
	})
	.then(filteredBranches => {
		branches = filteredBranches.map(branch => {
			const branchRef = branch.ref.split('/'),
			branchName = branchRef[3] ? branchRef[3] : branchRef[2]
			return branchName
		})

		res.send({text: `Here is a list of ${repoName}\'s current branches:\n`,
			attachments: [{
				color: '#02B0D8',
				text: `${branches.join('\n')}`,
				mrkdwn_in: ['text']
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

		res.send({
			text: `Here are the first five results for your search *${req.body.text}*:`,
			attachments: [{
					color: '#02B0D8',
					text: `${searchItems.join('\n')}\n<${gitHubSearchURL}|See all results here>`,
					mrkdwn_in: ['text']
      }],
			channel: slackChannel, response_type: 'in_channel'})
	})
	.catch(next)
})

.post('/popular', (req, res, next) => {
	const slackChannel = req.body.channel_id,
	last7Days = moment().subtract(7, 'days').format("YYYY-MM-DD")
	let gitHubSearchURL = `https://github.com/search?utf8=%E2%9C%93&type=Repositories&q=created:${last7Days}`

	octo.search.repositories.fetch({
		q: `created:${last7Days}`,
		sort: 'stars',
		order: 'desc'
	})
	.then(searchResults => {
		const searchItems = []
		for (var i = 0; i <= 4; i++) {
			const item = ({
				name: searchResults.items[i].fullName,
				url: searchResults.items[i].htmlUrl,
				description: searchResults.items[i].description,
				language: searchResults.items[i].language,
				stars: searchResults.items[i].stargazersCount,
			})
			searchItems.push(`${i+1}. <${item.url}|${item.name}>: *${item.stars}* stars, language: ${item.language}\n_${item.description}_`)
		}

		res.send({
			text: `The five most popular projects in the last week are:\n>`,
			attachments: [{
					color: '#02B0D8',
					text: `${searchItems.join('\n')}\n<${gitHubSearchURL}|See all results here>`,
					mrkdwn_in: ['text']
      }],
			channel: slackChannel, response_type: 'in_channel'})
	})
	.catch(next)
})

module.exports = router
