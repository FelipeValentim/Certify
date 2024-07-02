import "react-native-reanimated";

import App from "./_main";
import { Provider } from "react-redux";
import store from "@/redux/configureStore";

// Prevent the splash screen from auto-hiding before asset loading is complete.

export default function RootLayout() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
