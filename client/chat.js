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

  handleSubmit (e) {
      e.preventDefault()
      axios.post('/api/apiai', {question: e.target.question.value})
      .then(res => {
      this.setState({response: res.data})})
      // .then(user => dispatch(create(user)))
      .catch(err => console.error(`No answer from Api.ai`, err))
  }
  render() {
    return (
      <div className="col-lg-12 chat">
        <form onSubmit={this.handleSubmit}>
          <textarea className="form-control" id="textbox" type="question" name="question" required />
          <br />
          <button type="submit" className="btn btn-primary btn-block"><i className="fa fa-cogs" aria-hidden="true"></i>Chat with GitBot</button>
        </form>
        <div id="spokenResponse" className="spoken-response" />
        <div className="spoken-response__text" />
      <div id="gitbotresponse">
      {this.state.response ? <p className="lead"><Markdown source={this.state.response} /></p> : null}
      </div>
      <p> Prefer to chat with GitBot in realtime? <Link to='/chatbox'>Click here!</Link></p>
      </div>
    )
  }
}
