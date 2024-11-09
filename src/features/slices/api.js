/** @format */
// https://ebee-server.onrender.com
export const url = "https://ebee-server.onrender.com/api";

export const setHeaders = () => {
    let token = localStorage.getItem("token");

	token = token && token.replace(/^"|"$/g, "");

    // Check if token is null or undefined
    if (!token) {
        console.warn("No token found in localStorage. Check if user is logged in or if token is being stored correctly.");
    } else {
        console.log("Retrieved token:", token);  // Logs the retrieved token
    }

    const headers = {
        Authorization: `Bearer ${token}`,  // Set Authorization header
        "Content-Type": "application/json",  // Optionally add Content-Type
    };

    console.log("Request headers set:", headers);
    return headers;
};
