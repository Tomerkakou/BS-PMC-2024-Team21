import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Iconify from "components/iconify";
import { TextInput } from "components/Inputs";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { useLocation } from "react-router-dom";
import { resetPassword } from "auth/core/_requests";
import { useRouter } from "routes/hooks";
import { Stack, Typography } from "@mui/material";

interface FormValues {
  password: string;
}

export default function ResetPassView() {
  const { control, handleSubmit, formState, getValues } = useForm<FormValues>();
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const location = useLocation();
  const router = useRouter();
  const ConfirmPassword = (cpassword: string) => {
    const password = getValues().password;
    return password === cpassword ? true : "Password not match";
  };

  const submit = async (data: FormValues) => {
    const params = new URLSearchParams(window.location.search);
    const iterator = params.entries();
    let foundToken = false;
    let tokenValue = "";

    for (let entry = iterator.next(); !entry.done; entry = iterator.next()) {
      const [key, value] = entry.value;
      if (key.includes("token")) {
        tokenValue = value;
        foundToken = true;
        break;
      }
    }

    if (!foundToken) {
      throw new Error("Token not found in URL parameters");
    }

    console.log(tokenValue);
    // Wait for the state to update before using token
    const response = await resetPassword(data.password, tokenValue);
    console.log(response.data);

    if (response.status === 200) {
      router.push("/auth/login");
    }
  };
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
          fieldName="confirmPassword"
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
          onClick={handleSubmit(submit)}
        >
          Reset pass
        </LoadingButton>
      </Stack>
    </>
  );
}
