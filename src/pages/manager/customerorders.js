import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Container,
    Grid,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
    Typography
} from '@mui/material';
import {Layout as ManagerLayout} from 'src/layouts/manager/layout';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CustomerOrders = () => {
    const [orderList, setOrderList] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [orderBy, setOrderBy] = useState('dateOfPurchase');
    const [order, setOrder] = useState('desc');
    const [expanded, setExpanded] = useState(true);
    const [customerNameFilter, setCustomerNameFilter] = useState('');
    const [productTitleFilter, setProductTitleFilter] = useState('');
    const [zipCodeFilter, setZipCodeFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('');
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [filteredData, setFilteredData] = useState([]);
  // const [ setLatestOrders] = useState([]); todo

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8282/product/not-dispatched', {
                    headers: {
                        'Authorization': 'Basic ' + localStorage.getItem('token')
                    }
                });

                const sortedOrders = response.data.sort((a, b) => {
                    const dateA = new Date(a.dateOfPurchase);
                    const dateB = new Date(b.dateOfPurchase);
                    return dateB - dateA;
                });

                // setLatestOrders(sortedOrders)
                setOrderList(response.data);
                setFilteredData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const toggleFilterSection = () => {
        setExpanded(!expanded);
    };

    const handleSearch = () => {
        const filteredList = orderList.filter((item) => {
            const dateOfPurchase = new Date(item.dateOfPurchase);

            return (
                item.customer.name.toLowerCase().includes(customerNameFilter.toLowerCase()) &&
                item.customer.address.zipcode.toLowerCase().includes(zipCodeFilter.toLowerCase()) &&
                item.product.title.toLowerCase().includes(productTitleFilter.toLowerCase()) &&
                item.status.toLowerCase().includes(statusFilter.toLowerCase()) &&
                (startDateFilter === '' || dateOfPurchase >= new Date(startDateFilter)) &&
                (endDateFilter === '' || dateOfPurchase <= new Date(endDateFilter))
            );
        });

        const sortedFilteredList = filteredList.slice().sort((a, b) => {
            const cmp = order === 'asc' ? -1 : 1;
            return cmp * (a[orderBy] > b[orderBy] ? 1 : -1);
        });

        setFilteredData(sortedFilteredList);
    };

    const handleReset = () => {
        setProductTitleFilter('');
        setStatusFilter('');
        setStartDateFilter('');
        setEndDateFilter('');
        setFilteredData(orderList);
    };

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);

        const sortedFilteredList = filteredData.slice().sort((a, b) => {
            const cmp = order === 'asc' ? -1 : 1;
            return cmp * (a[property] > b[property] ? 1 : -1);
        });

        setFilteredData(sortedFilteredList);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            setFilteredData((prevData) =>
                prevData.map((item) => (item.id === id ? { ...item, status } : item))
            );

            const customerProductToPost = filteredData.find(item => item.id === id);

            delete customerProductToPost.customer.user.authorities;
            customerProductToPost.status = status
            console.log("customerProductToPost", customerProductToPost)

            await axios.post(`http://localhost:8282/product/dispatch`,  customerProductToPost , {
                headers: {
                    'Authorization': 'Basic ' + localStorage.getItem('token')
                }
            });


        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleExportToCSV = () => {
        const csvContent = filteredData
            .map((item) =>
                `${item.customer.name},${item.customer.address.zipcode},${item.customer.contact},${item.product.title},${item.quantity},${item.status},${item.dateOfPurchase}`
            )
            .join('\n');

        const blob = new Blob([`customer.name,customer.address.zipcode,customer.contact,product.title,quantity,status,dateOfPurchase\n${csvContent}`], {
            type: 'text/csv;charset=utf-8;'
        });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'customer_orders.csv';
        link.click();
    };

    return (
        <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
            <Container maxWidth="xl">
                <Accordion expanded={expanded}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}
                                      onClick={toggleFilterSection}>
                        <Typography variant="h6">Search Filters</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        label="Customer Name"
                                        value={customerNameFilter}
                                        onChange={(e) => setCustomerNameFilter(e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        label="Product Title"
                                        value={productTitleFilter}
                                        onChange={(e) => setProductTitleFilter(e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        label="Zip Code"
                                        value={statusFilter}
                                        onChange={(e) => setZipCodeFilter(e.target.value)}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        type="date"
                                        value={startDateFilter}
                                        onChange={(e) => setStartDateFilter(e.target.value)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        label="Start Date"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={3}>
                                    <TextField
                                        type="date"
                                        value={endDateFilter}
                                        onChange={(e) => setEndDateFilter(e.target.value)}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        label="End Date"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button variant="contained" color="primary" onClick={handleSearch}>
                                        Search
                                    </Button>
                                    <Button variant="outlined" color="primary" onClick={handleReset} sx={{ ml: 1 }}>
                                        Reset
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </AccordionDetails>
                </Accordion>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'dateOfPurchase'}
                                        direction={orderBy === 'dateOfPurchase' ? order : 'asc'}
                                        onClick={() => handleSort('dateOfPurchase')}
                                    >
                                        Date of Purchase
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'product.title'}
                                        direction={orderBy === 'product.title' ? order : 'asc'}
                                        onClick={() => handleSort('product.title')}
                                    >
                                        Product Title
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'customer.name'}
                                        direction={orderBy === 'customer.name' ? order : 'asc'}
                                        onClick={() => handleSort('customer.name')}
                                    >
                                        Customer Name
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'customer.address.zipcode'}
                                        direction={orderBy === 'customer.address.zipcode' ? order : 'asc'}
                                        onClick={() => handleSort('customer.address.zipcode')}
                                    >
                                        Zip Code
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={orderBy === 'quantity'}
                                        direction={orderBy === 'quantity' ? order : 'asc'}
                                        onClick={() => handleSort('quantity')}
                                    >
                                        Quantity
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Update Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredData
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.dateOfPurchase}</TableCell>
                                        <TableCell>{item.product.title}</TableCell>
                                        <TableCell>{item.customer.name}</TableCell>
                                        <TableCell>{item.customer.address.zipcode}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>{item.status}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={item.status}
                                                onChange={(event) => handleStatusUpdate(item.id, event.target.value)}
                                            >
                                                <MenuItem value="PLACED">PLACED</MenuItem>
                                                <MenuItem value="CANCELED">CANCELED</MenuItem>
                                                <MenuItem value="DISPATCHED">DISPATCHED</MenuItem>
                                                <MenuItem value="DELIVERED">DELIVERED</MenuItem>
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" onClick={handleExportToCSV}>
                        Export to CSV
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

CustomerOrders.getLayout = (page) => (
    <ManagerLayout>
        {page}
    </ManagerLayout>
);

export default CustomerOrders;
