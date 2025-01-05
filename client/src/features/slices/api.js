/** @format */
// https://ebee-server.onrender.com
export const url = "/api";

export const setHeaders = () => {
    let token = localStorage.getItem("token");

	token = token && token.replace(/^"|"$/g, "");

    if (!token) {
        console.warn("No token found in localStorage. Check if user is logged in or if token is being stored correctly.");
    } else {
        console.log("Retrieved token:", token); 
    }

    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };

    console.log("Request headers set:", headers);
    return headers;
};
