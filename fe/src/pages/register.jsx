import { Helmet } from 'react-helmet-async';

import { Register } from 'sections/register/register';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> register | LEARNIX </title>
      </Helmet>
      <Register />
    </>
  );
}
