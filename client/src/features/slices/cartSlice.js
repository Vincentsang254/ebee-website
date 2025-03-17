import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { setHeaders, url } from "./api";
const iniialState = {
  cart: [],
  total: 0,
  status: null,
};

export const addProductToCart = createAsyncThunk("carts/addProductToCart", async (product) => {
  try {
    const response = await axios.post(
      `${url}/cart/add-product-to-cart`,
      product,
      setHeaders()
    );

    return response.data;
  } catch (error) {
    const message = error.response?.data;
    toast.error(message, { position: "top-center" });
  }
});

export const clearCart = createAsyncThunk("carts/clearCart", async () => {
  try {
    const response = await axios.delete(`${url}/cart/clear`, setHeaders());
    return response.data;
    } catch (error) {
    const message = error.response?.data;
    toast.error(message, { position: "top-center" });
  }
});

export const removeProductFromCart = createAsyncThunk(
  "carts/removeProductFromCart",
  async (product) => {
    try {
      const response = await axios.delete(
        `${url}/cart/delete/:cartId`,
        product,
        setHeaders()
      );
      toast.success(response.data.message, { position: "top-center" });
      return response.data;
    } catch (error) {
      const message = error.response?.data;
      toast.error(message, { position: "top-center" });
    }
  }
);

export const decreaseProductQuantity = createAsyncThunk(
  "carts/decreaseProductQuantity",
  async (product) => {
    try {
      const response = await axios.delete(
        `${url}/cart/delete/:cartId/descrease`,
        product,
        setHeaders()
      );
      toast.success(response.data.message, { position: "top-center" });
      return response.data;
    } catch (error) {
      const message = error.response?.data;
      toast.error(message, { position: "top-center" });
    }
  }
);
export const increaseProductQuantity = createAsyncThunk(
    "carts/increaseProductQuantity",
    async (product) => {
      try {
        const response = await axios.delete(
          `${url}/cart/delete/:cartId/increase`,
          product,
          setHeaders()
        );
        toast.success(response.data.message, { position: "top-center" });
        return response.data;
      } catch (error) {
        const message = error.response?.data;
        toast.error(message, { position: "top-center" });
      }
    }
  );
export const getCart = createAsyncThunk("carts/getCart", async () => {
  try {
    const response = await axios.get(`${url}/cart/get`, setHeaders());
    return response.data;
  } catch (error) {
    const message = error.response?.data;
    toast.error(message, { position: "top-center" });
  }
});

const cartSlice = createSlice({
  name: "carts",
  initialState: iniialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.total = action.payload.total;
      })
      .addCase(addToCart.pending, (state) => {
        state.status = "pending";
      })
      .addCase(addToCart.rejected, (state) => {
        state.status = "rejected";
      })
      .addCase(removeProductFromCart.fulfilled, (state, action) => {
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
