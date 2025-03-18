import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { setHeaders, url } from "./api";

const initialState = {
  list: [],
  status: null,
};

export const getRating = createAsyncThunk(
  "rating/getRating",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${url}/rating/${id}`, setHeaders());
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addRating = createAsyncThunk(
  "rating/addRating",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${url}/rating/add`, data, setHeaders());
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteRating = createAsyncThunk(
    "rating/deleteRating",
    async (id, { rejectWithValue }) => {
        try {
        const res = await axios.delete(`${url}/rating/delete/${id}`, setHeaders());
        return res.data;
        } catch (error) {
        return rejectWithValue(error.response.data);
        }
    }
    );

export const updateRating = createAsyncThunk(
    "rating/updateRating",
    async (data, { rejectWithValue }) => {
        try {
        const res = await axios.put(`${url}/rating/update`, data, setHeaders());
        return res.data;
        } catch (error) {
        return rejectWithValue(error.response.data);
        }
    }
    );

const ratingSlice = createSlice({
  name: "rating",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRating.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getRating.fulfilled, (state, action) => {
        state.status = "success";
        state.rating = action.payload;
      })
      .addCase(getRating.rejected, (state, action) => {
        state.status = "rejected";
       
      })
      .addCase(addRating.pending, (state) => {
        state.status = "pending";
      })
      .addCase(addRating.fulfilled, (state, action) => {
        state.status = "success";
        state.rating = action.payload;
      })
      .addCase(addRating.rejected, (state, action) => {
        state.status = "rejected";
        
      })
      .addCase(deleteRating.pending, (state) => {
        state.status = "pending";
      })
      .addCase(deleteRating.fulfilled, (state, action) => {
        state.status = "success";
        state.rating = action.payload;
      })
      .addCase(deleteRating.rejected, (state, action) => {
        state.status = "rejected";
        
      })
      .addCase(updateRating.pending, (state) => {
        state.status = "pending";
      })
      .addCase(updateRating.fulfilled, (state, action) => {
        state.status = "success";
        state.rating = action.payload;
      })
      .addCase(updateRating.rejected, (state, action) => {
        state.status = "rejected";
     
      })
  },
});

export default ratingSlice.reducer;
