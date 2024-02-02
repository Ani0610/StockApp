import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react'
import AllSampleDesign from '../pages/Design master/AllSampleDesign';
import Dashboard from '../pages/Dashboard/Dashboard';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import { GlobalStyle } from '../../globalStyle';
import { View } from 'react-native';
import Icon from 'react-native-easy-icon';

const BottomStack = createBottomTabNavigator();
AllSampleDesign
const BottomTabNavigator = () => {
    return (
        <BottomStack.Navigator
            screenOptions={() => ({
                headerBackgroundContainerStyle: '#fff',
                tabBarShowLabel: false,
                tabBarStyle: GlobalStyle.tabBar
            })}
        >
            <BottomStack.Screen
                name='Design'
                component={AllSampleDesign}
                options={({ route }) => ({
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <View>
                                <Icon type="antdesign" name="home" color="gray" size={35} />
                            </View>
                        );
                    },
                    headerShown: false
                })}
            />
            <BottomStack.Screen
                name='Dashboard'
                component={Dashboard}
                options={({ route }) => ({
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <View>
                                <Icon type="entypo" name="area-graph" color="gray" size={35} />
                            </View>
                        );
                    },
                    headerShown: false
                })}
            />

            {/* <BottomStack.Screen name='AllSampleDesign' component={AllSampleDesign}
                options={{
                    headerShown: false
                }}
            /> */}

        </BottomStack.Navigator>
    )
}

export default BottomTabNavigator
