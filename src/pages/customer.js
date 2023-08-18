import Head from 'next/head';
import {
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { Layout as CustomerLayout } from '../layouts/customer/layout';
import { useEffect, useState } from 'react';
import axios from 'axios';

const now = new Date();

const CustomerPage = (props) => {

  const [products, setProducts] = useState([]);
  const [cartArray, setCartArray] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isCartExpanded, setIsCartExpanded] = useState(false);
  const { selectedCategory  = 0} = props
  const [couponCode, setCouponCode] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {

    //todo props change
    let url;
    if ( selectedCategory !== 0)
      url ='http://localhost:8282/product/categeory/${selectedCategory}'
    else if ( selectedCategory === 0)
      url = 'http://localhost:8282/product/all'
    console.log("url " + url)

    fetch(url)
      .then(response => response.json())
      .then(data => {
       // console.log("products data", data);
        setProducts(data);
      });
  }, [selectedCategory]);

  const addToCart = (p) => {
    const existingProductIndex = cartArray.findIndex(item => item.id === p.id);

    if (existingProductIndex !== -1) {
      // Update existing product in the cart
      const updatedCartArray = [...cartArray];
      updatedCartArray[existingProductIndex].quantity += 1;
      updatedCartArray[existingProductIndex].price += p.price;
      setCartArray(updatedCartArray);
    } else {
      // Add new product to the cart
      setCartArray(prevCart => [...prevCart, { ...p, quantity: 1 }]);
    }

    setTotalAmount(prevTotal => prevTotal + p.price);
  }

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  // todo setup dto
  const handleCheckOut = async () => {

    const entries = cartArray.map(item => ({
      pid: item.id,
      qty: item.quantity
    }));
    const checkoutobj = {
      entries,
      couponCode: couponCode
    };

    console.log("checkoutobj", checkoutobj)
    let cid = localStorage.setItem('id')
    try{
      let token = localStorage.getItem('token');
      const purchaseResponse = await axios.post(`http://localhost:8282/product/purchase/${cid}`,{
        headers:{
          'Authorization': 'Basic ' + token
        }

      });
    }
    catch (err){

    }

  }

  return (
    <>
      <Head>
        <title>Incedo ecommerce store</title>
      </Head>
      <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
        <Container maxWidth="xl">
          <Grid container spacing={3} justifyContent="flex-start">
            {/* Display products and add to cart functionality */}
            {products.map(product => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}> {/* 4 products per row */}
                <Card
                  sx={{
                    border: product.quantity === 0 ? '1px solid #ccc' : 'none',
                    boxShadow: product.quantity === 0 ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                    cursor: product.quantity === 0 ? 'not-allowed' : 'pointer',
                    marginLeft: 0, // Move products to the left
                    marginRight: 'auto' // Center products horizontally
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
          {isCartExpanded && (
            <>
              <Typography variant="h6" gutterBottom>
                Items in Cart
              </Typography>
              {cartArray.map(item => (
                <div key={item.id}>
                  <Typography>{item.title}</Typography>
                  <Typography>{`Price: $${item.price}`}</Typography>
                  <Typography>{`Quantity: ${item.quantity}`}</Typography> {/* Added quantity field */}
                </div>
              ))}
            </>
          )}
          Total Amount: ${totalAmount.toFixed(2)}
        </Typography>
        <Badge badgeContent={cartArray.length} color="primary">
          <ShoppingCart />
        </Badge>
        <Button
          onClick={() => setIsCartExpanded(prevState => !prevState)}
          sx={{ mt: 2 }}
        >
          {isCartExpanded ? 'Collapse Cart' : 'Expand Cart'}
        </Button>
        <Button
          onClick={handleDialogOpen}
          variant="contained"
          color="primary"
          sx={{ mt: 2, width: 'max-content' }}
        >
          Checkout
        </Button>
      </Box>

      {/* Checkout Dialog */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Checkout</DialogTitle>
        <DialogContent>
          {/* Display item details */}
          {cartArray.map(item => (
            <div key={item.id}>
              <Typography>{item.title}</Typography>
              <Typography>{`Quantity: ${item.quantity}`}</Typography>
              <Typography>{`Price: $${item.price}`}</Typography>
              <br/>
            </div>
          ))}
          {/* Coupon Code input field */}
          <TextField
            label="Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCheckOut} color="primary">
            Purchase now
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

CustomerPage.getLayout = (page) => (
  <CustomerLayout>{page}</CustomerLayout>
);

export default CustomerPage;
