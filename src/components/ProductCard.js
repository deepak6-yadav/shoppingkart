import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return <Card className="card" padding={1}>
    <CardMedia
    component="img"
    style={{height: '300px'}}
    image={product.image}
    alt={product.name}
    />
    <CardContent>
      <Typography variant="h5">
        {product.name}
      </Typography>
      <Typography variant="h5">
        ${product.cost}
      </Typography>
      <Rating name="read-only" readOnly value={product.rating}/>
    </CardContent>
    <CardActions>
      <Button onClick={()=>handleAddToCart(product._id)}> <AddShoppingCartOutlined/>Add to Cart</Button>
    </CardActions>
  </Card>;
};

export default ProductCard;
