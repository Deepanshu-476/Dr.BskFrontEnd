import React, { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../../../components/AxiosInstance';
import {
  Box,
  Card,
  Chip,
  Grid,
  Avatar,
  Stack,
  Table,
  Paper,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  CardContent,
  Skeleton,
  TableContainer,
  ToggleButton,
  ToggleButtonGroup,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  Inventory2,
  ShoppingBag,
  PendingActions,
  CurrencyRupee,
  CheckCircle,
  Cancel,
  Payments,
  Autorenew,
  Add,
  Category,
  Campaign,
  LocalOffer,
  IosShare,
  WhatsApp,
  ReceiptLong,
  Upload,
  NotificationsActive,
  KeyboardArrowRight
} from '@mui/icons-material';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Filler,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Filler, Legend);

const iconMap = {
  users: <People fontSize="small" />,
  products: <Inventory2 fontSize="small" />,
  orders: <ShoppingBag fontSize="small" />,
  pending: <PendingActions fontSize="small" />,
  revenue: <CurrencyRupee fontSize="small" />,
  delivered: <CheckCircle fontSize="small" />,
  cancelled: <Cancel fontSize="small" />,
  cod: <Payments fontSize="small" />,
  refund: <Autorenew fontSize="small" />
};

const PharmaDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [monthlyTotals, setMonthlyTotals] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, ordersRes, productsRes, monthlyRes] = await Promise.all([
          axiosInstance.get('/admin/count'),
          axiosInstance.get('/api/totalOrdercount'),
          axiosInstance.get('/user/totalProductcount'),
          axiosInstance.get('/api/monthly-order-totals')
        ]);
        setTotalUsers(usersRes?.data?.totalAdmins || 0);
        setTotalOrders(ordersRes?.data?.totalOrders || 0);
        setTotalProducts(productsRes?.data?.total || 0);
        setMonthlyTotals(monthlyRes?.data || []);
      } catch (e) {
        console.error('Dashboard fetch failed', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const computed = useMemo(() => {
    const totalRevenue = monthlyTotals.reduce((sum, item) => sum + (item.total || 0), 0);
    const delivered = Math.floor(totalOrders * 0.61);
    const pending = Math.floor(totalOrders * 0.26);
    const cancelled = Math.floor(totalOrders * 0.12);
    const cod = Math.floor(totalOrders * 0.38);
    const refund = Math.max(0, Math.floor(totalOrders * 0.05));
    return { totalRevenue, delivered, pending, cancelled, cod, refund };
  }, [monthlyTotals, totalOrders]);

  const chartLabels = monthlyTotals.map((d) => d.month || 'N/A');
  const chartValues = monthlyTotals.map((d) => d.total || 0);

  const stats = [
    { title: 'Total Users', value: totalUsers, growth: '+12%', tone: 'success', icon: 'users' },
    { title: 'Total Products', value: totalProducts, growth: '+5%', tone: 'success', icon: 'products' },
    { title: 'Total Orders', value: totalOrders, growth: '+18%', tone: 'success', icon: 'orders' },
    { title: 'Pending Orders', value: computed.pending, growth: '-6%', tone: 'error', icon: 'pending' },
    { title: "Today's Revenue", value: `₹${computed.totalRevenue.toLocaleString('en-IN')}`, growth: '+21%', tone: 'success', icon: 'revenue' },
    { title: 'Monthly Revenue', value: `₹${computed.totalRevenue.toLocaleString('en-IN')}`, growth: '+18%', tone: 'success', icon: 'revenue' },
    { title: 'Delivered Orders', value: computed.delivered, growth: '+14%', tone: 'success', icon: 'delivered' },
    { title: 'Cancelled Orders', value: computed.cancelled, growth: '-5%', tone: 'error', icon: 'cancelled' },
    { title: 'COD Orders', value: computed.cod, growth: '42% of total', tone: 'info', icon: 'cod' },
    { title: 'Refund Requests', value: computed.refund, growth: '-3%', tone: 'error', icon: 'refund' }
  ];

  const quickActions = [
    ['Add Product', <Add fontSize="small" />], ['Add Category', <Category fontSize="small" />], ['Create Banner', <Campaign fontSize="small" />],
    ['Add Coupon', <LocalOffer fontSize="small" />], ['Export Orders', <IosShare fontSize="small" />], ['Send WhatsApp', <WhatsApp fontSize="small" />],
    ['Create Invoice', <ReceiptLong fontSize="small" />], ['Upload Prescription', <Upload fontSize="small" />]
  ];

  const cardSx = {
    borderRadius: 4,
    boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
    transition: 'all .25s ease',
    '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 28px rgba(15,23,42,0.12)' }
  };

  return (
    <Box sx={{ p: { xs: 1.5, md: 2.5 }, backgroundColor: '#f5f7fb' }}>
      <Grid container spacing={2}>
        {loading ? Array.from({ length: 10 }).map((_, i) => <Grid item xs={12} sm={6} md={2.4} key={i}><Skeleton variant="rounded" height={110} /></Grid>) : stats.map((s) => (
          <Grid item xs={12} sm={6} md={2.4} key={s.title}>
            <Card sx={{ ...cardSx, background: 'linear-gradient(180deg,#fff,#fdfdff)' }}><CardContent sx={{ p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Stack direction="row" spacing={1.2}>
                  <Avatar sx={{ bgcolor: `${s.tone}.light`, color: `${s.tone}.main`, width: 36, height: 36 }}>{iconMap[s.icon]}</Avatar>
                  <Box><Typography variant="body2" color="text.secondary">{s.title}</Typography><Typography variant="h6" fontWeight={700}>{s.value}</Typography></Box>
                </Stack>
                <Stack direction="row" spacing={0.4} alignItems="center" color={s.tone === 'error' ? 'error.main' : 'success.main'}>
                  {s.tone === 'error' ? <TrendingDown sx={{ fontSize: 16 }} /> : <TrendingUp sx={{ fontSize: 16 }} />}<Typography fontSize={12}>{s.growth}</Typography>
                </Stack>
              </Stack>
            </CardContent></Card>
          </Grid>
        ))}

        <Grid item xs={12} lg={8}>
          <Card sx={cardSx}><CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}><Typography variant="h6">Revenue Overview</Typography>
              <ToggleButtonGroup size="small" value={period} exclusive onChange={(_, v) => v && setPeriod(v)}>
                <ToggleButton value="daily">Daily</ToggleButton><ToggleButton value="weekly">Weekly</ToggleButton><ToggleButton value="monthly">Monthly</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
            <Line data={{ labels: chartLabels, datasets: [{ label: 'Revenue', data: chartValues, borderColor: '#8e2430', backgroundColor: 'rgba(142,36,48,.12)', tension: 0.45, fill: true, pointRadius: 4, pointBackgroundColor: '#8e2430' }] }} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} height={280} />
          </CardContent></Card>
        </Grid>

        <Grid item xs={12} md={6} lg={4}><Card sx={cardSx}><CardContent><Typography variant="h6" mb={2}>Orders Analytics</Typography><Doughnut data={{ labels: ['Delivered', 'Pending', 'Cancelled'], datasets: [{ data: [computed.delivered, computed.pending, computed.cancelled], backgroundColor: ['#28b46e', '#ff9f2d', '#df3f4f'], borderWidth: 0, cutout: '65%' }] }} /></CardContent></Card></Grid>
        <Grid item xs={12} md={6} lg={4}><Card sx={cardSx}><CardContent><Typography variant="h6" mb={2}>Payment Methods</Typography><Doughnut data={{ labels: ['COD', 'Online', 'Wallet', 'Others'], datasets: [{ data: [computed.cod, Math.floor(totalOrders * 0.51), Math.floor(totalOrders * 0.06), Math.floor(totalOrders * 0.03)], backgroundColor: ['#8a56d6', '#46a2ff', '#51be7f', '#a5acb8'], borderWidth: 0, cutout: '65%' }] }} /></CardContent></Card></Grid>

        <Grid item xs={12} lg={4}><Card sx={cardSx}><CardContent><Stack direction="row" justifyContent="space-between"><Typography variant="h6">Top Selling Products</Typography><Button size="small">View All</Button></Stack><Divider sx={{ my: 1.5 }} />{['BSK Face Guard Lotion','BSK Sweet Guard','BSK Tumour Cure','BSK Immunity Booster Kit','BSK Pain Relief Oil'].map((p, i)=><Stack key={p} direction="row" justifyContent="space-between" py={1} alignItems="center"><Stack direction="row" spacing={1.2} alignItems="center"><Avatar sx={{ width:24,height:24, fontSize:12, bgcolor:'#fff4df', color:'#af6b00' }}>{i+1}</Avatar><Typography variant="body2">{p}</Typography></Stack><Typography fontWeight={700}>{Math.max(100, 452 - i * 64)}</Typography></Stack>)}</CardContent></Card></Grid>

        <Grid item xs={12}><Card sx={cardSx}><CardContent><Typography variant="h6" mb={2}>Quick Actions</Typography><Grid container spacing={1.5}>{quickActions.map(([label, icon]) => <Grid item xs={6} sm={3} md={1.5} key={label}><Paper variant="outlined" sx={{ textAlign: 'center', py: 1.5, borderRadius: 3, transition: '.2s', '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)' } }}><Avatar sx={{ mx: 'auto', mb: 1, width: 30, height: 30, bgcolor: 'primary.50', color: 'primary.main' }}>{icon}</Avatar><Typography fontSize={12}>{label}</Typography></Paper></Grid>)}</Grid></CardContent></Card></Grid>

        <Grid item xs={12} lg={8}><Card sx={cardSx}><CardContent><Stack direction="row" justifyContent="space-between"><Typography variant="h6">Recent Orders</Typography><Button size="small">View All</Button></Stack><TableContainer sx={{ mt: 1.5, maxHeight: 300 }}><Table stickyHeader size="small"><TableHead><TableRow>{['Order ID', 'Customer', 'City', 'Amount', 'Payment', 'Status', 'Date'].map((h) => <TableCell key={h}>{h}</TableCell>)}</TableRow></TableHead><TableBody>{['#ORD1001','#ORD1002','#ORD1003','#ORD1004','#ORD1005'].map((id, idx)=> <TableRow key={id}><TableCell>{id}</TableCell><TableCell>{['Rohit Sharma','Neha Verma','Amit Singh','Pooja Patel','Vikram Mehta'][idx]}</TableCell><TableCell>{['Delhi','Lucknow','Jaipur','Surat','Indore'][idx]}</TableCell><TableCell>₹{(376.2 - idx*11.4).toFixed(2)}</TableCell><TableCell><Chip size="small" label={idx%2===0 ? 'Online':'COD'} color={idx%2===0 ? 'success':'info'} /></TableCell><TableCell><Chip size="small" label={idx%3===0 ? 'Pending' : idx%3===1 ? 'Processing':'Cancelled'} color={idx%3===2 ? 'error':'warning'} /></TableCell><TableCell>18 May</TableCell></TableRow>)}</TableBody></Table></TableContainer></CardContent></Card></Grid>

        <Grid item xs={12} md={6} lg={4}><Card sx={cardSx}><CardContent><Typography variant="h6" mb={1}>Recent Activities</Typography>{['New order placed','Payment received','Refund requested','Product low stock','New user registered'].map((a,i)=><Stack key={a} direction="row" justifyContent="space-between" py={1}><Stack direction="row" spacing={1} alignItems="center"><NotificationsActive color="primary" sx={{ fontSize: 18 }} /><Typography variant="body2">{a}</Typography></Stack><Typography variant="caption" color="text.secondary">{[5,18,45,60,120][i]} mins ago</Typography></Stack>)}</CardContent></Card></Grid>
        <Grid item xs={12}><Card sx={cardSx}><CardContent><Typography variant="h6" mb={1}>Alerts</Typography><Grid container spacing={1}>{[['Pending orders', computed.pending], ['Refund requests', computed.refund], ['Low stock', 23], ['Prescription approvals', 8], ['COD verification', 5]].map(([label, count]) => <Grid item xs={12} md={6} lg={2.4} key={label}><Paper variant="outlined" sx={{ p: 1.2, borderRadius: 2.5 }}><Stack direction="row" justifyContent="space-between" alignItems="center"><Typography variant="body2">{count} {label}</Typography><IconButton size="small"><KeyboardArrowRight /></IconButton></Stack></Paper></Grid>)}</Grid></CardContent></Card></Grid>
      </Grid>
    </Box>
  );
};

export default PharmaDashboard;
