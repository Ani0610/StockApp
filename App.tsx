/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import type { PropsWithChildren } from "react";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StyleSheet,
  View
} from "react-native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import AuthNavigator from "./src/navigator/AuthNavigator";
import SideMenuNavigator from "./src/navigator/SideMenuNavigator";
import CreateChallan from "./src/pages/Carrier Challan/CreateChallan";
import CreateSampleDesign from "./src/pages/Design master/CreateSampleDesign";
import ViewDesignByPartyName from "./src/pages/Design master/ViewDesignByPartyName";
import ViewDesignDetails from "./src/pages/Design master/ViewDesignDetails";
import { RootState } from "./src/redux/store";
import Toast from "./src/components/Toast/toast";
import { setToast } from "./src/redux/action/Ui/Uislice";

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): React.JSX.Element {
  const dispatch = useDispatch();

  const Stack = createNativeStackNavigator();
  const {user} = useSelector((state: RootState) => state.user);
  const { isLoading, toast } = useSelector((state: RootState) => state.ui);
  const [isLoggedIn, setIsLogged] = useState(false);
  useEffect(() => {
    console.log('user', user);
    if (user) {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, [user]);
  useEffect(() => {
    dispatch(setToast({ message: 'Welcome Back', isVisible: true, type: 'success' }))
  }, [])
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {
        toast?.isVisible &&
        <Toast
          message={toast.message}
          visible={toast.isVisible}
          type={toast.type}
        />}
      {isLoading && (
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size={"large"} />
        </View>
      )}
      {/* <View style={{ height: "100%", backgroundColor: "#fff" }}> */}
        <NavigationContainer theme={DefaultTheme}>
          {isLoggedIn ? (
            // <SideMenuNavigator />
            <Stack.Navigator>
              <Stack.Screen
                name="AppDrawerStack"
                component={SideMenuNavigator}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Add Design"
                component={CreateSampleDesign}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="View Design"
                component={ViewDesignDetails}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Party Wise Design"
                component={ViewDesignByPartyName}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Create Challan"
                component={CreateChallan}
                options={{
                  headerShown: false,
                }}
              />
            </Stack.Navigator>
          ) : (
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen
                name="Auth"
                options={{ headerShown: false }}
                component={AuthNavigator}
              />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      {/* </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  highlight: {
    fontWeight: "700",
  },
  container: {
    position: "absolute",
    zIndex: 999,
    height: "100%",
    width: "100%",
    margin: "auto",
    backgroundColor: "rgba(255,255,255,0.7)",
    elevation: Platform.OS === "android" ? 50 : 0,
    shadowColor: "rgba(255,255,255,0.7)",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

export default App;
