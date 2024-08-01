import { Helmet } from 'react-helmet-async';

import { NewQuestionView } from 'sections/lecturer-sections/new-question/view';

// ----------------------------------------------------------------------

export default function EditQuestionPage() {
  return (
    <>
      <Helmet>
        <title> Edit Question | LEARNIX </title>
      </Helmet>
      <NewQuestionView />
    </>
  );
}