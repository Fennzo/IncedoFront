import Head from 'next/head';
import {Box, Container, Unstable_Grid2 as Grid} from '@mui/material';
import {Layout as ExecutiveLayout} from 'src/layouts/executive/layout';
import {OverviewRevenue} from 'src/sections/overview/overview-revenue';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {OverviewOverallRevenue} from "../sections/overview/overview-overall-revenue";
import {OverviewPurchasedCategories} from "../sections/overview/overview-purchased-categories";
import {OverviewSuppliers} from "../sections/overview/overiew-suppliers";

const ExecutivePage = () => {
    const [averageDispatchTurnover, setAverageDispatchTurnover] = useState(0);
    const [capacityRatio, setCapacityRatio] = useState(0)
    const [lastMonthRevenue, setLastMonthRevenue] = useState(0)
    const [thisMonthRevenue, setThisMonthRevenue] = useState(0)
    const [salesStatsData, setsalesStatsData] = useState({ labels: [], data: [] });
    const [suppliersStatsData, setSuppliersStatsData] = useState({ labels: [], data: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8282/executive/revenue', {
                    headers: {
                        'Authorization': 'Basic ' + localStorage.getItem('token')
                    }
                });
                setLastMonthRevenue(response.data.lastMonthRevenue)
                setThisMonthRevenue(response.data.thisMonthRevenue)
              console.log("revenues: ", lastMonthRevenue, thisMonthRevenue)
            } catch (error) {
                console.error('Error fetching data:', error);
            }

            try {
                const response = await axios.get('http://localhost:8282/customer/product/stats', {
                    headers: {
                        'Authorization': 'Basic ' + localStorage.getItem('token')
                    }
                });
                setsalesStatsData(response.data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }

            try {
                const response = await axios.get('http://localhost:8282/order/supplier/stats', {
                    headers: {
                        'Authorization': 'Basic ' + localStorage.getItem('token')
                    }
                });
                setSuppliersStatsData(response.data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <Head>
                <title>
                    Incedo capstone
                </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8
                }}
            >
                <Container maxWidth="xl">
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            lg={3}
                        >
                            <OverviewRevenue
                                difference={
                                    (thisMonthRevenue - lastMonthRevenue) >= 0
                                        ? `+${((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(2)}%`
                                        : `-${(Math.abs(thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(2)}%`
                                }
                                positive={thisMonthRevenue >= lastMonthRevenue}
                                sx={{ height: '100%' }}
                                value={`$${thisMonthRevenue.toLocaleString()}`}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            lg={8}
                        >
                            <OverviewOverallRevenue
                                revenueData={[18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20]}
                                sx={{ height: '100%' }}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={6}
                            lg={4}
                        >
                            <OverviewPurchasedCategories
                                chartSeries={salesStatsData.data}
                                labels={salesStatsData.labels}
                                sx={{ height: '100%' }}
                            />
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            md={6}
                            lg={4}
                        >
                            <OverviewSuppliers
                                chartSeries={suppliersStatsData.data}
                                labels={suppliersStatsData.labels}
                                sx={{ height: '100%' }}
                            />
                        </Grid>
                        {/*<Grid*/}
                        {/*    item*/}
                        {/*    xs={12}*/}
                        {/*    md={12}*/}
                        {/*    lg={8}*/}
                        {/*>*/}
                        {/*    <OverviewLatestOrders latestOrders={latestOrders} sx={{ height: '100%' }} />*/}
                        {/*</Grid>*/}
                        {/* todo to display the 5 latest customer orders*/}
                    </Grid>
                </Container>
            </Box>
        </>
    );
};

ExecutivePage.getLayout = (page) => (
    <ExecutiveLayout>
        {page}
    </ExecutiveLayout>
);

export default ExecutivePage;
