import React from 'react'

const About = () => (
    <div className="col-lg-6">
      <h1 className="header">Hi, I'm GitBot!</h1>
        <h2> Chat or talk with me about Git and GitHub</h2>
        <p>Here are some things I can do:</p>
        <ul>
          <li>Answer your questions</li>
          <li>Help you with Git and GitHub workflows</li>
          <li>Chat with you...I get lonely :(</li>
        </ul>
        <p> Add me to your Slack channel...I'm a lot more fun there!</p>
        <a href="https://slack.com/oauth/authorize?scope=incoming-webhook,commands,bot&client_id=198771643940.198649327571"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>
    </div>
  )

export default About

/*
<a href="https://slack.com/oauth/authorize?scope=incoming-webhook,commands,bot&client_id=198771643940.198649327571"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>

*/
