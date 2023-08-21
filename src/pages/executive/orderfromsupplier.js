import {Layout as ExecutiveLayout} from "../../layouts/executive/layout";
import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";

const OrderFromSupplier = () => {
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [selectedWarehouse, setSelectedWarehouse] = useState("");
    const [selectedSupplier, setSelectedSupplier] = useState("");
    const [quantity, setQuantity] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    useEffect(() => {
        // Fetch data from APIs
        const fetchData = async () => {
            try {
                const productResponse = await axios.get("http://localhost:8282/product/all", {
                    headers: {
                        'Authorization': 'Basic ' + localStorage.getItem('token')
                    }
                });
                setProducts(productResponse.data);

                const warehouseResponse = await axios.get("http://localhost:8282/warehouse/all", {
                    headers: {
                        'Authorization': 'Basic ' + localStorage.getItem('token')
                    }
                });
                setWarehouses(warehouseResponse.data);

                const supplierResponse = await axios.get("http://localhost:8282/supplier/all", {
                    headers: {
                        'Authorization': 'Basic ' + localStorage.getItem('token')
                    }
                });
                setSuppliers(supplierResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);
    const handleFormSubmission = async () => {
        // Create a new order object with selected values
        const newOrder = {
            quantity: parseInt(quantity),
            productId: parseInt(selectedProduct),
            supplierId: parseInt(selectedSupplier),
            warehouseId: parseInt(selectedWarehouse),
        };

        console.log('new order', newOrder)

        // Send a POST request to create a new order
        try {
            await axios.post("http://localhost:8282/order/post", newOrder, {
                headers: {
                    'Authorization': 'Basic ' + localStorage.getItem('token')
                }
            });
            // Reset form fields after successful submission
            setSelectedProduct("");
            setSelectedWarehouse("");
            setSelectedSupplier("");
            setQuantity("");
            setSuccessMessage("Order submitted successfully!");
        } catch (error) {
            console.error("Error submitting order:", error);
        }
    };

    return (

        <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
            <Container maxWidth="md">
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Order from Supplier
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Product</InputLabel>
                        <Select
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                        >
                            {products.map((product) => (
                                <MenuItem key={product.id} value={product.id} >
                                    {product.title}

                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Warehouse</InputLabel>
                        <Select
                            value={selectedWarehouse}
                            onChange={(e) => setSelectedWarehouse(e.target.value)}
                        >
                            {warehouses.map((warehouse) => (
                                <MenuItem key={warehouse.id} value={warehouse.id}>
                                    {warehouse.location}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Supplier</InputLabel>
                        <Select
                            value={selectedSupplier}
                            onChange={(e) => setSelectedSupplier(e.target.value)}
                        >
                            {suppliers.map((supplier) => (
                                <MenuItem key={supplier.id} value={supplier.id}>
                                    {supplier.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Quantity"
                        value={quantity}
                        onChange={(e) => {
                            const inputValue = e.target.value;
                            if (!isNaN(inputValue) && parseInt(inputValue) > 0) {
                                setQuantity(inputValue);
                            }
                        }}
                        type="number"
                        inputProps={{ min: 1 }}
                        sx={{ mb: 2 }}
                    />
                    {/* Display the success message if it's not empty */}
                    {successMessage && (
                        <Typography variant="body1" color="green" sx={{ mt: 2 }}>
                            {successMessage}
                        </Typography>
                    )}
                    <Button variant="contained" color="primary" onClick={handleFormSubmission}>
                        Submit Order
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
};

OrderFromSupplier.getLayout = (page) => (
    <ExecutiveLayout>
        {page}
    </ExecutiveLayout>
);

export default OrderFromSupplier;
