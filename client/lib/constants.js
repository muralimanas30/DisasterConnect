// Global constants for the frontend application

const use = "nw"
export const BACKEND_API_URL = (use==="nw")?
"http://10.146.108.50:8000/api":
"http://localhost:8000/api";

export const BACKEND_URL = (use==="nw")?
"http://10.146.108.50:8000":
"http://localhost:8000";
// Add other global constants here as needed
