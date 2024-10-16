import React, { useContext } from 'react';
import { Message as MessageType } from '../types/types';
import { ReactComponent as ChatIcon } from '../img/chat-icon.svg';
import { ThemeContext } from '../context/ThemeContext';

interface Props {
  message: MessageType;
}

const Message: React.FC<Props> = ({ message }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
        message.isUser 
          ? theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-800'
          : theme === 'dark' ? 'bg-gray-800 text-gray-200 border-gray-700' : 'bg-white text-gray-800 border border-gray-200'
      }`}>
        {!message.isUser && (
          <ChatIcon className={`w-6 h-6 mr-2 flex-shrink-0 ${theme === 'dark' ? 'fill-indigo-400' : 'fill-indigo-700'}`} />
        )}
        <div>{message.text}</div>
      </div>
    </div>
  );
};

export default Message;