/** @format */
// https://ebee-website.onrender.com
export const url = "/api";


export const setHeaders = () => {
  const token = localStorage.getItem("token");


  const headers = {
    headers: {
      "x-auth-token": localStorage.getItem("token"),
    },
  };


  return headers;
};


