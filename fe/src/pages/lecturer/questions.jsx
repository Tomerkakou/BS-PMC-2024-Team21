import { Helmet } from 'react-helmet-async';

import { QuestionsView } from 'sections/lecturer-sections/questions/view';

// ----------------------------------------------------------------------

export default function QuestionsPage() {
  return (
    <>
      <Helmet>
        <title> Questions | LEARNIX </title>
      </Helmet>
      <QuestionsView />
    </>
  );
}