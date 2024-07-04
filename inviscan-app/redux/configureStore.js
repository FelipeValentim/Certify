import { combineReducers, configureStore } from "@reduxjs/toolkit";
import token from "./token";
import snackBar from "./snackBar";

const reducer = combineReducers({
  token,
  snackBar,
});

// export const store = configureStore({
//   reducer: reducerProxy,
// });

// Existem middlewares já configurados por padrão na store
// para adicionarmos um novo, precisamos puxar os que já existem
// e desestruturarmos os mesmos dentro de uma array.

const store = configureStore({
  reducer,
});

export default store;
