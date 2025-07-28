import axiosInstance from "./axiosInstance";

// Register user (fields: name, email, password, role, currentLocation, phone)
export async function registerUser(data) {
  // data: { name, email, password, role, phone, currentLocation }
  const res = await axiosInstance.post("/users/register", data);
  return res.data;
}

// Login user (fields: email, password)
export async function loginUser(data) {
  // data: { email, password }
  const res = await axiosInstance.post("/users/login", data);
  return res.data;
}
