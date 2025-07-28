import axiosInstance from "./axiosInstance";

export async function fetchProfile() {
  const res = await axiosInstance.get("/users/profile");
  return res.data.user;
}

export async function updateProfile(data) {
  // Use the same base path as fetchProfile
  const res = await axiosInstance.patch("/users/profile", data);
  console.log("res data", res.data);
  return res.data;
}
