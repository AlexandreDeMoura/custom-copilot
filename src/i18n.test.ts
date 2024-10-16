import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['translations'],
    defaultNS: 'translations',
    resources: {
      en: {
        translations: {
          'app.title': 'Chat AI',
          'app.newChat': 'Start new chat',
          'sidebar.today': 'Today',
          'sidebar.yesterday': 'Yesterday',
          'sidebar.last7Days': 'Last 7 days',
          'sidebar.last30Days': 'Last 30 days',
          'sidebar.older': 'Older'
        }
      },
      fr: {
        translations: {
          'app.title': 'Chat IA',
          'app.newChat': 'Nouvelle conversation',
          'sidebar.today': 'Aujourd\'hui',
          'sidebar.yesterday': 'Hier',
          'sidebar.last7Days': '7 derniers jours',
          'sidebar.last30Days': '30 derniers jours',
          'sidebar.older': 'Plus ancien'
        }
      }
    }
  });

export default i18n;