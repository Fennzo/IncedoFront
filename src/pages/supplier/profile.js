import Head from 'next/head';
import {Box, Container, Stack, Typography, Unstable_Grid2 as Grid} from '@mui/material';
import {AccountProfile} from 'src/layouts/supplier/account-profile';
import {AccountProfileDetails} from 'src/layouts/supplier/account-profile-details';
import {Layout as SupplierLayout} from 'src/layouts/supplier/layout';

const Page = () => (
  <>
    <Head>
      <title>
        Profile
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <div>
            <Typography variant="h4">
              Profile
            </Typography>
          </div>
          <div>
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
                lg={4}
              >
                <AccountProfile />
              </Grid>
              <Grid
                xs={12}
                md={6}
                lg={8}
              >
                <AccountProfileDetails />
              </Grid>
            </Grid>
          </div>
        </Stack>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => (
  <SupplierLayout>{page}</SupplierLayout>

);

export default Page;
