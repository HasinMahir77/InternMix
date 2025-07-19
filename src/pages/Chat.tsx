import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Send, Bot } from 'lucide-react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const Chat = () => {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Welcome to InternMix! I'm your personal AI assistant." },
    { sender: 'bot', text: "I can help you polish your resume, find internships, and prepare for interviews. What's on your mind?" },
  ]);
  const [input, setInput] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      const botMessage: Message = { sender: 'bot', text: 'Chat coming soon' };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div className="min-h-screen pt-24 bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-3xl h-[calc(100vh-8rem)]">
        <div className="bg-white rounded-xl shadow-2xl flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 flex items-center space-x-3 bg-gray-50 rounded-t-xl">
            <div className="p-2 bg-primary-100 rounded-full">
              <Bot className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">InternMix AI Assistant</h1>
              <div className="flex items-center space-x-1">
                <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
          </div>

          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'bot' && <Bot className="h-6 w-6 text-gray-400 mb-1" />}
                <div className={`max-w-md rounded-2xl px-4 py-2 ${
                    msg.sender === 'user'
                      ? 'bg-primary-600 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white border-t border-gray-200 rounded-b-xl">
            <form onSubmit={handleSend} className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-primary-500 focus:border-primary-500 transition-shadow"
              />
              <button
                type="submit"
                className="p-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-transform transform hover:scale-105"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat; 