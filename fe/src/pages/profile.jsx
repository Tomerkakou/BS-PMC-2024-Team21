import { Helmet } from 'react-helmet-async';
import { Profile } from 'sections/profile/profile';


// ----------------------------------------------------------------------

export default function ProfilePage() {
  return (
    <>
      <Helmet>
        <title> Profile | LEARNIX </title>
      </Helmet>
      <Profile />
    </>
  );
}
