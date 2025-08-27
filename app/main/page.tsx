"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  role: string;
  content: string;
}

const ChatApp = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // 시뮬레이션을 위한 가짜 응답
    setTimeout(() => {
      const assistantMessage = { 
        role: 'assistant', 
        content: '안녕하세요! 저는 AI 어시스턴트입니다. 어떻게 도와드릴까요?' 
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    padding: '12px 16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: 0
  };

  const messagesContainerStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: '80px'
  };

  const inputAreaStyle: React.CSSProperties = {
    borderTop: '1px solid #e5e7eb',
    backgroundColor: 'white',
    padding: '16px'
  };

  const inputContainerStyle: React.CSSProperties = {
    maxWidth: '1024px',
    margin: '0 auto',
    display: 'flex',
    gap: '12px'
  };

  const textareaContainerStyle: React.CSSProperties = {
    flex: 1,
    position: 'relative'
  };

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 48px 12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '12px',
    resize: 'none',
    outline: 'none',
    fontSize: '14px',
    lineHeight: '1.5',
    minHeight: '50px',
    maxHeight: '120px',
    backgroundColor: isLoading ? '#f3f4f6' : 'white'
  };

  const sendButtonStyle: React.CSSProperties = {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
    padding: '8px',
    border: 'none',
    background: 'none',
    color: !input.trim() || isLoading ? '#d1d5db' : '#2563eb',
    cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
    transition: 'color 0.2s'
  };

  const messageRowStyle = (isUser: boolean): React.CSSProperties => ({
    display: 'flex',
    justifyContent: isUser ? 'flex-end' : 'flex-start'
  });

  const messageGroupStyle = (isUser: boolean): React.CSSProperties => ({
    maxWidth: '768px',
    display: 'flex',
    gap: '12px',
    flexDirection: isUser ? 'row-reverse' : 'row'
  });

  const avatarStyle = (isUser: boolean): React.CSSProperties => ({
    flexShrink: 0,
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isUser ? '#2563eb' : '#4b5563'
  });

  const messageBubbleStyle = (isUser: boolean): React.CSSProperties => ({
    padding: '12px 16px',
    borderRadius: '16px',
    backgroundColor: isUser ? '#2563eb' : 'white',
    color: isUser ? 'white' : '#1f2937',
    border: isUser ? 'none' : '1px solid #e5e7eb',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  });

  const loadingDotsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '4px'
  };

  const dotStyle = (delay: number): React.CSSProperties => ({
    width: '8px',
    height: '8px',
    backgroundColor: '#9ca3af',
    borderRadius: '50%',
    animation: `bounce 1.4s ease-in-out ${delay}s infinite both`
  });

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes bounce {
            0%, 80%, 100% { 
              transform: scale(0);
            } 40% { 
              transform: scale(1.0);
            }
          }
        `}
      </style>
      
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>
          <Bot size={24} color="#2563eb" />
          ChatGPT Clone
        </h1>
      </div>

      {/* Messages Container */}
      <div style={messagesContainerStyle}>
        {messages.length === 0 && (
          <div style={emptyStateStyle}>
            <Bot size={64} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '18px', margin: 0 }}>안녕하세요! 무엇을 도와드릴까요?</p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div key={index} style={messageRowStyle(message.role === 'user')}>
            <div style={messageGroupStyle(message.role === 'user')}>
              <div style={avatarStyle(message.role === 'user')}>
                {message.role === 'user' ? (
                  <User size={16} color="white" />
                ) : (
                  <Bot size={16} color="white" />
                )}
              </div>
              
              <div style={messageBubbleStyle(message.role === 'user')}>
                {message.content}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={messageRowStyle(false)}>
            <div style={messageGroupStyle(false)}>
              <div style={avatarStyle(false)}>
                <Bot size={16} color="white" />
              </div>
              <div style={messageBubbleStyle(false)}>
                <div style={loadingDotsStyle}>
                  <div style={dotStyle(0)}></div>
                  <div style={dotStyle(0.16)}></div>
                  <div style={dotStyle(0.32)}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={inputAreaStyle}>
        <div style={inputContainerStyle}>
          <div style={textareaContainerStyle}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              style={textareaStyle}
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              style={sendButtonStyle}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;