import PropTypes from 'prop-types';
import {Card, CardContent, CardHeader} from '@mui/material';
import {alpha, useTheme} from '@mui/material/styles';
import {Chart} from 'src/components/chart';

const useChartOptions = () => {
    const theme = useTheme();

    return {
        chart: {
            background: 'transparent',
            stacked: false,
            toolbar: {
                show: false
            }
        },
        colors: [theme.palette.primary.main, alpha(theme.palette.primary.main, 0.25)],
        dataLabels: {
            enabled: false
        },
        fill: {
            opacity: 1,
            type: 'solid'
        },
        grid: {
            borderColor: theme.palette.divider,
            strokeDashArray: 2,
            xaxis: {
                lines: {
                    show: false
                }
            },
            yaxis: {
                lines: {
                    show: true
                }
            }
        },
        legend: {
            show: false
        },
        plotOptions: {
            bar: {
                columnWidth: '40px'
            }
        },
        stroke: {
            colors: ['transparent'],
            show: true,
            width: 2
        },
        theme: {
            mode: theme.palette.mode
        },
        xaxis: {
            axisBorder: {
                color: theme.palette.divider,
                show: true
            },
            axisTicks: {
                color: theme.palette.divider,
                show: true
            },
            categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ],
            labels: {
                offsetY: 5,
                style: {
                    colors: theme.palette.text.secondary
                }
            }
        },
        yaxis: {
            labels: {
                formatter: (value) => (value > 0 ? `${value}K` : `${value}`),
                offsetX: -10,
                style: {
                    colors: theme.palette.text.secondary
                }
            }
        }
    };
};

export const OverviewOverallRevenue = (props) => {
    const { revenueData, sx } = props;
    const chartOptions = useChartOptions();
    const currentMonth = new Date().getMonth();
    const filteredChartData = revenueData.slice(0, currentMonth + 1);

    return (
        <Card sx={sx}>
            <CardHeader title="YTD Revenue" />
            <CardContent sx={{ position: 'relative' }}>
                <Chart
                    height={350}
                    options={chartOptions}
                    series={[
                        {
                            name: 'This year',
                            data: filteredChartData
                        }
                    ]}
                    type="bar"
                    width="100%"
                />
            </CardContent>
        </Card>
    );
};

OverviewOverallRevenue.propTypes = {
    revenueData: PropTypes.array.isRequired,
    sx: PropTypes.object
};
