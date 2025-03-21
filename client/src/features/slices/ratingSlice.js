import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { setHeaders, url } from "./api";

const initialState = {
  list: [],  // Changed to maintain consistency
  status: null,
};

export const getRating = createAsyncThunk(
  "rating/getRating",
  async (ratingId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${url}/ratings/get/${ratingId}`, setHeaders());
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch rating";
      toast.error(message, { position: "top-center" });
      return rejectWithValue(message);
    }
  }
);

export const addRating = createAsyncThunk(
  "rating/addRating",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${url}/ratings/create`, data, setHeaders());
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add rating";
      toast.error(message, { position: "top-center" });
      return rejectWithValue(message);
    }
  }
);

export const deleteRating = createAsyncThunk(
  "rating/deleteRating",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${url}/ratings/delete/${id}`, setHeaders()); // Fixed `id`
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete rating";
      toast.error(message, { position: "top-center" });
      return rejectWithValue(message);
    }
  }
);

export const updateRating = createAsyncThunk(
  "rating/updateRating",
  async ({ data, ratingId }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${url}/ratings/update/${ratingId}`, data, setHeaders());
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update rating";
      toast.error(message, { position: "top-center" });
      return rejectWithValue(message);
    }
  }
);

export const getRatings = createAsyncThunk(
  "rating/getRatings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${url}/ratings/get`, setHeaders());
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch ratings";
      toast.error(message, { position: "top-center" });
      return rejectWithValue(message);
    }
  }
);

const ratingSlice = createSlice({
  name: "rating",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRating.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getRating.fulfilled, (state, action) => {
        state.status = "success";
        state.list = [action.payload]; // Keep consistency
      })
      .addCase(getRating.rejected, (state) => {
        state.status = "rejected";
      })

      .addCase(getRatings.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getRatings.fulfilled, (state, action) => {
        state.status = "success";
        state.list = action.payload; // Changed to maintain consistency
      })
      .addCase(getRatings.rejected, (state) => {
        state.status = "rejected";
      })

      .addCase(addRating.pending, (state) => {
        state.status = "pending";
      })
      .addCase(addRating.fulfilled, (state, action) => {
        state.status = "success";
        state.list.push(action.payload); // Add new rating to list
      })
      .addCase(addRating.rejected, (state) => {
        state.status = "rejected";
      })

      .addCase(deleteRating.pending, (state) => {
        state.status = "pending";
      })
      .addCase(deleteRating.fulfilled, (state, action) => {
        state.status = "success";
        state.list = state.list.filter((r) => r.id !== action.payload.id); // Remove deleted rating
      })
      .addCase(deleteRating.rejected, (state) => {
        state.status = "rejected";
      })

      .addCase(updateRating.pending, (state) => {
        state.status = "pending";
      })
      .addCase(updateRating.fulfilled, (state, action) => {
        state.status = "success";
        state.list = state.list.map((r) =>
          r.id === action.payload.id ? action.payload : r
        ); // Update the existing rating
      })
      .addCase(updateRating.rejected, (state) => {
        state.status = "rejected";
      });
  },
});

export default ratingSlice.reducer;
