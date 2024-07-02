import "react-native-reanimated";

import Main from "./app/_main";
import { Provider } from "react-redux";
import store from "@/redux/configureStore";

// Prevent the splash screen from auto-hiding before asset loading is complete.

export default function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
