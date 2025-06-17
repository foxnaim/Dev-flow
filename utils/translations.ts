export const useTranslation = (language: string) => {
  const translations: Record<string, Record<string, string>> = {
    ru: {
      today: 'Сегодня',
      more: 'еще',
    },
    en: {
      today: 'Today',
      more: 'more',
    },
  };

  return (key: string) => translations[language]?.[key] || translations['en'][key];
}; 
