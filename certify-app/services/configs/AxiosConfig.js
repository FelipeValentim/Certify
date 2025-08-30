import axios from "axios";
import { baseURL, httpStatus } from "../../constants/Default";

// store
import store from "@/redux/configureStore";
import { signOut } from "@/redux/token";
import { getToken, removeToken } from "@/storage/SecurityStorage";
import { toast } from "@/redux/snackBar";
store.subscribe(listener);

// initializing the axios instance with custom configs
const api = axios.create({
  baseURL: baseURL,
});

const setHeader = async () => {
  const token = store.getState().token;
  if (!token) {
    const storageToken = await getToken();
    if (storageToken) {
      api.defaults.headers.common.Authorization = `Bearer ${storageToken}`;
    }
  } else {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
};

setHeader();

const errorHandler = async (error) => {
  const statusCode = error.response?.status;
  const message =
    typeof error.response?.data === "string"
      ? error.response.data
      : "Algum problema ocorreu";

  if (statusCode === httpStatus.unauthorized) {
    await removeToken();
    store.dispatch(signOut());
    store.dispatch(toast({ text: message, type: "error" }));
  } else if (statusCode && statusCode !== httpStatus.unauthorized) {
    store.dispatch(toast({ text: message, type: "error" }));
  }

  return Promise.reject(error);
};

// registering the custom error handler to the
// "api" axios instance
api.interceptors.response.use(undefined, (error) => {
  return errorHandler(error);
});

async function listener() {
  await setHeader();
}

export default api;
