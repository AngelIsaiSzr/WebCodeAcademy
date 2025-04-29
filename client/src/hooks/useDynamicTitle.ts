import { useEffect } from 'react';
import { titlesPage, defaultTitle } from '../utils/titles';

export const useDynamicTitle = () => {
  useEffect(() => {
    // Establecer el título por defecto al montar el componente
    document.title = defaultTitle;

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
      // Restaurar el título por defecto al desmontar
      document.title = defaultTitle;
    };
  }, []);
}; 