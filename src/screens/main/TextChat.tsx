
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../../store/store';
import { addMessage, setIsTyping } from '../../store/features/chatSlice';
import { generateChatResponse } from '../../services/openaiService';
import { toast } from 'sonner';

const TextChat: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const { messages, isTyping } = useSelector((state: RootState) => state.chat);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim()) return;
    
    // Add user message to chat
    const userMessage = {
      id: uuidv4(),
      text: inputText.trim(),
      sender: 'user' as const,
      timestamp: Date.now()
    };
    dispatch(addMessage(userMessage));
    setInputText('');
    
    // Indicate AI is typing
    dispatch(setIsTyping(true));
    
    try {
      // Get AI response
      const response = await generateChatResponse([...messages, userMessage]);
      
      // Add AI message to chat
      const aiMessage = {
        id: uuidv4(),
        text: response,
        sender: 'ai' as const,
        timestamp: Date.now()
      };
      dispatch(addMessage(aiMessage));
    } catch (error) {
      toast.error('Failed to get a response. Please try again.');
    } finally {
      dispatch(setIsTyping(false));
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto mb-4 px-1">
        {messages.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Start a health conversation with AIDLY</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-t-lg p-3 ${
                    message.sender === 'user'
                      ? 'aidly-gradient text-white rounded-bl-lg'
                      : 'bg-white text-gray-800 shadow-sm rounded-br-lg'
                  }`}
                >
                  <p>{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-gray-200' : 'text-gray-500'}`}>
                    {formatTimestamp(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {/* AI typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-t-lg rounded-br-lg p-3 shadow-sm max-w-[80%]">
                  <div className="flex space-x-1 items-center">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Input area */}
      <form onSubmit={handleSendMessage} className="sticky bottom-0 bg-white pb-2">
        <div className="flex items-center border border-gray-300 rounded-full overflow-hidden bg-white shadow-sm">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your health question..."
            className="flex-1 py-3 px-4 focus:outline-none"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className={`aidly-gradient text-white p-3 m-1 rounded-full transition-transform ${
              !inputText.trim() || isTyping ? 'opacity-50' : 'hover:scale-[1.05] active:scale-[0.98]'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 2L11 13" />
              <path d="M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default TextChat;
