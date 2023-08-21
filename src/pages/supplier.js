import React from 'react';
import {Layout as SupplierLayout} from 'src/layouts/supplier/layout'; // Update the path to match your actual file structure
import {Typography} from '@mui/material';
import SupplierOrders from "./supplier/supplierorders";

const SupplierPage = () => {
    return (
        <SupplierLayout>
            <Typography variant="h4">
                Welcome to the supplier Page
            </Typography>
            <SupplierOrders />
        </SupplierLayout>
    );
};

export default SupplierPage;
