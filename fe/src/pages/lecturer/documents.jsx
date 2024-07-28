import { Helmet } from 'react-helmet-async';

import { DocumentsView } from 'sections/lecturer-sections/documents/view';

// ----------------------------------------------------------------------

export default function LeturerPage() {
  return (
    <>
      <Helmet>
        <title> Documents | LEARNIX </title>
      </Helmet>
      <DocumentsView />
    </>
  );
}