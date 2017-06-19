'use strict'

import React from 'react'
import {Link} from 'react-router-dom'

const Chatbox = () => (
  <div>
    <iframe
    width='500'
    height='600'
    src='https://console.api.ai/api-client/demo/embedded/b77433ff-768e-41ff-a8a7-24fe2a5219b8' />
    <p> Prefer seeing formatted text? <Link to='/chat'>Click here!</Link></p>
  </div>
)
export default Chatbox
