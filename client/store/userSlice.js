import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerUser, loginUser } from "../api/auth";
import { fetchProfile, updateProfile } from "../api/user";
import extractError from "../lib/extractError";

// Thunks
export const registerUserThunk = createAsyncThunk(
    "user/register",
    async (data, { rejectWithValue }) => {
        try {
            return await registerUser(data);
        } catch (err) {
            console.error("[registerUserThunk]", extractError(err));
            return rejectWithValue(extractError(err));
        }
    }
);

export const loginUserThunk = createAsyncThunk(
    "user/login",
    async (data, { rejectWithValue }) => {
        try {
            const res = await loginUser(data);
            if (typeof window !== "undefined") {
                sessionStorage.setItem("token", res.token);
            }
            return res;
        } catch (err) {
            console.error("[loginUserThunk]", extractError(err));
            return rejectWithValue(extractError(err));
        }
    }
);

export const fetchProfileThunk = createAsyncThunk(
    "user/fetchProfile",
    async (_, { rejectWithValue }) => {
        try {
            return await fetchProfile();
        } catch (err) {
            console.error("[fetchProfileThunk]", extractError(err));
            return rejectWithValue(extractError(err));
        }
    }
);

export const updateProfileThunk = createAsyncThunk(
    "user/updateProfile",
    async (data, { rejectWithValue }) => {
        try {
            return await updateProfile(data);
        } catch (err) {
            console.error("[updateProfileThunk]", extractError(err));
            return rejectWithValue(extractError(err));
        }
    }
);

const getUserFromSession = () => {
    if (typeof window !== "undefined") {
        const raw = sessionStorage.getItem("user");
        if (!raw) return null;
        try {
            const user = JSON.parse(raw);
            // Defensive: Only return if user has expected attributes
            if (
                user &&
                typeof user === "object" &&
                user._id &&
                user.name &&
                user.email &&
                user.role
            ) {
                return user;
            }
            // If structure is invalid, clear and return null
            sessionStorage.removeItem("user");
            return null;
        } catch {
            sessionStorage.removeItem("user");
            return null;
        }
    }
    return null;
};

const getTokenFromSession = () => {
    if (typeof window !== "undefined") {
        const token = sessionStorage.getItem("token");
        // Defensive: Only return if token is a non-empty string
        if (token && typeof token === "string" && token.length > 0) {
            return token;
        }
        sessionStorage.removeItem("token");
        return null;
    }
    return null;
};

const initialState = {
    user: getUserFromSession(),
    token: getTokenFromSession(),
    loading: false,
    error: null,
    success: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            if (typeof window !== "undefined") {
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("user");
            }
        },
        setUserFromStorage(state, action) {
            // Always store user as JSON string, only with expected attributes
            let userObj = typeof action.payload.user === "string"
                ? JSON.parse(action.payload.user)
                : action.payload.user;
            // Defensive: Only store expected attributes
            if (
                userObj &&
                typeof userObj === "object" &&
                userObj._id &&
                userObj.name &&
                userObj.email &&
                userObj.role
            ) {
                state.user = {
                    _id: userObj._id,
                    name: userObj.name,
                    email: userObj.email,
                    role: userObj.role,
                    // Add other expected attributes if needed
                };
                state.token = action.payload.token;
                if (typeof window !== "undefined") {
                    sessionStorage.setItem("token", action.payload.token);
                    sessionStorage.setItem("user", JSON.stringify(state.user));
                }
            }
        },
        clearStatus(state) {
            state.error = null;
            state.success = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUserThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(registerUserThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.success = "Registration successful! You can now log in.";
            })
            .addCase(registerUserThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(loginUserThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(loginUserThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.success = "Login successful!";
                if (typeof window !== "undefined") {
                    sessionStorage.setItem("token", action.payload.token);
                    sessionStorage.setItem("user", JSON.stringify(action.payload.user));
                }
            })
            .addCase(loginUserThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProfileThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfileThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                if (typeof window !== "undefined") {
                    sessionStorage.setItem("user", JSON.stringify(action.payload));
                }
            })
            .addCase(fetchProfileThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateProfileThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(updateProfileThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.success = "Profile updated!";
                if (action.payload && action.payload._id) {
                    state.user = action.payload;
                    if (typeof window !== "undefined") {
                        sessionStorage.setItem("user", JSON.stringify(action.payload));
                    }
                } else {
                    state.success = "Profile updated, but no user data returned.";
                }
            })
            .addCase(updateProfileThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to update profile";
            });
    },
});

export const { logout, clearStatus, setUserFromStorage } = userSlice.actions;
export default userSlice.reducer;