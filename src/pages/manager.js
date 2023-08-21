import Head from 'next/head';
import {Box, Container, Unstable_Grid2 as Grid} from '@mui/material';
import {Layout as ManagerLayout} from 'src/layouts/manager/layout';
import {OverviewRevenue} from 'src/sections/overview/overview-revenue';
import {OverviewInwardOutward} from 'src/sections/overview/overview-inward-outward';
import {OverviewWarehouseCapacityRatio} from 'src/sections/overview/overview-warehouse-capacity-ratio';
import {OverviewDispatchTurnover} from 'src/sections/overview/overview-dispatch-turnover';
import {OverviewTraffic} from 'src/sections/overview/overview-traffic';
import {useEffect, useState} from 'react';
import axios from 'axios';

const now = new Date();

const ManagerPage = () => {
    const [averageDispatchTurnover, setAverageDispatchTurnover] = useState(0);
    const [capacityRatio, setCapacityRatio] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8282/manager/averagedispatchtunover', {
                    headers: {
                        'Authorization': 'Basic ' + localStorage.getItem('token')
                    }
                });
                setAverageDispatchTurnover(response.data);
               // console.log("average", averageDispatchTurnover);
            } catch (error) {
                console.error('Error fetching data:', error);
            }

            try {
                const response = await axios.get('http://localhost:8282/manager/capacityratio', {
                    headers: {
                        'Authorization': 'Basic ' + localStorage.getItem('token')
                    }
                });
                setCapacityRatio(response.data);
                //console.log("average", averageDispatchTurnover);
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
                                difference={12}
                                positive
                                sx={{ height: '100%' }}
                                value="$24k"
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            lg={3}
                        >
                            <OverviewWarehouseCapacityRatio
                                sx={{ height: '100%' }}
                                value={capacityRatio}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            lg={3}
                        >
                            <OverviewDispatchTurnover
                                sx={{ height: '100%' }}
                                value={`${averageDispatchTurnover}`}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            lg={8}
                        >
                            <OverviewInwardOutward
                                chartSeries={[
                                    {
                                        name: 'This year',
                                        data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20]
                                    },
                                    {
                                        name: 'Last year',
                                        data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13]
                                    }
                                ]}
                                sx={{ height: '100%' }}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={6}
                            lg={4}
                        >
                            <OverviewTraffic
                                chartSeries={[63, 15, 22]}
                                labels={['Desktop', 'Tablet', 'Phone']}
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

ManagerPage.getLayout = (page) => (
    <ManagerLayout>
        {page}
    </ManagerLayout>
);

export default ManagerPage;
