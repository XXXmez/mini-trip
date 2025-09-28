import { useServiceWorkerUpdater } from 'src/providers';
import { ChildrenProps } from 'src/shared';

type ServiceWorkerProviderProps = ChildrenProps;

export function ServiceWorkerProvider(props: ServiceWorkerProviderProps) {
  const { children } = props;

  useServiceWorkerUpdater();

  return <>{children}</>;
}
