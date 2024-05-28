import { Center, Spinner } from '@chakra-ui/react';
import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import suspenseFallbackMap from './suspense-fallback-map';
import { ConsoleLog } from './utils/debug/console-log';

// So in the App.tsx we could import css file which is gonna be in multiple
// entries. For example, we could import font.css

const Loadable =
  (
    Component: React.ComponentType,
    fallback = (
      <Center flex='1' width={'full'}>
        <Spinner />
      </Center>
    )
  ) =>
  (props: JSX.IntrinsicAttributes) =>
    (
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    );

const NotFound = Loadable(lazy(() => import('./pages/layout/__not-found')));
const Layout = Loadable(lazy(() => import('./pages/layout/__layout')));

const PagePathsWithComponents: Record<string, any> = import.meta.glob(
  './pages/**/[!_]*.tsx'
);

ConsoleLog({
  PagePathsWithComponents,
  paths: Object.keys(PagePathsWithComponents),
});

const routes = Object.keys(PagePathsWithComponents).map(path => {
  const dynamicMatch = path.match(/\.\/pages\/(.*?)\/\[(.*?)\](?:\/(.*?)(?:\/(.*?))?)?\.tsx$/);
  ConsoleLog({ dynamicMatch });
  if (dynamicMatch) {
    const [, routePath, paramName, nestedPath = '', nestedParamName = ''] = dynamicMatch;

    const nestedPathToUse = nestedPath === 'index' ? '' : nestedPath;
    const nestedParamToUse = nestedParamName ? `:${nestedParamName}` : '';

    ConsoleLog({
      path: `${routePath}/:${paramName}${nestedPathToUse ? `/${nestedPathToUse}${nestedParamToUse}` : ''}`,
    });

    return {
      name: `${routePath}/${paramName}${nestedPathToUse ? `/${nestedPathToUse}${nestedParamName}` : ''}`,
      path: `${routePath}/:${paramName}${nestedPathToUse ? `/${nestedPathToUse}${nestedParamToUse}` : ''}`,
      component: Loadable(lazy(PagePathsWithComponents[path])),
    };
  }

  const regularMatch = path.match(/\.\/pages\/(.*?)\/?(index)?\.tsx$/);
  if (regularMatch) {
    const [, name] = regularMatch;
    const lowerName = name.toLowerCase();
    const fallback = suspenseFallbackMap.get(lowerName) || undefined;

    return {
      name,
      path: lowerName === 'home' ? '/' : `/${lowerName}`,
      component: Loadable(lazy(PagePathsWithComponents[path]), fallback),
    };
  }

  return null; // Ignore invalid paths
});

ConsoleLog({ routes });

const filteredRoutes = routes.filter(
  (
    route
  ): route is {
    name: string;
    path: string;
    component: (props: JSX.IntrinsicAttributes) => JSX.Element;
  } => route !== null
);

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path='/' element={<Layout />}>
          {filteredRoutes.map(({ path, component: ReactComponent }) => (
            <Route key={path} path={path} element={<ReactComponent />} />
          ))}
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
