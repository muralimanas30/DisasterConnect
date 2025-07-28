import { configureStore } from "@reduxjs/toolkit";
import userReducer, { setUserFromStorage } from "./userSlice";
import incidentReducer from "./slices/incidentSlice";

const store = configureStore({
    reducer: {
        user: userReducer,
        incidents: incidentReducer,
    },
});

// Helper to sync Redux state from sessionStorage (call in layout/useEffect)
export function syncUserFromSessionStorage() {
    if (typeof window !== "undefined") {
        const token = sessionStorage.getItem("token");
        const user = sessionStorage.getItem("user");
        if (token && user) {
            store.dispatch(setUserFromStorage({ token, user: JSON.parse(user) }));
        }
    }
}

export default store;
