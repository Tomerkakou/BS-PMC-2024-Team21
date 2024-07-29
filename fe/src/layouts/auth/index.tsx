
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';

import { bgGradient } from 'theme/css';

import Logo from 'components/logo';

interface AuthLayoutProps {
    children?: React.ReactNode;
}

const AuthLayout:React.FC<AuthLayoutProps> = ({children}) => {
    const theme = useTheme();
  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />
      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            maxWidth: 800,
            minWidth:420,
            maxHeight: 0.75,
            overflow: 'auto',
          }}
        >
          {children}
        </Card>
      </Stack>
    </Box>
  )
}

export default AuthLayout