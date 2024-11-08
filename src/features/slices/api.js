/** @format */

export const url = "https://ebee-server.onrender.com/api"

export const setHeaders = () => {
	const token = localStorage.getItem("token");
	const headers = {
		Authorization: `Bearer ${token}`,
	};

	return headers;
};
