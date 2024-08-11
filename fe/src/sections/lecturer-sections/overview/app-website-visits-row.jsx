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

export default function StudentsTableRow({
  name,
 subjects
}) {
  const [open, setOpen] = useState(null);
  const navigate=useNavigate()
 
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" >

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
            
          </Stack>
        </TableCell>
        {subjects.map((subject, index)=> (        
        <TableCell key={index}>
        <Typography variant="subtitle2" noWrap>
              {subject}
            </Typography>
        </TableCell>))}
      </TableRow>

  
    </>
  );
}

StudentsTableRow.propTypes = {
  subjects: PropTypes.any,
  name: PropTypes.any,
};
