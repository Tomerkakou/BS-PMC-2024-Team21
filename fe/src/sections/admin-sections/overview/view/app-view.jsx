import { faker } from '@faker-js/faker';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import Iconify from 'components/iconify';

import AppTasks from '../app-tasks';
import AppNewsUpdate from '../app-news-update';
import AppOrderTimeline from '../app-order-timeline';
import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
import AppTrafficBySite from '../app-traffic-by-site';
import AppCurrentSubject from '../app-current-subject';
import AppConversionRates from '../app-conversion-rates';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from 'auth';
// ----------------------------------------------------------------------





export default function AppView() {
  const [usersmonth,setUserMonth]=useState([]);
  const [tokenscount,setTokensCount]=useState(0);
  const [usercount,setUserCount]=useState(0);
  const {currentUser } = useAuth();
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
        <Grid xs={12} md={6} lg={8}>
          <AppWebsiteVisits
            title="Study By Subject"
            subheader="(+43%) than last year"
            chart={{
              labels: [
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ],
              series: [
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'column',
                  fill: 'solid',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team xcxC',
                  type: 'column',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ],
            }}
          />
        </Grid>
        <Grid xs={12} md={6} lg={8}>
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
