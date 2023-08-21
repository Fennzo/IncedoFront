import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
import {getOrders, updateStatus} from 'src/redux/store/action/manager';
import {Layout as ManagerLayout} from 'src/layouts/manager/layout';

const SupplierOrders = () => {
    const dispatch = useDispatch();
    let {list} = useSelector((state) => state.supplier);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [orderBy, setOrderBy] = useState('dateOfOrder');
    const [order, setOrder] = useState('desc');
    const [expanded, setExpanded] = useState(true); // Initial state for the filter section
    // State for search filter fields
    const [productTitleFilter, setProductTitleFilter] = useState('');
    const [executiveNameFilter, setExecutiveNameFilter] = useState('');
    const [supplierNameFilter, setSupplierNameFilter] = useState('');
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [filteredData, setFilteredData] = useState(list);
  const [statusFiler, setStatusFiler] = useState('');
    useEffect(() => {
      dispatch(getOrders());
    }, [dispatch]);


    const toggleFilterSection = () => {
      setExpanded(!expanded);
    };

  const handleSearch = () => {
    // Filter the list based on the search criteria
    const filteredList = list.filter((item) => {
      const dateOfOrder = new Date(item.dateOfOrder);

      return (
        item.product.title.toLowerCase().includes(productTitleFilter.toLowerCase()) &&
        item.executive.name.toLowerCase().includes(executiveNameFilter.toLowerCase()) &&
        item.supplier.name.toLowerCase().includes(supplierNameFilter.toLowerCase()) &&
        (startDateFilter === '' || dateOfOrder >= new Date(startDateFilter)) &&
        (endDateFilter === '' || dateOfOrder <= new Date(endDateFilter))&&
        (statusFiler === '' || item.status === statusFiler)
      );
    });

    // Sort the filtered list
    const sortedFilteredList = filteredList.slice().sort((a, b) => {
      const cmp = order === 'asc' ? -1 : 1;
      return cmp * (a[orderBy] > b[orderBy] ? 1 : -1);
    });

    setFilteredData(sortedFilteredList); // Update the filtered data state
  };

    const handleReset = () => {
      // Reset the table to the original initial data
      dispatch(getOrders());
      setProductTitleFilter('');
      setExecutiveNameFilter('');
      setSupplierNameFilter('');
      setStartDateFilter('');
      setStatusFiler('');
      setEndDateFilter('');
      setFilteredData(list)
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

    const sortedList = list.slice().sort((a, b) => {
      const cmp = order === 'asc' ? -1 : 1;
      return cmp * (a[orderBy] > b[orderBy] ? 1 : -1);
    });

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const handleExportToCSV = () => {
      const csvContent = list
        .map((item) =>
          `${item.id},${item.product.title},${item.dateOfOrder},${item.executive.name},${item.supplier.name},${item.quantity},${item.warehouse.location},${item.status}`
        )
        .join('\n');

      const blob = new Blob([`id,product.title,dateOfOrder,executive.name,supplier.name,quantity,warehouse.location,status\n${csvContent}`], {
        type: 'text/csv;charset=utf-8;'
      });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'supplier_orders.csv';
      link.click();
    };

    const handleStatusUpdate = (id, status) => {
      dispatch(updateStatus(id, status));
    };

    return (
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          {/* Filter section */}
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
                      label="Product Title"
                      value={productTitleFilter}
                      onChange={(e) => setProductTitleFilter(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Executive Name"
                      value={executiveNameFilter}
                      onChange={(e) => setExecutiveNameFilter(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      label="Supplier Name"
                      value={supplierNameFilter}
                      onChange={(e) => setSupplierNameFilter(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item
                        xs={6}
                        sm={3}
                        md={2}>
                    <Select
                      value={statusFiler}
                      onChange={(e) => setStatusFiler(e.target.value)}
                      displayEmpty
                      fullWidth
                    >
                      <MenuItem value="" disabled>
                        Status
                      </MenuItem>
                      <MenuItem value="DELIVERED">DELIVERED</MenuItem>
                      <MenuItem value="RECEIVED">RECEIVED</MenuItem>
                      <MenuItem value="APPROVED">APPROVED</MenuItem>
                      <MenuItem value="DENIED">DENIED</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
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
                      <Grid item xs={6}>
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

                    </Grid>
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
                      active={orderBy === 'dateOfOrder'}
                      direction={orderBy === 'dateOfOrder' ? order : 'asc'}
                      onClick={() => handleSort('dateOfOrder')}
                    >
                      Date of Order
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
                      active={orderBy === 'executive.name'}
                      direction={orderBy === 'executive.name' ? order : 'asc'}
                      onClick={() => handleSort('executive.name')}
                    >
                      Executive Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'supplier.name'}
                      direction={orderBy === 'supplier.name' ? order : 'asc'}
                      onClick={() => handleSort('supplier.name')}
                    >
                      Supplier Name
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
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'warehouse.location'}
                      direction={orderBy === 'warehouse.location' ? order : 'asc'}
                      onClick={() => handleSort('warehouse.location')}
                    >
                      Warehouse Location
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Update status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.dateOfOrder}</TableCell>
                      <TableCell>{item.product.title}</TableCell>
                      <TableCell>{item.executive.name}</TableCell>
                      <TableCell>{item.supplier.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.warehouse.location}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>
                        {["INITIATED,EN_ROUTE,ACCEPTED,REJECTED,DENIED"].includes(item.status) ? (
                            <Typography>{item.status}</Typography>
                        ) : (
                            <Select
                                value={item.status}
                                onChange={(event) => handleStatusUpdate(item.id, event.target.value)}
                            >
                              <MenuItem value="RECEIVED">RECEIVED</MenuItem>
                              <MenuItem value="APPROVED">APPROVED</MenuItem>
                              <MenuItem value="DENIED">DENIED</MenuItem>
                              <MenuItem value="DELIVERED">DELIVERED</MenuItem>
                            </Select>
                        )}
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

  SupplierOrders.getLayout = (page) => (
    <ManagerLayout>
      {page}
    </ManagerLayout>
  );

  export default SupplierOrders;
