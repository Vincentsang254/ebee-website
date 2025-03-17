/** @format */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { url, setHeaders } from "./api";
import { toast } from "react-toastify";

const initialState = {
	list: [],
	status: null,

};



export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
	try {
		const response = await axios.get(`${url}/users/get-users`, setHeaders());

		console.log("fetch user response:", response.data);
		
		return response.data;
	} catch (error) {
		console.log(" Error fetching a user", error.response?.data?.message);
		toast.error(error.response?.data?.message, {
			position: "top-center",
		});
	}
});

export const deleteUser = createAsyncThunk(
	"users/deleteUser",
	async (userId) => {
		try {
			const response = await axios.delete(
				`${url}/users/delete-user/${userId}`,
				setHeaders()
			);
			toast.success(response?.data?.message, {
				position: "top-center",
			})
			return response.data;
		} catch (error) {
			console.log("Error deleting a user", error.response.data);
			toast.error(error.response?.data?.message, {
				position: "top-center",
			});
		}
	}
);

export const createUser = createAsyncThunk(
	"users/createUser",
	async (userData) => {
		try {
			const response = await axios.post(`${url}/users/create`, userData);
			toast.success(response?.data?.message, {
				position: "top-center",
			})
			return response.data;
		} catch (error) {
			console.log(error.response.data.message);
			toast.error(" Error creating a user", error.response?.data?.message, {
				position: "top-center",
			});
		}
	}
);

export const updateUser = createAsyncThunk(
	"users/updateUser",
	async (userData) => {
		try {
			const response = await axios.post(
				`${url}/users/update/${userData.id}`,
				userData
			);
			toast.success(response?.data?.message, {
				position: "top-center",
			})
			return response.data;
		} catch (error) {
			console.log("Error updating user", error.response?.data?.message);
			toast.error(error.response?.data?.message, {
				position: "top-center",
			});
		}
	}
);

const usersSlice = createSlice({
	name: "users",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUsers.pending, (state) => {
				state.status = "pending";
			})
			.addCase(fetchUsers.fulfilled, (state, action) => {
				state.list = action.payload;
				state.status = "success";
			})
			.addCase(fetchUsers.rejected, (state) => {
				state.status = "rejected";
			})
			.addCase(createUser.pending, (state) => {
				state.status = "pending";
			})
			.addCase(createUser.fulfilled, (state, action) => {
				state.users = action.payload;
				state.status = "success";
			})
			.addCase(createUser.rejected, (state) => {
				state.status = "rejected";
			})
			.addCase(deleteUser.pending, (state) => {
				state.status = "pending";
			})
			.addCase(deleteUser.fulfilled, (state, action) => {
				// state.users = state.users.filter((user) => user.id !== action.payload);
				const newList = state.list.filter((user) => user.id !== action.payload);
				state.users = newList;
				state.status = "success";
			})
			.addCase(deleteUser.rejected, (state) => {
				state.status = "rejected";
			})
			.addCase(updateUser.pending, (state) => {
				state.status = "pending";
			})
			.addCase(updateUser.fulfilled, (state, action) => {
				const updatedUser = action.payload;
				state.users = state.users.map((user) =>
					user.id === updatedUser.id ? updatedUser : user
				);
				state.status = "success";
			})
			.addCase(updateUser.rejected, (state) => {
				state.status = "rejected";
			})
			
	},
});

export default usersSlice.reducer;
