import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import RenderForm from '../../Resuable/RenderForm';
import { useState } from 'react';
import { axiosInstance } from '../../axios/axiosInterceptor';
import { useEffect } from 'react';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80vw', // Adjusted width for better responsiveness
  maxWidth: 800, // Max width for large screens
  height: '80vh', // Adjust height to fit the viewport
  bgcolor: 'background.paper',
  borderRadius: 2,
  border: '1px solid #ddd',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  p: 4,
  display: 'flex',
  flexDirection: 'column',
};

const contentStyle = {
  flex: 1,
  overflowY: 'auto',
  marginBottom: 6,
  paddingTop: 4,
};

export default function ChannelPartnerModal({ channelPartner = {}, onSave, open, setOpen, formik, fields, tableName }) {
  const handleClose = () => setOpen(false);
  const [options, setOptions] = useState([]);


  useEffect(() => {
    // Fetch dynamic dropdown options when the modal opens
    const fetchOptions = async () => {
      try {
        const response = await axiosInstance.get('/api/channelpartner/nameList');
        setOptions(response.data);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, [open]);

  return (
    <Modal
      keepMounted
      open={open}
      onClose={handleClose}
      aria-labelledby="channel-partner-modal-title"
      aria-describedby="channel-partner-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography
          id="channel-partner-modal-title"
          variant="h6"
          component="h2"
          sx={{ mb: 2 }}
        >
          {channelPartner.id ? `EDIT/UPDATE ${tableName}` : `ADD ${tableName}`}
        </Typography>
        <Box sx={contentStyle}>
          <RenderForm fields={fields} formik={formik} options={options} />
        </Box>
        <Button onClick={formik.handleSubmit} color='primary' variant='contained'>
          Save
        </Button>
      </Box>
    </Modal>
  );
}
