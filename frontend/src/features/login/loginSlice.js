import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchData, fetchRepo } from "./loginAPI";

const initialState = {
  isLoggedIn: false,
  user: null,
  status: "idle",
  error: null,
  repos: [],
  accessToken: "",
};

export const fetchAsync = createAsyncThunk("auth/fetchData", async (data) => {
  const response = await fetchData(data);
  return response;
});

export const fetchRepoAsync = createAsyncThunk(
  "auth/fetchRepo",
  async (url) => {
    const response = await fetchRepo(url);
    return response;
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.clear();
      state.isLoggedIn = false;
      state.user = null;
    },
    setLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },

  extraReducers(builder) {
    builder
      .addCase(fetchAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.user.repos_url = action.payload.repos_url + "?per_page=20";
        state.isLoggedIn = true;
        state.accessToken = action.payload.access_token;
      })
      .addCase(fetchAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchRepoAsync.fulfilled, (state, action) => {
        state.repos = action.payload;
      });
  },
});

export const { setLoggedIn, setAccessToken, logout } = authSlice.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectAccessToken = (state) => state.auth.accessToken;

export default authSlice.reducer;
