import React from 'react'
import { connect } from 'react-redux';
import axios from 'axios'
import {Link} from 'react-router-dom'
import Markdown from 'react-markdown'

export default class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        response: null
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (event) {
    event.preventDefault()
    axios.post('/api/apiai', {question: event.target.question.value})
    .then(res => this.setState({response: res.data}))
    .catch(err => console.error('There was an error: ', err))
  }

  render() {
    return (
      <div className="chat">
        <form onSubmit={this.handleSubmit}>
          <textarea className="form-control" id="textbox" type="question" name="question" required />
          <br />
          <button type="submit" className="btn btn-primary btn-block">Chat with GitBot</button>
        </form>
        <div id="spokenResponse" className="spoken-response" />
        <div className="spoken-response__text" />
        <div id="gitbotresponse">
          { this.state.response ?
            <p className="lead"><Markdown source={this.state.response} /></p>
            : null }
        </div>
        <p> Prefer to chat with GitBot in realtime? <Link to='/chatbox'>Click here!</Link></p>
      </div>
    )
  }
}
