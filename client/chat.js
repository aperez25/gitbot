import React from 'react'

const Chat = () => (
  <div className="col-lg-6 chat">
    <input id="speech" type="text" />
    <button id="rec" class="btn">Speak</button>
    <div id="spokenResponse" class="spoken-response" />
      <div class="spoken-response__text" />
  </div>
)

export default Chat

// <iframe
//   width="500"
//   height="600"
// src="https://console.api.ai/api-client/demo/embedded/b77433ff-768e-41ff-a8a7-24fe2a5219b8" />
