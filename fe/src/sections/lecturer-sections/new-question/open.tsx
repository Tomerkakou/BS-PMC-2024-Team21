import { Grid, Theme, useMediaQuery } from '@mui/material';
import { TextInput } from 'components/Inputs';
import React from 'react'
import { useFormContext } from 'react-hook-form'

const Open = () => {
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
            <TextInput control={control} multiline={matches ? 20 : 10} fieldName='correct_answer' label='Answer'
                rules={{required:'Answer is required'}}
            />
        </Grid>
    </Grid>
  )
}

export default Open