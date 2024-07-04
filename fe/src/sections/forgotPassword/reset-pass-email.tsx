import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Iconify from "components/iconify";
import { TextInput } from "components/Inputs";
import { useForm } from "react-hook-form";
import { Stack, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import axios from "axios";
import { requestPassword } from "auth/core/_requests";
import { toast } from "react-toastify";

interface FormValues {
  email: string;
}
export default function ResetPassEmailView() {
  const [emailSend, setEmailSend] = useState<boolean>(false);
  const { control, handleSubmit, formState } = useForm<FormValues>();
  const onSubmit = async (data: FormValues) => {
    try {
      const response = await requestPassword(data.email);
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
          <Typography>Enter your email</Typography>

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
        <Typography>Email have been send</Typography>
      </>
    );
  }
}
