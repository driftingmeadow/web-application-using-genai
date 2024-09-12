import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  // State variables to manage input and messages
  const [input, setInput] = useState(""); // Stores the current input from the user
  const [messages, setMessages] = useState([]); // Stores all the messages in the conversation

  // Function to handle sending messages
  const handleSend = async () => {
    if (input.trim() !== "") {
      try {
        // Add user message to messages
        setMessages([...messages, { text: input, sender: 'User' }]);
        
        // Call the ChatGPT API
        const response = await axios.post('https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-3.5-turbo", // Replace with "gpt-4" if you have access to GPT-4
          messages: [{ role: "user", content: input }],
        }, 
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`, // API key
            'Content-Type': 'application/json'
          }
        });

        // Extract the bot's response
        const botResponse = response.data.choices[0].message.content;

        // Add chatbot response to messages
        setMessages(prevMessages => [...prevMessages, { text: botResponse, sender: 'Bot' }]);

        // Clear the input box
        setInput("");
      } catch (error) {
        console.error("Error calling the API:", error);
      }
    }
  };

  return (
    <div className="App">
      <div className="chat-box">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <input 
        type="text" 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="Type your message here..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default App;