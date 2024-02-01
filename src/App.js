import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001', { transports : ['websocket'] });

function App() {
  const [messages, setMessages] = useState([]);
  const [prevMessage, setPrevMessage] = useState(0);
  const [percent, setPercent] = useState('');
  const [isBreakSocketMessage, setBreakSocketMessage] = useState(false);

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setPrevMessage(msg);
      if(isBreakSocketMessage) {
        let newMsg = msg;
        if(!!+percent) {
          if(prevMessage > msg) {
            newMsg = msg - msg * (+percent / 100);
          } else {
            newMsg = msg + msg * (+percent / 100);
          }
        }
        setMessages([{old: msg, new: newMsg}, ...messages, ]);
      } else {
        setMessages([{old: msg, new: msg}, ...messages]);
      }
    });
  }, [isBreakSocketMessage, messages]);

  const onBreakSocketMessage = (value) => {
    setBreakSocketMessage(value)
  }

  return (
    <div>
      <div>
        <input
          type="text"
          name="percent"
          value={percent}
          onChange={(e) => setPercent(e.target.value)}
        />
        <button onClick={() => onBreakSocketMessage(true)}>
          Break
        </button>
        <button onClick={() => onBreakSocketMessage(false)}>
          Connect
        </button>
      </div>
      <br />
      <ul>
        {messages.map((item, index) => (
          <li key={index}>{item.old} ----- {item.new}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
