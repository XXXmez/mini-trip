import { ChildrenProps } from 'shared';

import { useServiceWorkerUpdater } from '../../hooks';

type ServiceWorkerProviderProps = ChildrenProps;

export function ServiceWorkerProvider(props: ServiceWorkerProviderProps) {
  const { children } = props;

  useServiceWorkerUpdater();

  return <>{children}</>;
}
