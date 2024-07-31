import React, { useMemo } from 'react'
import { SingleChoice } from './types';
import { useController, useFormContext } from 'react-hook-form';
import { FormControl, FormControlLabel, FormHelperText, FormLabel, Radio, RadioGroup } from '@mui/material';

interface SingleChoiceQuestionViewProps {
    question: SingleChoice;
    readOnly?:boolean;
}

const SingleChoiceQuestionView:React.FC<SingleChoiceQuestionViewProps> = ({question,readOnly}) => {
    const {control}=useFormContext();
    const {field,fieldState}=useController({
        control,
        name:"answer",
        rules:{
            required:"Please select at least one answer!"
        },
        defaultValue:null
    })

    const suffle=useMemo(()=>shuffleArray(question.options),[question.options]);
  return (
    <FormControl sx={{ m: 3 }} error={fieldState.invalid} variant="standard">
        <FormLabel>Answers:</FormLabel>
        <RadioGroup
            value={field.value}
            onChange={field.onChange}
        >
        {suffle.map((option,index)=>(
            <FormControlLabel key={index} value={option} control={<Radio />} label={option} disabled={readOnly && option!==field.value} />
        ))}
        </RadioGroup>
        <FormHelperText>{fieldState.error?.message ?? "Choose wisley"}</FormHelperText>
    </FormControl>
  )
}

function shuffleArray(array:any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export default SingleChoiceQuestionView