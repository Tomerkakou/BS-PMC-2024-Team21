import { Box, Grid } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAuth } from "auth";

export const Profile = () => {
  const { currentUser } = useAuth();
  return (
    <Grid container spacing={3} sx={{p:3,pl:5}}>
      <Grid item xs={12}>
        <Typography variant="h4">Profile</Typography>
      </Grid>
      <Grid item xs={6}>
        <Stack spacing={2} sx={{pl:2}}>
          <Stack direction='row' spacing={2} 
            sx={{display:'flex',alignItems:'center'}}>
            <Typography variant="h6">Name:</Typography> 
            <Typography>{currentUser?.firstName} {currentUser?.lastName}</Typography>
          </Stack>
          <Stack direction='row' spacing={2} 
            sx={{display:'flex',alignItems:'center'}}>
            <Typography variant="h6">Email:</Typography> 
            <Typography>{currentUser?.email}</Typography>
          </Stack>
          <Stack direction='row' spacing={2} 
            sx={{display:'flex',alignItems:'center'}}>
            <Typography variant="h6">Role:</Typography> 
            <Typography>{currentUser?.role}</Typography>
          </Stack>
        </Stack>
      </Grid>
      <Grid item xs={6}>
        <Box
            component="img"
            src={currentUser?.avatar} 
            alt="avatar"
            sx={{p:5}}
          />
      </Grid>
    </Grid>
  );
};
