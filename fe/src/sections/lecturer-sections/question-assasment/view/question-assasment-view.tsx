import { Box, Card, Container, Grid, Stack, Typography } from '@mui/material';
import axios from 'axios';
import LayoutSplashScreen from 'layouts/dashboard/common/LayoutSplashScreen';
import { useEffect, useState } from 'react';
import { QuestionAnswer } from '../question-answer';
import QuestionAnswerView from '../question-answer';
import { useSearchParams } from 'react-router-dom';
import QuestionSort from '../question-sort';


const QuestionAssasment = () => {
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<QuestionAnswer[]>([]);
    const [searchParams] = useSearchParams();
    
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const id=searchParams.get('id');
                const by=searchParams.get('by');
                let params=''
                if(id && by){
                    params=`?id=${id}&by=${by}`;
                }
                //fetch questions from server
                const response = await axios.get<QuestionAnswer[]>(`/question/answered${params}`);
                const result=response.data.map((question)=>({...question,createdAt:new Date(question.createdAt)}));
                setQuestions(result);
            } catch (e:any) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        }
        fetchQuestions();
    }, [searchParams]);


  return (
    <>
        {loading && <LayoutSplashScreen/>}
        {!loading && <Container sx={{p:1,width:1}}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Question Assasment</Typography>
                <Box>
                    <QuestionSort setQuestions={setQuestions}/>
                </Box>
            </Stack>
            <Grid container spacing={2}>
                {questions.map((question,index)=>(
                <Grid item xs={12} md={6} key={question.answer_id}>
                    <Card sx={{p:2}}>
                            <QuestionAnswerView {...question}/>
                    </Card>
                </Grid>
                ))}
            </Grid>
        </Container>}
    </>
  )
}

export default QuestionAssasment