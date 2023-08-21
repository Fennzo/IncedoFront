import PropTypes from 'prop-types';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import {Avatar, Box, Card, CardContent, LinearProgress, Stack, SvgIcon, Typography} from '@mui/material';

export const OverviewWarehouseCapacityRatio = (props) => {
  const { value, sx } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography
              color="text.secondary"
              gutterBottom
              variant="overline"
            >
              Warehouse capacity
            </Typography>
            <Typography variant="h4">
              {value}%
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'warning.main',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon>
              <WarehouseIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
        <Box sx={{ mt: 3 }}>
          <LinearProgress
            value={value}
            variant="determinate"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

OverviewWarehouseCapacityRatio.propTypes = {
  value: PropTypes.number.isRequired,
  sx: PropTypes.object
};
