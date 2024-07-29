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
      title: 'product',
      path: '/products',
      icon: icon('ic_cart'),
    },
    {
      title: 'blog',
      path: '/blog',
      icon: icon('ic_blog'),
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
};

export default navConfig;
