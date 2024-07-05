import { LoadingButton } from "@mui/lab";
import { Stack, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { resetPassword } from "auth/core/_requests";
import Iconify from "components/iconify";
import { TextInput } from "components/Inputs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useSearchParams } from "react-router-dom";
import { useRouter } from "routes/hooks";

interface FormValues {
  password: string;
  cpassword: string;
}

export default function ResetPasswordView() {
  const { control, handleSubmit, formState, getValues } = useForm<FormValues>();
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const router = useRouter();

  const ConfirmPassword = (cpassword: string) => {
    const password = getValues().password;
    return password === cpassword ? true : "Password not match";
  };

  const onSubmit = async (data: FormValues) => {
    try{
      const response = await resetPassword(data.password, searchParams.get("token")!);
      if (response.status === 200) {
        router.push("/auth/login");
      }
    }catch(error:any){
      if (error.response) {
        console.log(error.response.data);
      }
    }
  };

  if(!searchParams.has("token")){
    return <Navigate to="/auth/login" />
  }

  return (
    <>
      <Stack spacing={3}>
        <Typography>Enter new password</Typography>
        <TextInput
          control={control}
          label="Password"
          fieldName="password"
          type={showPassword ? "text" : "password"}
          rules={{
            required: "Password is required!",
            pattern: {
              value: /^(?=.*\d)(?=.*[A-Z]).{6,}$/,
              message: "Weak Password",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  <Iconify
                    icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextInput
          control={control}
          label="Confirm Password"
          fieldName="cpassword"
          rules={{
            required: "Confirm Password is required!",
            validate: ConfirmPassword,
          }}
          type={showCPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowCPassword(!showCPassword)}
                  edge="end"
                >
                  <Iconify
                    icon={showCPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                  />
                </IconButton>
              </InputAdornment>
            ),
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
          Reset password
        </LoadingButton>
      </Stack>
    </>
  );
}
