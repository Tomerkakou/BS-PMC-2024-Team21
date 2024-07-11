import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import Label from 'components/label';
import Iconify from 'components/iconify';
import Switch from '@mui/material/Switch';

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  name,
  avatarUrl,
  email,
  role,
  isVerified,
  status,
  handleClick,
  nonActiveUser,
  activeUser
}) {
  const [open, setOpen] = useState(null);
  
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };
  const [checked, setChecked] = useState(true);

  const handleChange = async (event) => {
    const newChecked = event.target.checked;
    setChecked(newChecked);
    if (newChecked) {
      await activeUser();
    } else {
      await nonActiveUser();
    }
  };


  const handleCloseMenu = () => {
    setOpen(null);
  };
  console.log(isVerified)
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{email}</TableCell>

        <TableCell>{role}</TableCell>

        <TableCell align="center">{isVerified ? 'Yes' : 'No'}</TableCell>

        <TableCell>
          <Label color={status ?  'success'  : "error"}>{status ?  'Active'  : "Not active"}</Label>
        </TableCell>
        <TableCell>
        <Switch
        checked={checked}
        onChange={handleChange}
        inputProps={{ 'aria-label': 'controlled' }}
        />
        </TableCell>

      </TableRow>
       
  
    </>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  email: PropTypes.any,
  handleClick: PropTypes.func,
  isVerified: PropTypes.any,
  name: PropTypes.any,
  role: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
  nonActiveUser:PropTypes.any,
  activeUser:PropTypes.any
};
