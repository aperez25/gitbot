const router = require('express').Router()
const octokat = require('octokat')
const moment = require('moment')
const Promise = require('bluebird')
const format = require ('./formatter')
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
	user = format.user(req)
	// fetches the repo's commit history
	octo.repos(user.name, user.repo)
	.commits.fetch({"sha": "master"})
	// format and send the response back
	.then(response => {
		const commit = format.commit(response)
		return res.send({text: commit, channel: slackChannel, response_type: 'in_channel' })
	})
	.catch(next)
})

.post('/gitbranches', (req, res, next) => {
	const slackChannel = req.body.channel_id,
	user = format.user(req)
	let branches = []
	// fetches the repo's commit history
	repo = octo.repos(user.name, user.repo)
	repo.git.refs.fetch()
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
			repo.commits(b.sha).fetch() //this path is not working
			.then(object => {
				const formattedBranch = {name: b.name, url: object.html_url}
				branches.push(`<${formattedBranch.url}|${formattedBranch.name}>`)
				console.log(branches)
			})
		})
	})
	// .then(filteredBranches => {
	// 	branches = filteredBranches.map(branch => {
	// 		const branchRef = branch.ref.split('/'),
	// 		branchName = branchRef[3] ? branchRef[3] : branchRef[2]
	// 		// branches.push({name: branchName, sha: branch.sha})
	// 		return branchName
	// 	})
	// 	branchList = `Here is a list of ${repoName}\'s current branches:\n`
	// // send a response back to slack
	// 	res.send({text: branchList,
	// 		attachments: [{
	// 			color: '#02B0D8',
	// 			text: `${branches.join('\n')}`,
	// 			mrkdwn_in: ['text']
  //     }],
	// 	channel: slackChannel, response_type: 'in_channel'})
	// })
	.catch(next)
})

.post('/searchrepos', (req, res, next) => {
	const slackChannel = req.body.channel_id,
  request = array.body.text.split(', '),
	gitHubSearch = request[0],
	searchLanguage = request[1] || '',
	searchTopic = request[2] || ''
	gitURL = format.URL(gitHubSearch, searchLanguage, searchTopic)

	octo.search.repositories.fetch({
		q: `${gitHubSearch}+language:${searchLanguage}`,
		topic: searchTopic,
		order: 'desc'
	})
	.then(searchResults => {
		const resultsList = format.search(searchResults)
		const searchText = `Here are the first five results for your search *${req.body.text}*:`
		// response back to Slack
		res.send({
			text: searchText,
			attachments: [{
					color: '#02B0D8',
					text: `${resultsList}\n<${gitURL}|See all results here>`,
					mrkdwn_in: ['text']
      }],
			channel: slackChannel,
			response_type: 'in_channel'})
	})
	.catch(next)
})

.get('/popular', (req, res, next) => {
	const slackChannel = req.body.channel_id,
	last7 = moment().subtract(7, 'days').format("YYYY-MM-DD")

	octo.search.repositories.fetch({
		q: `created:${last7}`,
		sort: 'stars',
		order: 'desc'
	})
	.then(searchResults => {
		const popularList = format.popular(searchResults),
		gitHubSearchURL = `https://github.com/search?utf8=%E2%9C%93&type=Repositories&q=created:${last7}`
		// response back to Slack
		res.send({
			text: `The five most popular projects in the last week are:\n>`,
			attachments: [{
					color: '#02B0D8',
					text: `${popularList}\n<${gitHubSearchURL}|See all results here>`,
					mrkdwn_in: ['text']
      }],
			channel: slackChannel, response_type: 'in_channel'})
	})
	.catch(next)
})

module.exports = router
