import { Grid, Theme, useMediaQuery } from '@mui/material';
import { TextInput } from 'components/Inputs';
import React from 'react'
import { useFormContext } from 'react-hook-form';

const SingleChoice = () => {
    const matches=useMediaQuery((theme:Theme) => theme.breakpoints.up('lg'));
    const {control}=useFormContext();
  return (
    <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
            <TextInput control={control} multiline={matches ? 20 : 10} fieldName='question' label='Question'
                rules={{required:'Question is required'}}
            />
        </Grid>
        <Grid item xs={12} lg={6}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextInput control={control} fieldName='correct_answer' label='Correct Answer'
                        rules={{required:'Correct Answer is required'}}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextInput control={control} fieldName='option2' label='Option 2'
                        rules={{required:'Option 2 is required'}}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextInput control={control} fieldName='option3' label='Option 3'
                        rules={{required:'Option 3 is required'}}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextInput control={control} fieldName='option4' label='Option 4'
                        rules={{required:'Option 4 is required'}}
                    />
                </Grid>
            </Grid>
        </Grid>
    </Grid>
  )
}

export default SingleChoice