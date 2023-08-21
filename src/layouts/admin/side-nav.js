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
            href="/admin"
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
              Onboardings
            </Typography>

            <SideNavItem
              key= '33'
              title='Executive'
              onClick={()=>router.push('/admin/executive-onboarding')}
            />
            <SideNavItem
              key= '34'
              title='Supplier'
              onClick={()=>router.push('/admin/supplier-onboarding')}
            />
            <SideNavItem
              key= '35'
              title='Manager'
              onClick={()=>router.push('/admin/manager-onboarding')}
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
