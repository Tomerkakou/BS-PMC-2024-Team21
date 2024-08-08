import { useState } from 'react';


import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useAuth } from 'auth';
import { useNavigate } from 'react-router-dom';
import Iconify from 'components/iconify';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    route:'/'
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const { logout,currentUser } = useAuth();
  const displayName = `${currentUser.firstName} ${currentUser.lastName}`;
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };
  const navigate = useNavigate();

  const handleClose = (event,route) => {
    event.stopPropagation();
    setOpen(null);
    if(route!=='backdropClick'){
      setTimeout(() => 
        navigate(route), 300);
    }
  };

  const handleLogout = () => {
    window.location.href = '/auth/login'
    logout();
  }

  return (
    <>
      <IconButton
        onClick={handleOpen}
        id="account-popover"
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Iconify icon="eva:menu-outline" />
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {currentUser.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem key={option.label} id={option.label} onClick={(e)=>handleClose(e,option.route)}>
            {option.label}
          </MenuItem>
        ))}

        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleLogout}
          id="btn-logout"
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
        >
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
