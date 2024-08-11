import { faker } from '@faker-js/faker';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import Iconify from 'components/iconify';

import { useAuth } from 'auth';
import axios from 'axios';
import { useEffect, useState } from 'react';
import AppNewsUpdate from '../app-news-update';
import AppOrderTimeline from '../app-order-timeline';
import AppTasks from '../app-tasks';
import AppTrafficBySite from '../app-traffic-by-site';
import StudentsTableView from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
import StudentAverageGrades from '../student-average-grades';
import SubjectQuestionCounts from '../subject-question-counts';

// ----------------------------------------------------------------------





export default function AppView() {
  const {currentUser } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [pizzaChartData, setPizzaChartData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/lecturer/student-averages");
        const data = response.data;

        const series = data.map(student => ({
          label: student.student_name, 
          value: student.average_grade, 
        }));

        setChartData(series);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/lecturer/subject-question-counts");
        const data = response.data;
        const series = Object.keys(data).map(subject => ({
          label: subject,
          value: data[subject],
        }));

        setPizzaChartData(series);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);






  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi {currentUser.firstName}, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Weekly Sales"
            total={714000}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Users"
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Item Orders"
            total={1723315}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Bug Reports"
            total={234}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <StudentsTableView/>
        </Grid>

        <Grid xs={12} md={6} lg={8}>
      <StudentAverageGrades
        title="Student Average Grades"
        subheader="Current average grades for your students"
        chart={{
          series: chartData,
          options: {
            yaxis: {
              min: 0,  
              max: 10,
            }
          }
        }}
      />
    </Grid>

    <Grid xs={12} md={6} lg={4}>
      <SubjectQuestionCounts   
        title="Subject Question Counts"
        chart={{
          series: pizzaChartData, 
        }}
      />
    </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppNewsUpdate
            title="News Update"
            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: faker.person.jobTitle(),
              description: faker.commerce.productDescription(),
              image: `/assets/images/covers/cover_${index + 1}.jpg`,
              postedAt: faker.date.recent(),
            }))}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppOrderTimeline
            title="Order Timeline"
            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: [
                '1983, orders, $4220',
                '12 Invoices have been paid',
                'Order #37745 from September',
                'New order placed #XF-2356',
                'New order placed #XF-2346',
              ][index],
              type: `order${index + 1}`,
              time: faker.date.past(),
            }))}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTrafficBySite
            title="Traffic by Site"
            list={[
              {
                name: 'FaceBook',
                value: 323234,
                icon: <Iconify icon="eva:facebook-fill" color="#1877F2" width={32} />,
              },
              {
                name: 'Google',
                value: 341212,
                icon: <Iconify icon="eva:google-fill" color="#DF3E30" width={32} />,
              },
              {
                name: 'Linkedin',
                value: 411213,
                icon: <Iconify icon="eva:linkedin-fill" color="#006097" width={32} />,
              },
              {
                name: 'Twitter',
                value: 443232,
                icon: <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={32} />,
              },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppTasks
            title="Tasks"
            list={[
              { id: '1', name: 'Create FireStone Logo' },
              { id: '2', name: 'Add SCSS and JS files if required' },
              { id: '3', name: 'Stakeholder Meeting' },
              { id: '4', name: 'Scoping & Estimations' },
              { id: '5', name: 'Sprint Showcase' },
            ]}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
