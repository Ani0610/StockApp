import React, { useState } from 'react';
import { Text, TouchableOpacity, View, ScrollView, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/action/User/userSlice';
import Icon from 'react-native-easy-icon';

const DrawerView = ({ navigation, state }: any) => {
    const dispatch = useDispatch()
    const [dropDown, setdropDown] = useState(false)
    const handlePress = (screenName: string) => {
        navigation.navigate(screenName);
    };

    const handleLogout = () => {
        dispatch(setUser(null))
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                <TouchableOpacity
                    style={[
                        styles.drawerItem,
                        state.index === 0 && styles.activeDrawerItem,
                    ]}
                    onPress={() => handlePress('Home')}
                >
                    <Text style={styles.drawerText}>Home</Text>
                </TouchableOpacity>
                <View style={[styles.drawerItem, { paddingVertical: 8 }]}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                        onPress={() => setdropDown(!dropDown)}
                    >
                        <Text style={styles.drawerText}>Stone </Text>
                        {
                            dropDown ?

                                <Icon type="feather" name="chevron-down" color="#000" size={30} />
                                :
                                <Icon type="feather" name="chevron-right" color="#000" size={30} />
                        }

                    </TouchableOpacity>
                    {dropDown && <>
                        <TouchableOpacity
                            style={[
                                styles.drawerItem,
                                state.index === 1 && styles.activeDrawerItem, { marginHorizontal: 0 }
                            ]}
                            onPress={() => handlePress('StoneDetails')}
                        >
                            <Text style={styles.drawerText}>Stone Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.drawerItem,
                                state.index === 2 && styles.activeDrawerItem, { borderBottomWidth: 0, marginHorizontal: 0 }
                            ]}
                            onPress={() => handlePress('StoneStock')}
                        >
                            <Text style={styles.drawerText}>Stone Stock</Text>
                        </TouchableOpacity>
                    </>}
                </View>
                <TouchableOpacity
                    style={[
                        styles.drawerItem,
                        state.index === 3 && styles.activeDrawerItem,
                    ]}
                    onPress={() => handlePress('DesignDetails')}
                >
                    <Text style={styles.drawerText}>Design Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.drawerItem,
                        state.index === 4 && styles.activeDrawerItem,
                    ]}
                    onPress={() => handlePress('JobWorkDetails')}
                >
                    <Text style={styles.drawerText}>Job Details</Text>
                </TouchableOpacity>
            </ScrollView>
            <View style={styles.logoutContainer}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.drawerText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
        paddingVertical: 20,
    },
    drawerItem: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: 'transparent',
    },
    activeDrawerItem: {
        backgroundColor: '#c6f5f5',
    },
    drawerText: {
        fontSize: 16,
        color: '#333',
    },
    logoutContainer: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        borderBottomWidth: 1,
        borderBottomColor: "#ccc"
    },
    logoutButton: {
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
});

export default DrawerView;