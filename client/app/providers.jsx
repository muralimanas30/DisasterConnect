"use client";
import { Provider, useDispatch } from "react-redux";
import store from "../store";
import { useEffect } from "react";
import { setUserFromStorage } from "../store/userSlice";

function HydrateUser() {
  const dispatch = useDispatch();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("token");
      if (token) {
        dispatch(setUserFromStorage({ token, user: null }));
        // dispatch(hydrateUserThunk());
      }
    }
  }, [dispatch]);
  return null;
}

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <HydrateUser />
      {children}
    </Provider>
  );
}
