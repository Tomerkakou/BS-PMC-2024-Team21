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
  const { currentUser } = useAuth();  // Get the current user information from the authentication context

  // State to store data for the student's progress chart
  const [chartData, setChartData] = useState({
    labels: [],
    series: []
  });

  // State to store data for the subject answer count pie chart
  const [pizzaChartData, setPizzaChartData] = useState([]);

  // State to store data for the subject average grades chart
  const [subjectAvgData, setSubjectAvgData] = useState([]);

  // useEffect to fetch and set data for the student's progress over time
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/student/student-progress");  // Fetch student's progress data
        const { date_ranges, grades_by_subject } = response.data;

        const labels = date_ranges;  // Set labels to date ranges

        // Transform the grades by subject into a series format suitable for the chart
        const series = Object.keys(grades_by_subject).map(subject => ({
          name: subject,
          type: 'line',  // Define the type of chart
          fill: 'solid',  // Define the fill type
          data: grades_by_subject[subject]
        }));

        setChartData({ labels, series });  // Update the chart data state
      } catch (e) {
        console.log(e);  // Log any errors
      }
    })();
  }, []);

  // useEffect to fetch and set data for the subject answer count chart
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/student/student-answer-count");  // Fetch student's answer count data by subject
        const data = response.data;
        const series = Object.keys(data).map(subject => ({
          label: subject,
          value: data[subject],
        }));

        setPizzaChartData(series);  // Update the pizza (pie) chart data state
      } catch (e) {
        console.log(e);  // Log any errors
      }
    })();
  }, []);

  // useEffect to fetch and set data for the subject average grades chart
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/student/subject-averages");  // Fetch student's average grades data by subject
        const data = response.data;
        const series = Object.keys(data).map(subject => ({
          label: subject,
          value: data[subject],
        }));

        setSubjectAvgData(series);  // Update the subject averages data state
      } catch (e) {
        console.log(e);  // Log any errors
      }
    })();
  }, []);
  
  return (
    <Container maxWidth="xl">  {/* Container to manage the layout width */}
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi {currentUser.firstName}, Welcome back 👋  {/* Display a welcome message with the user's first name */}
      </Typography>

      <Grid container spacing={3}>
        {/* Grid item for the Student Progress chart */}
        <Grid xs={12} md={6} lg={8}>
          <StudentProgress
            title="Student Progress"
            subheader="Progress over the last 30 days"
            chart={{
              ...chartData,  // Pass the dynamic chart data
              options: {
                yaxis: {
                  min: 0,
                  max: 10,
                  labels: {
                    formatter: function (value) {
                      return value.toFixed(0);  // Display whole numbers only (0 decimal places)
                    }
                  }
                },
                tooltip: {
                  y: {
                    formatter: function (value) {
                      return value.toFixed(1) + " Average";  // Show one decimal place in tooltip
                    }
                  }
                }
              }
            }}
          />
        </Grid>

        {/* Grid item for the Subject Answer Count chart */}
        <Grid xs={12} md={6} lg={4}>
          <SubjectAnswerCount
            title="Subject Answer Count"
            chart={{
              series: pizzaChartData,  // Pass the dynamic pizza chart data
            }}
          />
        </Grid>

        {/* Grid item for the Student Subject Averages chart */}
        <Grid xs={12}>
          <StudentSubjectAverages
            title="Student Subject Averages"
            subheader="Average grades per subject"
            chart={{
              series: subjectAvgData,  // Pass the dynamic subject averages data
              options: {
                xaxis: {
                  categories: subjectAvgData.map(item => item.label),  // Set x-axis categories to subject names
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
