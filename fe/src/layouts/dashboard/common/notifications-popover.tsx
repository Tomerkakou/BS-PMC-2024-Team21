import { useEffect, useState } from "react";

import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

import { fToNow } from "utils/format-time";
import { useAuth } from "auth";
import axios from "axios";
import Iconify from "components/iconify";
import Scrollbar from "components/scrollbar";
import io from "socket.io-client";


const socket = io(process.env.REACT_APP_SOCKET_URL ?? "");
// ----------------------------------------------------------------------
interface NotificationItemProps {
  title: string;
  message: string;
  belongTo?: string;
  type: string;
  id: number;
  createdAt: Date;
  avatar?: string;
}
export default function NotificationsPopover() {
  const [notifications, setNotifications] = useState<NotificationItemProps[]>(
    []
  );
  const [open, setOpen] = useState(null);
  const { currentUser } = useAuth();
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/notification/load-all");
        setNotifications(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  useEffect(() => {
    switch (currentUser?.role) {
      case "Admin":
        socket.on("verifyUser", (msg) => {
          setNotifications((prev) => [msg, ...prev]);
        });
        break;
      case "Student":
        socket.on("new-document", (msg) => {
          if (msg.id === currentUser.id) {
            setNotifications((prev) => [msg.nft, ...prev]);
          }
        });
        socket.on("new-assasment", (msg) => {
          if (msg.id === currentUser.id) {
            setNotifications((prev) => [msg.nft, ...prev]);
          }
        });
        break;
      case "Lecturer":

        socket.on("VerifyStudent", (msg) => {
          if (msg.id === currentUser.id) {
            setNotifications((prev) => [msg.nft, ...prev]);
          }
        });

        break;
    }
    socket.on("deleteNotification", (ids) => {
      setNotifications((prev) => prev.filter((n) => !ids.includes(n.id)));
    });
    return () => {
      socket.off("verifyUser");
      socket.off("VerifyStudent");
      socket.off("new-document");
      socket.off("new-assasment");
      socket.off("deleteNotification");
      socket.disconnect();
    };
  }, [currentUser]);

  useEffect(() => {
    if (notifications.length === 0) {
      setOpen(null);
    }
  }, [notifications.length, setOpen]);

  const handleOpen = (event: any) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <IconButton color={open ? "primary" : "default"} onClick={handleOpen}>
        <Badge badgeContent={notifications.length} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 360,
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              You have {notifications.length} unread messages
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Scrollbar sx={{ height: { xs: 340, sm: "auto" } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader
                disableSticky
                sx={{ py: 1, px: 2.5, typography: "overline" }}
              >
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

function NotificationItem(notification: NotificationItemProps) {
  const { avatar, title } = renderContent(notification);
  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: "1px",
        bgcolor: "action.selected",
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: "background.neutral" }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: "flex",
              alignItems: "center",
              color: "text.disabled",
            }}
          >
            <Iconify
              icon="eva:clock-outline"
              sx={{ mr: 0.5, width: 16, height: 16 }}
            />
            {fToNow(notification.createdAt)}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------

function renderContent(notification: NotificationItemProps) {
  if (notification.type === "VerifyUser") {
    return {
      avatar: <img alt={notification.title} src={notification.avatar} />,
      title: (
        <Typography variant="subtitle2">
          {notification.title}
          <Typography
            component="span"
            variant="body2"
            sx={{ color: "text.secondary" }}
          >
            &nbsp; <br />
            {notification.message}

          </Typography>
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <IconButton
              color="error"
              onClick={() =>
                axios.get("/notification/dismiss?id=" + notification.id)
              }
            >
              <Iconify icon="eva:close-fill" />
            </IconButton>
            <IconButton
              color="success"
              onClick={() =>
                axios.get(
                  "/notification/activateUser?id=" + notification.belongTo
                )
              }
            >
              <Iconify icon="eva:checkmark-fill" />
            </IconButton>
          </Box>
        </Typography>
      ),
    };
  }
  if (notification.type === "VerifyStudent") {
    return {
      avatar: <img alt={notification.title} src={notification.avatar} />,
      title: (
        <Typography variant="subtitle2">
          {notification.title}
          <Typography
            component="span"
            variant="body2"
            sx={{ color: "text.secondary" }}
          >
            &nbsp; <br />
            {notification.message}

          </Typography>
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <IconButton
              color="error"
              onClick={() =>
                axios.get("/notification/dismiss?id=" + notification.id)
              }
            >
              <Iconify icon="eva:close-fill" />
            </IconButton>
            <IconButton
              color="success"
              onClick={() =>
                axios.get(
                  "/notification/studentApproval?id=" + notification.belongTo

                )
              }
            >
              <Iconify icon="eva:checkmark-fill" />
            </IconButton>
          </Box>
        </Typography>
      ),
    };
  }
  if (notification.type === "NewDocument") {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_mail.svg" />,
      title: (
        <Typography variant="subtitle2">
          {notification.title}
          <Typography
            component="span"
            variant="body2"
            sx={{ color: "text.secondary" }}
          >
            &nbsp; <br />
            {notification.message}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <IconButton
              color="error"
              onClick={() =>
                axios.get("/notification/dismiss?id=" + notification.id)
              }
            >
              <Iconify icon="eva:close-fill" />
            </IconButton>
          </Box>
        </Typography>
      ),
    };
  }
  if (notification.type === "Assasment") {
    return {
      avatar: <img alt={notification.title} src="/assets/icons/ic_notification_chat.svg" />,
      title: (
        <Typography variant="subtitle2">
          {notification.title}
          <Typography
            component="span"
            variant="body2"
            sx={{ color: "text.secondary" }}
          >
            &nbsp; <br />
            {notification.message}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "end" }}>
            <IconButton
              color="error"
              onClick={() =>
                axios.get("/notification/dismiss?id=" + notification.id)
              }
            >
              <Iconify icon="eva:close-fill" />
            </IconButton>
          </Box>
        </Typography>
      ),
    };
  }
  return { title: undefined, avatar: undefined };
}
