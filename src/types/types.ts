export interface Message {
    text: string;
    isUser: boolean;
  }
  
  export interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    lastUpdated: Date; 
  }