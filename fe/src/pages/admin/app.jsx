import { Helmet } from 'react-helmet-async';

import { AppView } from 'sections/admin-sections/overview/view';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard | LEARNIX </title>
      </Helmet>

      <AppView />
    </>
  );
}
