import LoadingButton from "@mui/lab/LoadingButton";
import {
  Avatar,
  Box,
  CardActions,
  FormControlLabel,
  Grid,
  Link,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { FileInput, SelectInput, TextInput } from "components/Inputs";
import Iconify from "components/iconify";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { RouterLink } from "routes/components";
import { useRouter } from "routes/hooks";

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
  const { handleSubmit, control, getValues } = useForm<FormValues>({
    defaultValues: {
      role: "Student",
      avatar: "/assets/images/avatars/avatar_1.jpg",
    },
  });
  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    try {
      if (data.image) {
        data.avatar = (await fileToBase64(data.image)) as string;
      }
      const response = await axios.post("/auth/sign-up", data);
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
    console.log(newValue);
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
        <Stack spacing={3}>
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
          <TextInput
            control={control}
            label="Password"
            fieldName="password"
            rules={{
              required: "Password is required!",
              pattern: {
                value: /^(?=.*\d)(?=.*[A-Z]).{6,}$/,
                message: "Weak Password",
              },
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
          />
          <TextInput
            control={control}
            label="First Name"
            fieldName="firstName"
            rules={{
              required: "First Name is required!",
            }}
          />
          <TextInput
            control={control}
            label="Last Name"
            fieldName="lastName"
            rules={{
              required: "Last Name is required!",
            }}
          />
          <SelectInput
            control={control}
            label="Role"
            fieldName="role"
            options={["Student", "Lecturer", "Admin"]}
            rules={{
              required: "Role is required!",
            }}
          />
          <Tabs
            value={tab}
            onChange={handleChange}
            aria-label="icon label tabs example"
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
                        <Grid item xs={4} key={index}>
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
        </Stack>
        <CardActions sx={{ mt: 2 }}>
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="inherit"
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
