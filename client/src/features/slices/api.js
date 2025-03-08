export const url = "/api";

export const setHeaders = () => {
  const token = localStorage.getItem("token");

  let headers = {
    headers: {},
  };

  if (token) {
    headers.headers["x-auth-token"] = token; // ✅ Keep for backward compatibility
    headers.headers["Authorization"] = `Bearer ${token}`; // ✅ Best practice
  }

  return headers;
};
