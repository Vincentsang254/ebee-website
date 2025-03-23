/** @format */

import { configureStore } from "@reduxjs/toolkit";

import usersReducer from "./slices/usersSlice";
import productReducer from "./slices/productSlice";
import notificationReducer from "./slices/notificationSlice";
import orderReducer from "./slices/orderSlice";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import ratingReducer from "./slices/ratingSlice";
import userAddressReducer from "./slices/userAddressSlice";
const store = configureStore({
	reducer: {
		users: usersReducer,
		products: productReducer,
		orders: orderReducer,
		auth: authReducer,
		cart: cartReducer,
		rating: ratingReducer,
		address: userAddressReducer,
	},
});

export default store