import React, { useState, useContext } from 'react';
import { Send } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

interface Props {
  onSubmit: (input: string) => void;
}

const MessageInput: React.FC<Props> = ({ onSubmit }) => {
  const [input, setInput] = useState('');
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className={`p-4 border-t ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('chat.placeholder')}
          className={`flex-1 px-3.5 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:py-1.5 focus:mb-1 ${
            theme === 'dark' 
              ? 'bg-gray-700 text-white border-gray-600 focus:ring-indigo-500' 
              : 'bg-white text-gray-800 border-gray-300'
          }`}
        />
        <button type="submit" className={`flex justify-center items-center gap-3 px-3.5 py-2.5 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          theme === 'dark' 
            ? 'bg-indigo-600 hover:bg-indigo-700' 
            : 'bg-indigo-700 hover:bg-indigo-800'
        }`}>
         <Send size={20} /> <div className='text-sm font-medium'>{t('chat.submit')}</div>
        </button>
      </div>
    </form>
  );
};

export default MessageInput;