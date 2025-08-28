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
    const currentInput = input.trim();
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentInput }),
      });

      const data = await response.json();
      
      if (response.ok) {
        const assistantMessage = { 
          role: 'assistant', 
          content: data.message || '응답을 받지 못했습니다.' 
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // 상세한 에러 메시지 처리
        let errorMessage = 'Error: ';
        
        if (response.status === 400) {
          errorMessage += '잘못된 요청입니다.';
        } else if (response.status === 401) {
          errorMessage += 'API 키가 유효하지 않습니다.';
        } else if (response.status === 403) {
          errorMessage += 'API 접근 권한이 없습니다.';
        } else if (response.status === 429) {
          errorMessage += 'API 사용량 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
        } else if (response.status === 500) {
          if (data.error?.includes('API 키가 설정되지 않았습니다')) {
            errorMessage += 'API 키 미설정 - 환경변수에 OPENAI_API_KEY를 설정해주세요.';
          } else {
            errorMessage += '서버 오류가 발생했습니다.';
          }
        } else if (response.status === 503) {
          errorMessage += 'OpenAI 서비스를 일시적으로 사용할 수 없습니다.';
        } else {
          errorMessage += `알 수 없는 오류 (${response.status})`;
        }
        
        // 서버에서 제공한 구체적인 에러 메시지가 있다면 추가
        if (data.error) {
          errorMessage += ` - ${data.error}`;
        }

        const errorResponse = { 
          role: 'assistant', 
          content: errorMessage
        };
        setMessages(prev => [...prev, errorResponse]);
      }
    } catch (error: unknown) {
      console.error('Network error:', error);
      
      let networkErrorMessage = 'Error: ';
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        networkErrorMessage += '네트워크 연결을 확인해주세요. 서버가 실행 중인지 확인해보세요.';
      } else if (error instanceof SyntaxError) {
        networkErrorMessage += '서버 응답 형식이 올바르지 않습니다.';
      } else if (error instanceof Error) {
        networkErrorMessage += `네트워크 오류 - ${error.message}`;
      } else if (typeof error === 'string') {
        networkErrorMessage += `네트워크 오류 - ${error}`;
      } else {
        networkErrorMessage += '알 수 없는 네트워크 오류가 발생했습니다.';
      }

      const networkErrorResponse = { 
        role: 'assistant', 
        content: networkErrorMessage
      };
      setMessages(prev => [...prev, networkErrorResponse]);
    } finally {
      setIsLoading(false);
    }
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
          Fit coach Mint
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