import axios, { AxiosError } from "axios";
import { httpStatus } from "../../constants/Default";

// initializing the axios instance with custom configs
const api = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:8081",
});

const errorHandler = async (error: AxiosError) => {
  const statusCode = error.response?.status;
  // logging only errors that are not 401
  if (statusCode && statusCode !== httpStatus.unauthorized) {
    if (typeof error.response?.data === "string") {
      const message: string = error.response?.data;
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
