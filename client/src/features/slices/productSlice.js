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

export const fetchProduct 
= createAsyncThunk(
	"products/fetchProduct",
	async (productId, { rejectWithValue }) => {
		try {
			const response = await axios.get(`${url}/get/${productId}`, setHeaders());
			return response.data.data;
		} catch (error) {
			// Handle any error and log the error response
			const message = error.response?.data;
			toast.error(message, { position: "top-center" });
		}
	})

export const createProduct = createAsyncThunk(
	"products/createProduct",
	async (formData, { rejectWithValue }) => {
	  try {
		const response = await axios.post(`${url}/products/create`, formData, setHeaders());
		console.log("Create product response:", response?.data); // Correctly log response after getting it
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
			await axios.delete(`${url}/products/delete/${productId}`,  setHeaders());
			return productId; // Return the deleted product's ID
		} catch (error) {
			console.log( "Error deletin product",error.response?.data.message)
			const message = error.response?.data.message || "Error deleting product";
			toast.error(message, { position: "bottom-left" });
			return rejectWithValue(message);
		}
	}
);

export const updateProduct = createAsyncThunk(
	"products/updateProduct",
	async ({ id, values }, { rejectWithValue }) => {
		try {
			const response = await axios.put(`${url}/products/update/${id}`, values,  setHeaders());
			return response.data; // Assuming the server returns the updated product
		} catch (error) {
			console.log( "Error updating product",error.response?.data.message)
			const message = error.response?.data.message || "Error updating product";
			toast.error(message, { position: "bottom-left" });
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
				toast.success("Product created successfully", { position: "bottom-left" });
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
				const updatedProduct = action.payload;
				const index = state.list.findIndex(product => product.id === updatedProduct.id);
				if (index !== -1) {
					state.list[index] = updatedProduct;
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
