import { Helmet } from 'react-helmet-async';

import { QuestionsView } from 'sections/student-sections/questions/view';

// ----------------------------------------------------------------------

export default function QuestionsStudentPage() {
  return (
    <>
      <Helmet>
        <title> Questions | LEARNIX </title>
      </Helmet>
      <QuestionsView />
    </>
  );
}