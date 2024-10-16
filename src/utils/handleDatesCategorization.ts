import { Conversation } from '../types/types';
import i18next from 'i18next';

function handleDatesCategorization(conversations: Conversation[]) {
    const t = i18next.t.bind(i18next);
    const now = new Date();
    const categories: { [key: string]: Conversation[] } = {
        [t('sidebar.today', 'Today')]: [],
        [t('sidebar.yesterday', 'Yesterday')]: [],
        [t('sidebar.last7Days', 'Last 7 days')]: [],
        [t('sidebar.last30Days', 'Last 30 days')]: [],
        [t('sidebar.older', 'Older')]: [],
    };

    // Add month categories for the last 12 months
    for (let i = 0; i < 12; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthYear = t('date.monthYear', '{{month}} {{year}}', {
            month: t(`months.${date.getMonth()}`),
            year: date.getFullYear()
        });
        categories[monthYear] = [];
    }

    conversations.forEach(conv => {
        const lastUpdated = new Date(conv.lastUpdated);
        const diffDays = Math.floor((now.getTime() - lastUpdated.getTime()) / (1000 * 3600 * 24));
        const diffMonths = (now.getFullYear() - lastUpdated.getFullYear()) * 12 + now.getMonth() - lastUpdated.getMonth();
        
        if (diffDays === 0) {
            categories[t('sidebar.today', 'Today')].push(conv);
        } else if (diffDays === 1) {
            categories[t('sidebar.yesterday', 'Yesterday')].push(conv);
        } else if (diffDays <= 7) {
            categories[t('sidebar.last7Days', 'Last 7 days')].push(conv);
        } else if (diffDays <= 30) {
            categories[t('sidebar.last30Days', 'Last 30 days')].push(conv);
        } else if (diffMonths < 12) {
            const monthYear = t('date.monthYear', '{{month}} {{year}}', {
                month: t(`months.${lastUpdated.getMonth()}`),
                year: lastUpdated.getFullYear()
            });
            categories[monthYear].push(conv);
        } else {
            categories[t('sidebar.older', 'Older')].push(conv);
        }
    });

    // Sort conversations within each category
    Object.values(categories).forEach(categoryConvs => {
        categoryConvs.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
    });

    // Filter out empty categories and sort them
    const sortedCategories = Object.entries(categories)
        .filter(([_, convs]) => convs.length > 0)
        .sort(([a], [b]) => {
            const order = [t('sidebar.today', 'Today'), t('sidebar.yesterday', 'Yesterday'), t('sidebar.last7Days', 'Last 7 days'), t('sidebar.last30Days', 'Last 30 days')];
            const aIndex = order.indexOf(a);
            const bIndex = order.indexOf(b);
            if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
            if (aIndex !== -1) return -1;
            if (bIndex !== -1) return 1;
            if (a === t('sidebar.older', 'Older')) return 1;
            if (b === t('sidebar.older', 'Older')) return -1;
            return new Date(b.split(' ')[1]).getTime() - new Date(a.split(' ')[1]).getTime();
        });

    return sortedCategories;
}

export default handleDatesCategorization;