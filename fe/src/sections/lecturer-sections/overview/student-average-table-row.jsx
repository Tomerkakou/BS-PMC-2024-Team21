import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';


// ----------------------------------------------------------------------

export default function StudentsTableRow({
  name,
 subjects
}) {

 
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" >

        <TableCell component="th" scope="row" padding="normal">
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
