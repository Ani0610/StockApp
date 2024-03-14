import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import GodownReceiveMaal from '../pages/Godown Receive/GodownReceiveMaal';
import Icon from "react-native-easy-icon";
import { DrawerActions } from '@react-navigation/native';
import AddEditGodownReceive from '../pages/Godown Receive/AddEditGodownReceive';
import AssignJobwork from '../pages/Godown Receive/AssignJobwork';

const Stack = createNativeStackNavigator();

const GodownReceive = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="GodownReceiveList" component={GodownReceiveMaal} options={({ navigation }: any) => ({
                title: "Receive Maal",
                headerLeft: () => (
                    <Icon
                        type="feather"
                        name="menu"
                        color="black"
                        size={20}
                        style={{ marginRight: 30 }}
                        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())
                        }
                    />
                ),
            })} />
            <Stack.Screen name="AddEditReceiveMaal" component={AddEditGodownReceive} options={({ navigation }: any) => ({
                title: "Receive Maal",
                headerLeft: () => (
                    <Icon
                        type="feather"
                        name="arrow-left"
                        color="black"
                        size={35}
                        style={{ marginRight: 30 }}
                        onPress={() => navigation.goBack()}
                    />
                ),
            })} />
            <Stack.Screen name="AssignJobwork" component={AssignJobwork} options={({ navigation }: any) => ({
                title: "Assign Job",
                headerLeft: () => (
                    <Icon
                        type="feather"
                        name="arrow-left"
                        color="black"
                        size={35}
                        style={{ marginRight: 30 }}
                        onPress={() => navigation.goBack()}
                    />
                ),
            })} />
        </Stack.Navigator>
    )
}

export default GodownReceive