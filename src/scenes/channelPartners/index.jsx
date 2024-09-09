import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import ConfirmationDialog from '../../components/deleteModal/ResponsiveDialog';
import ChannelPartnerModal from '../../components/modal/KeepMountedModal';
import { axiosInstance } from '../../axios/axiosInterceptor';
import { useTheme } from '@mui/material/styles';
import * as Yup from 'yup';
import { useFormik } from 'formik';

const Invoices = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [channelPartner, setChannelPartner] = useState({});
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState('');

  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(20); // pageSize is predefined
  const [totalRows, setTotalRows] = useState(0);

  const fetchData = async (page = pageNumber) => {
    try {
      const response = await axiosInstance.get(`/api/channelpartner?pageNumber=${page}`)
      // setData(response.data.detail.content);
      // setTotalRows(response.data.detail.page.totalElements); // Update total rows
      const { content, page: pageData } = response.data.detail;
  
      setData(content);
      setTotalRows(pageData.totalElements);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  


  useEffect(() => {
    fetchData();
  }, [pageNumber]);

  const handlePageChange = (newPage) => {
    setPageNumber(newPage);
  };

  const handleOpen = (partner = {}) => {
    setChannelPartner(partner);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async (values) => {
    try {
      if (values.id) {
        await axiosInstance.post(`/api/channelpartner/edit`, values);
      } else {
        await axiosInstance.post('/api/channelpartner', values);
      }
      fetchData();
      handleClose();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleDeleteClick = (id, name) => {
    setDeleteItemId(id);
    setItemToDelete(name);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (deleteItemId) {
        await axiosInstance.delete(`/api/channelpartner/${deleteItemId}`);
        fetchData();
      }
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'channelPartnerName', headerName: 'Channel Partner Name', flex: 1 },
    { field: 'contactNumber', headerName: 'Contact Number', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1 },
    { field: 'city', headerName: 'City', flex: 1 },
    { field: 'state', headerName: 'State', flex: 1 },
    { field: 'country', headerName: 'Country', flex: 1 },
    { field: 'url', headerName: 'URL', flex: 1 },
    { field: 'cellNumber', headerName: 'Cell Number', flex: 1 },
    { field: 'vat', headerName: 'VAT', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Button
            color="primary"
            variant="contained"
            onClick={() => handleOpen(params.row)}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => handleDeleteClick(params.row.id, params.row.channelPartnerName)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];



  const onSave = async (values) => {
    try {
      if (values.id) {
        await axiosInstance.post(`/api/channelpartner/edit`, values);
      } else {
        await axiosInstance.post('/api/channelpartner', values);
      }
      fetchData(); // Refresh the data
      handleClose(); // Close the modal
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };


  const formik = useFormik({
    initialValues: {
      id: channelPartner.id || '', // Make sure to include ID for edit operations
      channelPartnerName: channelPartner.channelPartnerName || '',
      email: channelPartner.email || '',
      contactNumber: channelPartner.contactNumber || '',
      address: channelPartner.address || '',
      city: channelPartner.city || '',
      state: channelPartner.state || '',
      country: channelPartner.country || '',
      url: channelPartner.url || '',
      cellNumber: channelPartner.cellNumber || '',
      vat: channelPartner.vat || '',
    },
    validationSchema: Yup.object({
      channelPartnerName: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      contactNumber: Yup.string().matches(/^[0-9]+$/, 'Must be a valid contact number').required('Required'),
      address: Yup.string(),
      city: Yup.string(),
      state: Yup.string(),
      country: Yup.string(),
      url: Yup.string().url('Invalid URL'),
      cellNumber: Yup.string(),
      vat: Yup.string(),
    }),
    onSubmit: (values) => {
      console.log("Submitted data:", values);
      onSave(values);
      handleClose();
    },
  });

  React.useEffect(() => {
    formik.setValues({
      id: channelPartner.id || '',
      channelPartnerName: channelPartner.channelPartnerName || '',
      email: channelPartner.email || '',
      contactNumber: channelPartner.contactNumber || '',
      address: channelPartner.address || '',
      city: channelPartner.city || '',
      state: channelPartner.state || '',
      country: channelPartner.country || '',
      url: channelPartner.url || '',
      cellNumber: channelPartner.cellNumber || '',
      vat: channelPartner.vat || '',
    });
  }, [channelPartner]);

  const fields = [
    { label: "Channel Partner Name", name: "channelPartnerName", type: "text", col: 12, required: true },
    { label: "Email", name: "email", type: "email", col: 12, required: true },
    { label: "Contact Number", name: "contactNumber", type: "text", col: 12, required: true },
    { label: "Address", name: "address", type: "text", col: 12, required: false },
    { label: "City", name: "city", type: "text", col: 12, required: false },
    { label: "State", name: "state", type: "text", col: 12, required: false },
    { label: "Country", name: "country", type: "text", col: 12, required: false },
    { label: "URL", name: "url", type: "text", col: 12, required: false },
    { label: "Cell Number", name: "cellNumber", type: "text", col: 12, required: false },
    { label: "VAT", name: "vat", type: "text", col: 12, required: false },
  ];




  return (
    <Box m="20px">
      <Box m="40px 0 0 0" sx={{ height: '75vh', overflowX: 'auto' }}>
        <Button onClick={() => handleOpen()} color="secondary" variant="contained" sx={{ mb: 2 }}>
          Add Channel Partner
        </Button>
        <Box sx={{ height: '100%', width: '100%' }}>
          <DataGrid
            checkboxSelection
            rows={data}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            pagination
            pageSize={pageSize} // This sets the number of rows per page
            paginationMode="server" // Ensure this is set for server-side pagination
            rowCount={totalRows} // Total rows from your API response
            onPageChange={handlePageChange} // This will handle page changes
            autoHeight
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.secondary.main, // Use theme secondary color
                color: '#ffffff', // Customize header text color
              },
            }}
          />


        </Box>
      </Box>
      <ChannelPartnerModal
        channelPartner={channelPartner}
        onSave={handleSave}
        open={open}
        setOpen={setOpen}
        formik={formik}
        fields={fields}
        tableName={"Channel Partner"}
      />
      <ConfirmationDialog
        open={deleteDialogOpen}
        handleClose={handleDeleteCancel}
        handleConfirm={handleDeleteConfirm}
        itemName={itemToDelete}
      />
    </Box>
  );
};

export default Invoices;
