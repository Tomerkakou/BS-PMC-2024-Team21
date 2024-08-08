import PropTypes from 'prop-types';
import { useState } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Iconify from 'components/iconify';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Label from 'components/label';

// ----------------------------------------------------------------------

export default function StudentTableRow({
  selected,
  name,
  avatarUrl,
  email,
  handleClick,
  id,
  handleDeleteStudents,
  answers
}) {

  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();

  const handleBtnClick= async ()=>{
    setLoading(true)
    try{
      //delete student
      const response = await axios.post(`/lecturer/remove-students`,[id])
      handleDeleteStudents([id])
      toast.success(response.data)
    }catch(e){
      console.error(e)
    }
    finally{
      setLoading(false)
    }
  }
 

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          {<Checkbox disableRipple checked={selected} onChange={handleClick} />}
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
        <TableCell>
          <Label color={answers ?  'success'  : "error"}>{answers ?  'Yes'  : "No"}</Label>
        </TableCell>

        <TableCell align="right">
          <LoadingButton onClick={()=>navigate(`/questions/assasment?id=${id}&by=student`)} loading={loading}>
            <Iconify icon="mdi:chat-plus-outline" />
          </LoadingButton>
          <LoadingButton onClick={handleBtnClick} loading={loading} color="error">
            <Iconify icon="eva:person-delete-outline" />
          </LoadingButton>
        </TableCell>

      </TableRow>
       
  
    </>
  );
}

StudentTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  email: PropTypes.any,
  handleClick: PropTypes.func,
  name: PropTypes.any,
  selected: PropTypes.any,
  id: PropTypes.any,
  handleDeleteStudents: PropTypes.func,
  answers: PropTypes.any,
};
