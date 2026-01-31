
import React, { useState, useCallback, useEffect } from 'react';
import { Contact, Message, ChatState } from './types';
import { INITIAL_CONTACTS, INITIAL_MESSAGES, COLORS } from './constants';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import Icon from './components/Icon';
import { streamGeminiResponse } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<ChatState>({
    contacts: INITIAL_CONTACTS,
    messages: INITIAL_MESSAGES,
    activeContactId: INITIAL_CONTACTS[0].id
  });

  const activeContact = state.contacts.find(c => c.id === state.activeContactId) || null;

  const handleSelectContact = (id: string) => {
    setState(prev => ({ ...prev, activeContactId: id }));
  };

  const updateContactStatus = (contactId: string, status: Contact['status'], lastMessage?: string) => {
    setState(prev => ({
      ...prev,
      contacts: prev.contacts.map(c => 
        c.id === contactId 
          ? { ...c, status, ...(lastMessage ? { lastMessage, lastMessageTime: new Date() } : {}) } 
          : c
      )
    }));
  };

  const handleSendMessage = useCallback(async (text: string) => {
    if (!state.activeContactId) return;

    const contactId = state.activeContactId;
    const contact = state.contacts.find(c => c.id === contactId);
    if (!contact) return;

    // Create unique message ID
    const msgId = Math.random().toString(36).substr(2, 9);
    
    const userMessage: Message = {
      id: msgId,
      text,
      timestamp: new Date(),
      senderId: 'me',
      status: 'sent'
    };

    // Update state with user message
    setState(prev => ({
      ...prev,
      messages: {
        ...prev.messages,
        [contactId]: [...(prev.messages[contactId] || []), userMessage]
      },
      contacts: prev.contacts.map(c => 
        c.id === contactId ? { ...c, lastMessage: text, lastMessageTime: new Date() } : c
      )
    }));

    // Simulate delivery
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        messages: {
          ...prev.messages,
          [contactId]: prev.messages[contactId].map(m => m.id === msgId ? { ...m, status: 'delivered' } : m)
        }
      }));
    }, 1000);

    // Simulate read
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        messages: {
          ...prev.messages,
          [contactId]: prev.messages[contactId].map(m => m.id === msgId ? { ...m, status: 'read' } : m)
        }
      }));
    }, 2000);

    // If active contact is AI, handle AI response
    if (contact.isAi) {
      setTimeout(async () => {
        updateContactStatus(contactId, 'typing...');
        
        const aiMsgId = 'ai-' + Math.random().toString(36).substr(2, 9);
        const aiMessage: Message = {
          id: aiMsgId,
          text: '',
          timestamp: new Date(),
          senderId: contactId,
          status: 'read',
          isAi: true
        };

        // Initialize AI message bubble
        setState(prev => ({
          ...prev,
          messages: {
            ...prev.messages,
            [contactId]: [...(prev.messages[contactId] || []), aiMessage]
          }
        }));

        // Convert current history for Gemini
        const history = (state.messages[contactId] || []).slice(-10).map(m => ({
          role: m.senderId === 'me' ? 'user' as const : 'model' as const,
          parts: [{ text: m.text }]
        }));

        let accumulatedText = '';
        const stream = streamGeminiResponse(text, history, contact.systemInstruction);

        for await (const chunk of stream) {
          accumulatedText += chunk;
          setState(prev => ({
            ...prev,
            messages: {
              ...prev.messages,
              [contactId]: prev.messages[contactId].map(m => 
                m.id === aiMsgId ? { ...m, text: accumulatedText } : m
              )
            }
          }));
        }

        updateContactStatus(contactId, 'online', accumulatedText);
      }, 1500);
    } else {
      // Small simulation for regular contacts
      setTimeout(() => {
        updateContactStatus(contactId, 'typing...');
        setTimeout(() => {
          const autoReply = "That sounds cool! I'm a bit busy now, let's talk later.";
          const replyId = 'reply-' + Math.random().toString(36).substr(2, 9);
          const reply: Message = {
            id: replyId,
            text: autoReply,
            timestamp: new Date(),
            senderId: contactId,
            status: 'read'
          };
          
          setState(prev => ({
            ...prev,
            messages: {
              ...prev.messages,
              [contactId]: [...(prev.messages[contactId] || []), reply]
            }
          }));
          updateContactStatus(contactId, 'online', autoReply);
        }, 3000);
      }, 2000);
    }
  }, [state]);

  return (
    <div className="flex h-screen w-screen overflow-hidden text-gray-100" style={{ backgroundColor: COLORS.bg }}>
      <Sidebar 
        contacts={state.contacts} 
        activeId={state.activeContactId} 
        onSelectContact={handleSelectContact} 
      />
      
      {activeContact ? (
        <ChatWindow 
          contact={activeContact} 
          messages={state.messages[activeContact.id] || []} 
          onSendMessage={handleSendMessage}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center" style={{ backgroundColor: COLORS.chatBg }}>
          <div className="w-64 h-64 mb-10 opacity-40">
            <Icon name="MessageSquare" size={256} className="text-gray-600" />
          </div>
          <h1 className="text-3xl font-light text-gray-300 mb-4">Gemini Messenger for Web</h1>
          <p className="text-gray-500 max-w-md text-sm leading-relaxed">
            Send and receive messages without keeping your phone online. Use Gemini AI built-in to enhance your conversations.
          </p>
          <div className="mt-auto text-gray-600 text-xs flex items-center">
            <Icon name="Lock" size={12} className="mr-2" /> End-to-end encrypted
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
