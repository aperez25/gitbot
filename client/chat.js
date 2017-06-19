import React from 'react'
import { connect } from 'react-redux';
import axios from 'axios'
import {Link} from 'react-router-dom'

class Chat extends React.Component {
  render() {
    return (
      <div className="col-lg-12 chat">
        <form onSubmit={e => {
          e.preventDefault()
          gitBotRequest(e.target.question.value)
        }}>
          <textarea className="form-control" id="textbox" type="question" name="question" required />
          <br />
          <button type="submit" className="btn btn-primary btn-block"><i className="fa fa-cogs" aria-hidden="true"></i>Chat with GitBot</button>
        </form>
        <div id="spokenResponse" className="spoken-response" />
        <div className="spoken-response__text" />
      <div>
      <p> Prefer to chat with GitBot in realtime? <Link to='/chatbox'>Click here!</Link></p>
      </div>
      </div>
    )
  }
}

const gitBotRequest = (question) => {
    axios.post('/api/apiai', {question})
    .then(res => console.log(res.data))
    // .then(user => dispatch(create(user)))
    // .then(() => browserHistory.push('/products'))
    .catch(err => console.error(`Creating new account unsuccesful`, err))
}

export default Chat
// export default connect(null, mapDispatch)(Chat)
// <Link to='/Chatbox'>Prefer realtime chat? Click here!</Link>


