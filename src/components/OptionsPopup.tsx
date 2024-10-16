import React, { useRef, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { ThemeContext } from '../context/ThemeContext';
import { ReactComponent as SettingsIcon } from '../img/settings.svg';
import { ReactComponent as LogoutIcon } from '../img/logout.svg';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSettingsClick: () => void;
    onLogout: () => void;
}

const OptionsPopup: React.FC<Props> = ({ isOpen, onClose, onSettingsClick, onLogout }) => {
    const { t } = useTranslation();
    const { theme } = useContext(ThemeContext);
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={popupRef}
            className={classNames(
                "absolute right-0 bottom-full mb-2 w-48 rounded-md shadow-xl border py-1 z-50",
                {
                    "bg-white border-gray-200": theme !== 'dark',
                    "bg-gray-800 border-gray-700": theme === 'dark'
                }
            )}
        >
            <button
                onClick={onSettingsClick}
                className={classNames(
                    "flex items-center px-4 py-2 text-sm w-full",
                    {
                        "text-gray-700 hover:bg-gray-100": theme !== 'dark',
                        "text-gray-300 hover:bg-gray-700": theme === 'dark'
                    }
                )}
            >
                <SettingsIcon className={`mr-2 w-5 h-5 ${theme === 'dark' ? 'fill-gray-300' : 'fill-gray-700'}`} />
                {t('settings.title')}
            </button>
            <button
                onClick={onLogout}
                className={classNames(
                    "flex items-center px-4 py-2 text-sm w-full",
                    {
                        "text-gray-700 hover:bg-gray-100": theme !== 'dark',
                        "text-gray-300 hover:bg-gray-700": theme === 'dark'
                    }
                )}
            >
                <LogoutIcon className={`mr-2 w-5 h-5 ${theme === 'dark' ? 'fill-gray-300' : 'fill-gray-700'}`} />
                {t('app.signOut')}
            </button>
        </div>
    );
};

export default OptionsPopup;