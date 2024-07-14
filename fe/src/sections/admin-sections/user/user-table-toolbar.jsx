import { useState } from 'react';
import PropTypes from 'prop-types';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'components/iconify';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export default function UserTableToolbar({ numSelected, filterName, onFilterName,deActivateUsers }) {
  const [loading,setLoading]=useState(false);
  const deleteAllSelected=(event)=>{
    setLoading(true);
    try{
      deActivateUsers(event)
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
          placeholder="Search user..."
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

UserTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  deActivateUsers:PropTypes.any,
};
