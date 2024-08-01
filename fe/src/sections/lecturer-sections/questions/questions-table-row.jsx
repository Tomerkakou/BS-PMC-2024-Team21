import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Iconify from 'components/iconify';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


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
  const [open, setOpen] = useState(null);
  const navigate=useNavigate()

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleDeleteClick= async ()=>{
    handleCloseMenu()
    try{
      const response = await axios.post(`/lecturer/remove-questions`,[id])
      handleDeleteQuestions([id])
      toast.success(response.data)
    }catch(e){
      console.error(e)
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
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="mdi:question-answer" sx={{ mr: 2 }} />
          Answers
        </MenuItem>

        <MenuItem onClick={()=>navigate(`/edit-question/${id}`)}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
  
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
