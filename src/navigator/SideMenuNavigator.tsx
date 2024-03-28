import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import { useSelector } from "react-redux";
import Challan from "../pages/Carrier Challan/Challan";
import CategoryMaster from "../pages/Category Master/CategoryMaster";
import DesignDetails from "../pages/Design details/DesignDetails";
import JobWorkDetails from "../pages/Job work details/JobWorkDetails";
import PartyMaster from "../pages/Party Master/PartyMaster";
import StoneStock from "../pages/Stone Stock/StoneStock";
import StoneDetails from "../pages/Stone details/StoneDetails";
import UserMaster from "../pages/Users Master/UserMaster";
import JobWorkTeam from "../pages/job work module/JobWorkTeam";
import TeamWorkPerDay from "../pages/job work module/TeamWorkPerDay";
import { RootState } from "../redux/store";
import BottomTabNavigator from "./BottomTabNavigator";
import DrawerView from "./DrawerView";
import GodownReceiveMaal from "../pages/Godown Receive/GodownReceiveMaal";
import GodownReceive from "./GodownReceive";
import JobworkReport from "../pages/Job work details/JobWorkReport";
import currentJob from "../pages/job work module/currentJob";
import CurrentJobWork from "../pages/job work module/currentJob";
const DrawerStack = createDrawerNavigator();
const SideMenuNavigator = ({ navigation }: any) => {
  const { user }: any = useSelector((state: RootState) => state.user);

  console.log('user-------------',user?.userType);
  
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
          case "admin":
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
                  options={{ title: 'Paper Master' }}
                />
                <DrawerStack.Screen
                  name="JobWork Details"
                  component={JobWorkDetails}
                />
                <DrawerStack.Screen name="Users" component={UserMaster} />
                <DrawerStack.Screen name="Challan" component={Challan} />
                <DrawerStack.Screen
                  name="Job work Report"
                  component={JobworkReport}
                />
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
                <DrawerStack.Screen
                  name="GodownReceive"
                  component={GodownReceive}
                  options={{ headerShown: false }}
                />
                <DrawerStack.Screen
                  name="Category"
                  component={CategoryMaster}
                />

              </>
            );
          case "godown":
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
                <DrawerStack.Screen
                  name="Category"
                  component={CategoryMaster}
                />
              </>
            );
          case "jobwork":
            return (
              <>
               <DrawerStack.Screen
                  name="Home"
                  component={CurrentJobWork}
                />
                <DrawerStack.Screen name="Work By Team" component={TeamWorkPerDay} />
                <DrawerStack.Screen name="Team" component={JobWorkTeam} />
              </>
            );
          case "carrier":
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
                <DrawerStack.Screen
                  name="Category Master"
                  component={CategoryMaster}
                />
              </>
            );
        }
      })()}
    </DrawerStack.Navigator>
  );
};

export default SideMenuNavigator;
