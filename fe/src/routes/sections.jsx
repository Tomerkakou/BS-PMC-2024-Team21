import { lazy } from 'react';
import { Outlet, Navigate, useRoutes,useLocation,useRouteError } from 'react-router-dom';

import DashboardLayout from 'layouts/dashboard';
import AuthLayout from 'layouts/auth';
import { useAuth } from 'auth';
export const IndexPage = lazy(() => import('pages/app'));
export const BlogPage = lazy(() => import('pages/blog'));
export const UserPage = lazy(() => import('pages/user'));
export const LoginPage = lazy(() => import('pages/login'));
export const RegisterPage = lazy(() => import('pages/register'));
export const ProductsPage = lazy(() => import('pages/products'));
export const Page404 = lazy(() => import('pages/page-not-found'));
export const ResetPassPage=lazy(() => import('pages/resetpass'));
export const ResetPassEmailPage=lazy(() => import('pages/reset-pass-email'));

// ----------------------------------------------------------------------
const UnauthorizedErrorHandler = () => {
  const { pathname } = useLocation()
  return (<Navigate to={'/auth'} state={{
    redirectTo: pathname
  }} />)
};

const LoginRedirectionHandler= () => {
  const { state } = useLocation()

  if (state && state.redirectTo) {
    window.history.pushState(null, "", "/");
    return (<Navigate to={state.redirectTo} />)
  }

  return (<Navigate to={'/'} />)
};

export default function Router() {
  const {currentUser}=useAuth();
  const routes = useRoutes([
    {
      element: (currentUser ?
        <DashboardLayout>
          <Outlet />
        </DashboardLayout>
        :
        <UnauthorizedErrorHandler/>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: 'auth',
      element: (
        !currentUser ?
        <AuthLayout>
          <Outlet />
        </AuthLayout>
        :
        <LoginRedirectionHandler/>
      ),
      children: [
        { element: <Navigate to="/auth/login" />, index: true},
        { path:'login', element: <LoginPage /> },
        { path:'sign-up',element:<RegisterPage/> },
        { path:'reset-pass-email',element:<ResetPassEmailPage/> },
        { path:'reset-pass',element:<ResetPassPage/> }
      ],
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
