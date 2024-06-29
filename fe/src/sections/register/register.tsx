import React from "react";
import { useState } from "react";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import { alpha, useTheme } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";

import { useRouter } from "routes/hooks";

import { bgGradient } from "theme/css";

import Logo from "components/logo";
import Iconify from "components/iconify";

export const Register = () => {
  const theme = useTheme();

  const router = useRouter();

  const handleClick = () => {
    router.push("/");
  };

  const [showPassword, setShowPassword] = useState(false);
  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Email address" />
        <TextField
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
        />
        <TextField
          name="Verify_Password"
          label="Verify password"
          type={showPassword ? "text" : "Verify_Password"}
        />
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
      >
        Register
      </LoadingButton>
    </>
  );

  return (
    <>
      <Typography variant="h4">Sign up to LEARNIX</Typography>

      {renderForm}
    </>
  );
};
