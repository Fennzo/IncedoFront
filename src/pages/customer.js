import Head from 'next/head';
import { Badge, Box, Button, Card, CardContent, Container, Grid, Typography } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { Layout as DashboardLayout } from '../layouts/dashboard/layout';
import { useEffect, useState } from 'react';

const now = new Date();

const CustomerPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [cartArray, setCartArray] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetch('http://localhost:8282/product/all')
      .then(response => response.json())
      .then(data => {
        console.log("products data", data);
        setProducts(data);
      });
  }, []);

  const addToCart = (p) => {
    if (p.quantity > 0) {
      setCartArray(prevCart => [...prevCart, p]);
      setTotalAmount(prevTotal => prevTotal + p.price);
    }
  }

  return (
    <>
      <Head>
        <title>Incedo ecommerce store</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            {/* Display products and add to cart functionality */}
            {products.map(product => (
              <Grid item key={product.id} xs={12} md={6} lg={4}>
                <Card
                  sx={{
                    border: product.quantity === 0 ? '1px solid #ccc' : 'none',
                    boxShadow: product.quantity === 0 ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                    cursor: product.quantity === 0 ? 'not-allowed' : 'pointer'
                  }}
                  onClick={() => addToCart(product)}
                >
                  <CardContent>
                    <Typography variant="h6">{product.title}</Typography>
                    <Typography variant="body2" color="textSecondary">{product.description}</Typography>
                    <Typography variant="h6" sx={{ mt: 2 }}>{`$${product.price}`}</Typography>
                    <Typography variant="body2" color="textSecondary">{`Quantity: ${product.quantity}`}</Typography>
                    <Typography variant="body2" color="textSecondary">{product.tagline}</Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={product.quantity === 0}
                      sx={{ mt: 2 }}
                      startIcon={<ShoppingCart />}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      {/* Cart */}
      <Box
        position="fixed"
        bottom={16}
        right={16}
        bgcolor="background.paper"
        border="1px solid #ccc"
        borderRadius="8px"
        p={2}
        sx={{ zIndex: 1000 }}
      >
        <Typography variant="h6" gutterBottom>
          Cart
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Total Amount: ${totalAmount.toFixed(2)}
        </Typography>
        <Badge badgeContent={cartArray.length} color="primary">
          <ShoppingCart />
        </Badge>
      </Box>
    </>
  );
};

CustomerPage.getLayout = (page) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default CustomerPage;
