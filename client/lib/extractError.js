/**
 * Extracts a user-friendly error message from backend error response.
 */
export default function extractError(err) {
    if (!err) return "Unknown error";
    if (err.response?.data?.error) return err.response.data.error;
    if (err.response?.data?.message) return err.response.data.message;
    if (err.response?.data?.msg) return err.response.data.msg;
    if (typeof err.response?.data === "string") return err.response.data;
    if (err.message) return err.message;
    return "Unknown error";
}
