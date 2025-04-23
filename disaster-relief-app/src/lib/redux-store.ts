// d:\CURRENT PROJECTS\DRCP\disaster-relief-app\src\lib\redux-store.ts

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";

// filepath: d:\CURRENT PROJECTS\DRCP\disaster-relief-app\src\lib\redux-store.ts
import { UserState } from "@/types/userTypes";


// ...rest of the file remains unchanged

const loadFromSession = () => {
  if (typeof window === "undefined") return undefined;
  const data = sessionStorage.getItem("userState");
  return data ? JSON.parse(data) : undefined;
};

const saveToSession = (state: any) => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("userState", JSON.stringify(state.user));
};

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState: {
    user: loadFromSession(),
  },
});

store.subscribe(() => {
  saveToSession(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
