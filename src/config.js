const API_URL =
  process.env.REACT_APP_API_URL ||
  (["localhost", "127.0.0.1"].includes(window.location.hostname)
    ? "http://localhost:4000/"
    : "https://drbskhealthcare.com/");

export default API_URL;