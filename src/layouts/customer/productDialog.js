import React from 'react';
import { Button, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';

const ProductDialog = ({ open, onClose, product, reviews, addToCart }) => {

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>{product?.title}</DialogTitle>
      {product && (
        <DialogContent>
          <Typography variant="body2" color="textSecondary" paragraph>
            <strong>Tag:</strong> {product.tagline}
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            <strong>Description:</strong> {product.description}
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            <strong>Price:</strong> ${product.price}
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            <strong>Quantity:</strong> {product.quantity}
          </Typography>
          {reviews.length !== 0 && (
            <div>
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Reviews:
              </Typography>
              {reviews.map((review) => (
                <div key={review.id}>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {review.rating}/5  {review.reviewText}
                  </Typography>
                </div>
              ))}
            </div>
          )}
          {reviews.length === 0 && (
            <Typography variant="body2" color="textSecondary">
              No reviews available.
            </Typography>
          )}
          {/* Align buttons at the bottom */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <Button variant="contained" color="primary" onClick={() => addToCart(product)}>
              Add to Cart
            </Button>
            <Button variant="contained" color="primary" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ProductDialog;
