
import { Contact, Message } from './types';

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'gemini-ai',
    name: 'Gemini AI Assistant',
    avatar: 'https://picsum.photos/seed/gemini/200',
    status: 'online',
    isAi: true,
    systemInstruction: 'You are a helpful and witty WhatsApp assistant. Keep your responses concise and friendly, use emojis occasionally like a real human would in a chat.',
    lastMessage: 'Hello! I am your AI assistant. How can I help you today?',
    lastMessageTime: new Date()
  },
  {
    id: 'alex-rivera',
    name: 'Alex Rivera',
    avatar: 'https://picsum.photos/seed/alex/200',
    status: 'online',
    lastMessage: 'See you at 7!',
    lastMessageTime: new Date(Date.now() - 3600000)
  },
  {
    id: 'sarah-chen',
    name: 'Sarah Chen',
    avatar: 'https://picsum.photos/seed/sarah/200',
    status: 'offline',
    lastMessage: 'Did you check the new designs?',
    lastMessageTime: new Date(Date.now() - 86400000)
  },
  {
    id: 'design-group',
    name: 'Product Design Team',
    avatar: 'https://picsum.photos/seed/team/200',
    status: 'online',
    lastMessage: 'The presentation looks great!',
    lastMessageTime: new Date(Date.now() - 172800000)
  }
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  'gemini-ai': [
    {
      id: 'm1',
      text: 'Hello! I am your AI assistant. How can I help you today?',
      timestamp: new Date(Date.now() - 10000),
      senderId: 'gemini-ai',
      status: 'read',
      isAi: true
    }
  ],
  'alex-rivera': [
    {
      id: 'm2',
      text: 'Hey, are we still on for dinner?',
      timestamp: new Date(Date.now() - 7200000),
      senderId: 'alex-rivera',
      status: 'read'
    },
    {
      id: 'm3',
      text: 'Yes! See you at 7!',
      timestamp: new Date(Date.now() - 3600000),
      senderId: 'me',
      status: 'read'
    }
  ]
};

export const COLORS = {
  bg: '#0c1317',
  sidebar: '#111b21',
  chatBg: '#0b141a',
  header: '#202c33',
  inputBg: '#2a3942',
  whatsappGreen: '#00a884',
  sentMessage: '#005c4b',
  receivedMessage: '#202c33',
  textPrimary: '#e9edef',
  textSecondary: '#8696a0'
};
