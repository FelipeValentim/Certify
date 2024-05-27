import axios from "axios";
import { httpStatus } from "../../constants/Default";

// store
import store from "@/redux/configureStore";
store.subscribe(listener);

function listener() {
  const token = store.getState().token;
  console.log("dsa", token);
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
}
console.log("dasdds");
// initializing the axios instance with custom configs
const api = axios.create({
  baseURL: "https://localhost:7093",
});

const errorHandler = async (error) => {
  const statusCode = error.response?.status;
  // logging only errors that are not 401
  if (statusCode && statusCode !== httpStatus.unauthorized) {
    if (typeof error.response?.data === "string") {
      const message = error.response?.data;
    }
  } else if (statusCode && statusCode === httpStatus.unauthorized) {
  }

  return Promise.reject(error);
};

// registering the custom error handler to the
// "api" axios instance
api.interceptors.response.use(undefined, (error) => {
  return errorHandler(error);
});

export default api;
