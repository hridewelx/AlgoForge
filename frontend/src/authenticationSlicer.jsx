import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "./utilities/axiosClient";

export const userRegistration = createAsyncThunk(
  "authentication/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/user/register", userData);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const userLogin = createAsyncThunk(
  "authentication/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/user/login", credentials);
      return response.data.user;
    } catch (error) {
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
      return rejectWithValue(error);
    }
  }
);

export const checkAuthenticatedUser = createAsyncThunk(
  "authentication/check",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/user/checkauthentication");
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// New thunk to fetch user avatar from profile
export const fetchUserAvatar = createAsyncThunk(
  "authentication/fetchAvatar",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { authentication } = getState();
      // Only fetch if authenticated and avatar not already loaded
      if (!authentication.isAuthenticated) {
        return null;
      }
      const response = await axiosClient.get("/profile/getprofile");
      return response.data.user?.avatar || "";
    } catch (error) {
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
    avatar: "",  // Store avatar in global state
    avatarLoading: false,
    avatarFetched: false,  // Track if avatar has been fetched to prevent re-fetching
  },
  reducers: {
    // Action to manually update avatar (e.g., after upload)
    setAvatar: (state, action) => {
      state.avatar = action.payload;
      state.avatarFetched = true;
    },
    // Action to clear avatar (e.g., after removing avatar)
    clearAvatar: (state) => {
      state.avatar = "";
    },
  },
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
        state.avatar = "";  // Clear avatar on logout
        state.avatarFetched = false;
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
        state.isAuthenticated = false;
        state.user = null;
        state.avatar = "";
        state.avatarFetched = false;
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
        state.avatar = "";
        state.avatarFetched = false;
      })

      // fetch user avatar cases
      .addCase(fetchUserAvatar.pending, (state) => {
        state.avatarLoading = true;
      })
      .addCase(fetchUserAvatar.fulfilled, (state, action) => {
        state.avatarLoading = false;
        state.avatar = action.payload || "";
        state.avatarFetched = true;
      })
      .addCase(fetchUserAvatar.rejected, (state) => {
        state.avatarLoading = false;
        state.avatarFetched = true;  // Mark as fetched even on error to prevent retries
      });
  },
});

export const { setAvatar, clearAvatar } = authenticationSlice.actions;
export default authenticationSlice.reducer;
