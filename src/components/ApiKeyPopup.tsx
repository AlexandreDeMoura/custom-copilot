import React, { useState, useRef, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../context/ThemeContext';
import classNames from 'classnames';

interface Props {
    onClose: () => void;
}

const ApiKeyPopup: React.FC<Props> = ({ onClose }) => {
    const { t } = useTranslation();
    const { theme } = useContext(ThemeContext);
    const [apiKey, setApiKey] = useState('');
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleSave = () => {
        // TODO: Implement API key saving logic
        console.log('Saving API key:', apiKey);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-full sm:w-[576px]">
                <div
                    ref={popupRef}
                    className={classNames('bg-white rounded-lg p-6 w-full', {
                        'bg-gray-800 text-white': theme === 'dark'
                    })}
                >
                    <h2 className="text-2xl font-bold mb-4 text-center">{t('api_settings.title')}</h2>
                    <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">{t('api_settings.description')}</p>
                    <input
                        type="text"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder={t('api_settings.placeholder')}
                        className={classNames('w-full p-2 border rounded mb-4', {
                            'bg-gray-700 border-gray-600': theme === 'dark',
                            'bg-white border-gray-300': theme !== 'dark'
                        })}
                    />
                    <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mb-4 block">
                        {t('api_settings.getApiKey')}
                    </a>
                    <div className="flex justify-between">
                        <button
                            onClick={onClose}
                            className={classNames('px-4 py-2 rounded flex-grow mr-2', {
                                'bg-white text-gray-800 hover:bg-gray-100 border border-gray-300': theme !== 'dark',
                                'bg-gray-700 text-white hover:bg-gray-600': theme === 'dark'
                            })}
                        >
                            {t('api_settings.cancel')}
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex-grow ml-2"
                        >
                            {t('api_settings.save')}
                        </button>
                    </div>
                    <div className="mt-6">
                        <h3 className="text-xl font-bold mb-2 text-center">{t('api_settings.faqs')}</h3>
                        {['apiKeyNotWorking', 'apiKeyHandling', 'chatGptPlusRequired', 'apiKeyPayment', 'licenseVsApiKey'].map((faq) => (
                            <details key={faq} className="mb-2">
                                <summary className="cursor-pointer hover:text-blue-500">{t(`api_settings.faq.${faq}.question`)}</summary>
                                <p className="mt-1 ml-4">{t(`api_settings.faq.${faq}.answer`)}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApiKeyPopup;
