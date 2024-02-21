import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import AllSampleDesign from "../pages/Design master/AllSampleDesign";
import Dashboard from "../pages/Dashboard/Dashboard";
// import Icon from 'react-native-vector-icons/MaterialIcons';
import { GlobalStyle } from "../../globalStyle";
import { View } from "react-native";
import Icon from "react-native-easy-icon";
import DeliveredDesign from "../pages/Design master/DeliveredDesign";

const BottomStack = createBottomTabNavigator();
const BottomTabNavigator = () => {
  return (
    <BottomStack.Navigator
      initialRouteName="Sample"
      screenOptions={() => ({
        headerBackgroundContainerStyle: "#fff",
        tabBarShowLabel: true,
        tabBarStyle: GlobalStyle.tabBar,
        tabBarActiveTintColor: "blue",
      })}
    >
      <BottomStack.Screen
        name="Delivered"
        component={DeliveredDesign}
        options={({ route }) => ({
          tabBarIcon: ({ size, focused, color }) => {
            return (
              <View>
                <Icon
                  type="foundation"
                  name="photo"
                  color={focused ? "blue" : "gray"}
                  size={35}
                />
              </View>
            );
          },
          headerShown: false,
        })}
      />
      <BottomStack.Screen
        name="Sample"
        component={AllSampleDesign}
        options={({ route }) => ({
          tabBarIcon: ({ size, focused, color }) => {
            return (
              <View>
                <Icon
                  type="foundation"
                  name="list-thumbnails"
                  color={focused ? "blue" : "gray"}
                  size={35}
                />
              </View>
            );
          },
          headerShown: false,
        })}
      />
      <BottomStack.Screen
        name="Statistics"
        component={Dashboard}
        options={({ route }) => ({
          tabBarIcon: ({ size, focused, color }) => {
            return (
              <View>
                <Icon
                  type="entypo"
                  name="area-graph"
                  color={focused ? "blue" : "gray"}
                  size={35}
                />
              </View>
            );
          },
          headerShown: false,
        })}
      />
    </BottomStack.Navigator>
  );
};

export default BottomTabNavigator;
