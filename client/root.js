import React from 'react'
import About from './about'
import Chat from './chat'
import Chatbox from './chatbox'
import Slack from './slackbutton'

const Root = () => (
  <div className="row">
    <About />
    <Chat />
    <Slack />
  </div>
)

export default Root
