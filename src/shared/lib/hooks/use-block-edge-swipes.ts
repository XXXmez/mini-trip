import { useEffect } from 'react';

/**
 * Хук блокирует горизонтальные свайпы "назад/вперед",
 * которые есть по умолчанию в браузере на iOS/Android.
 *
 * @param edgeZone ширина зоны от краёв экрана, где блокируется свайп (по умолчанию 30px).
 */
export function useBlockEdgeSwipes(edgeZone: number = 30) {
  useEffect(() => {
    const handler = (e: TouchEvent) => {
      const touch = e.touches[0];

      if (
        touch.clientX < edgeZone ||
        touch.clientX > window.innerWidth - edgeZone
      ) {
        // свайп начинается у края → блокируем
        e.preventDefault();
      }
    };

    document.addEventListener('touchstart', handler, { passive: false });
    return () => document.removeEventListener('touchstart', handler);
  }, [edgeZone]);
}
