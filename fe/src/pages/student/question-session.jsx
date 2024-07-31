import { Helmet } from 'react-helmet-async';

import { QuestionSessionView } from 'sections/student-sections/question-session/view';

// ----------------------------------------------------------------------

export default function QuestionSessionPage() {
  return (
    <>
      <Helmet>
        <title> Questions | LEARNIX </title>
      </Helmet>
      <QuestionSessionView />
    </>
  );
}