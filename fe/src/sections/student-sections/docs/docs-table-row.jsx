import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Iconify from 'components/iconify';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';


// ----------------------------------------------------------------------

export default function DocsTableRow({
  name,
  lecturer,
  subject,
  date,
  description,
  id,
}) {
  const navigate=useNavigate()

  return (
    <>
      <TableRow hover tabIndex={-1}>
      
        <TableCell component="th" scope="row">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{subject}</TableCell>
        <TableCell>{lecturer}</TableCell>
        <TableCell>{format(new Date(date), 'dd/MM/yyyy')}</TableCell>
        <TableCell>{description}</TableCell>
        <TableCell align="right">
          <Button color='success' component="a" href={`http://localhost:5000/api/student/document/${id}`}>
            <Iconify icon="mdi:file-download-outline"/> 
          </Button>
          <Button onClick={()=>navigate(`/document/${id}`)}>
            <Iconify icon="mdi:file-document" />
          </Button>
        </TableCell>

      </TableRow>
       
  
    </>
  );
}

DocsTableRow.propTypes = {
  subject: PropTypes.any,
  lecturer: PropTypes.any,
  date:PropTypes.any,
  name: PropTypes.any,
  description:PropTypes.any,
  id: PropTypes.any,
};
