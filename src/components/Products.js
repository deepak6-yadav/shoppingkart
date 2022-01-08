import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  IconButton,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState, useRef } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";
import Cart, { generateCartItemsFrom, getTotalCartValue } from "./Cart";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

const Products = () => {
  const [allProductsData,setAllCartData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [searchKey, setSearchKey] = useState("==");
  const userData = useRef(null);
  const [timerId, setTimerId] = useState(null);
  /**
   * Make API callto get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */

  const performAPICall = async () => {
    try {
      let url = config.endpoint + "/products";
      let res = await axios.get(url);
      setAllCartData(res.data);
      return res.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Something went wrong. Check the backend console for more details",
          {
            variant: "error",
          }
        );
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    console.log(text);
    try {
      if (text.trim().length === 0) {
        setProducts([...allProductsData]);
        return;
      }
      let url = config.endpoint + "/products/search?value=" + text;
      let res = await axios.get(url);
      setNotFound(false);
      setProducts(res.data);
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Something went wrong. Check with backend", {
          variant: "error",
        });
      }
      setNotFound(true);
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    if (timerId) {
      clearTimeout(timerId);
    }
    if (searchKey !== "==") {
      const debounceTimerId = setTimeout(
        () => performSearch(event),
        debounceTimeout
      );
      setTimerId(debounceTimerId);
    }
  };

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */

  const [finalCart, setFinalCart] = useState([]);

  const fetchCart = async (token) => {
    if (!token) return;
    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      let url = config.endpoint + "/cart";
      let res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  //useEffect state calls
  useEffect(() => {
    let username = localStorage.getItem("username");
    let token = localStorage.getItem("token");
    let balance = localStorage.getItem("balance");
    if (username !== null) {
      userData.current = { username, token, balance };
    }
    (async function () {
      let pdata = await performAPICall();
      let cdata = await fetchCart(token);
      let final = generateCartItemsFrom(cdata || [], pdata || []);
      getTotalCartValue(final);
      setProducts(pdata);
      setFinalCart(final);
    })();
  }, []);

  useEffect(() => {
    debounceSearch(searchKey, 500);
  }, [searchKey]);

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200
   * {
   *      "success": true
   * }
   *
   * Example for failed response from backend:
   * HTTP 404
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addtoCart = async (id) => {
    if (userData.current === null) {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
      return;
    }
    let index = finalCart.findIndex((item) => item._id === id);
    if (index >= 0) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        { variant: "warning" }
      );
      return;
    } else {
      let item = products.find((prod) => prod._id === id);
      item["qty"] = 1;
      await saveData(item._id, item.qty);
    }
  };

  const sideCartHandler = async (prod, type) => {
    let id = prod._id;
    let item = finalCart.find((prod) => prod._id === id);
    let qty = item["qty"];
    if (type === "add") {
      qty += 1;
    } else {
      if (qty <= 1) {
        qty = 0;
      } else {
        qty -= 1;
      }
    }
    await saveData(item._id, qty);
  };

  const saveData = async (id, qty) => {
    try {
      let url = config.endpoint + "/cart";
      let body = {
        productId: id,
        qty: qty,
      };
      let res = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${userData.current.token}`,
        },
      });
      let final = generateCartItemsFrom(res.data, products);
      getTotalCartValue(final);
      setFinalCart(final);
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar("Something went wrong. Check with backend", {
          variant: "error",
        });
      }
    }
  };

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100px"
          width="30%"
        >
          <TextField
            size="medium"
            className="search-desktop"
            fullWidth
            placeholder="Search for items/categories"
            onChange={(e) => setSearchKey(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          ></TextField>
        </Box>
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
      <Grid container>
        <Grid
          item
          className="product-grid"
          xs={12}
          md={userData.current === null ? 12 : 9}
          key={1}
        >
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
          <Grid container>
            {products.length === 0 && (
              <div className="loading">
                <CircularProgress />
                <p>Loading Products..</p>
              </div>
            )}

            {!notFound &&
              products.length > 0 &&
              products.map((item) => (
                <Grid item xs={12} sm={6} md={3} key={item._id}>
                  <ProductCard product={item} handleAddToCart={addtoCart} />
                </Grid>
              ))}
            {notFound && (
              <div className="loading">
                <SentimentDissatisfied />
                No products found
              </div>
            )}
          </Grid>
        </Grid>
        {userData.current !== null && (
          <Grid
            item
            key={2}
            xs={12}
            md={3}
            style={{ backgroundColor: "#E9F5E1" }}
          >
            <Cart
              products={products}
              items={finalCart}
              handleQuantity={sideCartHandler}
            />
          </Grid>
        )}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;