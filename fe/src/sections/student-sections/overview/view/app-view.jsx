import { faker } from '@faker-js/faker';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import Iconify from 'components/iconify';

import AppTasks from '../app-tasks';
import AppNewsUpdate from '../app-news-update';
import AppOrderTimeline from '../app-order-timeline';
import SubjectAnswerCount from '../subject-answer-count';
import StudentProgress from '../student-progress';
import AppWidgetSummary from '../app-widget-summary';
import AppTrafficBySite from '../app-traffic-by-site';
import AppCurrentSubject from '../app-current-subject';
import StudentSubjectAverages from '../student-subject-averages';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from 'auth';

// ----------------------------------------------------------------------





export default function AppView() {
  const {currentUser } = useAuth();

  const [chartData, setChartData] = useState({
    labels: [],
    series: []
  });
  const [pizzaChartData, setPizzaChartData] = useState([]);
  const [subjectAvgData, setSubjectAvgData] = useState([]); 
 

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/student/student-progress");
        const { date_ranges, grades_by_subject } = response.data;
  
        const labels = date_ranges; 

        const series = Object.keys(grades_by_subject).map(subject => ({
          name: subject,
          type: 'line', 
          fill: 'solid', 
          data: grades_by_subject[subject]
        }));
  
        setChartData({ labels, series });
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/student/student-answer-count");
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

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/student/subject-averages");
        const data = response.data;
        const series = Object.keys(data).map(subject => ({
          label: subject,
          value: data[subject],
        }));

        setSubjectAvgData(series); 
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/student/subject-averages");
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
  <StudentProgress
    title="Student Progress"
    subheader="Progress over the last 30 days"
    chart={{
      ...chartData, 
      options: {
        yaxis: {
          min: 0,
          max: 10,
          labels: {
            formatter: function (value) {
              return value.toFixed(0); // Display whole numbers only (0 decimal places)
            }
          }
        },
        tooltip: {
          y: {
            formatter: function (value) {
              return value.toFixed(1) + " Average"; // Show one decimal place in tooltip
            }
          }
        }
      }
    }}
  />
</Grid>

        <Grid xs={12} md={6} lg={4}>
          <SubjectAnswerCount
            title="Subject Answer Count"
            chart={{
              series: pizzaChartData,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
      <StudentSubjectAverages
        title="Student Subject Averages"
        subheader="Average grades per subject"
        chart={{
          series: subjectAvgData, // Use the dynamic data from subjectAvgData
          options: {
            xaxis: {
              categories: subjectAvgData.map(item => item.label), // Set x-axis categories to subject names
            },
            yaxis: {
              min: 0,  // Set the minimum value of the y-axis
              max: 10, // Set the maximum value of the y-axis to 10
            }
          }
        }}
      />
    </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentSubject
            title="Current Subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
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
