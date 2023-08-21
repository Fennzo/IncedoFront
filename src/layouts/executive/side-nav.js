import NextLink from 'next/link';
import PropTypes from 'prop-types';
import {Box, Divider, Drawer, Stack, Typography, useMediaQuery} from '@mui/material';
import {Scrollbar} from 'src/components/scrollbar';
import {SideNavItem} from './side-nav-item';
import {useRouter} from 'next/navigation';

export const SideNav = (props) => {
  const { open, onClose } = props;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const router = useRouter();


  const content = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': {
          height: '100%'
        },
        '& .simplebar-scrollbar:before': {
          background: 'neutral.400'
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* Logo and header content */}
          <Box
            component={NextLink}
            href="/executive"
            sx={{
              display: 'inline-flex',
              height: 32,
              width: 32
            }}
          >
            <img src="/assets/incedo.png" alt="Incedo Logo" style={{ width: '250%', height: '100%' }} />
          </Box>
        </Box>
        <Divider sx={{ borderColor: 'neutral.700' }} />
        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3
          }}
        >
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: 'none',
              p: 0,
              m: 0
            }}
          >
            {/* Map over categories data */}
            <Typography
              color="primary"
              variant="subtitle2"
              sx={{
                ml: 1,
                mb: 1
              }}
            >
              Functions
            </Typography>

            <SideNavItem
              key= '31'
              title='All customer orders'
              onClick={()=>router.push('/executive/customerorders')}
            />
            <SideNavItem
              key= '30'
              title='All supplier orders'
              onClick={()=>router.push('/executive/supplierorders')}
            />
              <SideNavItem
                  key= '29'
                  title='Order from supplier'
                  onClick={()=>router.push('/executive/orderfromsupplier')}
              />
          </Stack>
        </Box>
      </Box>
    </Scrollbar>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.800',
            color: 'common.white',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.800',
          color: 'common.white',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
