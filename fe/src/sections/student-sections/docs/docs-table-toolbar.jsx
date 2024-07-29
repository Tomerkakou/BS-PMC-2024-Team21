import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Toolbar from '@mui/material/Toolbar';
import PropTypes from 'prop-types';

import Iconify from 'components/iconify';


// ----------------------------------------------------------------------

export default function DocsTableToolbar({filterName, onFilterName }) {
  
  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
      }}
    >
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
    </Toolbar>
  );
}

DocsTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};
