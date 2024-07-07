import { Helmet } from 'react-helmet-async';
import { Profile } from 'sections/profile/profile';


// ----------------------------------------------------------------------

export default function ProfilePage() {
  return (
    <>
      <Helmet>
        <title> profile | LEARNIX </title>
      </Helmet>
      <Profile />
    </>
  );
}
