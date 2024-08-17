import { Card, Stack, Step, StepLabel, Stepper, styled, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import { QontoConnector, QontoStepIcon } from 'components/stepper';
import { useLayoutEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Step1 from '../step1';
import Step2 from '../step2';
import axios from 'axios';
import { toast } from 'react-toastify';
import Step3 from '../step3';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import { grey, yellow } from '@mui/material/colors';

interface FormValues {
  step1:{
    shortDescription: string;
    qtype: string;
    level: string;
    subject: string;
  },
  step2:any
}

const NewQuestion = () => {

  const [step,setStep]=useState<number>(-1); //do not render anyhing until we have the data
  const navigate =useNavigate();
  const methods=useForm<FormValues>();
  const {id} = useParams();
  const [loading,setLoading]=useState(false);
  const [ai,setAi]=useState(false);

  useLayoutEffect(() => {
      const fetchEdit= async () => {
        try{
          const res=await axios.get(`/lecturer/question/${id}`);
          methods.setValue("step1",res.data.step1);
          methods.setValue("step2",res.data.step2);
          setStep(0);
        }
        catch(e:any){
          if(e.response){
            navigate('/questions', { state: { message: e.response.data } });
          }
          console.log(e);
        }
      }
      if(id){
        fetchEdit();
      }
      else{
        setStep(0);
      }
  },[id,methods,navigate]);

  const handleStep1 = (data:any) => {
    if(!id && (data.qtype!==methods.getValues("step1.qtype") || data.subject!==methods.getValues("step1.subject"))){
      setAi(false);
      methods.resetField('step2');
    }
    methods.setValue("step1",data);
    setStep(step+1);
  }

  const handleStep2 = async (data:any) => {
    if(id){
      try{
        await axios.patch(`/lecturer/question/${id}`,{
          ...methods.getValues("step1"),
          ...data,
        });
        setStep(step+2);
      }
      catch(e:any){
        if(e.response){
          toast.error(e.response.data.message);
        }
        console.log(e);
      }
    }
    else{
      try{
        await axios.post('/lecturer/new-question',{
          ...methods.getValues("step1"),
          ...data,
          using_ai:ai,
        });
        
        setStep(step+2);
      }
      catch(e:any){
        if(e.response){
          toast.error(e.response.data.message);
        }
        console.log(e);
      }
    }
  }

  const generateWithAI = async () => {
    setLoading(true);
    try{
      const res=await axios.get('/question/generate');
      console.log(res.data);
      methods.setValue("step1",res.data.step1);
      methods.setValue("step2",res.data.step2);
      setAi(true);
      toast.success("Question generated successfully!\nPlease review the question before saving.");
    }
    catch(e:any){
      if(e.response){
        toast.error(e.response.data.message);
      }
      console.log(e);
    }
    finally{
      setLoading(false);
    }
  }

  const reset=()=>{
    if(id){
      navigate("/new-question")
    }
    else{
      methods.reset();
      setStep(0);
      setAi(false);
    }
  }

  const title = id ? "Edit Question" : "New Question";

  return (
    <Container sx={{p:1}}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">{title}</Typography>
        {!id && step===0 && <HintBtn id="generate-btn" loading={loading} onClick={generateWithAI}> 
          Generate With AI
        </HintBtn>}
      </Stack>
      <Card sx={{p:2,display:'flex',flexGrow:1,flexDirection:'column'}}>
        <Stepper alternativeLabel activeStep={step} connector={<QontoConnector />} sx={{mb:5}}>
            <Step>
              <StepLabel StepIconComponent={QontoStepIcon}>Basic Data</StepLabel>
            </Step>
            <Step>
              <StepLabel StepIconComponent={QontoStepIcon}>Question</StepLabel>
            </Step>
            <Step>
              <StepLabel StepIconComponent={QontoStepIcon}>Complete</StepLabel>
            </Step>
        </Stepper>
        <FormProvider {...methods}>
        {step===0 && 
          <Step1 saveStep={handleStep1} edit={Boolean(id)}/>
        }
        {step===1 &&
          <Step2 questionType={methods.getValues("step1.qtype")} saveStep={handleStep2} back={()=>setStep(step-1)} language={methods.getValues("step1.subject")}/>
        }
        {step===3 &&
          <Step3 reset={reset}/>
        }
        </FormProvider>
      </Card>
    </Container>
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

export default NewQuestion