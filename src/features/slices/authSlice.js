import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { setHeaders, url } from "./api";
import { Toast } from "@/components/ui/toast"; // Import ShadCN Toast

// Initial state for the auth slice
const initialState = {
  token: localStorage.getItem("token") || null,
  phoneNumber: "",
  email: "",
  name: "",
  id: "",
  userType: null,
  registerStatus: "",
  registerError: "",
  loginStatus: "",
  loginError: "",
  userLoaded: false,
};

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/auth/signup`, {
        email: values.email,
        phoneNumber: values.phoneNumber,
        name: values.name,
        password: values.password,
      });

      console.log("Response is:", response.data);  // For debugging

      // Use ShadCN Toast for success message
      Toast.success(response.data.message);

      return { userData: response.data.data, message: response.data.message };
    } catch (error) {
      console.error(error.response.data.errors[0]);
      
      // Use ShadCN Toast for error message
      Toast.error(error.response.data.errors[0] || "Registration failed!");
      return rejectWithValue(error.response.data.errors[0]);
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/auth/login`, {
        email: values.email,
        password: values.password,
      });

      const token = response.data.token;
      localStorage.setItem("token", JSON.stringify(token));

      // Use ShadCN Toast for success message
      Toast.success(response.data.message);
      return token;
    } catch (error) {
      console.error(error.response);
      
      // Use ShadCN Toast for error message
      Toast.error(error.response.data.errors[0] || "Login failed!");
      return rejectWithValue(error.response.data.errors[0]);
    }
  }
);

// Async thunk for account verification (if applicable)
export const verifyAccount = createAsyncThunk(
  "auth/verifyAccount",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/auth/verify/:verificationCode`, {
        email: values.email,
        password: values.password,
      });

      const token = response.data.token;
      localStorage.setItem("token", JSON.stringify(token));

      // Use ShadCN Toast for success message
      Toast.success(response.data.message);
      return token;
    } catch (error) {
      console.error(error.response);
      
      // Use ShadCN Toast for error message
      Toast.error(error.response.data.errors[0] || "Verification failed!");
      return rejectWithValue(error.response.data.errors[0]);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loadUser(state, action) {
      const token = state.token;
      if (token) {
        const user = jwtDecode(token);
        return {
          ...state,
          phoneNumber: user.phoneNumber,
          email: user.email,
          name: user.name,
          id: user.id,
          userType: user.userType,
          userLoaded: true,
        };
      } else {
        return { ...state, userLoaded: false };
      }
    },
    logoutUser(state) {
      localStorage.removeItem("token");
      return {
        ...state,
        token: "",
        phoneNumber: "",
        email: "",
        name: "",
        id: "",
        userType: null,
        registerStatus: "",
        registerError: "",
        loginStatus: "",
        loginError: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        return { ...state, registerStatus: "pending" };
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const userData = action.payload.userData;
        if (userData) {
          return {
            ...state,
            phoneNumber: userData.phoneNumber,
            email: userData.email,
            name: userData.name,
            id: userData.id,
            userType: userData.userType || "user", // Default to "user" if not provided
            profilePic: userData.profilePic,
            verificationCode: userData.verificationCode,
            verified: userData.verified,
            registerStatus: "success",
          };
        }
        return state;
      })
      .addCase(registerUser.rejected, (state, action) => {
        return {
          ...state,
          registerStatus: "rejected",
          registerError: action.payload,
        };
      })
      .addCase(loginUser.pending, (state) => {
        return { ...state, loginStatus: "pending" };
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        if (action.payload) {
          const user = jwtDecode(action.payload);
          return {
            ...state,
            token: action.payload,
            phoneNumber: user.phoneNumber,
            name: user.name,
            email: user.email,
            id: user.id,
            userType: user.userType,
            loginStatus: "success",
          };
        }
        return state;
      })
      .addCase(loginUser.rejected, (state, action) => {
        return {
          ...state,
          loginStatus: "rejected",
          loginError: action.payload,
        };
      });
  },
});

// Exporting actions and reducer
export const { loadUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
