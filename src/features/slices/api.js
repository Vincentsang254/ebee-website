/** @format */
// https://ebee-server.onrender.com
export const url = "https://ebee-server.onrender.com/api"

export const setHeaders = () => {
	const token = localStorage.getItem("token");
	console.log("Token:", token);  
	const headers = {
		Authorization: `Bearer ${token}`,
	};

	return headers;
};
