import { Helmet } from 'react-helmet-async';

import { DocumentsView } from 'sections/lecturer-sections/documents/view';

// ----------------------------------------------------------------------

export default function DocumentsPage() {
  return (
    <>
      <Helmet>
        <title> Documents | LEARNIX </title>
      </Helmet>
      <DocumentsView />
    </>
  );
}