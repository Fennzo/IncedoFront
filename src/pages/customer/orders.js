import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel
} from '@mui/material';
import { Layout as CustomerLayout } from 'src/layouts/customer/layout';

const Page = () => {
  const customerId = localStorage.getItem('id');
  const [customerOrders, setCustomerOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('dateOfPurchase');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8282/customer/orders/${customerId}`);
        setCustomerOrders(response.data);
      } catch (error) {
        console.error('Error fetching customer orders:', error);
      }
    };

    fetchData();
  }, [customerId]);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedCustomerOrders = customerOrders.sort((a, b) => {
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
    const csvContent = customerOrders
      .map((order) =>
        `${order.id},${order.dateOfPurchase},${order.totalAmount},${order.quantity},${order.status}`
      )
      .join('\n');
    const blob = new Blob([`id,dateOfPurchase,totalAmount,quantity,status\n${csvContent}`], {
      type: 'text/csv;charset=utf-8;',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'customer_orders.csv';
    link.click();
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, sortedCustomerOrders.length - page * rowsPerPage);

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
      <Container maxWidth="xl">
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
                    active={orderBy === 'totalAmount'}
                    direction={orderBy === 'totalAmount' ? order : 'asc'}
                    onClick={() => handleSort('totalAmount')}
                  >
                    Total Amount
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
                    active={orderBy === 'status'}
                    direction={orderBy === 'status' ? order : 'asc'}
                    onClick={() => handleSort('status')}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedCustomerOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.dateOfPurchase}</TableCell>
                  <TableCell>{order.totalAmount}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>{order.status}</TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={4} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="contained" onClick={handleExportToCSV}>
            Export to CSV
          </Button>
        </Box>
        <TablePagination
          rowsPerPageOptions={[5,10, 25]}
          component="div"
          count={customerOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{ marginTop: 'auto' }}
        />
      </Container>
    </Box>
  );
};

Page.getLayout = (page) => (
  <CustomerLayout>
    {page}
  </CustomerLayout>
);

export default Page;