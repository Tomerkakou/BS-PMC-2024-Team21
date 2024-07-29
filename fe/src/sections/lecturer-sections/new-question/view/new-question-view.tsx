import { Card, Stack, Step, StepLabel, Stepper, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import { QontoConnector, QontoStepIcon } from 'components/stepper';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Step1 from '../step1';
import Step2 from '../step2';
import axios from 'axios';
import { toast } from 'react-toastify';
import Step3 from '../step3';

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

  const [step,setStep]=useState<number>(0);
  const methods=useForm<FormValues>();

  const handleStep1 = (data:any) => {
    if(data.qtype!==methods.getValues("step1.qtype") || data.subject!==methods.getValues("step1.subject")){
      methods.resetField('step2');
    }
    methods.setValue("step1",data);
    setStep(step+1);
  }

  const handleStep2 = async (data:any) => {
    try{
      await axios.post('/lecturer/new-question',{
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
  return (
    <Container sx={{p:1}}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">New Question</Typography>
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
          <Step1 saveStep={handleStep1}/>
        }
        {step===1 &&
          <Step2 questionType={methods.getValues("step1.qtype")} saveStep={handleStep2} back={()=>setStep(step-1)} language={methods.getValues("step1.subject")}/>
        }
        {step===3 &&
          <Step3/>
        }
        </FormProvider>
      </Card>
    </Container>
  )
}

export default NewQuestion