import { Helmet } from 'react-helmet-async';

import { AppView } from 'sections/student-sections/overview/view';

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
