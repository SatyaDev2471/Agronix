import React, { useState, useRef, useEffect } from 'react';
import styles from './AIAssistant.module.css';
import { useLanguage } from '../../contexts/LanguageContext';
import axios from 'axios';

const formatMessage = (text) => {
  // Simple markdown parser for **bold** and newlines
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (!line.trim()) return <br key={i} />;

    // Split by ** for bold
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <p key={i}>
        {parts.map((part, index) =>
          index % 2 === 1 ? <strong key={index}>{part}</strong> : part
        )}
      </p>
    );
  });
};

const AIAssistant = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: t('welcome') || "Hello! I am Agronix AI. I am constantly monitoring your farm's soil sensors and live market prices. How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/ai/chat', {
        message: userMsg,
        language: language // Pass the current language context to the RAG backend
      });

      setMessages(prev => [...prev, { role: 'ai', text: response.data.message }]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg = error.response?.data?.error || error.message;
      setMessages(prev => [...prev, {
        role: 'ai',
        text: `**Connection Error**: ${errorMsg}. Please try again.`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t('nav.ai_assistant') || 'AI Assistant'}</h2>
        <p className={styles.subtitle}>
          {'Powered by real-time RAG (Retrieval-Augmented Generation) on your farm and market data.'}
        </p>
      </div>

      <div className={styles.chatContainer}>
        <div className={styles.messagesArea}>
          {messages.map((msg, index) => (
            <div key={index} className={`${styles.messageWrapper} ${styles[msg.role]}`}>
              <div className={styles.messageBubble}>
                {formatMessage(msg.text)}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className={`${styles.messageWrapper} ${styles.ai}`}>
              <div className={styles.messageBubble}>
                <div className={styles.typingIndicator}>
                  <div className={styles.dot}></div>
                  <div className={styles.dot}></div>
                  <div className={styles.dot}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className={styles.inputArea} onSubmit={handleSend}>
          <input
            type="text"
            className={styles.inputField}
            placeholder={"Ask me about your soil health or when to sell your crops..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button type="submit" className={styles.sendBtn} disabled={!input.trim() || isLoading}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;
