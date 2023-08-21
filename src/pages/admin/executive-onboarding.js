import {useState} from 'react';
import {Alert, Button, Container, MenuItem, Select, TextField, Typography} from '@mui/material';
import {useRouter} from 'next/router';
import axios from 'axios';

function ExecutiveOnboard() {
  const containerStyle = {
    marginTop: '16px',
  };

  const formControlStyle = {
    marginTop: '16px',
    minWidth: '120px',
  };

  const submitButtonStyle = {
    marginTop: '16px',
  };

  const router = useRouter();

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [jobtitle, setJobTitle] = useState('Executive'); // Set jobtitle to "Executive"
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [hno, setHno] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const processForm = async (e) => {
    e.preventDefault();
    const executive = {
      name,
      contact,
      jobtitle, // Include jobtitle in the executive object
      user: {
        username,
        password,
      },
      address: {
        hno,
        street,
        city,
        zipcode: zip,
      },
    };

    try {
      const response = await axios.post('http://localhost:8282/executive/add', executive);
      const msg = `Executive Info Added. Your Safety Pin is: ${response.data.user.safetyPin}`;
      setSuccessMsg(msg);
    } catch (err) {
      setErrorMsg('Error adding info, please contact IT');
    }
  };

  return (
    <Container style={containerStyle}>
      <Typography variant="h5">Executive Onboarding</Typography>
      {successMsg && <Alert severity="success">{successMsg}</Alert>}
      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <form onSubmit={(e) => processForm(e)}>
        <TextField
          label="Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={formControlStyle}
        />
        <TextField
          label="Contact"
          fullWidth
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          style={formControlStyle}
        />
        <TextField
          label="Username"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={formControlStyle}
        />
        <TextField
          type="password"
          label="Password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={formControlStyle}
        />
        <TextField
          label="House Number"
          fullWidth
          value={hno}
          onChange={(e) => setHno(e.target.value)}
          style={formControlStyle}
        />
        <TextField
          label="Street Name"
          fullWidth
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          style={formControlStyle}
        />
        <Select
          label="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={formControlStyle}
        >
          <MenuItem value="">Choose...</MenuItem>
          <MenuItem value="london">London</MenuItem>
        </Select>
        <TextField
          label="Zip"
          fullWidth
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          style={formControlStyle}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={submitButtonStyle}
        >
          Add Executive
        </Button>
      </form>

      <Button
        variant="contained"
        onClick={() => router.push('/admin')}
        color="primary"
        style={submitButtonStyle}
      >
        Back to dashboard
      </Button>
    </Container>
  );
}

export default ExecutiveOnboard;
