import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "./utilities/axiosClient";

export const userRegistration = createAsyncThunk(
  "authentication/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/user/register", userData);
      return response.data.user;
    } catch (error) {
      // return rejectWithValue({
      //   message:
      //     error.response?.data?.message ||
      //     error.message ||
      //     "Registration failed",
      //   status: error.response?.status,
      // });
      return rejectWithValue(error);
    }
  }
);

export const userLogin = createAsyncThunk(
  "authentication/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/user/login", credentials);
      // console.log("logincredentials",credentials);
      // console.log("login response", response);
      return response.data.user;
    } catch (error) {
      // return rejectWithValue({
      //   message:
      //     error.response?.data?.message || error.message || "Login failed",
      //   status: error.response?.status,
      // });
      return rejectWithValue(error);
    }
  }
);

export const userLogout = createAsyncThunk(
  "authentication/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post("user/logout");
      return null;
    } catch (error) {
      // return rejectWithValue({
      //   message:
      //     error.response?.data?.message || error.message || "Logout failed",
      //   status: error.response?.status,
      // });
      return rejectWithValue(error);
    }
  }
);

export const checkAuthenticatedUser = createAsyncThunk(
  "authentication/check",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/user/checkauthentication");
      // console.log("authentication response", response);
      return response.data.user;
    } catch (error) {
      // return rejectWithValue({
      //   message: error.response?.data?.message || error.message || 'Authentication check failed',
      //   status: error.response?.status
      // });
      return rejectWithValue(error);
    }
  }
);

const authenticationSlice = createSlice({
  name: "authentication",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: true,  // Start with true to wait for auth check on page load
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // user registration cases
      .addCase(userRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userRegistration.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(userRegistration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
        state.isAuthenticated = false;
        state.user = null;
      })

      // user login cases
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
        state.isAuthenticated = false;
        state.user = null;
      })

      // user logout cases
      .addCase(userLogout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogout.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
        state.isAuthenticated = false;
        state.user = null;
      })

      // check authenticated user cases
      .addCase(checkAuthenticatedUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthenticatedUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(checkAuthenticatedUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || null;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export default authenticationSlice.reducer;
