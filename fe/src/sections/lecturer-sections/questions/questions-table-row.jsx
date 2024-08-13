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
import Label from 'components/label';

// ----------------------------------------------------------------------

export default function QuestionsTableRow({
  selected,
  name,
  subject,
  type,
  level,
  handleClick,
  id,
  handleDeleteQuestions,
  ai
}) {
  // State to manage the popover menu open/close status
  const [open, setOpen] = useState(null);

  // Hook to navigate programmatically
  const navigate = useNavigate();

  // Function to handle opening the menu when the "more options" button is clicked
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);  // Set the current target (button) as the anchor for the popover
  };

  // Function to close the popover menu
  const handleCloseMenu = () => {
    setOpen(null);  // Reset the anchor to close the popover
  };

  // Function to handle the deletion of a question
  const handleDeleteClick = async () => {
    handleCloseMenu();  // Close the menu after clicking delete
    try {
      // Make an API call to delete the question by its ID
      const response = await axios.post(`/lecturer/remove-questions`, [id]);

      // Update the list of questions after deletion
      handleDeleteQuestions([id]);

      // Show a success toast notification with the response data
      toast.success(response.data);
    } catch (e) {
      // Log any errors to the console
      console.error(e);
    }
  }

  return (
    <>
      {/* TableRow representing a single question in the list */}
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        
        {/* Checkbox to select the question row */}
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        {/* Cell displaying the question's name */}
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        {/* Cell displaying the question's subject */}
        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {subject}
          </Typography>
        </TableCell>

        {/* Cell displaying the question's type */}
        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {type}
          </Typography>
        </TableCell>

        {/* Cell displaying the question's difficulty level */}
        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {level}
          </Typography>
        </TableCell>

        {/* Cell displaying whether the question is AI-generated */}
        <TableCell>
          <Label color={ai ? 'success' : 'error'}>{ai ? 'Yes' : 'No'}</Label>
        </TableCell>

        {/* Cell containing the "more options" button */}
        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Popover menu with options for the question (view answers, edit, delete) */}
      <Popover
        open={!!open}  // Popover is open if `open` is not null
        anchorEl={open}  // Anchor element for positioning the popover
        onClose={handleCloseMenu}  // Close handler
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}  // Positioning of the popover
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}  // Positioning of the popover
        PaperProps={{
          sx: { width: 140 },  // Style for the popover's paper component
        }}
      >
        {/* Menu item to view answers associated with the question */}
        <MenuItem onClick={() => navigate(`/questions/assasment?id=${id}&by=question`)}>
          <Iconify icon="mdi:file-sign" sx={{ mr: 2 }} />
          Answers
        </MenuItem>

        {/* Menu item to edit the question */}
        <MenuItem onClick={() => navigate(`/edit-question/${id}`)}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        {/* Menu item to delete the question */}
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

// PropTypes to define the expected types and required props for validation
QuestionsTableRow.propTypes = {
  subject: PropTypes.any,
  description: PropTypes.any,
  handleClick: PropTypes.func,
  name: PropTypes.any,
  selected: PropTypes.any,
  id: PropTypes.any,
  handleDeleteQuestions: PropTypes.func,
  ai: PropTypes.any,
};
