import { Helmet } from 'react-helmet-async';
import {ForgotPasswordView} from 'sections/forgotPassword';




// ----------------------------------------------------------------------

export default function ForgotPasswordPage() {
  return (
    <>
      <Helmet>
        <title> Forgot Password | LEARNIX </title>
      </Helmet>
      <ForgotPasswordView/>
    </>
  );
}