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
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function DocumentTableRow({
  selected,
  name,
  description,
  subject,
  createdAt,
  pages,
  handleClick,
  id,
  handleDeleteDocuments
}) {
  const navigate=useNavigate()
  const [loading,setLoading]=useState(false);

  const handleBtnClick= async ()=>{
    setLoading(true)
    try{
      //delete document
      const response = await axios.post(`/document/remove`,[id])
      handleDeleteDocuments([id])
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
              {description}
            </Typography>
        </TableCell>

        <TableCell>
        <Typography variant="subtitle2" noWrap>
              {createdAt}
            </Typography>
        </TableCell>

        <TableCell>
        <Typography variant="subtitle2" noWrap>
              {pages}
            </Typography>
        </TableCell>

        <TableCell align="right">
          <LoadingButton onClick={handleBtnClick} loading={loading} color="error">
            <Iconify icon="eva:file-remove-outline" />
          </LoadingButton>
          <Button onClick={()=>navigate(`/document/${id}`)}>
            <Iconify icon="mdi:file-document" />
          </Button>
        </TableCell>

      </TableRow>
       
  
    </>
  );
}

DocumentTableRow.propTypes = {
  subject: PropTypes.any,
  description: PropTypes.any,
  handleClick: PropTypes.func,
  name: PropTypes.any,
  selected: PropTypes.any,
  id: PropTypes.any,
  handleDeleteDocuments: PropTypes.func
};
