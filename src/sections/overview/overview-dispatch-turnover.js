import PropTypes from 'prop-types';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {Avatar, Card, CardContent, Stack, SvgIcon, Typography} from '@mui/material';

export const OverviewDispatchTurnover = (props) => {
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
              variant="overline"
            >
              Average dispatch turnover
            </Typography>
            <Typography variant="h4">
              {value}
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'primary.main',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon>
              <AccessTimeIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewDispatchTurnover.propTypes = {
  value: PropTypes.string,
  sx: PropTypes.object
};
