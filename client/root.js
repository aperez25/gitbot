import React from 'react'
import About from './about'
import { Route, Switch, Link } from 'react-router-dom'
import Chat from './chat'
import Chatbox from './chatbox'
import Navbar from './navbar'

const Root = () => (
  <div className="container">
    <About />
  </div>
)

export default Root
