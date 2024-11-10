/** @format */

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { setHeaders, url } from "./api";

const initialState = {
	list: [],
	status: null,
	productsCount: 0,
};

// Thunks
export const fetchProducts = createAsyncThunk(
	"products/fetchProducts",
	async () => {
		try {
			console.log("fetching products....");
			// Ensure headers are passed as part of an object
			const response = await axios.get(`${url}/products/get`, { headers: setHeaders() });
			console.log("Fetch products response", response);
			return response.data.data.products; // Returning products array from data structure

		} catch (error) {
			// Handle any error and log the error response
			const message = error.response?.data || "Error fetching products";
			toast.error(message, { position: "bottom-left" });
		}
	}
);

export const createProduct = createAsyncThunk(
	"products/createProduct",
	async (formData, { rejectWithValue }) => {
	  try {
		const response = await axios.post(`${url}/products/create`, formData);
		console.log("Create product response:", response); // Correctly log response after getting it
		return response.data;
	  } catch (error) {
		console.log( "Error creating product",error.response?.data.errors[0])
		// toast.error(message, { position: "bottom-left" });
		return rejectWithValue(error.response.data.error[0]);
	  }
	}
  );

export const removeProduct = createAsyncThunk(
	"products/removeProduct",
	async (productId, { rejectWithValue }) => {
		try {
			await axios.delete(`${url}/products/delete/${productId}`,  { headers: setHeaders() });
			return productId; // Return the deleted product's ID
		} catch (error) {
			const message = error.response?.data || "Error deleting product";
			toast.error(message, { position: "bottom-left" });
			return rejectWithValue(message);
		}
	}
);

export const updateProduct = createAsyncThunk(
	"products/updateProduct",
	async ({ id, values }, { rejectWithValue }) => {
		try {
			const response = await axios.put(`${url}/products/update/${id}`, values,  { headers: setHeaders() });
			return response.data; // Assuming the server returns the updated product
		} catch (error) {
			const message = error.response?.data || "Error updating product";
			toast.error(message, { position: "bottom-left" });
			return rejectWithValue(message);
		}
	}
);

export const fetchProductsCount = createAsyncThunk(
	"products/fetchProductsCount",
	async () => {
		try {
			const response = await axios.get(`${url}/products/get-productscount`,  { headers: setHeaders() });
			return response.data.count;
		} catch (error) {
			const message = error.response?.data || "Error fetching products count";
			toast.error(message, { position: "bottom-left" });
			throw new Error(message); // Re-throw for rejected action
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
			.addCase(fetchProductsCount.fulfilled, (state, action) => {
				state.productsCount = action.payload;
				state.status = "success";
			})
			.addCase(fetchProductsCount.pending, (state) => {
				state.status = "pending";
			})
			.addCase(fetchProductsCount.rejected, (state) => {
				state.status = "rejected";
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
