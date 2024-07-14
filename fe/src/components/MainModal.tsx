import React, { useMemo } from 'react';

import Draggable from 'react-draggable';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, SxProps } from '@mui/material';
import Paper, { PaperProps } from '@mui/material/Paper';
import Iconify from './iconify';

interface ModalProps {
  open: boolean; // Indicates whether the modal is open or not
  handleClose: () => void; // Function to handle modal close
  title?: string; // Optional title for the modal
  xBtn?: boolean; // Indicates whether to show the close button or not
  cancelBtn?: boolean; // Indicates whether to show the cancel button or not
  sx?: SxProps; // Additional styles for the modal
  buttons?: JSX.Element[]; // Array of custom buttons to be rendered in the modal
  idProp?: string; // Id for the draggable component
  draggable?: boolean; // Indicates whether the modal is draggable or not
  hideBackdrop?: boolean; // Indicates whether to hide the backdrop or not
  draggableProps?: any; // Additional props for the draggable component
  allowInteraction?: boolean; // Indicates whether to allow interaction with the modal or not
  children: React.ReactNode; // Content of the modal
  disableMaxWidth?: boolean; // Indicates whether to disable the max width of the modal
  TransitionComponent?: any;
}


const MainModal: React.FC<ModalProps> = ({ open, handleClose, title, cancelBtn, sx, buttons, draggable, idProp, hideBackdrop, draggableProps, allowInteraction, xBtn, disableMaxWidth, TransitionComponent, children }) => {
  const { titleStyle, paperComponent } = useMemo(() => {
    // generating style and paperComponent based on draggable prop
    if (!draggable) {
      return { style: undefined, paperComponent: undefined }
    }
    if (!title || !idProp) {
      //dragging modal requires title and idProp the drag happens from the title
      throw new Error('Title and idProp are required for draggable modal');
    }
    return {
      titleStyle: { cursor: 'move' },
      paperComponent: (props: PaperProps) => (
        <Draggable
          {...draggableProps}
          handle={`#${idProp}`}
          cancel={'[class*="MuiDialogContent-root"]'}
        >
          <Paper {...props} />
        </Draggable>
      )
    }
  }, [title, idProp, draggable, draggableProps]);



  return (
    <Dialog open={open} onClose={handleClose} PaperProps={{ elevation: 0, sx: { width: "25%", ...sx }, style: allowInteraction ? { pointerEvents: 'auto' } : undefined }}
      hideBackdrop={hideBackdrop}
      disableEnforceFocus={allowInteraction}
      maxWidth={disableMaxWidth ? false : undefined}
      TransitionComponent={TransitionComponent}
      style={allowInteraction ? { pointerEvents: 'none' } : undefined}
      PaperComponent={paperComponent}>
      {title && <DialogTitle variant="h5" style={titleStyle} id={idProp}>{title}</DialogTitle>} {/* Render the title if provided */}
      {xBtn &&
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Iconify icon="eva:close-outline"/>
        </IconButton>}
      {title && <Divider />} {/* Render a divider if title is provided */}
      <DialogContent>
        {children} {/* Render the content of the modal */}
      </DialogContent>
      <DialogActions>
        {cancelBtn && <Button onClick={handleClose}>Cancel</Button>} {/* Render the cancel button if cancelBtn is true */}
        {buttons && buttons.map((btn, index) => (
          <React.Fragment key={index}>
            {btn}
          </React.Fragment>
        ))}
      </DialogActions>
    </Dialog>
  );
};

export default MainModal;