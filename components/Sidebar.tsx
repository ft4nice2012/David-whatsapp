
import React, { useState } from 'react';
import { Contact } from '../types';
import { COLORS } from '../constants';
import Icon from './Icon';

interface SidebarProps {
  contacts: Contact[];
  activeId: string | null;
  onSelectContact: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ contacts, activeId, onSelectContact }) => {
  const [search, setSearch] = useState('');

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div 
      className="flex flex-col h-full border-r border-gray-800"
      style={{ backgroundColor: COLORS.sidebar, width: '30%', minWidth: '320px' }}
    >
      {/* User Profile Header */}
      <div className="flex items-center justify-between p-4" style={{ backgroundColor: COLORS.header }}>
        <img 
          src="https://picsum.photos/seed/user/200" 
          alt="My Profile" 
          className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
        />
        <div className="flex space-x-5 text-gray-400">
          <Icon name="Users" size={20} className="cursor-pointer hover:text-white" />
          <Icon name="CircleDashed" size={20} className="cursor-pointer hover:text-white" />
          <Icon name="MessageSquare" size={20} className="cursor-pointer hover:text-white" />
          <Icon name="MoreVertical" size={20} className="cursor-pointer hover:text-white" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-2">
        <div className="flex items-center p-2 rounded-lg bg-gray-800 space-x-3">
          <Icon name="Search" size={18} className="text-gray-400 ml-1" />
          <input 
            type="text" 
            placeholder="Search or start new chat" 
            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-gray-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {filteredContacts.map(contact => (
          <div 
            key={contact.id}
            onClick={() => onSelectContact(contact.id)}
            className={`flex items-center p-3 cursor-pointer transition-colors ${
              activeId === contact.id ? 'bg-gray-800' : 'hover:bg-gray-800'
            }`}
          >
            <div className="relative">
              <img 
                src={contact.avatar} 
                alt={contact.name} 
                className="w-12 h-12 rounded-full"
              />
              {contact.status === 'online' && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
              )}
            </div>
            <div className="flex-1 ml-4 border-b border-gray-800 pb-3 mt-1">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-gray-100 font-medium truncate">{contact.name}</h3>
                <span className="text-xs text-gray-500">
                  {contact.lastMessageTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500 truncate w-48">
                  {contact.status === 'typing...' ? (
                    <span className="text-green-500">typing...</span>
                  ) : (
                    contact.lastMessage
                  )}
                </p>
                {contact.id === 'gemini-ai' && (
                  <span className="bg-blue-900/40 text-blue-400 text-[10px] px-1.5 py-0.5 rounded border border-blue-500/30">
                    AI
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
