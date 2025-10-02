import { useEffect } from 'react';
// eslint-disable-next-line import/no-unresolved
import { registerSW } from 'virtual:pwa-register';

export function useServiceWorkerUpdater() {
  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        // автообновление без вопросов
        updateSW(true).then();
      },
      onOfflineReady() {
        console.log('PWA: offline ready');
      },
    });
    // нет cleanup, registerSW сам управляет подписками
  }, []);
}
