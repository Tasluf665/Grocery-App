import React from "react";
import { Redirect } from "expo-router";

export default function AppContainer() {
  let isAuth = false;
  let screenName = isAuth ? "/Main" : "/SplashScreen";
  return <Redirect href={screenName} />;
}
