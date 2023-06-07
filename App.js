import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootSiblingParent } from "react-native-root-siblings";
import { RootNavigator } from "./navigation/RootNavigator";
import { AuthenticatedUserProvider } from "./providers";
import { PaperProvider } from "react-native-paper";

export default function App() {
  return (
    <AuthenticatedUserProvider>
      <SafeAreaProvider>
        <RootSiblingParent>
          <PaperProvider>
            <RootNavigator />
          </PaperProvider>
        </RootSiblingParent>
      </SafeAreaProvider>
    </AuthenticatedUserProvider>
  );
}
