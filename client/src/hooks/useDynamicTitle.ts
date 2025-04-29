import { useEffect } from 'react';
import { titlesPage, defaultTitle } from '../utils/titles';

export const useDynamicTitle = () => {
  useEffect(() => {
    const handleBlur = () => {
      const randomTitle = titlesPage[Math.floor(Math.random() * titlesPage.length)];
      document.title = randomTitle;
    };

    const handleFocus = () => {
      document.title = defaultTitle;
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);
}; 