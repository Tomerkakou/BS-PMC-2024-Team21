import { Box, Button, Stack } from '@mui/material';
import { SelectInput, TextInput } from 'components/Inputs';
import React, { useLayoutEffect } from 'react';
import { useForm, useFormContext, useWatch } from 'react-hook-form';

interface FormValues {
    shortDescription: string;
    qtype: string;
    level: string;
    subject: string;
}

interface Step1Props {
    saveStep: (data: FormValues) => void;
    edit: boolean;
}

const Step1:React.FC<Step1Props> = ({saveStep,edit}) => {
    const methods=useFormContext();
    const {control,handleSubmit,reset}=useForm<FormValues>({
        defaultValues:methods.getValues("step1"),
    })
    const step1=useWatch({name:'step1',control:methods.control});
    useLayoutEffect(() => {
        if(step1){
            reset(methods.getValues("step1"));
        }
    },[methods,reset,step1])

  return (
    <Box sx={{
        display:'flex',
        flexDirection:'column',
        alignContent:'space-between',
        
      }}>
        <Stack spacing={2} sx={{maxWidth:500,mb:3}}>
            <TextInput fieldName="shortDescription" label="Short Description" control={control} 
                rules={{required:'Short Description is required',maxLength:{value:100,message:'Short Description is too long'}}}
            />
            <SelectInput fieldName="subject" label="Subject" control={control} options={["C#",'Python','Java','JavaScript','SQL']}
                rules={{required:'Subject is required'}}
            />
            <SelectInput fieldName="level" label="Level" control={control} options={["Easy",'Medium','Hard']}
                rules={{required:'Level is required'}}
            />
            <SelectInput fieldName="qtype" label="Question Type" control={control} options={["Single Choice","Open","Coding"]}
                rules={{required:'Question Type is required'}}
                readonly={edit}
                helperText={edit ? "Question Type cannot be changed after creation" : undefined}
            />
        </Stack>
        <Stack direction='row' spacing={2} sx={{
            display:'flex',
            justifyContent:'space-evenly'
        }}>
            <Button disabled>
                Back
            </Button>
            <Button id="next-step-btn" onClick={handleSubmit(saveStep)}>
                Next Step
            </Button>
        </Stack>
    </Box>
  )
}

export default Step1