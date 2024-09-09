import { Alert, Box, Button, Snackbar } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import { axiosInstance } from "../../axios/axiosInterceptor";
import React, { useEffect, useState } from "react";
import ConfirmationDialog from "../../components/deleteModal/ResponsiveDialog";
import ChannelPartnerModal from "../../components/modal/KeepMountedModal";
import FullScreenDialog from "../../components/viewPage/ViewPage"; // Adjust path if needed
import * as Yup from "yup";
import { useFormik } from "formik";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [lead, setLead] = useState({});
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [itemToDelete, setItemToDelete] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [leadData, setLeadData] = useState("Lead")

  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(20); // pageSize is predefined
  const [totalRows, setTotalRows] = useState(0); // Total rows from backend response

  const formik = useFormik({
    initialValues: {
      id: lead.id || "",
      channelPartnerId: lead.channelPartnerId || "",
      name: lead.name || "",
      address: lead.address || "",
      email: lead.email || "",
      url: lead.url || "",
      contactPerson: lead.contactPerson || "",
      contactNumber: lead.contactNumber || "",
      landLineNumber: lead.landLineNumber || "",
      designation: lead.designation || "",
      usingServices: lead.usingServices || "",
      existingSoftware: lead.existingSoftware || "",
      totalBranch: lead.totalBranch || "",
      marketingStatus: lead.marketingStatus || "",
      leadStatus: lead.leadStatus || "",
    },
    validationSchema: Yup.object({
      id: Yup.string(),
      createdBy: Yup.string(),
      contactPerson: Yup.string(),
      name: Yup.string(),
      designation: Yup.string(),
      channelPartnerId: Yup.string().required("Required"),
      contactNumber: Yup.string()
        .matches(/^[0-9]+$/, "Must be a valid contact number")
        .required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      address: Yup.string(),
      introducedOn: Yup.string(),
      leadStatus: Yup.string(),
      marketingStatus: Yup.string(),
      url: Yup.string().url("Invalid URL"),
    }),
    onSubmit: (values) => {
      onSave(values);
      handleClose();
    },
  });

  const handleOpen = (partner = {}) => {
    setLead(partner);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleViewOpen = (data) => {
    console.log("leads comment part", data)
    setViewData(data);
    setViewDialogOpen(true);
  };

  const handleViewClose = () => setViewDialogOpen(false);

  const fetchData = async (pageNumber = 0) => {
    try {
      const response = await axiosInstance.get(`/api/lead?pageNumber=${pageNumber}`);
      const { content, page } = response.data.detail;
      
      setData(content);
      setTotalRows(page.totalElements); // Total number of leads
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handlePageChange = (newPage) => {
    setPageNumber(newPage);
    fetchData(newPage); // Fetch data for the new page
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConvert = async (leadId) => {
    try {
      await axiosInstance.post(`/api/lead/${leadId}/convert`);
      fetchData(pageNumber);
      setSnackbarMessage('Lead has been converted to Customer successfully.');
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error converting lead to customer:", error);
      setSnackbarMessage('Error converting lead to customer.');
      setSnackbarOpen(true);
    }
  };

  const handleSave = async (values) => {
    try {
      if (values.id) {
        await axiosInstance.put(`/api/lead`, values);
      } else {
        await axiosInstance.post("/api/lead", values);
      }
      fetchData(pageNumber);
      handleClose();
    } catch (error) {
      console.error("Error saving data:", error);
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
        await axiosInstance.delete(`/api/lead/${deleteItemId}`);
        fetchData(pageNumber);
      }
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "createdBy", headerName: "Created By" },
    { field: "contactPerson", headerName: "Contact Person", flex: 1 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "designation", headerName: "Designation", flex: 1 },
    { field: "channelPartnerId", headerName: "Channel Partner", flex: 1 },
    { field: "contactNumber", headerName: "Phone Number", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "introducedOn", headerName: "Introduced On", flex: 1 },
    { field: "leadStatus", headerName: "Lead Status", flex: 1 },
    { field: "marketingStatus", headerName: "Marketing Status", flex: 1 },
    { field: "url", headerName: "URL", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
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
            onClick={() => handleViewOpen(params.row)}
            sx={{ mr: 1 }}
          >
            View
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() => handleConvert(params.row.id)}
            sx={{ mr: 1 }}
          >
            CTC
          </Button>
        </Box>
      ),
    },
  ];

  React.useEffect(() => {
    formik.setValues({
      id: lead.id || "",
      channelPartnerId: lead.channelPartnerId || "",
      name: lead.name || "",
      address: lead.address || "",
      email: lead.email || "",
      url: lead.url || "",
      contactPerson: lead.contactPerson || "",
      contactNumber: lead.contactNumber || "",
      landLineNumber: lead.landLineNumber || "",
      designation: lead.designation || "",
      existingSoftware: lead.existingSoftware || "",
      usingServices: lead.usingServices || "",
      totalBranch: lead.totalBranch || "",
      marketingStatus: lead.marketingStatus || "",
      leadStatus: lead.leadStatus || "",
    });
  }, [lead]);

  const fields = [
    {
      label: "Channel Partner",
      name: "channelPartnerId",
      type: "dymaicDropDown",
      path: "/api/channelpartner/nameList",
      col: 12,
      required: false,
      selectionType: "id",
    },
    { label: "Name", name: "name", type: "text", col: 12, required: false },
    { label: "Address", name: "address", type: "text", col: 12, required: false },
    { label: "Email", name: "email", type: "email", col: 12, required: true },
    { label: "URL", name: "url", type: "text", col: 12, required: false },
    { label: "Contact Person", name: "contactPerson", type: "text", col: 12, required: false },
    { label: "Contact Number", name: "contactNumber", type: "text", col: 12, required: true },
    { label: "Land Line Number", name: "landLineNumber", type: "text", col: 12, required: false },
    { label: "Designation", name: "designation", type: "text", col: 12, required: false },
    { label: "Existing Software", name: "existingSoftware", type: "text", col: 12, required: false },
    { label: "Using Services", name: "usingServices", type: "text", col: 12, required: false },
    { label: "Total Branch", name: "totalBranch", type: "text", col: 12, required: false },
    { label: "Marketing Status", name: "marketingStatus", type: "select", options: [
      { id: "Viber", value: "Viber" },
      { id: "Whatsapp", value: "Whatsapp" },
      { id: "Messenger", value: "Messenger" },
      { id: "Facebook", value: "Facebook" }
    ], col: 12, required: false },
    { label: "Lead Status", name: "leadStatus", type: "select", options: [
      { id: "Hot", value: "Hot" },
      { id: "Warm", value: "Warm" },
      { id: "Cold", value: "Cold" },
    ], col: 12, required: false },
  ];

  const onSave = async (values) => {
    try {
      if (values.id) {
        await axiosInstance.put(`/api/lead`, values);
      } else {
        await axiosInstance.post("/api/lead", values);
      }
      fetchData(pageNumber); // Refresh the data
      handleClose(); // Close the modal
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <Box m="20px">
      <Box m="40px 0 0 0" sx={{ height: "75vh", overflowX: "auto" }}>
        <Button
          onClick={() => handleOpen()}
          color="secondary"
          variant="contained"
          sx={{ mb: 2 }}
        >
          Add Lead
        </Button>
        <Box sx={{ height: "100%", width: "100%" }}>
          <DataGrid
            checkboxSelection
            rows={data}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            pagination
            pageSize={pageSize}
            rowsPerPageOptions={[2]} // Only one option since pageSize is fixed
            paginationMode="server"
            rowCount={totalRows} // Total rows
            onPageChange={handlePageChange}
            autoHeight
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme.palette.secondary.main,
                color: "#ffffff",
              },
            }}
          />
        </Box>
      </Box>

      <ChannelPartnerModal
        channelPartner={lead}
        onSave={handleSave}
        formik={formik}
        open={open}
        setOpen={setOpen}
        fields={fields}
        tableName={"Lead"}
      />
      <ConfirmationDialog
        open={deleteDialogOpen}
        handleClose={handleDeleteCancel}
        handleConfirm={handleDeleteConfirm}
        itemName={itemToDelete}
      />
      <FullScreenDialog
        open={viewDialogOpen}
        onClose={handleViewClose}
        data={viewData}
        commentData={leadData}
        setCommentData={setLeadData}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 'auto',
          }
        }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarMessage.includes("Error") ? "error" : "success"}
          sx={{
            width: '100%',
            textAlign: 'center',
            justifyContent: 'center'
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contacts;
