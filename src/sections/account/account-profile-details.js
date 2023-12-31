import { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Unstable_Grid2 as Grid
} from '@mui/material';
import axios from 'axios';

const states = [
  {
    value: 'alabama',
    label: 'Alabama'
  },
  {
    value: 'new-york',
    label: 'New York'
  },
  {
    value: 'san-francisco',
    label: 'San Francisco'
  },
  {
    value: 'los-angeles',
    label: 'Los Angeles'
  }
];

export const  AccountProfileDetails = () => {
  const [profile, setProfile] = useState({
    name: localStorage.getItem('name'),
    username: localStorage.getItem('username'),
    contact: localStorage.getItem('contact'),
    hno: localStorage.getItem('hno'),
    city: localStorage.getItem('city'),
    zipcode: localStorage.getItem('zipcode'),
    street: localStorage.getItem('street')
  });

  const handleChange = useCallback(
    (event) => {
      setProfile((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value
      }));
    },
    []
  );

  const handleSubmit = async () => {
    try {
      const userObj = JSON.parse(localStorage.getItem('userObj'));

      // Update the userObj's fields with the profile fields
      userObj.name = profile.name;
      userObj.username = profile.username;
      userObj.contact = profile.contact;
      userObj.address.hno = profile.hno;
      userObj.address.street = profile.street;
      userObj.address.city = profile.city;
      userObj.address.zipcode = profile.zipcode;

      // Send PUT requests to update customer and address
      await axios.put('http://localhost:8282/customer/update', userObj);
      await axios.put('http://localhost:8282/address/update', userObj.address);

      // Update the userObj in localStorage
      localStorage.setItem('userObj', JSON.stringify(userObj));

      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
    >
      <Card>
        <CardHeader
          subheader="The information can be edited"
          title="Profile"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  helperText="Please specify the first name"
                  label="Name"
                  name="Name"
                  onChange={handleChange}
                  required
                  value={profile.name}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  onChange={handleChange}
                  required
                  value={profile.username}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Contact"
                  name="contact"
                  onChange={handleChange}
                  value={profile.phone}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="hno"
                  name="hno"
                  onChange={handleChange}
                  value={profile.hno}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="street"
                  name="street"
                  onChange={handleChange}
                  value={profile.street}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="zipcode"
                  name="zipcode"
                  onChange={handleChange}
                  value={profile.zipcode}
                />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="city"
                  name="city"
                  onChange={handleChange}
                  value={profile.city}
                />
              </Grid>
            </Grid>

          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained">
            Save details
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};
