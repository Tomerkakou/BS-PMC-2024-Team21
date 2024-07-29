import PropTypes from 'prop-types';
import { useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import Iconify from 'components/iconify';
import Tooltip from '@mui/material/Tooltip';

import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { toast } from 'react-toastify';

// ----------------------------------------------------------------------

export default function DocumentTableToolbar({ numSelected, filterName, onFilterName,handleDeleteDocuments,selected }) {
  const [loading,setLoading]=useState(false);
  const deleteAllSelected=async (event)=>{
    setLoading(true);
    try{
      const response=await axios.post("/lecturer/remove-documents",selected)
      handleDeleteDocuments(selected,true)
      toast.success(response.data)
    }catch(e){
      console.error(e)
    }finally{
      setLoading(false);
    }
  }
  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <OutlinedInput
          value={filterName}
          onChange={onFilterName}
          placeholder="Search document..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
        />
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <LoadingButton loading={loading} onClick={deleteAllSelected}>
              <Iconify icon="eva:trash-2-fill"/>
          </LoadingButton>
        </Tooltip>
      ) : (
        null
      )}
    </Toolbar>
  );
}

DocumentTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  deActivateUsers:PropTypes.any,
  handleDeleteDocuments:PropTypes.func,
  selected:PropTypes.any
};
