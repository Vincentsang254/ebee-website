/** @format */
// https://ebee-server.onrender.com
export const url = "/api";


export const setHeaders = () => {
  const token = localStorage.getItem("token");


  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };


  return headers;
};


