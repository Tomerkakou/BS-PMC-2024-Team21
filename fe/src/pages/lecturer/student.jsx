import { Helmet } from 'react-helmet-async';

import { StudentView } from 'sections/lecturer-sections/overview/lecturer/view';

// ----------------------------------------------------------------------

export default function LeturerPage() {
  return (
    <>
      <Helmet>
        <title> Students | LEARNIX </title>
      </Helmet>
      <StudentView />
    </>
  );
}