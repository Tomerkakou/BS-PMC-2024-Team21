import React, { useState } from 'react'
import StartSession, { SessionValues } from '../start-session'
import { FormProvider, useForm } from 'react-hook-form';
import { Coding, Evaluation, Question, SingleChoice } from '../types';
import CodingQuestionView from '../coding';
import SingleChoiceQuestionView from '../single-choice';
import OpenQuestionView from '../open';
import { Card, Container, Stack, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { toast } from 'react-toastify';
import Score from '../score';
import styled from '@emotion/styled';
import { yellow,grey } from '@mui/material/colors';
import Iconify from 'components/iconify';
import MainModal from 'components/MainModal';

const QuestionSessionView = () => {
  const [session, setSession] = useState<SessionValues>();
  const [question, setQuestion] = useState<Question | Coding | SingleChoice>();
  const [evaluation, setEvaluation] = useState<Evaluation>();
  const [loading, setLoading] = useState(false);
  const [hintloading, setHintLoading] = useState(false);
  const [hint,setHint]=useState<string>();

  const methods=useForm<{answer:string}>();
  const fetchQuestion = async ({level,subject,qtype}:SessionValues) => {
    try{
      //fetch question from server
      const response = await axios.post('/question/',{level,subject,qtype});
      methods.reset();
      setQuestion(response.data);
      setSession({level,subject,qtype});
    }
    catch(err:any){
      if(err.response && err.response.status===404){
        setSession(undefined);
        setQuestion(undefined);
        if(question){
          toast.info("You Have Completed All Questions For This Session!\nStart A New Session When You Are Ready :)");
        }
        else{
          //start of session
          toast.error(err.response.data);
        }
      }
      console.log(err);
    }
  }

  const handleStartSession = async (data: SessionValues) => {
    await fetchQuestion(data);
  }

  const handleAnswer = async ({answer}: {answer:string}) => {
    //submit answer
    try{
      const response = await axios.post<Evaluation>('/question/validate-answer',{answer,question_id:question?.id});
      methods.setValue("answer",response.data.correct_answer);
      setEvaluation(response.data);
    }
    catch(err){
      toast.error("Failed To Submit Answer! :(");
    }
  }

  const handleNextQuestion = async () => {
    //fetch next question
    setLoading(true);
    setEvaluation(undefined);
    await fetchQuestion(session!);
    setLoading(false);
  }

  const GenerateHint=async ()=>{
    setHintLoading(true);
    try{
      const answer=methods.getValues("answer");
      const response = await axios.post<string>('/question/hint',{question_id:question?.id,answer});
      setHint(response.data);
    }
    catch(err){
      toast.error("Failed To Generate Hint! :(");
    }
    finally{
      setHintLoading(false);
    }
  }

  return (
    <>
      {!session && <StartSession handleStartSession={handleStartSession} />}
      {session && 
        <Container sx={{p:1}}>
          {question && <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4">{`${question.qtype} Question!`}</Typography>
            <HintBtn 
              startIcon={<Iconify icon="mdi:stars-outline" sx={{mr:1}}/>} 
              sx={{mr:2}}
              onClick={GenerateHint}
              loading={hintloading}
            >
              Generate Hint
            </HintBtn>
          </Stack>}
          <Card sx={{p:2,display:'flex',flexGrow:1,flexDirection:'column'}}>
            {question && <>
              <Stack spacing={1} sx={{mb:2}}>
                <Typography variant="subtitle1">{`Subject: ${question?.subject}`}</Typography>
                <Typography variant="subtitle1">{`Level: ${question?.level}`}</Typography>
                <Typography variant="subtitle1">{`Description: ${question?.description}`}</Typography>
                {evaluation && <Score value={evaluation.score} />}
              </Stack>
              <TextField 
                  label={evaluation && question.qtype!=="Single Choice" ? "Assament" : "Question" }
                  value={evaluation && question.qtype!=="Single Choice" ? evaluation.assessment:question?.question} 
                  variant="outlined" 
                  InputProps={{
                    readOnly: true,
                  }}
                  multiline 
                  rows={6}
                  fullWidth 
                  sx={{my:2}}
                />
              <FormProvider {...methods}>
                  {question.qtype==="Coding" && <CodingQuestionView  question={question as Coding} readOnly={Boolean(evaluation)}/>}
                  {question.qtype==="Single Choice" && <SingleChoiceQuestionView question={question as SingleChoice} readOnly={Boolean(evaluation)}/>}
                  {question.qtype==="Open" && <OpenQuestionView  question={question} readOnly={Boolean(evaluation)}/>}
              </FormProvider>
              {!evaluation ? <LoadingButton loading={methods.formState.isSubmitting} onClick={methods.handleSubmit(handleAnswer)} sx={{mt:2}}>
                Check Answer
              </LoadingButton>
              :
              <LoadingButton onClick={handleNextQuestion} loading={loading} sx={{mt:2}}>
                Next Question
              </LoadingButton>
              }
            </>}
          </Card>
        </Container>
      }
      <MainModal open={Boolean(hint)} 
        handleClose={()=>setHint(undefined)} 
        title="Hint" 
        xBtn
        sx={{width:0.6}}
      >
        <Typography variant="subtitle1">{hint}</Typography>
      </MainModal>
    </>
  )
}

const HintBtn = styled(LoadingButton)(({ theme }) => ({
  backgroundColor: 'black',
  color: 'white',
  transition: 'all 0.3s ease',
  '&:hover': {
    color: yellow[400],
    transform: 'scale(1.2)',
    backgroundColor:  grey[500],
  },
}));

export default QuestionSessionView