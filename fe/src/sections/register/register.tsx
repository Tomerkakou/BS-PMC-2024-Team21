import LoadingButton from "@mui/lab/LoadingButton";
import {
  Avatar,
  Box,
  CardActions,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { register } from "auth/core/_requests";
import { FileInput, SelectInput, TextInput } from "components/Inputs";
import Iconify from "components/iconify";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { RouterLink } from "routes/components";

interface FormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  confirmPassword: string;
  image: File;
  avatar: string;
  role: string;
}

export const Register = () => {
  const [succes, setSucces] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const { handleSubmit, control, getValues, formState } = useForm<FormValues>({
    defaultValues: {
      role: "Student",
      avatar: "/assets/images/avatars/avatar_1.jpg",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      if (data.image) {
        data.avatar = (await fileToBase64(data.image)) as string;
      }
      await register(
        data.email,
        data.firstName,
        data.lastName,
        data.password,
        data.confirmPassword,
        data.role,
        data.avatar
      );
      setSucces(true);
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data);
      }
    }
  };

  const [tab, setTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const ConfirmPassword = (cpassword: string) => {
    const password = getValues().password;
    return password === cpassword ? true : "Password not match";
  };
  if (succes) {
    return (
      <>
        <Typography variant="h3">Sign-up Successful!</Typography>
        <Typography variant="h6" mt={3}>
          Please check your inbox and follow the instructions to verify your
          email address.
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
          Go back to
          <Link
            variant="subtitle2"
            component={RouterLink}
            sx={{ ml: 0.5 }}
            href="/auth/login"
          >
            Log In
          </Link>
        </Typography>
      </>
    );
  } else {
    return (
      <>
        <Typography variant="h4">Sign Up to LEARNIX</Typography>
        <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
          Already have account ?
          <Link
            variant="subtitle2"
            component={RouterLink}
            sx={{ ml: 0.5 }}
            href="/auth/login"
          >
            Log In
          </Link>
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
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
              maxLength:{
                value:50,
                message:'Maximum length is 50!'
              }
            }}
          />
          </Grid>
          <Grid item xs={12} md={6}>
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
          </Grid>
          <Grid item xs={12} md={6}>
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
          </Grid>
          <Grid item xs={12} md={6}>
          <TextInput
            control={control}
            label="First Name"
            fieldName="firstName"
            rules={{
              required: "First Name is required!",
              maxLength:{
                value:50,
                message:'Maximum length is 50!'
              }
            }}
          />
          </Grid>
          <Grid item xs={12} md={6}>
          <TextInput
            control={control}
            label="Last Name"
            fieldName="lastName"
            rules={{
              required: "Last Name is required!",
              maxLength:{
                value:50,
                message:'Maximum length is 50!'
              }
            }}
          />
          </Grid>
          <Grid item xs={12}>
          <SelectInput
            control={control}
            label="Role"
            fieldName="role"
            options={["Student", "Lecturer", "Admin"]}
            rules={{
              required: "Role is required!",
            }}
          />
          </Grid>
          <Grid item xs={12}>
          <Tabs
            value={tab}
            onChange={handleChange}
            centered
            sx={{mb:1}}
          >
            <Tab label="Upload image" />
            <Tab label="Choose avatar" />
          </Tabs>
          {tab === 0 && (
            <FileInput
              control={control}
              placeholder="Upload Image"
              fieldName="image"
              accept="image/*"
              icon={<Iconify icon="eva:cloud-upload-outline" />}
              rules={{
                validate: async (file) => {
                  if (file) {
                    const base64String = await fileToBase64(file) as string;
                    return base64String.startsWith("data:image") || "Chosen file is not a valid image";
                  }
                  return true; 
                }
              }}
            />
          )}
          {tab === 1 && (
            <Box sx={{ maxHeight: "15vh", overflow: "auto" }}>
              <Controller
                name="avatar"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field}>
                    <Grid container spacing={1}>
                      {Array.from({ length: 25 }).map((_, index) => (
                        <Grid item  md={3}  xs={4} lg={2} key={index} sx={{mb:1}}>
                          <FormControlLabel
                            value={`/assets/images/avatars/avatar_${
                              index + 1
                            }.jpg`}
                            control={<Radio sx={{ display: "none" }} />}
                            label={
                              <Box
                                sx={{
                                  opacity:
                                    field.value ===
                                    `/assets/images/avatars/avatar_${
                                      index + 1
                                    }.jpg`
                                      ? "50%"
                                      : undefined,
                                }}
                              >
                                {/* <Box sx={{position:"absolute",left:50,top:50,zIndex:99999}}><Iconify icon="eva:checkmark-fill" /></Box> */}
                                <Avatar
                                  src={`/assets/images/avatars/avatar_${
                                    index + 1
                                  }.jpg`}
                                  alt={`Avatar ${index + 1}}`}
                                />
                              </Box>
                            }
                            labelPlacement="top"
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </RadioGroup>
                )}
              />
            </Box>
          )}
          </Grid>
        </Grid>
        <CardActions sx={{ mt: 2 }}>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="inherit"
            loading={formState.isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            Sign Up
          </LoadingButton>
        </CardActions>
      </>
    );
  }
};

const fileToBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
