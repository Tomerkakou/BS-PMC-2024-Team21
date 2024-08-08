import SvgColor from 'components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = {
  Admin: [
    {
      title: 'dashboard',
      path: '/',
      icon: icon('ic_analytics'),
    },
    {
      title: 'user',
      path: '/user',
      icon: icon('ic_user'),
    },
    {
      title: 'product',
      path: '/products',
      icon: icon('ic_cart'),
    },
    {
      title: 'blog',
      path: '/blog',
      icon: icon('ic_blog'),
    },
  ],
  Lecturer:[
    {
      title: 'dashboard',
      path: '/',
      icon: icon('ic_analytics'),
    },
    {

      title: 'students',
      path: '/students',
      icon: icon('ic_students'),
    },
    {

      title: 'documents',
      path: '/documents',
      icon: icon('ic_documents'),
    },
    {

      title: 'questions',
      path: '/questions',
      icon: icon('ic_questions'),
    },
    {

      title: 'questions assasment',
      path: '/questions/assasment',
      icon: icon('ic_chat'),
    }
  ],
  Student:[
    {
      title: 'dashboard',
      path: '/',
      icon: icon('ic_analytics'),
    },
    {
      title: 'lecturers',
      path: '/lecturers',
      icon: icon('ic_user'),
    },
    {

      title: 'documents',
      path: '/documents',
      icon: icon('ic_documents'),
    },
    {
      title: 'question-session',
      path: '/question-session',
      icon: icon('ic_question_session'),
    },

    {
      title: 'questions',
      path: '/question',
      icon: icon('ic_chat'),
    }

  ],
};

export default navConfig;
