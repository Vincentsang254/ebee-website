/** @format */

export const url = "https://ebee-0q1f.onrender.com/api"

export const setHeaders = () => {
	const token = localStorage.getItem("token");
	const headers = {
		Authorization: `Bearer ${token}`,
	};

	return headers;
};
