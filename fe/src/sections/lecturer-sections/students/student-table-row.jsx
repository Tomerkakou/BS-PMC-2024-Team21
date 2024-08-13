import PropTypes from 'prop-types';
import { useState } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Iconify from 'components/iconify';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Label from 'components/label';
import { Button } from '@mui/material';

// ----------------------------------------------------------------------

export default function StudentTableRow({
  selected,
  name,
  avatarUrl,
  email,
  handleClick,
  id,
  handleDeleteStudents,
  answers
}) {

  // State to manage loading status for the delete button
  const [loading, setLoading] = useState(false);

  // Hook to navigate programmatically
  const navigate = useNavigate();

  // Function to handle the delete button click
  const handleBtnClick = async () => {
    setLoading(true);  // Set loading state to true
    try {
      // Make an API call to delete the student by their ID
      const response = await axios.post(`/lecturer/remove-students`, [id]);

      // Call the provided function to update the list of students
      handleDeleteStudents([id]);

      // Show a success toast notification with the response data
      toast.success(response.data);
    } catch (e) {
      // Log any errors to the console
      console.error(e);
    } finally {
      // Ensure the loading state is reset to false after the operation
      setLoading(false);
    }
  }

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        {/* Checkbox to select the student row */}
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        {/* Cell displaying the student's avatar and name */}
        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        {/* Cell displaying the student's email */}
        <TableCell>{email}</TableCell>

        {/* Cell displaying if the student has answered or not */}
        <TableCell>
          <Label color={answers ? 'success' : "error"}>{answers ? 'Yes' : "No"}</Label>
        </TableCell>

        {/* Action buttons: one for viewing the student's assessment and another for deleting the student */}
        <TableCell align="right">
          {/* Button to navigate to the student's assessment page */}
          <Button onClick={() => navigate(`/questions/assasment?id=${id}&by=student`)}>
            <Iconify icon="mdi:file-sign" />
          </Button>

          {/* Loading button to delete the student, with loading indicator */}
          <LoadingButton onClick={handleBtnClick} loading={loading} color="error">
            <Iconify icon="eva:person-delete-outline" />
          </LoadingButton>
        </TableCell>
      </TableRow>
    </>
  );
}

// PropTypes to define the expected types and required props
StudentTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  email: PropTypes.any,
  handleClick: PropTypes.func,
  name: PropTypes.any,
  selected: PropTypes.any,
  id: PropTypes.any,
  handleDeleteStudents: PropTypes.func,
  answers: PropTypes.any,
};
