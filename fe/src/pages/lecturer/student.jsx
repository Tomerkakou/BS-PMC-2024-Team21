import { Helmet } from 'react-helmet-async';

import { StudentView } from 'sections/lecturer-sections/students/view';

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