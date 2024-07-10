import LoadingButton from "@mui/lab/LoadingButton";
import { Link, Stack, Typography } from "@mui/material";
import { requestPassword } from "auth/core/_requests";
import { TextInput } from "components/Inputs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { RouterLink } from "routes/components";

interface FormValues {
  email: string;
}
export default function ForgotPasswordView() {

  const [emailSend, setEmailSend] = useState<boolean>(false);
  const { control, handleSubmit, formState } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      await requestPassword(data.email);
      setEmailSend(true);
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data);
      }
    }
  };
  if (!emailSend) {
    return (
      <>
        <Stack spacing={3}>
          <Typography variant="h4">Enter your Email</Typography>

          <TextInput
            control={control}
            label="Email"
            fieldName="email"
            rules={{
              required: "Email is required!",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid Email",
              },
            }}
          />
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="inherit"
            loading={formState.isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            Reset Password
          </LoadingButton>
        </Stack>
      </>
    );
  } else {
    return (
      <>
        <Typography variant="h4">Email have been sent to provided address! </Typography>
        <Typography variant="body2" sx={{ mt: 2, mb: 5}}>
          Go back to
          <Link
            variant="subtitle2"
            component={RouterLink}
            sx={{ ml: 0.5 }}
            href="/auth/login"
          >
            Log in
          </Link>
        </Typography>
      </>
    );
  }
}
