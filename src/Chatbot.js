import { useState, useContext } from 'react';
import axios from 'axios';
import { Button } from '@chatscope/chat-ui-kit-react';
import { AuthContext } from './Login/AuthContext';
import './Chatbot.css';

function Chatbot() {
  const { isAuthenticated, isUSP, logout } = useContext(AuthContext);

  if (isUSP && !isAuthenticated) {
    logout(); // If someone left 2FA in between.
  }

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isBotReplying, setIsBotReplying] = useState(false); // State to track if bot is replying

  async function generateAnswer() {
    if (!question.trim()) return; // Prevent empty submissions

    const userMessage = { text: question, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setQuestion("");
    setIsBotReplying(true); // Set bot replying state to true

    try {
      const response = await axios({
        url:
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" +
          process.env.REACT_APP_GEMINI, // Replace with the actual API URL
        method: "POST",
        data: {
          contents: [
            {
              parts: [{ text: question }],
            },
          ],
        },
      });

      const botMessage = {
        text: response.data.candidates[0].content.parts[0].text,
        sender: "bot",
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      const botMessage = { text: "Error in fetching response", sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } finally {
      setIsBotReplying(false); // Reset bot replying state
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default behavior (adding a new line)
      generateAnswer();
    }
  };

  return (
    <div className="BeyondApp">
      <div className="App">
        <h1>Gemini Support</h1>
        <div className="chat-container">
          <div className="chat-box">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}

            {/* Display "Replying..." message from bot while generating a response */}
            {isBotReplying && (
              <div className="message bot">
                Replying...
              </div>
            )}
          </div>

          <div className="input-area">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown} // Listen for Enter key press
              placeholder="Ask anything..."
              disabled={isBotReplying} // Disable input while bot is replying
            />
            <Button onClick={generateAnswer} disabled={isBotReplying}>
              {isBotReplying ? "Replying..." : "Send"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
