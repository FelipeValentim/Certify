import "react-native-reanimated";

import Main from "./app/_main";
import { Provider } from "react-redux";
import store from "@/redux/configureStore";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

export default function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
