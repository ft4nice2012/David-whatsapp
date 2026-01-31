
export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface Message {
  id: string;
  text: string;
  timestamp: Date;
  senderId: string;
  status: MessageStatus;
  isAi?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'typing...';
  lastMessage?: string;
  lastMessageTime?: Date;
  isAi?: boolean;
  systemInstruction?: string;
}

export interface ChatState {
  contacts: Contact[];
  messages: Record<string, Message[]>;
  activeContactId: string | null;
}
