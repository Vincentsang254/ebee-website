/** @format */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { setHeaders, url } from "./api";

const initialState = {
	list: [],
	status: null,
};

// Thunks
export const fetchProducts = createAsyncThunk(
	"products/fetchProducts",
	async () => {
		try {
			
			const response = await axios.get(`${url}/products/get`, setHeaders());
			console.table("Fetch products response from slice..", response);
			return response.data.data;

		} catch (error) {
			// Handle any error and log the error response
			const message = error.response?.data;
			toast.error(message, { position: "top-center" });
		}
	}
);

export const fetchProduct = createAsyncThunk(
	"products/fetchProduct",
	async (productId, { rejectWithValue }) => {
	  try {
		const response = await axios.get(`${url}/products/get/${productId}`, setHeaders());
		console.log("Fetch product response:", response.data); // Log entire response for debugging
		return response.data.data;
	  } catch (error) {
		console.error("Error fetching product:", error.response?.data || error.message);
  
		// Get error message safely
		const message =
		  error.response?.data?.message || "Failed to fetch product";
  
		// Show toast notification
		toast.error(message, { position: "top-center" });
  
		// Reject the thunk properly
		return rejectWithValue(message);
	  }
	}
  );
  

export const createProduct = createAsyncThunk(
	"products/createProduct",
	async (formData, { rejectWithValue }) => {
	  try {
		const response = await axios.post(`${url}/products/create`, formData, setHeaders());
		console.log("create response from product slice......", response)
		toast.success(response?.data.message, { position: "top-center" });
		return response.data;
	  } catch (error) {
		console.log( "Error creating product",error.response?.data?.message)
		toast.error(error.response?.data.message, { position: "top-center" });
		return rejectWithValue(error.response?.data.message);
	  }
	}
  );


export const removeProduct = createAsyncThunk(
	"products/removeProduct",
	async (productId, { rejectWithValue }) => {
		try {
			const response = await axios.delete(`${url}/products/delete/${productId}`,  setHeaders());
			toast.success(response?.data.message, { position: "top-center" });
			return productId; // Return the deleted product's ID
		} catch (error) {
			console.log( "Error deletin product",error.response?.data.message)
			const message = error.response?.data.message || "Error deleting product";
			toast.error(message, { position: "top-center" });
			return rejectWithValue(message);
		}
	}
);

export const updateProduct = createAsyncThunk(
	"products/updateProduct",
	async ({ productId, values }, { rejectWithValue }) => {
		try {
			const response = await axios.put(`${url}/products/update/${productId}`, values,  setHeaders());
			console.log( "update product response.. ",response);
			toast.success(response?.message, { position: "top-center" });
			return response.data; // Assuming the server returns the updated product
		} catch (error) {
			console.log( "Error updating product",error.response?.message)
			const message = error.response?.message || "Error updating product";
			toast.error(message, { position: "top-center" });
			return rejectWithValue(message);
		}
	}
);

export const searchProducts = createAsyncThunk(
	"products/searchProducts", // The action type
	async ({ values }, { rejectWithValue }) => {
		try {
			// Make a POST request to the search endpoint
			const response = await axios.post(`${url}/products/search`, values, {
				headers: setHeaders() // Assuming setHeaders handles authentication token and other necessary headers
			});
			return response.data; // The server response containing the search results
		} catch (error) {
			// If error, show the error message via toast
			console.log("Error searching products:", error.response?.data.message);
			const message = error.response?.data.message || "Error searching products";
			toast.error(message, { position: "bottom-left" });
			return rejectWithValue(message); // Reject with error message to update Redux state
		}
	}
);



// Slice
const productsSlice = createSlice({
	name: "products",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchProduct.pending, (state) => {
				state.status = "pending";
			})
			.addCase(fetchProduct.fulfilled, (state, action) => {
				console.log("Fetched product payload:", action.payload);
				state.list = action.payload;
				state.status = "success";
			})
			.addCase(fetchProduct.rejected, (state) => {
				state.status = "rejected";
				console.error("Fetch product error:", action.error.message);
			})
			.addCase(fetchProducts.fulfilled, (state, action) => {
				console.log("Fetched products payload:", action.payload); 
				state.list = action.payload;
				state.status = "success";
			})
			.addCase(fetchProducts.pending, (state) => {
				state.status = "pending";
			})
			.addCase(fetchProducts.rejected, (state) => {
				state.status = "rejected";
				console.error("Fetch products error:", action.error.message);
			})
			.addCase(createProduct.fulfilled, (state, action) => {

				state.list.push(action.payload);
				state.status = "success";
			})
			.addCase(createProduct.pending, (state) => {
				state.status = "pending";
			})
			.addCase(createProduct.rejected, (state) => {
				state.status = "rejected";
			})
			.addCase(removeProduct.fulfilled, (state, action) => {
				state.list = state.list.filter(product => product.id !== action.payload);
				state.status = "success";
			})
			.addCase(removeProduct.pending, (state) => {
				state.status = "pending";
			})
			.addCase(removeProduct.rejected, (state) => {
				state.status = "rejected";
			})
			.addCase(updateProduct.fulfilled, (state, action) => {
				const index = state.list.findIndex(product => product.id === action.payload.id);
				if (index !== -1) {
					state.list[index] = action.payload;
				}
				state.status = "success";
			})
			.addCase(updateProduct.pending, (state) => {
				state.status = "pending";
			})
			.addCase(updateProduct.rejected, (state) => {
				state.status = "rejected";
			});
	},
});

export default productsSlice.reducer;
