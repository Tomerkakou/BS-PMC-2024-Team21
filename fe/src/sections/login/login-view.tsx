import { useState } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Iconify from 'components/iconify';
import { useNavigate } from 'react-router-dom';
import { RouterLink } from 'routes/components';
import { useRouter } from 'routes/hooks';
import { TextInput } from 'components/Inputs';
import { useForm } from 'react-hook-form';
import { getUserByToken, login } from 'auth/core/_requests';
import { useAuth } from 'auth/core/Auth';
import { toast } from 'react-toastify';

// ----------------------------------------------------------------------

interface FormValues {
  email: string;
  password: string;
}
export default function LoginView() {
  
  const {control, handleSubmit,formState} = useForm<FormValues>();
  const {saveAuth,setCurrentUser} = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const router=useRouter();

  const onSubmit = async ({email,password}:FormValues) => {
    try{
      const response=await login(email,password);
      console.log(response);
      saveAuth(response.data);
      const {data:user}= await getUserByToken();
      setCurrentUser(user);
      router.push('/');
    }catch(error:any){
      saveAuth(undefined)
      if (error.response) {
        toast.error(error.response.data);
      }
    }
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextInput fieldName="email" label="Email address" control={control}
          rules={{ required: 'Email is required' }}
         />

        <TextInput
          fieldName="password"
          label="Password"
          control={control}
          type={showPassword ? 'text' : 'password'}
          rules={{ required: 'Password is required' }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        loading={formState.isSubmitting}
        onClick={handleSubmit(onSubmit)}
      >
        Login
      </LoadingButton>
    </>
  );

  return (<>
          <Typography variant="h4">Sign in to LEARNIX</Typography>
          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Don’t have an account?
            <Link variant="subtitle2" component={RouterLink} sx={{ ml: 0.5 }} href="/auth/sign-up" >
              Get started
            </Link>
          </Typography>

          {/* <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:google-fill" color="#DF3E30" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:facebook-fill" color="#1877F2" />
            </Button>

            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:twitter-fill" color="#1C9CEA" />
            </Button>
          </Stack>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              OR
            </Typography>
          </Divider> */}
          {renderForm}
    </>
  );
}
