import { LoadingButton } from '@mui/lab';
import { Card, Container, Stack, Typography } from '@mui/material';
import { SelectInput } from 'components/Inputs';
import React from 'react';
import { useForm } from 'react-hook-form';

export interface SessionValues {
    level: string[];
    subject: string[];
    qtype: string[];
}

interface StartSessionProps {
    handleStartSession: (data: SessionValues) => void;
}
const StartSession:React.FC<StartSessionProps> = ({handleStartSession}) => {
    const {control,handleSubmit,formState,reset}=useForm<SessionValues>();

    const onSubmit = async (data: SessionValues) => {
        await handleStartSession(data);
        reset();
    }

  return (
    <Container sx={{p:1}}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Start New Session</Typography>
      </Stack>
      <Card sx={{p:2,display:'flex',flexGrow:1,flexDirection:'column'}}>
        <Stack spacing={4} sx={{maxWidth:600,mb:3}}>
            <SelectInput control={control} fieldName="level" label="Level" isMulti options={["Easy",'Medium','Hard']} />
            <SelectInput control={control} fieldName="subject" label="Subject" isMulti options={["C#",'Python','Java','JavaScript','SQL']} />
            <SelectInput control={control} fieldName="qtype" label="Question Type" isMulti options={["Single Choice","Open","Coding"]} />
        </Stack>
        <LoadingButton onClick={handleSubmit(onSubmit)} loading={formState.isSubmitting}>
            Start Session
        </LoadingButton>
      </Card>
    </Container>
  )
}

export default StartSession