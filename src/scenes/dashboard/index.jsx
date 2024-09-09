import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import { axiosInstance } from "../../axios/axiosInterceptor";
import { useState, useEffect } from "react";
import FullScreenDialog from "../../components/viewPage/ViewPage";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [channelPartners, setChannelPartners] = useState([]);
  const [latestComments, setLatestComments] = useState([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  const fetchData = async () => {
    try {
      const [leadsResponse, customerResponse, channelPartnerResponse, latestCommentResponse] = await Promise.all([
        axiosInstance.get('/api/lead'),
        axiosInstance.get('/api/customer'),
        axiosInstance.get('/api/channelpartner'),
        axiosInstance.get('/api/comment/commentsByDate')
      ]);

      setLeads(leadsResponse.data.detail.content);
      setCustomers(customerResponse.data.detail.content);
      setChannelPartners(channelPartnerResponse.data.detail.content);
      setLatestComments(latestCommentResponse.data.detail);

      console.log("Leads data:", leadsResponse.data.detail.content);
      console.log("Customers data:", customerResponse.data.detail.content);
      console.log("Channel Partners data:", channelPartnerResponse.data.detail.content);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewOpen = async (id, isCustomer = false) => {
    try {
      const endpoint = isCustomer ? `/api/customer/${id}` : `/api/lead/${id}`;
      const response = await axiosInstance.get(endpoint);
      setViewData(response.data.detail);
      setViewDialogOpen(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClose = () => setOpen(false);
  const handleViewClose = () => setViewDialogOpen(false);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px">
        {/* ROW 1 */}
        <Box gridColumn="span 4" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
          <StatBox
            title={`${leads.length}`}
            subtitle="Total Leads"
            progress="0.75"
            increase="+14%"
            icon={<EmailIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Box>
        <Box gridColumn="span 4" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
          <StatBox
            title={`${customers.length}`}
            subtitle="Total Customers"
            progress="0.50"
            increase="+21%"
            icon={<PointOfSaleIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Box>
        <Box gridColumn="span 4" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
          <StatBox
            title={`${channelPartners.length}`}
            subtitle="Total Channel-Partners"
            progress="0.30"
            increase="+5%"
            icon={<PersonAddIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Box>

        {/* ROW 2 */}
        <Box gridColumn="span 12" gridRow="span 3" backgroundColor={colors.primary[400]} overflow="auto">
          <Box gridColumn="span 4" gridRow="span 2" backgroundColor={colors.primary[400]}>
            <Box display="flex" justifyContent="space-between" alignItems="center" borderBottom={`4px solid ${colors.primary[500]}`} p="15px">
              <Typography color={colors.grey[100]} variant="h5" fontWeight="600">Recent Comments</Typography>
            </Box>
            {latestComments.map((transaction, i) => (
              <Box
                key={`${transaction.id}-${i}`}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[500]}`}
                p="15px"
                sx={{
                  transition: 'background-color 0.3s, transform 0.3s',
                  '&:hover': {
                    backgroundColor: colors.primary[900],
                    transform: 'scale(1.02)',
                  }
                }}
              >
                <Box>
                  <Typography color={colors.greenAccent[500]} variant="h5" fontWeight="600">
                    {transaction.user.name}
                  </Typography>
                  <Typography
                    color={colors.grey[100]}
                    sx={{
                      display: 'inline-block',
                      maxWidth: '200px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      transition: 'color 0.3s, background-color 0.3s, padding 0.3s, border 0.3s',
                      borderRadius: '4px',
                      padding: '8px',
                      '&:hover': {
                        backgroundColor: colors.primary[800], 
                        color: colors.grey[100],
                        borderColor: colors.primary[500],
                        padding: '10px',
                      }
                    }}
                    title={transaction.comment}
                  >
                    {transaction.comment.length > 30 ? `${transaction.comment.substring(0, 30)}...` : transaction.comment}
                  </Typography>
                </Box>
                <Box>
                  {transaction.leadId ? transaction.leadId : transaction.customerId}
                </Box>
                <Box color={colors.grey[100]}>
                  {new Date(transaction.createdDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Box>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => handleViewOpen(transaction.leadId || transaction.customerId, !!transaction.customerId)}
                  sx={{ mr: 1 }}
                >
                  View
                </Button>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ROW 3 */}
        <Box gridColumn="span 4" gridRow="span 2" backgroundColor={colors.primary[400]} p="30px">
          <Typography variant="h5" fontWeight="600">Campaign</Typography>
          <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
            <ProgressCircle size="125" />
            <Typography variant="h5" color={colors.greenAccent[500]} sx={{ mt: "15px" }}>
              $48,352 revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>
        <Box gridColumn="span 4" gridRow="span 2" backgroundColor={colors.primary[400]}>
          <Typography variant="h5" fontWeight="600" sx={{ padding: "30px 30px 0 30px" }}>Sales Quantity</Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box gridColumn="span 4" gridRow="span 2" backgroundColor={colors.primary[400]} padding="30px">
          <Typography variant="h5" fontWeight="600" sx={{ marginBottom: "15px" }}>Geography Based Traffic</Typography>
          <Box height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box>
      </Box>

      <FullScreenDialog open={viewDialogOpen} onClose={handleViewClose} data={viewData}/>
    </Box>
  );
};

export default Dashboard;
