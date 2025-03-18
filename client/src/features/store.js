/** @format */

import { configureStore } from "@reduxjs/toolkit";

import usersReducer from "./slices/usersSlice";
import productReducer from "./slices/productSlice";
import notificationReducer from "./slices/notificationSlice";
import orderReducer from "./slices/orderSlice";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import ratingReducer from "./slices/ratingSlice";
const store = configureStore({
	reducer: {
		users: usersReducer,
		products: productReducer,
		orders: orderReducer,
		auth: authReducer,
		cart: cartReducer,
		rating: ratingReducer,
	},
});

export default store