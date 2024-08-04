import { Helmet } from 'react-helmet-async';

import { QuestionAssasmentView } from 'sections/lecturer-sections/question-assasment/view';

// ----------------------------------------------------------------------

export default function QuestionAssasmentPage() {
  return (
    <>
      <Helmet>
        <title> Question Assasment | LEARNIX </title>
      </Helmet>
      <QuestionAssasmentView />
    </>
  );
}