import { useEffect,useMemo,useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';

import { usePathname } from 'routes/hooks';
import { RouterLink } from 'routes/components';

import { useResponsive } from 'hooks/use-responsive';


import Logo from 'components/logo';
import Scrollbar from 'components/scrollbar';

import { NAV } from './config-layout';
import navConfig from './config-navigation';
import { useAuth } from 'auth';
import SvgColor from 'components/svg-color';
import axios from "axios";
import MainModal from 'components/MainModal';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';
import Iconify from 'components/iconify';

// ----------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav }) {
  const pathname = usePathname();
  const {currentUser}=useAuth();
  const upLg = useResponsive('up', 'lg');
  const [open,setOpen]=useState(false);
  const [loading,setLoading]=useState(false);

  const navlinks=useMemo(()=>navConfig[currentUser?.role],[currentUser])

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderAccount = (
    <Box
      sx={{
        my: 3,
        mx: 2.5,
        py: 2,
        px: 2.5,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
      }}
    >
      <Avatar src={currentUser.avatar} alt="photoURL" />

      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2">{`${currentUser.firstName} ${currentUser.lastName}`}</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {currentUser.role}
        </Typography>
      </Box>
    </Box>
  );

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {navlinks.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
      {currentUser.role==="Student" && 
      <>
          <ListItemButton 
          id= "grades-report-btn"
          onClick = {()=>setOpen(true)}
          sx={{
            minHeight: 44,
            borderRadius: 0.75,
            typography: 'body2',
            color: 'text.secondary',
            textTransform: 'capitalize',
            fontWeight: 'fontWeightMedium',
          }}
        >
          <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
          <SvgColor src={`/assets/icons/navbar/ic_student_grade_report.svg`} sx={{ width: 1, height: 1 }} />
          </Box>
          <Box component="span">grades report</Box>
        </ListItemButton>
        <MainModal open={open} 
          handleClose={()=>setOpen(false)}
          title='Export Grades Report'
          xBtn
        >
          <Stack spacing={3}>
            <Button onClick={async () => {
              try {
                const response = await axios.get("/student/get-grades", {
                  responseType: "blob",
                });
                const fileURL = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
                window.open(fileURL);
              } catch (error) {
                console.error("Error openning the PDF:", error);
              }
              finally{
                setOpen(false);
              }
            }}
            endIcon={<Iconify icon="eva:external-link-outline"/>}
            >
              View
            </Button>
            <Button onClick={async () => {
              try {
                const response = await axios.get("/student/get-grades", {
                  responseType: "blob",
                });
                const fileURL = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
                const link = document.createElement('a');
                link.href = fileURL;
                link.download = 'grades.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(fileURL);
              } catch (error) {
                console.error("Error downloading the PDF:", error);
              }
              finally{
                setOpen(false);
              }
            }}
            endIcon={<Iconify icon="eva:save-outline"/>}
            >
              Download
            </Button>
            <LoadingButton onClick={async () => {
                setLoading(true);
                try {
                  await axios.get("/student/get-grades?email=True");
                  toast.success('Email with grades report sent successfuly!')
                } catch (error) {
                  console.error("Error sending the PDF:", error);
                }
                finally{
                  setOpen(false);
                  setLoading(false);
                }
              }} 
              loading={loading}
              endIcon={<Iconify icon="eva:paper-plane-outline"/>}
              id="view-report"
            >
              Send to Email
            </LoadingButton>
          </Stack>
        </MainModal>
      </>
}
    </Stack>
  );


  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Logo sx={{ mt: 3, ml: 4 }} />

      {renderAccount}

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />

    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function NavItem({ item }) {
  const pathname = usePathname();

  const active = item.path === pathname;

  return (
    <ListItemButton
      component={RouterLink}
      href={item.path}
      sx={{
        minHeight: 44,
        borderRadius: 0.75,
        typography: 'body2',
        color: 'text.secondary',
        textTransform: 'capitalize',
        fontWeight: 'fontWeightMedium',
        ...(active && {
          color: 'primary.main',
          fontWeight: 'fontWeightSemiBold',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
          },
        }),
      }}
    >
      <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
        {item.icon}
      </Box>

      <Box component="span">{item.title} </Box>
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};
