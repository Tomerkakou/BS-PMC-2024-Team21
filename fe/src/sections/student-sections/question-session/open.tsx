import React from 'react'
import { Question } from './types';
import { useFormContext } from 'react-hook-form';
import { TextInput } from 'components/Inputs';

interface OpenQuestionViewProps {
    question: Question;
    readOnly?:boolean;
}

const OpenQuestionView:React.FC<OpenQuestionViewProps> = ({readOnly}) => {

    const {control}=useFormContext();
  return (
    <TextInput control={control} label={readOnly ? "Correct Answer":"Answer Here"} fieldName="answer" rules={{required:"Answer is required!"}} multiline={15} readonly={readOnly}/>
  )
}

export default OpenQuestionView