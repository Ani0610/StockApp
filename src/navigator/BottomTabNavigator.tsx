import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect } from "react";
import Dashboard from "../pages/Dashboard/Dashboard";
import AllSampleDesign from "../pages/Design master/AllSampleDesign";
// import Icon from 'react-native-vector-icons/MaterialIcons';
import { View } from "react-native";
import Icon from "react-native-easy-icon";
import { useDispatch, useSelector } from "react-redux";
import { Subscription, forkJoin } from "rxjs";
import { GlobalStyle } from "../../globalStyle";
import DeliveredDesign from "../pages/Design master/DeliveredDesign";
import HomePage from "../pages/Design master/HomePage";
import DesignSample from "../pages/Design master/DesignSample";
import { setCategory } from "../redux/action/Category/categorySlice";
import { setDesign } from "../redux/action/DesignDetails/designSlice";
import { setJobWork } from "../redux/action/Job Work details/jobDetailsSlice";
import { setStone } from "../redux/action/StoneDetails/stoneSlice";
import { setLoading } from "../redux/action/Ui/Uislice";
import { setPartyMaster } from "../redux/action/party master/PartymasterSlice";
import {
  getCategories,
  getJobWork,
  getPapers,
  getParty,
  getStones,
} from "../services/master/master.service";
import { getUsers } from "../services/user/user.service";
import { setUsers } from "../redux/action/User Master/userMasterSlice";
import { RootState } from "../redux/store";

const BottomStack = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const dispatch = useDispatch();
  const { user }: any = useSelector((state: RootState) => state.user);
  let subscription: Subscription;
  const fetchData = () => {
    const stones = getStones();
    const papers = getPapers();
    const jobworks = getJobWork();
    const categories = getCategories();
    const parties = getParty();
    const users = getUsers();

    const combinedRequests = forkJoin([
      stones,
      papers,
      jobworks,
      categories,
      parties,
      users,
    ]);

    subscription = combinedRequests.subscribe({
      next: ([data1, data2, data3, data4, data5, data6]) => {
        // Handle the data from all requests
        console.log(
          data1,
          "-----------------------------------------------------------------------------"
        );

        if (data1) dispatch(setStone(data1));
        else dispatch(setStone([]));
        if (data2) dispatch(setDesign(data2));
        else dispatch(setDesign([]));
        if (data3) dispatch(setJobWork(data3));
        else dispatch(setJobWork([]));
        if (data4) dispatch(setCategory(data4));
        else dispatch(setCategory([]));
        if (data5) dispatch(setPartyMaster(data5));
        else dispatch(setPartyMaster([]));
        if (data6) {
          let userLists = data6.filter(
            (data) => data.mobileNumber !== user?.mobileNumber
          );
          dispatch(setUsers(userLists));
        } else dispatch(setUsers([]));

        dispatch(setLoading(false));
      },
      error: (err) => {
        // Handle error
        console.error("Error fetching data:", err);
      },
    });
  };
  useEffect(() => {
    dispatch(setLoading(true));

    fetchData();
    return () => {
      // Unsubscribe to prevent memory leaks
      // This will cancel the ongoing requests if the component unmounts before they complete
      // You may want to handle this differently based on your specific use case
      subscription.unsubscribe();
    };
  }, []);

  // useEffect(()=>{
  //   dispatch(setLoading(true))
  //   getDesignDetails().then((res) => {
  //     dispatch(setLoading(false))
  //     if (res) {
  //       dispatch(setDesignMaster(res))
  //     }
  //     else {
  //       dispatch(setToast({ message: 'No Data Found', isVisible: true, type: 'danger' }))
  //     }
  //   })
  // },[])
  return (
    <BottomStack.Navigator
      initialRouteName="Home"
      screenOptions={() => ({
        headerBackgroundContainerStyle: "#fff",
        tabBarShowLabel: true,
        tabBarStyle: GlobalStyle.tabBar,
        tabBarActiveTintColor: "blue",
      })}
    >
      <BottomStack.Screen
        name="Home"
        component={HomePage}
        options={({ route }) => ({
          tabBarIcon: ({ size, focused, color }) => {
            return (
              <View>
                <Icon
                  type="foundation"
                  name="home"
                  color={focused ? "blue" : "gray"}
                  size={35}
                />
              </View>
            );
          },
          headerTitle:"Overview",
          headerStyle: {
            backgroundColor: "#24acf2", 
          },
          headerTintColor: "#FFF", 
          headerShown: true,
        })}
      />


      {/* <BottomStack.Screen
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
      /> */}
      <BottomStack.Screen
        name="Designs"
        component={DesignSample}
        options={({ route }) => ({
          tabBarIcon: ({ size, focused, color }) => {
            return (
              <View>
                <Icon
                  type="feather"
                  name="menu"
                  color={focused ? "blue" : "gray"}
                  size={35}
                />
              </View>
            );
          },
          headerTitle:"Designs",
          headerStyle: {
            backgroundColor: "#24acf2", 
          },
          headerTintColor: "#FFF", 
          headerShown: true,
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
          headerTitle:"Statistics",
          headerStyle: {
            backgroundColor: "#24acf2", 
          },
          headerTintColor: "#FFF", 
          headerShown: true,
        })}
      />
    </BottomStack.Navigator>
  );
};

export default BottomTabNavigator;
