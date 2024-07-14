import PropTypes from 'prop-types';
import { useState } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Label from 'components/label';
import { useAuth } from 'auth';

// ----------------------------------------------------------------------

export default function LecturerTableRow({
  selected,
  name,
  avatarUrl,
  email,
  handleClick,
}) {

  const [loading,setLoading]=useState(false);
  const {currentUser}=useAuth()
  const allowDelete=currentUser.email!==email;

  const handleBtnClick= (func)=>{
    return async (event)=>{
      setLoading(true)
      try{
        await func(event);
      }
      finally{
        setLoading(false)
      }
    }
  }
 

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          {allowDelete && <Checkbox disableRipple checked={selected} onChange={handleClick} />}
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

      </TableRow>
       
  
    </>
  );
}

LecturerTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  email: PropTypes.any,
  handleClick: PropTypes.func,
  name: PropTypes.any,
  selected: PropTypes.any,
};
