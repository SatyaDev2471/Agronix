import React, { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend, FiCpu } from 'react-icons/fi';
import api from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import styles from './FloatingChatbot.module.css';

const formatMessage = (text) => {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (!line.trim()) return <br key={i} />;
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={i} style={{ margin: '0 0 0.5rem 0' }}>
        {parts.map((part, index) =>
          index % 2 === 1 ? <strong key={index}>{part}</strong> : part
        )}
      </p>
    );
  });
};

const FloatingChatbot = () => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hello! I am Agronix AI. How can I assist you with your farm today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    const newMsg = { id: Date.now(), type: 'user', text: userMsg };
    
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/ai/chat', {
        message: userMsg,
        language: language
      });
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        text: response.data.message
      }]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg = error.response?.data?.error || error.message;
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        text: `**Connection Error**: ${errorMsg}. Please try again.`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.chatbotContainer}>
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div className={styles.headerInfo}>
              <div className={styles.botIcon}>
                <FiCpu size={18} />
              </div>
              <div>
                <h4 className={styles.botName}>Agronix AI</h4>
                <span className={styles.statusText}>Online</span>
              </div>
            </div>
            <button onClick={toggleChat} className={styles.closeBtn}><FiX size={20} /></button>
          </div>
          
          <div className={styles.chatBody}>
            {messages.map(msg => (
              <div key={msg.id} className={`${styles.messageWrapper} ${msg.type === 'user' ? styles.userMsg : styles.botMsg}`}>
                <div className={styles.messageBubble}>
                  {formatMessage(msg.text)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.messageWrapper} ${styles.botMsg}`}>
                <div className={styles.messageBubble} style={{ fontStyle: 'italic', opacity: 0.7 }}>
                  Typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSend} className={styles.chatInputContainer}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your farm..."
              className={styles.chatInput}
              disabled={isLoading}
            />
            <button type="submit" className={styles.sendBtn} disabled={!input.trim() || isLoading}>
              <FiSend size={18} />
            </button>
          </form>
        </div>
      )}
      
      <button className={styles.toggleBtn} onClick={toggleChat}>
        {isOpen ? <FiX size={24} /> : <FiMessageSquare size={24} />}
      </button>
    </div>
  );
};

export default FloatingChatbot;
