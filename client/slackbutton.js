import React from 'react'

const Slack = () => {
  return (
    <div>
      <p> Add me to your Slack channel...I'm a lot more fun there!</p>
      <a href="https://slack.com/oauth/authorize?scope=incoming-webhook,commands,bot&client_id=198771643940.198649327571"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>
    </div>
  )
}

export default Slack
