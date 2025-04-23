"use client";

import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

interface UserState {
  token: string | null;
}

const Home: React.FC = () => {
  const user = useSelector((store: { user: UserState }) => store.user);
  const router = useRouter();
  const isAuthenticated = Boolean(user.token);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 px-4 text-center transition-colors duration-300">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-primary transition-all duration-500">
          {isAuthenticated ? "Welcome Home" : "Welcome Guest"}
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-base-content transition-opacity duration-500">
          {isAuthenticated
            ? "Continue to your dashboard from here."
            : "You need to log in to continue."}
        </p>

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <button
            onClick={() => router.push(isAuthenticated ? "/dashboard" : "/auth/login")}
            className="btn btn-primary transition-transform duration-200 hover:scale-105"
          >
            {isAuthenticated ? "Go to Dashboard" : "Go to Login"}
          </button>

          <button
            onClick={() => router.push("/about")}
            className="btn btn-outline transition-transform duration-200 hover:scale-105"
          >
            About Us
          </button>

          <button
            onClick={() => router.push("/contact")}
            className="btn btn-outline transition-transform duration-200 hover:scale-105"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
