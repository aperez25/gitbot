import React from 'react'
import { connect } from 'react-redux';
import axios from 'axios'
import {Link} from 'react-router'
import Chatbox from './chatbox'

class Chat extends React.Component {
  render() {
    return (
      <div className="col-lg-12 chat">
        <form onSubmit={e => {
          e.preventDefault()
          gitBotRequest(e.target.question.value)
        }}>
          <textarea id="textbox" type="question" name="question" required rows="3" cols="50"/>
          <br />
          <button type="submit" className="btn btn-primary">Speak</button>
        </form>
        <div id="spokenResponse" className="spoken-response" />
        <div className="spoken-response__text" />
      <div>
      { }
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


