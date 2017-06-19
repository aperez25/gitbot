import React from 'react'
import About from './about'
import { Route, Switch, Link } from 'react-router-dom'
import Chat from './chat'
import Chatbox from './chatbox'

const Root = () => (
  <div className="container">
    <About />
    <p className="lead"> Let's get started! Would you like to <Link to='/chatbox'>chat in realtime</Link> or <Link to="/chat">see formatted text?</Link> You can toggle at any time!</p>
  </div>
)

export default Root
