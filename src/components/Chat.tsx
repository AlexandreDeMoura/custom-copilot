import React, { useState, useRef, useEffect } from 'react';
import { Send, Mail, Edit3, Calendar, MessageCircle, PlusCircle } from 'lucide-react';

interface Message {
  text: string;
  isUser: boolean;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}

interface Option {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Chat: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [showHome, setShowHome] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const options: Option[] = [
    { icon: <Mail className="w-6 h-6 text-purple-500" />, title: "Draft email", description: "Generate email for any occasion you need." },
    { icon: <Edit3 className="w-6 h-6 text-green-500" />, title: "Write an Essay", description: "Generate essay for any occasion you need." },
    { icon: <Calendar className="w-6 h-6 text-blue-500" />, title: "Planning", description: "Plan for any occasion, from holiday to family." },
    { icon: <MessageCircle className="w-6 h-6 text-yellow-500" />, title: "Assistant", description: "Become your personal assistant. Helping you." },
  ];

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations, currentConversation]);

  const simulateAIResponse = (convId: string) => {
    setTimeout(() => {
      const aiResponse = { text: "This is a simulated AI response.", isUser: false };
      setConversations(prevConversations => 
        prevConversations.map(conv => 
          conv.id === convId 
            ? { ...conv, messages: [...conv.messages, aiResponse] }
            : conv
        )
      );
      scrollToBottom();
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessage = { text: input, isUser: true };
      if (currentConversation) {
        setConversations(prevConversations => 
          prevConversations.map(conv => 
            conv.id === currentConversation 
              ? { ...conv, messages: [...conv.messages, newMessage] }
              : conv
          )
        );
        simulateAIResponse(currentConversation);
      } else {
        const newConversationId = Date.now().toString();
        const newConversation: Conversation = {
          id: newConversationId,
          title: input.slice(0, 30),
          messages: [newMessage]
        };
        setConversations(prev => [...prev, newConversation]);
        setCurrentConversation(newConversationId);
        simulateAIResponse(newConversationId);
      }
      setInput('');
      setShowHome(false);
    }
  };

  const startNewChat = () => {
    setCurrentConversation(null);
    setShowHome(true);
  };

  const selectConversation = (id: string) => {
    setCurrentConversation(id);
    setShowHome(false);
  };

  const renderSidebar = () => (
    <div className="w-64 bg-gray-100 border-r flex flex-col h-screen overflow-hidden">
      <div className="p-4">
        <button 
          onClick={startNewChat}
          className="w-full p-2 mb-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center"
        >
          <PlusCircle size={20} className="mr-2" />
          Start new chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {conversations.map(conv => (
          <div 
            key={conv.id}
            onClick={() => selectConversation(conv.id)}
            className={`p-2 rounded-lg cursor-pointer ${currentConversation === conv.id ? 'bg-blue-100' : 'hover:bg-gray-200'}`}
          >
            {conv.title}
          </div>
        ))}
      </div>
    </div>
  );

  const renderHomeScreen = () => (
    <div className="flex-1 p-8 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Hey, I'm Chat AI. Your AI assistant and companion for any occasion.</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {options.map((option, index) => (
          <div key={index} className="border p-6 rounded-lg hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center mb-4">
              {option.icon}
              <h2 className="font-semibold text-xl ml-4">{option.title}</h2>
            </div>
            <p className="text-gray-600">{option.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderChatScreen = () => (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentConversation && conversations.find(conv => conv.id === currentConversation)?.messages.map((message, index) => (
          <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${message.isUser ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {renderSidebar()}
      <div className="flex-1 flex flex-col">
        {showHome ? renderHomeScreen() : renderChatScreen()}
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;