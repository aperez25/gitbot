import React from 'react'
import About from './about'
import { Route, Switch, Link } from 'react-router-dom'
import Chat from './chat'
import Chatbox from './chatbox'

const Root = () => (
  <div className="container">
    <About />
    <p className="lead"> <Link to='/chatbox'>Chat in realtime with GitBot</Link> for simple Q&A<p> <Link to="/chat">Exchange messages with GitBot</Link> for workflow questions like "How do I create a new project?"</p><Link to="/commands">Use GitBot commands</Link> to see what's happening on GitHub</p>
  </div>
)

export default Root
