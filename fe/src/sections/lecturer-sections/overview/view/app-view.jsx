
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';


import { useAuth } from 'auth';
import axios from 'axios';
import { useEffect, useState } from 'react';
import StudentsTableView from '../student-average-table';
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
        <Grid xs={12}>
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
      </Grid>
    </Container>
  );
}
