import { useEffect, useState } from 'react';

import { BeforeInstallPromptEvent } from '../../types';

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      // проверяем, что это кастомное событие
      if ('prompt' in e) {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return null;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    return outcome;
  };

  return { canInstall: !!deferredPrompt, promptInstall };
}
