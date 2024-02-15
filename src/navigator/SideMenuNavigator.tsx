import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerView from "./DrawerView";
import StoneDetails from "../pages/Stone details/StoneDetails";
import JobWorkDetails from "../pages/Job work details/JobWorkDetails";
import DesignDetails from "../pages/Design details/DesignDetails";
import CreateSampleDesign from "../pages/Design master/CreateSampleDesign";
import BottomTabNavigator from "./BottomTabNavigator";
import StoneStock from "../pages/Stone Stock/StoneStock";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import JobWorkTeam from "../pages/job work module/JobWorkTeam";
import TeamWorkPerDay from "../pages/job work module/TeamWorkPerDay";
import UserMaster from "../pages/Users Master/UserMaster";
import Challan from "../pages/Carrier Challan/Challan";
import PartyMaster from "../pages/Party Master/PartyMaster";
const DrawerStack = createDrawerNavigator();
const SideMenuNavigator = ({ navigation }: any) => {
  const { user }: any = useSelector((state: RootState) => state.user);

  return (
    <DrawerStack.Navigator
      drawerContent={(props) => <DrawerView {...props} />}
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f5f5f5", // Set the background color of the header for all screens
        },
      }}
    >
      {(() => {
        switch (user?.userType) {
          case "Admin":
            return (
              <>
                <DrawerStack.Screen
                  name="Home"
                  component={BottomTabNavigator}
                />
                <DrawerStack.Screen
                  name="Stone Details"
                  component={StoneDetails}
                />
                <DrawerStack.Screen name="Stone Stock" component={StoneStock} />
                <DrawerStack.Screen
                  name="Design Details"
                  component={DesignDetails}
                />
                <DrawerStack.Screen
                  name="JobWork Details"
                  component={JobWorkDetails}
                />
                <DrawerStack.Screen name="Users" component={UserMaster} />
                <DrawerStack.Screen name="Challan" component={Challan} />
                <DrawerStack.Screen
                  name="Job work Team"
                  component={JobWorkTeam}
                />
                <DrawerStack.Screen
                  name="Per Day Work by Team"
                  component={TeamWorkPerDay}
                />
                <DrawerStack.Screen
                  name="Party Master"
                  component={PartyMaster}
                />
              </>
            );
          case "Godown":
            return (
              <>
                <DrawerStack.Screen
                  name="Home"
                  component={BottomTabNavigator}
                />
                <DrawerStack.Screen
                  name="Stone Details"
                  component={StoneDetails}
                />
                <DrawerStack.Screen name="Stone Stock" component={StoneStock} />
                <DrawerStack.Screen
                  name="Design Details"
                  component={DesignDetails}
                />
                <DrawerStack.Screen
                  name="JobWork Details"
                  component={JobWorkDetails}
                />
                <DrawerStack.Screen name="Challan" component={Challan} />
                <DrawerStack.Screen
                  name="Job work Team"
                  component={JobWorkTeam}
                />
                <DrawerStack.Screen
                  name="Per Day Work by Team"
                  component={TeamWorkPerDay}
                />
              </>
            );
          case "Job Work":
            return (
              <>
                <DrawerStack.Screen name="Home" component={TeamWorkPerDay} />
                <DrawerStack.Screen name="Team" component={JobWorkTeam} />
              </>
            );
          case "Carrier":
            return (
              <>
                <DrawerStack.Screen name="Challan" component={Challan} />
              </>
            );
          default:
            return (
              <>
                <DrawerStack.Screen
                  name="Home"
                  component={BottomTabNavigator}
                />
                <DrawerStack.Screen
                  name="Stone Details"
                  component={StoneDetails}
                />
                <DrawerStack.Screen name="Stone Stock" component={StoneStock} />
                <DrawerStack.Screen
                  name="Design Details"
                  component={DesignDetails}
                />
                <DrawerStack.Screen
                  name="JobWork Details"
                  component={JobWorkDetails}
                />
                <DrawerStack.Screen name="Users" component={UserMaster} />
                <DrawerStack.Screen name="Challan" component={Challan} />
                <DrawerStack.Screen
                  name="Job work Team"
                  component={JobWorkTeam}
                />
                <DrawerStack.Screen
                  name="Per Day Work by Team"
                  component={TeamWorkPerDay}
                />
                <DrawerStack.Screen
                  name="Party Master"
                  component={PartyMaster}
                />
              </>
            );
        }
      })()}
    </DrawerStack.Navigator>
  );
};

export default SideMenuNavigator;
