import { Box, Button, Stack } from '@mui/material';
import { SelectInput, TextInput } from 'components/Inputs';
import React from 'react';
import { useForm, useFormContext } from 'react-hook-form';

interface FormValues {
    shortDescription: string;
    qtype: string;
    level: string;
    subject: string;
}

interface Step1Props {
    saveStep: (data: FormValues) => void;
}

const Step1:React.FC<Step1Props> = ({saveStep}) => {
    const {getValues}=useFormContext();
    const {control,handleSubmit}=useForm<FormValues>({
        defaultValues:getValues("step1"),
    })

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
            />
        </Stack>
        <Stack direction='row' spacing={2} sx={{
            display:'flex',
            justifyContent:'space-evenly'
        }}>
            <Button disabled>
                Back
            </Button>
            <Button onClick={handleSubmit(saveStep)}>
                Next Step
            </Button>
        </Stack>
    </Box>
  )
}

export default Step1