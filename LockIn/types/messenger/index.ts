export interface MessageProp {
  senderId: string;
  content: string;
  timestamp: number;
  message: string;
  respondingTo: string | null; // Added property
}

export interface Message {
  _id: string;
  chatId: string;
  userId: string;
  respondingTo: string | null;
  message: string;
  timestamp: number;
}

export interface Chat {
  _id: string;
  name: string;
  privateChat: boolean;
  members: { username: string; nickname: string | null }[];
  lastMessage: {
    _id: string;
    chatId: string;
    userId: string;
    respondingTo: string;
    message: string;
    timestamp: number;
  } | null;
  totalMessages: number;
  timestamp: number;
}

export interface CreatePublicChat {
  name: string;
  members: string[];
}
