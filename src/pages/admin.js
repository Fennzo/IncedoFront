import React from 'react';
import {Layout as AdminLayout} from 'src/layouts/admin/layout'; // Update the path to match your actual file structure
import {Typography} from '@mui/material';

const AdminPage = () => {
  return (
    <AdminLayout>
      <Typography variant="h4">
        Welcome to the Admin Page
      </Typography>
    </AdminLayout>
  );
};

export default AdminPage;
