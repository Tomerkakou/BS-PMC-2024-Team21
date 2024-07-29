import { Helmet } from 'react-helmet-async';

import { DocsView } from 'sections/student-sections/docs/view';

// ----------------------------------------------------------------------

export default function docsPage() {
  return (
    <>
      <Helmet>
        <title> Documents | LEARNIX </title>
      </Helmet>
      <DocsView />
    </>
  );
}