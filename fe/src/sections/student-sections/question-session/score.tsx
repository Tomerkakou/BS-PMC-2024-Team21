import { Avatar, Stack, Theme, Typography } from '@mui/material'
import React, { useMemo } from 'react'

const Score = ({value}:{value:number}) => {
    const {color}=useMemo(()=>{
        if(value<4){
            return {color:(theme:Theme)=>theme.palette.error.dark}
        }
        else if(value<8){
            return {color:(theme:Theme)=>theme.palette.warning.main}
        }
        else{
            return {color:(theme:Theme)=>theme.palette.success.main}
        }
    },[value])

  return (
    <Stack direction='row' spacing={1} sx={{display:'flex',alignItems:'end'}}>
        <Typography variant="subtitle1">Score:</Typography>
        <Typography variant='h5' sx={{color}}>{value}</Typography>
        {value>7 && <Avatar src="/assets/trophy.gif" />}
    </Stack>
  )
}

export default Score