import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { UserState } from "@/types/userTypes";

const API = "http://localhost:8000/api/users";

// Automatically create the initial state based on the UserState interface
const initialState: UserState = {
  user_id: undefined,
  username: undefined,
  email: undefined,
  role: undefined,
  phone_number: undefined,
  location: null,
  created_at: undefined,
  updated_at: undefined,
  token: null,
  loading: false,
  error: null,
  hasReported: false,
  hasBeenAccepted: false,
  hasBeenAssigned: false,
  previousReports: [],
  workingOnReport: null,
};

// Auth thunks
export const loginUser = createAsyncThunk<
  Omit<UserState, "loading" | "error">,
  Record<string, any>,
  { rejectValue: string }
>("user/login", async (userData, thunkApi) => {
  try {
    const res = await axios.post<any>(`${API}/login`, userData);
    if (res.data.success) {
      return { ...res.data.user, token: res.data.token };
    } else {
      return thunkApi.rejectWithValue(res.data.msg || "Login failed");
    }
  } catch (err: any) {
    return thunkApi.rejectWithValue(err?.response?.data?.msg || err.message || "Login failed");
  }
});

export const registerUser = createAsyncThunk<
  Omit<UserState, "loading" | "error">,
  Record<string, any>,
  { rejectValue: string }
>("user/register", async (userData, thunkApi) => {
  try {
    const res = await axios.post<any>(`${API}/register`, userData);
    if (res.data.success) {
      return { ...res.data.user, token: res.data.token };
    } else {
      return thunkApi.rejectWithValue("Registration failed");
    }
  } catch (err: any) {
    return thunkApi.rejectWithValue(err?.response?.data?.msg || err.message || "Registration failed");
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
    clearUser: () => initialState,
    updateLocation: (state, action: PayloadAction<{ lat: number; lng: number }>) => {
      state.location = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        Object.assign(state, action.payload, { loading: false });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        Object.assign(state, action.payload, { loading: false });
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });
  },
});

export const { setUser, clearUser, updateLocation } = userSlice.actions;
export default userSlice.reducer;