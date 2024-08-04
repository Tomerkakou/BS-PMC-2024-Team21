import { Helmet } from 'react-helmet-async';
import {DocumentView} from 'sections/document/view';




// ----------------------------------------------------------------------

export default function DocumentPage() {
  return (
    <>
      <Helmet>
        <title> Document | LEARNIX </title>
      </Helmet>
      <DocumentView/>
    </>
  );
}