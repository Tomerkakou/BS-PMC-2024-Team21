import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Box,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAuth } from "auth";
import axios from "axios";
import Iconify from "components/iconify";
import { FileInput, TextInput } from "components/Inputs";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";

interface FormValues {
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  image: File;
}
interface UserModel {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: string;
}

export const Profile = () => {
  const { currentUser, setCurrentUser } = useAuth();

  const { handleSubmit, control, formState, reset } = useForm<FormValues>({
    defaultValues: {
      email: currentUser?.email,
      firstName: currentUser?.firstName as string,
      lastName: currentUser?.lastName as string,
      avatar: currentUser?.avatar,
    },
  });

  const currentAvatar = useWatch({ control, name: "avatar" });
  const [flag, setFlag] = useState(0);
  const [image, setImage] = useState("");
  const [updateFlag, setUpadteFlag] = useState(false);

  const onSubmit = async (data: FormValues) => {
    try {
      if (data.image && flag === 0) {
        data.avatar = (await fileToBase64(data.image)) as string;
        setImage(data.avatar);
      }
      const response = await axios.post("/auth/change-profile", data);
      toast.success(response.data);
      setCurrentUser((prevUser) => ({
        ...(prevUser as UserModel),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: data.avatar,
      }));
      setUpadteFlag(false);
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data);
      }
    }
  };
  const [tab, setTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    setFlag(newValue);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Stack spacing={3}>
          <Stack direction="row" spacing={3}>
            <Typography variant="h3">Profile</Typography>
            <IconButton
              onClick={() => {
                setUpadteFlag(!updateFlag);
                reset();
              }}
            >
              {updateFlag ? (
                <Iconify icon="eva:close-fill" />
              ) : (
                <Iconify icon="mdi:account-edit-outline" />
              )}
            </IconButton>
          </Stack>
          {updateFlag && (
            <>
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
                  maxLength: {
                    value: 50,
                    message: "Maximum length is 50!",
                  },
                }}
              />
              <TextInput
                control={control}
                label="First Name"
                fieldName="firstName"
                rules={{
                  required: "First Name is required!",
                  maxLength: {
                    value: 50,
                    message: "Maximum length is 50!",
                  },
                }}
              />
              <TextInput
                control={control}
                label="Last Name"
                fieldName="lastName"
                rules={{
                  required: "Last Name is required!",
                  maxLength: {
                    value: 50,
                    message: "Maximum length is 50!",
                  },
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
                                    <Avatar
                                      src={`/assets/images/avatars/avatar_${
                                        index + 1
                                      }.jpg`}
                                      alt={`Avatar ${index + 1}`}
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

              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="inherit"
                loading={formState.isSubmitting}
                onClick={handleSubmit(onSubmit)}
              >
                Update
              </LoadingButton>
            </>
          )}
          {!updateFlag && (
            <>
              <Stack
                direction="row"
                spacing={2}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography variant="h6">Name:</Typography>
                <Typography>
                  {currentUser?.firstName} {currentUser?.lastName}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography variant="h6">Email:</Typography>
                <Typography>{currentUser?.email}</Typography>
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Typography variant="h6">Role:</Typography>
                <Typography>{currentUser?.role}</Typography>
              </Stack>
            </>
          )}
        </Stack>
      </Grid>
      <Grid item xs={12} md={4}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <Avatar
            src={image !== "" && flag === 0 ? image : currentAvatar}
            alt="Current Avatar"
            sx={{ width: 150, height: 150 }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};
const fileToBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
