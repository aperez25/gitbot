import React from 'react'
import { connect } from 'react-redux';

class Chat extends React.Component {
  render() {
    return (
      <div className="col-lg-6 chat">
      <form onSubmit={e => {
        e.preventDefault()
        console.log(e.target.question.value)
        return e.target.question.value
      }}>
        <input type="question" name="question" required />
        <button type="submit" className="btn btn-primary">Speak</button>
      </form>
      <div id="spokenResponse" className="spoken-response" />
      <div className="spoken-response__text" />
      </div>
    )
  }

}

export default Chat
// export default connect(null, mapDispatch)(Chat)

// <iframe
//   width="500"
//   height="600"
// src="https://console.api.ai/api-client/demo/embedded/b77433ff-768e-41ff-a8a7-24fe2a5219b8" />
