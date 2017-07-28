import React from 'react'
import { Link } from 'react-router-dom'

const About = () => (
    <div className="inner cover">
      <img src="https://cdn-images-1.medium.com/max/600/1*Lp2rS78GlhA-a4B81wlHfw.png" className="img-circle"/>
      <h1 className="cover-heading"> Ask me your questions about <a href="https://git-scm.com/" target="_blank">Git</a> & <a href="https://github.com" target="_blank">GitHub</a>:</h1>
      <p className="lead">
        <ul>
        <li><Link to='/chatbox'>Chat in realtime with GitBot</Link> for simple Q&A</li>
        <li id="chatmarkdown"><Link to="/chat">Exchange messages with GitBot</Link> for workflow questions like "How do I create a new project?"</li>
        <li id="commands"><Link to="/commands">Preview the Slack commands</Link> with some cool gifs</li>
        </ul>
      </p>
    </div>
  )

export default About
