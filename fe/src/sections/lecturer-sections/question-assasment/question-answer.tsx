import { LoadingButton } from '@mui/lab';
import { Grid, Stack, styled, TextField, Tooltip, tooltipClasses, TooltipProps, Typography } from '@mui/material';
import axios from 'axios';
import { TextInput } from 'components/Inputs';
import React from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export interface QuestionAnswer{
  answer_id:number;
  subject:string;
  level:string;
  qtype:string;
  auto_assasment:string;
  student_name:string;
  question:string;
  answer:string;
  score:number;
  assasment:string;
  createdAt:Date;
}

const QuestionAnswerView:React.FC<QuestionAnswer> = (props) => {

  const {control,handleSubmit,formState}=useForm<{assasment:string,score:number}>({
    defaultValues:{
      score:props.score,
      assasment:props.assasment
    }
  }); 

  const onSubmit = async (data:{assasment:string,score:number}) => {
    try{
      //save assasment
      const response = await axios.post(`/question/assasment/${props.answer_id}`,data);
      toast.success(response.data);
    }
    catch(e:any){
      if(e.response){
        toast.error(e.response.data);
      }
      console.log(e);
    }
  }

  return (
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <HtmlTooltip
            placement="bottom-start"
            title={
              <React.Fragment>
                <Stack spacing={1} sx={{mb:2}}>
                    <Typography variant="subtitle1">{`Subject: ${props.subject}`}</Typography>
                    <Typography variant="subtitle1">{`Level: ${props.level}`}</Typography>
                    <Typography variant="subtitle1">{`Type: ${props.qtype}`}</Typography>
                    <Typography variant="subtitle1">{`Question: ${props.question}`}</Typography>
                </Stack>
              </React.Fragment>
            }
          >
            <Typography variant="subtitle1">{`Student name: ${props.student_name}`}</Typography>
          </HtmlTooltip>
        </Grid>
        <Grid item xs={6}>
          <TextField label="Answer" inputProps={{readOnly:true}} multiline rows={15} value={props.answer} fullWidth/>
        </Grid>
        <Grid item xs={6}>
          <Stack spacing={1}>
            <TextField label="AI Assasment" inputProps={{readOnly:true}} multiline rows={5} value={props.auto_assasment}/>
            <TextInput fieldName="assasment" label="Your Assasment" control={control} multiline={5} rules={{required:"Assasment is required!"}}/>
            <TextInput fieldName="score" label="Score" control={control} rules={{required:"Score is required!",valueAsNumber:true,min:1,max:10}}/>
          </Stack>
        </Grid>
        <Grid item xs={12} sx={{display:'flex',justifyContent:'end'}}>
          <LoadingButton loading={formState.isSubmitting} onClick={handleSubmit(onSubmit)}>
            Save Assasment
          </LoadingButton>
        </Grid>
      </Grid>
  )
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

export default QuestionAnswerView