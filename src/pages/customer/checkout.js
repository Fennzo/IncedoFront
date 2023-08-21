import {Box, Button, Container, Grid, InputAdornment, MenuItem, Paper, Typography} from '@mui/material';
import {Layout as CustomerLayout} from '../../layouts/customer/layout';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import axios from 'axios';

const CheckoutPage = () => {
  const router = useRouter();
  const storedCartArray = localStorage.getItem('cartArray');
  // Ensure cartArray is not null or undefined
  const cartItems = storedCartArray ? JSON.parse(storedCartArray) : [];
  const [customer, setCustomer] = useState({
    id: 0,
    name: '',
    contact: '',
    address: {
      id: 0,
      hno: '',
      street: '',
      city: '',
      zipcode: ''
    },
    user: {
      id: 0,
      username: '',
      password: '',
      safetyPin: null,
      role: '',
      enabled: false,
      authorities: [],
      accountNonExpired: false,
      credentialsNonExpired: false,
      accountNonLocked: false
    }
  });
  const [address, setAddress] = useState({
    id: 0,
    hno: '',
    street: '',
    city: '',
    zipcode: ''
  });
  const [newCustomer, setNewCustomer] =useState({
    id: 0,
    name: '',
    contact: '',
    address: {
      id: 0,
      hno: '',
      street: '',
      city: '',
      zipcode: ''
    },
    user: {
      id: 0,
      username: '',
      password: '',
      safetyPin: null,
      role: '',
      enabled: false,
      authorities: [],
      accountNonExpired: false,
      credentialsNonExpired: false,
      accountNonLocked: false
    }
  });
  const [newAddress, setNewAddress] = useState({
    id: 0,
    hno: '',
    street: '',
    city: '',
    zipcode: ''
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [couponErrorMsg, setCouponErrorMsg] = useState('');
  const [discount, setDiscount] = useState(0);
  const [staticCouponCode, setStaticCouponCode] = useState('')

  useEffect(() => {
    // Fetch customer info using the username from localStorage
    fetch("http://localhost:8282/customer/info/" + localStorage.getItem("username"))
      .then(response => response.json())
      .then(data => {
        setCustomer(data);
      });

    fetch("http://localhost:8282/customer/address/" + localStorage.getItem("id"))
      .then(response => response.json())
      .then(data => {
        setAddress(data);
      });

    const calculatedTotalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    setTotalAmount(calculatedTotalAmount);
  }, [cartItems]);

  const handleQuantityChange = (event, item) => {
    const newCartArray = [...cartItems];
    const selectedValue = event.target.value;

    if (selectedValue === 'remove') {
      const indexToRemove = newCartArray.findIndex(cartItem => cartItem.id === item.id);
      if (indexToRemove !== -1) {
        newCartArray.splice(indexToRemove, 1);
      }
    } else {
      const newQuantity = parseInt(selectedValue);
      const itemIndex = newCartArray.findIndex(cartItem => cartItem.id === item.id);
      if (itemIndex !== -1) {
        newCartArray[itemIndex].quantity = newQuantity;
      }
    }

    const newTotalAmount = newCartArray.reduce((total, cartItem) => total + cartItem.price * cartItem.quantity, 0);

    localStorage.setItem('cartArray', JSON.stringify(newCartArray));
    setTotalAmount(newTotalAmount);
  };

  const couponVerification = async(couponCode) =>{
    try{
      const purchaseResponse = await axios.get(`http://localhost:8282/coupon/validate/` + couponCode);
      if(purchaseResponse.data === -1){
        setCouponCode('')
        setCouponErrorMsg("Coupon is invalid")
        setDiscount(0)
      }
      else{
        setDiscount(purchaseResponse.data)
        setStaticCouponCode(couponCode)
      }

    }
    catch (err){
      console.error('Error validating coupon:', err);
    }
  }
  const handlePlaceOrder = async () => {
    console.log("customer", customer)
    console.log("newcustomer", newCustomer)
    console.log('address', address)
    console.log("newaddress", newAddress)

    if (customer.contact !== newCustomer.contact && newCustomer.contact !== '') {
      try {
        await axios.put(`http://localhost:8282/customer/update`, newCustomer);
      } catch (err) {
        console.error('Error updating customer', err);
      }
    }

    if((address.hno !== newAddress.hno && newAddress.hno !== '') ||
      (address.city !== newAddress.city && newAddress.city !== '') ||
      (address.zipcode !== newAddress.zipcode && newAddress.zipcode !== '')||
      (address.street !== newAddress.street && newAddress.street !== '')){
      try{
        const response = await axios.put("http://localhost:8282/address/update", newAddress)
      }
      catch (err){
        console.error('Error updating address', err)
      }
    }

    const entries = cartItems.map(item => ({
      pid: item.id,
      qty: item.quantity
    }));

    const productPurchaseDto = {
      entries,
      totalAmount: totalAmount
    };

    console.log("productPurchaseDto" , productPurchaseDto)

    try{
      let token = localStorage.getItem('token');
      const purchaseResponse = await axios.post(`http://localhost:8282/product/purchase`, productPurchaseDto,{
        headers:{
          'Authorization': 'Basic ' + token
        }
      });
      router.push('/customer')
    }
    catch (err){
      console.error('Error purchasing cart:', err);
    }
  }

  // todo prefill the textfield with defaultvalue and allow changes afterwards.
  return (
    <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4">Checkout Page</Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ padding: '24px' }}>
              <Typography variant="h6" gutterBottom>Customer Details</Typography>
              <TextField
                label="Name"
                fullWidth
                value={customer.name}
                disabled
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Contact"
                fullWidth
                placeholder={customer.contact}
                onChange={(e) => {
                  const updatedContact = e.target.value;
                  setNewCustomer(prevCustomer => ({
                    ...prevCustomer,
                    contact: updatedContact
                  }));
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="House Number"
                fullWidth
                value={address.hno}
                onChange={(e) => {
                  const updatedHno = e.target.value;
                  setAddress((prevAddress) => ({
                    ...prevAddress,
                    hno: updatedHno,
                  }));
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Street"
                fullWidth
                value={address.street}
                onChange={(e) => {
                  const updatedStreet = e.target.value;
                  setNewAddress(prevAddress => ({
                    ...prevAddress,
                    street: updatedStreet
                  }));
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="City"
                fullWidth
                value={address.city}
                onChange={(e) => {
                  const updatedCity = e.target.value;
                  setNewAddress(prevAddress => ({
                    ...prevAddress,
                    city: updatedCity
                  }));
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Zipcode"
                fullWidth
                value={address.zipcode}
                onChange={(e) => {
                  const updatedZipcode = e.target.value;
                  setNewAddress(prevAddress => ({
                    ...prevAddress,
                    zipcode: updatedZipcode
                  }));
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ padding: '24px' }}>
              <Typography variant="h6" gutterBottom>Order Summary</Typography>
              {cartItems.map(item => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #ccc',
                    marginBottom: '16px',
                    paddingBottom: '8px',
                  }}
                >
                  <Typography>{item.title}</Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    {item.quantity !== 'remove' && (
                      <TextField
                        select
                        value={item.quantity}
                        onChange={(event) => handleQuantityChange(event, item)}
                        sx={{ width: '80px' }}
                      >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value="remove">Remove</MenuItem>
                      </TextField>
                    )}
                    <Typography>{`Price: $${item.price * item.quantity}`}</Typography>
                  </Box>
                </Box>
              ))}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  marginTop: '16px',
                }}
              >
                <TextField
                  label="Coupon Code"
                  fullWidth
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    setCouponErrorMsg(''); // Clear the coupon error message
                  }}
                  error={Boolean(couponErrorMsg)}
                  helperText={couponErrorMsg}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          variant="text"
                          color="primary"
                          onClick={() => couponVerification(couponCode)}
                        >
                          <Typography variant="body1" color="primary">
                            Apply Coupon
                          </Typography>
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              {discount > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ paddingRight: '16px' }}
                  >{`Discount (${staticCouponCode}): -$${discount.toFixed(2)}`}</Typography>
                </Box>
              )}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  marginTop: '16px',
                }}
              >
                <Typography
                  variant="h6"
                >{`Total Amount: $${(totalAmount - discount).toFixed(2)}`}</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={()=>handlePlaceOrder()}
            >
              Place Order
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};


CheckoutPage.getLayout = (page) => <CustomerLayout>{page}</CustomerLayout>;

export default CheckoutPage;
