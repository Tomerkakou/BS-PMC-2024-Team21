
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import Iconify from 'components/iconify';

import { useAuth } from 'auth';
import axios from 'axios';
import { useEffect, useState } from 'react';
import AppConversionRates from '../app-conversion-rates';
import AppWidgetSummary from '../app-widget-summary';
import AvgUsage from '../Avg-usage';
// ----------------------------------------------------------------------





export default function AppView() {
  const [usersmonth,setUserMonth]=useState([]);
  const [tokenscount,setTokensCount]=useState(0);
  const [usercount,setUserCount]=useState(0);
  const {currentUser } = useAuth();
  const [avgUsage,setAvgUsage]=useState({
    docs:[],
    questions:[],
    answers:[],
    days:[]
  });
  useEffect(()=>{
    (async ()=>{
      try{
        const response=await axios.get("/statistics/usercount")
        setUserCount(response.data.count)
      }
      catch(e){
        console.log(e)
      }

    })()
  },[])
  useEffect(()=>{
    (async ()=>{
      try{
        const response=await axios.get("/statistics/tokenscount")
        setTokensCount(response.data.count)
      }
      catch(e){
        console.log(e)
      }

    })()
  },[])
  useEffect(()=>{
    (async ()=>{
      try{
        const response=await axios.get("/statistics/avg-usage")
        setAvgUsage(response.data)
      }
      catch(e){
        console.log(e)
      }

    })()
  },[])

  useEffect(()=>{
    (async ()=>{
      try{
        const response=await axios.get("/statistics/users-week")
        setUserMonth(response.data)
      }
      catch(e){
        console.log(e)
      }

    })()
  },[])




  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi {currentUser.firstName}, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Open AI Tokens"
            total={tokenscount}
            color="success"
            icon ={<Iconify icon="tabler:brand-openai" sx={{color:"success.main"}} width={60} height={60}/>}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Users"
            total={usercount}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>
        <Grid xs={12}>
          <AvgUsage
            title="Average usage per day"
            chart={{
              labels:  avgUsage.days,
              series: [
                {
                  name: 'New Documents',
                  type: 'column',
                  fill: 'solid',
                  data: avgUsage.docs,
                },
                {
                  name: 'New Questions',
                  type: 'column',
                  fill: 'solid',
                  data: avgUsage.questions,
                },
                {
                  name: 'New Answers',
                  type: 'column',
                  fill: 'solid',
                  data: avgUsage.answers,
                },
              ],
            }}
          />
        </Grid>
        <Grid xs={12}>
          <AppConversionRates
            title="New users per week"
            chart={{
              series: usersmonth
            }}
          />
        </Grid>

      </Grid>
    </Container>
  );
}
