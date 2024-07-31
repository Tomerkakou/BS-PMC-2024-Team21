import React from 'react'
import { Coding } from './types';
import { useController, useFormContext } from 'react-hook-form';
import { Box, Typography } from '@mui/material';
import { CodeEditor } from 'components/CodeEditor';

interface CodingQuestionViewProps {
    question: Coding;
    readOnly?:boolean;
}

const CodingQuestionView:React.FC<CodingQuestionViewProps> = ({question,readOnly}) => {
    const {control}=useFormContext();
    const {field,fieldState}=useController({
        control,
        name:"answer",
        defaultValue:question.template ?? "",
        rules:{
            required:"Answer is required!"
        }
    })
    
  return (
    <Box>
        {fieldState.invalid && <Typography variant='h6' sx={{color:theme=>theme.palette.error.dark}}>{fieldState.error?.message}</Typography>}
        <Box sx={{height:600}}>
            <CodeEditor language={question.subject} value={field.value} onChange={field.onChange} readOnly={readOnly}/>
        </Box>
    </Box>
  )
}

export default CodingQuestionView