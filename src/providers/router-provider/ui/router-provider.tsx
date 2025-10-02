import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { appRoutes } from 'routes';
import { ChildrenProps } from 'shared';

type RouterProviderProps = ChildrenProps;

export function RouterProvider(props: RouterProviderProps) {
  const { children } = props;

  return (
    <BrowserRouter>
      <Routes>
        {appRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
      {children}
    </BrowserRouter>
  );
}
