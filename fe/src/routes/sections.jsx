import { lazy,useMemo } from 'react';
import { Outlet, Navigate, useRoutes,useLocation } from 'react-router-dom';

import DashboardLayout from 'layouts/dashboard';
import AuthLayout from 'layouts/auth';
import { useAuth } from 'auth';


export const IndexAdminPage = lazy(() => import('pages/admin/app'));
export const IndexLecturerPage = lazy(() => import('pages/lecturer/app'));
export const IndexStudentPage = lazy(() => import('pages/student/app'));
export const BlogPage = lazy(() => import('pages/blog'));
export const UserPage = lazy(() => import('pages/admin/user'));
export const LoginPage = lazy(() => import('pages/login'));
export const RegisterPage = lazy(() => import('pages/register'));
export const ProductsPage = lazy(() => import('pages/products'));
export const Page404 = lazy(() => import('pages/page-not-found'));
export const ProfiilePage=lazy(() => import('pages/profile'));
export const ResetPasswordPage=lazy(() => import('pages/reset-password'));
export const ForgotPasswordPage=lazy(() => import('pages/forgot-password'));
export const LecturerPage=lazy(() => import('pages/student/lecturer'));
export const StudentPage =lazy(() => import('pages/lecturer/student'));
export const DocumentsPage=lazy(() => import('pages/lecturer/documents'));
export const StudentDocs=lazy(() => import('pages/student/docs'));
export const NewQuestionPage=lazy(() => import('pages/lecturer/new-question'));
export const EditQuestionPage=lazy(() => import('pages/lecturer/edit-question'));
export const QuestionsPage=lazy(() => import('pages/lecturer/questions'));
export const QuestionSessionPage=lazy(() => import('pages/student/question-session'));
export const DocumentPage=lazy(() => import('pages/document'));
export const QuestionAssasmentPage=lazy(() => import('pages/lecturer/assasment-question'));

// ----------------------------------------------------------------------
const UnauthorizedErrorHandler = () => {
  const { pathname } = useLocation()
  return (<Navigate to={'/auth/login'} state={{
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

  const roleRoutes=useMemo(()=>{
    if(!currentUser || !currentUser.role){
      return [];
    }
    switch(currentUser.role){
      case 'Admin':
        return [
          { element: <IndexAdminPage />, index: true },
          { path: 'user', element: <UserPage /> },
        ]
      case 'Student':
        return [
          { element: <IndexStudentPage />, index: true },
          { path: 'lecturers', element: <LecturerPage /> },
          { path: 'documents', element: <StudentDocs /> },
          { path: 'question-session', element: <QuestionSessionPage /> },
          { path: 'document/:id', element: <DocumentPage /> },
        ]
      case 'Lecturer':
        return [
          { element: <IndexLecturerPage />, index: true },
          { path: 'students', element : <StudentPage/> },
          { path: 'documents', element : <DocumentsPage/> },
          { path: 'questions', children:[
            {element:<QuestionsPage/>,index:true},
            {path:'assasment',element:<QuestionAssasmentPage/>}
          ] },
          { path: 'new-question', element : <NewQuestionPage/> },
          { path: 'edit-question/:id', element : <EditQuestionPage/>  },
          { path: 'document/:id', element: <DocumentPage /> },
        ]
      default:
        throw new Error('invalid role')
    }
  },[currentUser])

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
        ...roleRoutes,
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path:'profile',element:<ProfiilePage/> },
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
        { path:'forgot-password',element:<ForgotPasswordPage/> },
        { path:'reset-password',element:<ResetPasswordPage/> }
      ],
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: currentUser ? <Navigate to="/404" replace /> :  <UnauthorizedErrorHandler/>,
    },
  ]);

  return routes;
}
