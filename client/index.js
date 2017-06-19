import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Root from './root'
import About from './about'
import Chat from './chat'
import Chatbox from './chatbox'
import Commands from './commands'

ReactDOM.render(
  <BrowserRouter>
    <div className="site-wrapper-inner">
      <Route path="/" component={Root} />
      <Route path="/about" component={About} />
      <div>
        <Switch>
          <Route path="/chat" component={Chat} />
          <Route path="/chatbox" component={Chatbox} />
          <Route path="/commands" component={Commands} />
        </Switch>
      </div>
    </div>
  </BrowserRouter>, document.getElementById('app')
)
