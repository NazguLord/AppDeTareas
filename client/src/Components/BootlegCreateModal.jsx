import React from 'react';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import BootlegForm from './BootlegForm';
import './BootlegCreateModal.scss';

const BootlegCreateModal = ({ open, onClose }) => {
  const handleClose = (_, reason) => {
    if (reason === 'backdropClick') {
      return;
    }

    onClose?.();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth className="bootleg-create-modal">
      <IconButton className="bootleg-create-modal-close" onClick={onClose} aria-label="Cerrar modal">
        <CloseRoundedIcon />
      </IconButton>
      <DialogContent className="bootleg-create-modal-body">
        <BootlegForm submitLabel="Crear bootleg" onCancel={onClose} onSuccess={onClose} isDialog />
      </DialogContent>
    </Dialog>
  );
};

export default BootlegCreateModal;
