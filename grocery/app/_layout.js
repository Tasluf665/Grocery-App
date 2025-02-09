import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { persistor, store } from "../utils/store";
import { PersistGate } from "redux-persist/integration/react";

export default () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(Authentication)" />
        </Stack>
      </PersistGate>
    </Provider>
  );
};
