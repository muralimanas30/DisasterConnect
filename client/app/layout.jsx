"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import NavBar from "../components/NavBar";
import AppClientProvider from "../components/AppClientProvider";
import ReduxDevTools from "../components/ReduxDevTools";
import React from "react";
import RouteLoader from "@/hooks/useRouteLoader";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import store from "@/store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <Provider store={store}>
      <html lang="en" data-theme="light">
      
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-base-100 text-base-content`}
        >
          <Providers>
            <AppClientProvider /> {/* This handles sessionStorage hydration */}
            <NavBar />
            <RouteLoader />
            {children}
            {/* ToastContainer for react-toastify toasts */}
            <ToastContainer />
          </Providers>
          <ReduxDevTools />
        </body>
      </html>
    </Provider>
  );
}