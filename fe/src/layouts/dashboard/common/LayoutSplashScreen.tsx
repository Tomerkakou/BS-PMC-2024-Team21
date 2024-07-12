import { Box, CircularProgress, Stack } from '@mui/material'
import Logo from 'components/logo'
import React from 'react'

const LayoutSplashScreen = () => {
  return (
    <Box sx={{postion:'absolute',
      top:0,left:0,
      height:'100vh',width:'100vw',
      zIndex:99999999999,
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
    }}>
        <Stack sx={{
          display:'flex',
          justifyContent:'center',
          alignItems:'center',
        }}>
          <Logo sx={{
            height:'20vh',
            width:'20vw',
            transform: 'translate(-80%, -20%)',
          }}/>
            <Box>
            <svg width={0} height={0}>
              <defs>
                <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#e01cd5" />
                  <stop offset="100%" stopColor="#1CB5E0" />
                </linearGradient>
              </defs>
            </svg>
            <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
          </Box>
        </Stack>
    </Box>
  )
}

export default LayoutSplashScreen