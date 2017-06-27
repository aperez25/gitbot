export const commitFormatter = (array) => {
  const commit = array.items[0].commit,
    author = commit.author.name,
    email = commit.author.email
    date = new Date(commit.author.date)
    unixDate = date.getTime() / 1000,
    message = commit.message,
    url = array.items[0].htmlUrl

  return `<${url}|The last commit> was made <!date^${unixDate}^{date_short_pretty} at {time}|${date}>, by ${author}: "${message}".`
}

export const URLFormatter = (search, lang, topic) => {

	if (topic !== '')
  	return `https://github.com/search?utf8=%E2%9C%93&type=Repositories&q=${search}+${encodeURI('topic:', topic)}&l=${lang}`
	else
		return `https://github.com/search?utf8=%E2%9C%93&type=Repositories&q=${search}&l=${lang}`
}

export const searchFormatter = array => {
  const searchItems = []
  for (var i = 0; i <= 4; i++) {
    const item = ({
      fullName: array.items[i].fullName,
      htmlUrl: array.items[i].htmlUrl,
      forks: array.items[i].forks,
      language: array.items[i].language,
      lastUpdated: new Date(array.items[i].updatedAt),
      unixDate: new Date(array.items[i].updatedAt).getTime() / 1000
    })
    searchItems.push(`${i+1}. <${item.htmlUrl}|${item.fullName}>: ${item.forks} forks,  language: ${item.language}, last updated: <!date^${item.unixDate}^{date_short_pretty}|${item.lastUpdated}>`)
  }
  return searchItems.join('\n')
}

export const popularFormatter = array => {
  const searchItems = []
  for (var i = 0; i <= 4; i++) {
    const item = ({
      fullName: array.items[i].fullName,
      htmlUrl: array.items[i].htmlUrl,
      description: array.items[i].description,
      language: array.items[i].language,
      stars: array.items[i].stargazersCount,
    })
    searchItems.push(`${i+1}. <${item.htmlUrl}|${item.fullName}>: *${item.stars}* stars, language: ${item.language}\n_${item.description}_`)
  }
  return searchItems.join('\n')
}
