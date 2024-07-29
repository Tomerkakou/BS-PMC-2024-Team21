import { Helmet } from 'react-helmet-async';

import { NewQuestionView } from 'sections/lecturer-sections/new-question/view';

// ----------------------------------------------------------------------

export default function NewQuestionPage() {
  return (
    <>
      <Helmet>
        <title> New Question | LEARNIX </title>
      </Helmet>
      <NewQuestionView />
    </>
  );
}