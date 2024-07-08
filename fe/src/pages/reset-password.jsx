import { Helmet } from 'react-helmet-async';
import {ResetPasswordView} from 'sections/resetPassword';



// ----------------------------------------------------------------------

export default function ResetPasswordPage() {
  return (
    <>
      <Helmet>
        <title> Reset Password | LEARNIX </title>
      </Helmet>
      <ResetPasswordView/>
    </>
  );
}
