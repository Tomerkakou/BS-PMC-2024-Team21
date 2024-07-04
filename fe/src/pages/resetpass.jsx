import { Helmet } from 'react-helmet-async';
import ResetPassView from 'sections/resetPassword/resetpass';



// ----------------------------------------------------------------------

export default function ResetPassPage() {
  return (
    <>
      <Helmet>
        <title> ResetPassword | LEARNIX </title>
      </Helmet>

    <ResetPassView/>
    </>
  );
}
