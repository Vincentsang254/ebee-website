export const url = "/api";


console.log("API URL:", url);

export const setHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      "x-auth-token": token ? token : "",
    },
  };
};
