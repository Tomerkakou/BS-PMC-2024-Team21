import { useState,useEffect } from 'react';
import PropTypes from 'prop-types';
import { set, sub } from 'date-fns';
import { faker } from '@faker-js/faker';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import { fToNow } from 'utils/format-time';

import Iconify from 'components/iconify';
import Scrollbar from 'components/scrollbar';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io(process.env.REACT_APP_SOCKET_URL ?? '');
// ----------------------------------------------------------------------

const NOTIFICATIONS = [
  {
    id: faker.string.uuid(),
    title: 'Your order is placed',
    description: 'waiting for shipping',
    avatar: null,
    type: 'order_placed',
    createdAt: set(new Date(), { hours: 10, minutes: 30 }),
    isUnRead: true,
  },
  {
    id: faker.string.uuid(),
    title: faker.person.fullName(),
    description: 'answered to your comment on the Minimal',
    avatar: '/assets/images/avatars/avatar_2.jpg',
    type: 'friend_interactive',
    createdAt: sub(new Date(), { hours: 3, minutes: 30 }),
    isUnRead: true,
  },
  {
    id: faker.string.uuid(),
    title: 'You have new message',
    description: '5 unread messages',
    avatar: null,
    type: 'chat_message',
    createdAt: sub(new Date(), { days: 1, hours: 3, minutes: 30 }),
    isUnRead: false,
  },
  {
    id: faker.string.uuid(),
    title: 'You have new mail',
    description: 'sent from Guido Padberg',
    avatar: null,
    type: 'mail',
    createdAt: sub(new Date(), { days: 2, hours: 3, minutes: 30 }),
    isUnRead: false,
  },
  {
    id: faker.string.uuid(),
    title: 'Delivery processing',
    description: 'Your order is being shipped',
    avatar: null,
    type: 'order_shipped',
    createdAt: sub(new Date(), { days: 3, hours: 3, minutes: 30 }),
    isUnRead: false,
  },
];

interface NotificationItemProps{
  title:string;
  message:string;
  belongTo?:string;
  type:string;
  id:number;
  createdAt:Date;
  avatar?:string;
}
export default function NotificationsPopover() {
  const [notifications, setNotifications] = useState<NotificationItemProps[]>([]);
  const [open, setOpen] = useState(null);
  
  useEffect(()=>{
    (async ()=>{
      try{
        const response=await axios.get('/notification/load-all')
        setNotifications(response.data)
      }
      catch(error){
        console.log(error)
      }
    })()
  },[])
  useEffect(() => {
      socket.on('verifyUser', (msg) => {
          setNotifications(prev=>[msg,...prev])
      });

      socket.on('deleteNotification',(ids)=>{
        setNotifications((prev)=>prev.filter(n=>!ids.includes(n.id)))
      })
      return () => {
          socket.off('verifyUser');
          socket.off('deleteNotification');
          socket.disconnect();
      };
  }, []);

  useEffect(()=>{
    if(notifications.length===0){
      setOpen(null)
    }
  },[notifications.length,setOpen])

  const handleOpen = (event:any) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen}>
        <Badge badgeContent={notifications.length} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {notifications.length} unread messages
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                New
              </ListSubheader>
            }
          >
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} {...notification} />
            ))}
          </List>
        </Scrollbar>
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------


function NotificationItem(notification :NotificationItemProps) {
  const { avatar, title } = renderContent(notification);
  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        bgcolor: 'action.selected',
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {fToNow(notification.createdAt)}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification:NotificationItemProps) {  
  if (notification.type === 'VerifyUser') {
    return {
      avatar: <img alt={notification.title} src={notification.avatar} />,
      title:(
        <Typography variant="subtitle2">
          {notification.title}
          <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
            &nbsp; <br/>{notification.message}
          </Typography>
          <Box sx={{display:'flex',justifyContent:'end'}}>
            <IconButton color='error' onClick={()=>axios.get('/notification/dismiss?id='+notification.id)}>
              <Iconify icon="eva:close-fill"/>
            </IconButton>
            <IconButton color='success' onClick={()=>axios.get('/notification/activateUser?id='+notification.belongTo)}>
              <Iconify icon="eva:checkmark-fill"/>
            </IconButton>
          </Box>
        </Typography>
      ),
    };
  }
  return {title:undefined,avatar:undefined}
}
