import { useRouter } from 'next/router';
import { Box, Typography } from '@mui/material';
import { Layout as CustomerLayout } from '../layouts/customer/layout';

const CheckoutPage = () => {
  const router = useRouter();
  const { cartArray } = router.query; // This will be an array of cart items

  // Ensure cartArray is not null or undefined
  const items = cartArray ? JSON.parse(cartArray) : [];

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
      <Typography variant="h4">Checkout</Typography>
      {items.map(item => (
        <div key={item.id}>
          <Typography>{item.title}</Typography>
          <Typography>{`Price: $${item.price}`}</Typography>
          <Typography>{`Quantity: ${item.quantity}`}</Typography>
          <br />
        </div>
      ))}
      {/* Add any additional content you want on the checkout page */}
    </Box>
  );
};

CheckoutPage.getLayout = (page) => <CustomerLayout>{page}</CustomerLayout>;

export default CheckoutPage;
