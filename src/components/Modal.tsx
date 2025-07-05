"use client";

import React, { ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Fade
} from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Fade}
      TransitionProps={{
        timeout: 300
      }}
      PaperProps={{
        elevation: 0,
        sx: {
          border: 1,
          borderColor: 'divider',
          borderRadius: 3,
          maxHeight: '90vh'
        }
      }}
    >
      {title && (
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 2,
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 600,
              color: 'text.primary'
            }}
          >
            {title}
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                bgcolor: 'grey.100'
              }
            }}
            aria-label="Cerrar modal"
          >
            <CloseOutlined />
          </IconButton>
        </DialogTitle>
      )}
      
      <DialogContent
        sx={{
          p: 3,
          '&.MuiDialogContent-root': {
            paddingTop: title ? 3 : 3
          }
        }}
      >
        {!title && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mb: 2
            }}
          >
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'grey.100'
                }
              }}
              aria-label="Cerrar modal"
            >
              <CloseOutlined />
            </IconButton>
          </Box>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
