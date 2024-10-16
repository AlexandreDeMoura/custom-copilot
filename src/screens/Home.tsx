import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as DraftEmailIcon } from '../img/draft-email.svg';
import { ReactComponent as WriteEssayIcon } from '../img/write-essay.svg';
import { ReactComponent as AssistantIcon } from '../img/assistant.svg';
import { ReactComponent as PlanningIcon } from '../img/planning.svg';
import { ThemeContext } from '../context/ThemeContext';

const Option: React.FC<{ icon: React.ReactNode, title: string, description: string, bgColor: string }> = ({ icon, title, description, bgColor }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <div className={`flex flex-col justify-center items-center border p-6 rounded-lg hover:shadow-md transition-shadow duration-300 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className={`flex p-2 items-center justify-center mb-4 rounded-lg ${bgColor}`}>
          {icon}
      </div>
      <h2 className={`font-semibold text-xl text-center mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
      <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
    </div>
  );
};

const Home: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  const optionsData = [
    { icon: <DraftEmailIcon className="w-6 h-6 fill-indigo-700" />, title: t('home.draftEmail'), description: t('home.draftEmailDesc'), bgColor: "bg-indigo-50" },
    { icon: <WriteEssayIcon className="w-6 h-6 fill-green-700" />, title: t('home.writeEssay'), description: t('home.writeEssayDesc'), bgColor: "bg-green-50" },
    { icon: <PlanningIcon className="w-6 h-6 fill-fuchsia-600" />, title: t('home.planning'), description: t('home.planningDesc'), bgColor: "bg-fuchsia-50" },
    { icon: <AssistantIcon className="w-6 h-6 fill-orange-500" />, title: t('home.assistant'), description: t('home.assistantDesc'), bgColor: "bg-amber-50" },
  ];

  return (
    <div className={`flex-1 p-8 overflow-y-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <h1 className="text-3xl font-bold mb-24 text-center">
        <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>{t('home.titleBold')}</span>{' '}
        <span className={theme === 'dark' ? 'text-gray-400' : 'text-neutral-600'}>{t('home.titleNormal')}</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {optionsData.map((option, index) => (
          <Option key={index} icon={option.icon} title={option.title} description={option.description} bgColor={option.bgColor} />
        ))}
      </div>
    </div>
  );
};

export default Home;