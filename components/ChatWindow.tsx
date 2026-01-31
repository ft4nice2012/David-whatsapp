
import React, { useState, useRef, useEffect } from 'react';
import { Contact, Message } from '../types';
import { COLORS } from '../constants';
import Icon from './Icon';
import { streamGeminiResponse } from '../services/geminiService';

interface ChatWindowProps {
  contact: Contact;
  messages: Message[];
  onSendMessage: (text: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ contact, messages, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full relative" style={{ backgroundColor: COLORS.chatBg, flex: 1 }}>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-3 px-4 z-10 shadow-sm" style={{ backgroundColor: COLORS.header }}>
        <div className="flex items-center cursor-pointer">
          <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full" />
          <div className="ml-3">
            <h3 className="text-gray-100 font-medium leading-none">{contact.name}</h3>
            <p className="text-xs text-gray-400 mt-1">
              {contact.status === 'typing...' ? <span className="text-green-500">typing...</span> : contact.status}
            </p>
          </div>
        </div>
        <div className="flex space-x-6 text-gray-400">
          <Icon name="Search" size={20} className="cursor-pointer hover:text-white" />
          <Icon name="MoreVertical" size={20} className="cursor-pointer hover:text-white" />
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 px-8 chat-scrollbar"
        style={{ 
          backgroundImage: 'url("https://w0.peakpx.com/wallpaper/580/650/HD-wallpaper-whatsapp-background-dark-background-whatsapp-blue-bubbles-messages.jpg")',
          backgroundSize: 'cover',
          backgroundBlendMode: 'overlay',
          backgroundColor: '#0b141a'
        }}
      >
        <div className="max-w-3xl mx-auto space-y-2 flex flex-col">
          {/* Encryption Notice */}
          <div className="self-center bg-gray-800/80 text-gray-400 text-[11px] px-3 py-1 rounded-md mb-4 flex items-center shadow">
             <Icon name="Lock" size={10} className="mr-2" />
             Messages are end-to-end encrypted. No one outside of this chat can read them.
          </div>

          {messages.map((msg, idx) => {
            const isMe = msg.senderId === 'me';
            const showTail = idx === messages.length - 1 || messages[idx + 1].senderId !== msg.senderId;

            return (
              <div 
                key={msg.id}
                className={`max-w-[80%] px-3 py-1.5 rounded-lg text-sm relative mb-0.5 shadow-sm ${
                  isMe 
                    ? 'self-end bg-[#005c4b] text-gray-100 rounded-tr-none' 
                    : 'self-start bg-[#202c33] text-gray-100 rounded-tl-none'
                }`}
              >
                <div className="flex flex-col">
                  <span className="whitespace-pre-wrap leading-relaxed">{msg.text}</span>
                  <div className="flex items-center justify-end space-x-1 mt-0.5 -mr-1">
                    <span className="text-[10px] text-gray-400/80">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && (
                      <div className="flex text-blue-400">
                        {msg.status === 'read' ? (
                          <div className="flex -space-x-1.5">
                            <Icon name="Check" size={14} />
                            <Icon name="Check" size={14} />
                          </div>
                        ) : (
                           <Icon name="Check" size={14} className="text-gray-400" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {contact.status === 'typing...' && (
            <div className="self-start bg-[#202c33] text-gray-100 px-3 py-2 rounded-lg rounded-tl-none text-sm animate-pulse flex items-center space-x-1">
               <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
               <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
               <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-2 px-4 flex items-center space-x-3" style={{ backgroundColor: COLORS.header }}>
        <Icon name="Smile" size={24} className="text-gray-400 cursor-pointer hover:text-white" />
        <Icon name="Plus" size={24} className="text-gray-400 cursor-pointer hover:text-white" />
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="Type a message" 
            className="w-full bg-[#2a3942] text-gray-100 py-2.5 px-4 rounded-lg outline-none text-sm placeholder-gray-500"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>
        {inputText.trim() ? (
          <div 
            onClick={handleSubmit}
            className="w-10 h-10 flex items-center justify-center bg-[#00a884] rounded-full cursor-pointer hover:opacity-90 transition-opacity"
          >
            <Icon name="Send" size={20} className="text-[#111b21] ml-0.5" />
          </div>
        ) : (
          <Icon name="Mic" size={24} className="text-gray-400 cursor-pointer hover:text-white" />
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
