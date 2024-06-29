import { useState } from "react";

import LoadingButton from "@mui/lab/LoadingButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import { useRouter } from "routes/hooks";
import { Link } from "@mui/material";
import { RouterLink } from "routes/components";
import { useForm } from "react-hook-form";
import { TextInput, SelectInput, DateInput } from "components/Inputs";


interface FormValues{
  email:string;
  password:string;
  confirmPassword:string;
  role:string;
}

export const Register = () => {

  const {handleSubmit,control,getValues}=useForm<FormValues>({
    defaultValues:{
      role:"Student"
    }
  });
  const router = useRouter();

  const onSubmit = (data:FormValues) => {
    console.log(data);
  };

  const [showPassword, setShowPassword] = useState(false);

  const ConfirmPassword=(cpassword:string)=>{
    const password=getValues().password;
    return password===cpassword ? true : "Password not match"
  }

  return (
    <>
      <Typography variant="h4">Sign Up to LEARNIX</Typography>
      <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
        Already have account ?
        <Link variant="subtitle2" component={RouterLink} sx={{ ml: 0.5 }} href="/auth/login" >
          Log In
        </Link>
      </Typography>
      <Stack spacing={3}>
        <TextInput control={control} label="Email" fieldName="email" 
          rules={{
            required:"Email is required!",
            pattern:{
              value:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message:"Invalid Email"
            }
          }}
        />
        <TextInput control={control} label="Password" fieldName="password"
          rules={{
            required:"Password is required!",
            pattern:{
              value:/^(?=.*\d)(?=.*[A-Z]).{6,}$/,
              message:"Weak Password"
            }
          }}
         />
        <TextInput control={control} label="Confirm Password" fieldName="confirmPassword"
          rules={{
            required:"Confirm Password is required!",
            validate:ConfirmPassword,
          }}
         />
         <SelectInput control={control} label="Role" fieldName="role"
            options={["Student","Lecturer","Admin"]}
            rules={{
              required:"Role is required!"
            }}
          />
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
      </Stack>
    </>
  );
};
