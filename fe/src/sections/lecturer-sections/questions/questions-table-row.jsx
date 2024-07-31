import PropTypes from 'prop-types';
import { useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Iconify from 'components/iconify';
import { toast } from 'react-toastify';
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';



// ----------------------------------------------------------------------

export default function QuestionsTableRow({
  selected,
  name,
  subject,
  type,
  level,
  handleClick,
  id,
  handleDeleteQuestions
}) {

  const [loading,setLoading]=useState(false);

  const handleBtnClick= async ()=>{
    setLoading(true)
    try{
      //delete lecturer
      const response = await axios.post(`/lecturer/remove-questions`,[id])
      handleDeleteQuestions([id])
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
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
            
          </Stack>
        </TableCell>

        <TableCell>
        <Typography variant="subtitle2" noWrap>
              {subject}
            </Typography>
        </TableCell>

        <TableCell>
        <Typography variant="subtitle2" noWrap>
              {type}
            </Typography>
        </TableCell>

        <TableCell>
        <Typography variant="subtitle2" noWrap>
              {level}
            </Typography>
        </TableCell>

        <TableCell align="right">
          <LoadingButton onClick={handleBtnClick} loading={loading} color="success">
            <Iconify icon="mdi:question-answer" />
          </LoadingButton>
          <LoadingButton onClick={handleBtnClick} loading={loading}>
            <Iconify icon="mdi:edit-outline" />
          </LoadingButton>
          <LoadingButton onClick={handleBtnClick} loading={loading} color="error">
            <Iconify icon="mdi:trash-can-empty" />
          </LoadingButton>
        </TableCell>


      </TableRow>
       
  
    </>
  );
}

QuestionsTableRow.propTypes = {
  subject: PropTypes.any,
  description: PropTypes.any,
  handleClick: PropTypes.func,
  name: PropTypes.any,
  selected: PropTypes.any,
  id: PropTypes.any,
  handleDeleteQuestions: PropTypes.func
};
