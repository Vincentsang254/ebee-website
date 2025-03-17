import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { setHeaders, url } from "./api";

const initialState = {
  list: [],
  total: 0,
  status: null,
};

// Add product to cart
export const addProductToCart = createAsyncThunk(
  "cart/addProductToCart",
  async (product) => {
    try {
      const response = await axios.post(
        `${url}/cart/add-product-to-cart`,
        product,
        setHeaders()
      );
      return response.data;
    } catch (error) {
      toast.error(error.response?.data, { position: "top-center" });
      throw error;
    }
  }
);

// Get cart items
export const getCart = createAsyncThunk("cart/getCart", async () => {
  try {
    const response = await axios.get(`${url}/cart/get`, setHeaders());
    return response.data;
  } catch (error) {
    toast.error(error.response?.data, { position: "top-center" });
    throw error;
  }
});

// Remove product from cart
export const removeProductFromCart = createAsyncThunk(
  "cart/removeProductFromCart",
  async (cartId) => {
    try {
      const response = await axios.delete(
        `${url}/cart/delete/${cartId}`,
        setHeaders()
      );
      toast.success(response.data.message, { position: "top-center" });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data, { position: "top-center" });
      throw error;
    }
  }
);

// Decrease product quantity
export const decreaseProductQuantity = createAsyncThunk(
  "cart/decreaseProductQuantity",
  async (cartId) => {
    try {
      const response = await axios.put(
        `${url}/cart/update/${cartId}/decrease`,
        {},
        setHeaders()
      );
      toast.success(response.data.message, { position: "top-center" });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data, { position: "top-center" });
      throw error;
    }
  }
);

// Increase product quantity
export const increaseProductQuantity = createAsyncThunk(
  "cart/increaseProductQuantity",
  async (cartId) => {
    try {
      const response = await axios.put(
        `${url}/cart/update/${cartId}/increase`,
        {},
        setHeaders()
      );
      toast.success(response.data.message, { position: "top-center" });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data, { position: "top-center" });
      throw error;
    }
  }
);

// Clear cart
export const clearCart = createAsyncThunk("cart/clearCart", async () => {
  try {
    const response = await axios.delete(`${url}/cart/clear`, setHeaders());
    return response.data;
  } catch (error) {
    toast.error(error.response?.data, { position: "top-center" });
    throw error;
  }
});

const cartSlice = createSlice({
  name: "carts",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addProductToCart.fulfilled, (state, action) => {
        state.status = "success"
        state.cart = action.payload;
        state.total = action.payload.total;
      })
      .addCase(addProductToCart.pending, (state) => {
        state.status = "pending";
      })
      .addCase(addProductToCart.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(removeProductFromCart.fulfilled, (state, action) => {
        state.status = "success"
        state.cart = action.payload;
        state.total = action.payload.total;
      })
      .addCase(removeProductFromCart.pending, (state) => {
        state.status = "pending";
      })
      .addCase(removeProductFromCart.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(decreaseProductQuantity.fulfilled, (state, action) => {
        state.status = "success"
        state.cart = action.payload;
        state.total = action.payload.total;
      })
      .addCase(decreaseProductQuantity.pending, (state) => {
        state.status = "pending";
      })
      .addCase(decreaseProductQuantity.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(increaseProductQuantity.fulfilled, (state, action) => {
        state.status = "success"
        state.cart = action.payload;
        state.total = action.payload.total;
      })
      .addCase(increaseProductQuantity.pending, (state) => {
        state.status = "pending";
      })
      .addCase(increaseProductQuantity.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.status = "success"
        state.cart = action.payload;
        state.total = action.payload.total;
      })
      .addCase(clearCart.pending, (state) => {
        state.status = "pending";
      })
      .addCase(clearCart.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.status = "success"
        state.cart = action.payload;
        state.total = action.payload.total;
      })
      .addCase(getCart.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getCart.rejected, (state) => {
        state.status = "rejected";
      });
  },
});

export default cartSlice.reducer;
