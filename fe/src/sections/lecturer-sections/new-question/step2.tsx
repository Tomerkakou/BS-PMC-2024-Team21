import { LoadingButton } from '@mui/lab';
import { Button, Stack } from '@mui/material';
import React, { useMemo } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import Coding from './coding';
import Open from './open';
import SingleChoice from './single-choice';


interface Step1Props {
    questionType: string;
    language: string;
    back: () => void;
    saveStep: (data:any) => void;
}

const Step2:React.FC<Step1Props> = ({questionType,saveStep,back,language}) => {
    const {getValues}=useFormContext();
    const methods=useForm({
        shouldUnregister:true,
        defaultValues:getValues("step2"),
    })

    const children = useMemo(() => {
        switch (questionType) {
            case 'Single Choice':
                return <SingleChoice/>
            case 'Open':
                return <Open/>
            case 'Coding':
                return <Coding language={language}/>
            default:
                return null;
        }
    }, [questionType,language])

  return (
    <Stack sx={{
        display:'flex',
        flexDirection:'column',
        alignContent:'space-between',
        height:1
      }}>
        <FormProvider {...methods}>
            {children}
        </FormProvider>
        <Stack direction='row' spacing={2} sx={{
            mt:2,
            display:'flex',
            justifyContent:'space-evenly'
        }}>
            <Button onClick={back}>
                Back
            </Button>
            <LoadingButton id='save-question-btn' onClick={methods.handleSubmit(saveStep)} loading={methods.formState.isSubmitting}>
                Save Question
            </LoadingButton>
        </Stack>
    </Stack>
  )
}

export default Step2