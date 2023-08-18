import Head from 'next/head';
import { Badge, Box, Button, Card, CardContent, Container, Grid, Typography } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { Layout as CustomerLayout } from '../layouts/customer/layout';
import { useEffect, useState } from 'react';
import ProductDialog from '../layouts/customer/ProductDialog';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const now = new Date();

const CustomerPage = (props) => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [cartArray, setCartArray] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isCartExpanded, setIsCartExpanded] = useState(false);
  const { selectedCategory} = props
  const [couponCode, setCouponCode] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reviews, setReviews] = useState(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
  console.log("selectedcat" , selectedCategory)
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
        setProducts(data);
      });

    fetch('http://localhost:8282/product/reviews/all')
      .then(response => response.json())
      .then(data => {
        setReviews(data)
      });

    console.log("reviews,", reviews)
  }, [selectedCategory]);

  const openProductDialog = (product) => {
    setSelectedProduct(product);
    // fetchProductReviews(product.id);
    // console.log("inter reviews", reviews)
    setIsProductDialogOpen(true);
  };

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

  // const handleDialogClose = () => {
  //   setIsDialogOpen(false);
  // };

  const fetchProductReviews = (pid) => {
    axios
      .get(`http://localhost:8282/product/reviews/` + pid)
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error('Error fetching reviews:', error);
      });
  };

  useEffect(() => {
    if (selectedProduct !== null) {
      fetchProductReviews(selectedProduct.id);
    }
  }, [selectedProduct]);

  // todo setup dto
  const handleCheckOut =  () => {
    const entries = cartArray.map(item => ({
      pid: item.id,
      qty: item.quantity
    }));

    console.log("checkoutobj", entries)
    router.push({
      pathname: '/checkout',
      query: {cartArray: JSON.stringify(entries)}
    })
    // const productPurchaseDto = {
    //   entries,
    //   couponCode: couponCode
    // };


    // let cid = localStorage.getItem('id')
    // try{
    //   let token = localStorage.getItem('token');
    //   const purchaseResponse = await axios.post(`http://localhost:8282/product/purchase/${cid}`,{
    //     headers:{
    //       'Authorization': 'Basic ' + token
    //     }
    //   });
    //
    //
    // }
    // catch (err){
    //   console.error('Error fetching reviews:', err);
    // }

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
                    marginLeft: 0,
                    marginRight: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                  }}
                >
                  <div onClick={() => openProductDialog(product)}>
                    {/* Display product information */}
                    <CardContent>
                      <Typography variant="h6">{product.title}</Typography>
                      <Typography variant="h6" sx={{ mt: 2 }}>{`$${product.price}`}</Typography>
                      <Typography variant="body2" color="textSecondary">{`Quantity: ${product.quantity}`}</Typography>
                      <Typography variant="body2" color="textSecondary">{product.tagline}</Typography>
                    </CardContent>
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={product.quantity === 0}
                    sx={{ mb: 2 }}
                    startIcon={<ShoppingCart />}
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </Card>
              </Grid>
            ))}

            {/* Use the ProductDialog component */}
            <ProductDialog
              open={isProductDialogOpen}
              onClose={() => setIsProductDialogOpen(false)}
              product={selectedProduct}
              reviews={reviews}
              addToCart={addToCart} // Assuming you have defined this function in your parent component
              disabled={cartArray.length === 0}
            />
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
              {/* ... (other cart details rendering) */}
            </>
          )}
          Total Amount: ${totalAmount.toFixed(2)}
        </Typography>
        <Badge badgeContent={cartArray.length} color="primary">
          <ShoppingCart />
        </Badge>
        {cartArray.length === 0 && ( // Conditional rendering for the warning
          <Typography variant="body2" color="red" mt={1}>
            The cart is empty. Please add items before checking out.
          </Typography>
        )}
        <Button
          onClick={() => setIsCartExpanded(prevState => !prevState)}
          sx={{ mt: 2 }}
        >
          {isCartExpanded ? 'Collapse Cart' : 'Expand Cart'}
        </Button>
        <Button
          onClick={handleCheckOut}
          variant="contained"
          color="primary"
          sx={{ mt: 2, width: 'max-content' }}
        >
          Checkout
        </Button>
      </Box>
    </>
  );
};

CustomerPage.getLayout = (page) => (
  <CustomerLayout>{page}</CustomerLayout>
);

export default CustomerPage;
