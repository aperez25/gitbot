import React from 'react'
import {Link} from 'react-router-dom'

const Toggle = () => {
  return (
    <div className="mastfoot">
    <div class="inner">
      <p> Prefer to chat with GitBot in realtime? <Link to='/chat'>Click here!</Link></p>
    </div>
    </div>
  )
}

export default Toggle
