
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';


import { useAuth } from 'auth';
import axios from 'axios';
import { useEffect, useState } from 'react';
import AppWidgetSummary from '../app-widget-summary';
import StudentProgress from '../student-progress';
import StudentSubjectAverages from '../student-subject-averages';
import SubjectAnswerCount from '../subject-answer-count';

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
        <Grid xs={12}>
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
      </Grid>
    </Container>
  );
}
