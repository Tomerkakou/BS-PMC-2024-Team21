import { Helmet } from 'react-helmet-async';
import ResetPassEmailView from 'sections/forgotPassword/reset-pass-email';




// ----------------------------------------------------------------------

export default function ResetPassEmailPage() {
  return (
    <>
      <Helmet>
        <title> ResetPassword | LEARNIX </title>
      </Helmet>
    <ResetPassEmailView/>
    </>
  );
}