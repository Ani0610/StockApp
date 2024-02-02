import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerView from './DrawerView';
import StoneDetails from '../pages/Stone details/StoneDetails';
import JobWorkDetails from '../pages/Job work details/JobWorkDetails';
import DesignDetails from '../pages/Design details/DesignDetails';
import CreateSampleDesign from '../pages/Design master/CreateSampleDesign';
import BottomTabNavigator from './BottomTabNavigator';
const DrawerStack = createDrawerNavigator();
const SideMenuNavigator = ({ navigation }: any) => {
    return (
        <DrawerStack.Navigator drawerContent={(props) => <DrawerView {...props} />}>
            <DrawerStack.Screen name="Home" component={BottomTabNavigator}
            />
            {/* <DrawerStack.Screen name='Add Design' component={CreateSampleDesign}
                options={() => ({
                    drawerLabel: () => null,
                    title: undefined,
                    drawerIcon: () => null,
                })}
            /> */}
            <DrawerStack.Screen name='StoneDetails' component={StoneDetails} />
            <DrawerStack.Screen name='DesignDetails' component={DesignDetails} />
            <DrawerStack.Screen name='JobWorkDetails' component={JobWorkDetails} />
        </DrawerStack.Navigator>
    );
}


export default SideMenuNavigator
