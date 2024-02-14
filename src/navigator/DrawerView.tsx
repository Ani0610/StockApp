import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/action/User/userSlice";
import Icon from "react-native-easy-icon";
import { RootState } from "../redux/store";

const DrawerView = ({ navigation, state }: any) => {
  const dispatch = useDispatch();
  const [dropDown, setdropDown] = useState(false);
  const [dropDownjob, setdropDownjob] = useState(false);
  const { user }: any = useSelector((state: RootState) => state.user);

  const handlePress = (screenName: string) => {
    navigation.navigate(screenName);
  };

  const handleLogout = () => {
    dispatch(setUser(null));
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {(() => {
          switch (user?.userType) {
            case "Admin":
              return (
                <>
                  <TouchableOpacity
                    style={[
                      styles.drawerItem,
                      state.index === 0 && styles.activeDrawerItem,
                    ]}
                    onPress={() => handlePress("Home")}
                  >
                    <Text style={styles.drawerText}>Home</Text>
                  </TouchableOpacity>
                  <View style={[styles.drawerItem, { paddingVertical: 8 }]}>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                      onPress={() => setdropDown(!dropDown)}
                    >
                      <Text style={styles.drawerText}>Stone </Text>
                      {dropDown ? (
                        <Icon
                          type="feather"
                          name="chevron-down"
                          color="#000"
                          size={30}
                        />
                      ) : (
                        <Icon
                          type="feather"
                          name="chevron-right"
                          color="#000"
                          size={30}
                        />
                      )}
                    </TouchableOpacity>
                    {dropDown && (
                      <>
                        <TouchableOpacity
                          style={[
                            styles.drawerItem,
                            state.index === 1 && styles.activeDrawerItem,
                            { marginHorizontal: 0 },
                          ]}
                          onPress={() => handlePress("Stone Details")}
                        >
                          <Text style={styles.drawerText}>Stone Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.drawerItem,
                            state.index === 2 && styles.activeDrawerItem,
                            { borderBottomWidth: 0, marginHorizontal: 0 },
                          ]}
                          onPress={() => handlePress("Stone Stock")}
                        >
                          <Text style={styles.drawerText}>Stone Stock</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.drawerItem,
                      state.index === 3 && styles.activeDrawerItem,
                    ]}
                    onPress={() => handlePress("Design Details")}
                  >
                    <Text style={styles.drawerText}>Design Details</Text>
                  </TouchableOpacity>
                  <View style={[styles.drawerItem, { paddingVertical: 8 }]}>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                      onPress={() => setdropDownjob(!dropDownjob)}
                    >
                      <Text style={styles.drawerText}>Job </Text>
                      {dropDownjob ? (
                        <Icon
                          type="feather"
                          name="chevron-down"
                          color="#000"
                          size={30}
                        />
                      ) : (
                        <Icon
                          type="feather"
                          name="chevron-right"
                          color="#000"
                          size={30}
                        />
                      )}
                    </TouchableOpacity>
                    {dropDownjob && (
                      <>
                        <TouchableOpacity
                          style={[
                            styles.drawerItem,
                            state.index === 4 && styles.activeDrawerItem,
                            { marginHorizontal: 0 },
                          ]}
                          onPress={() => handlePress("JobWork Details")}
                        >
                          <Text style={styles.drawerText}>Job Master</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.drawerItem,
                            state.index === 7 && styles.activeDrawerItem,
                            { borderBottomWidth: 0, marginHorizontal: 0 },
                          ]}
                          onPress={() => handlePress("Job work Team")}
                        >
                          <Text style={styles.drawerText}>Job work Team</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.drawerItem,
                            state.index === 8 && styles.activeDrawerItem,
                            { borderBottomWidth: 0, marginHorizontal: 0 },
                          ]}
                          onPress={() => handlePress("Per Day Work by Team")}
                        >
                          <Text style={styles.drawerText}>Work by Team</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.drawerItem,
                      state.index === 5 && styles.activeDrawerItem,
                    ]}
                    onPress={() => handlePress("Users")}
                  >
                    <Text style={styles.drawerText}>Users</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.drawerItem,
                      state.index === 6 && styles.activeDrawerItem,
                    ]}
                    onPress={() => handlePress("Challan")}
                  >
                    <Text style={styles.drawerText}>Challan</Text>
                  </TouchableOpacity>
                </>
              );
            case "Godown":
              return (
                <>
                  <TouchableOpacity
                    style={[
                      styles.drawerItem,
                      state.index === 0 && styles.activeDrawerItem,
                    ]}
                    onPress={() => handlePress("Home")}
                  >
                    <Text style={styles.drawerText}>Home</Text>
                  </TouchableOpacity>
                  <View style={[styles.drawerItem, { paddingVertical: 8 }]}>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                      onPress={() => setdropDown(!dropDown)}
                    >
                      <Text style={styles.drawerText}>Stone </Text>
                      {dropDown ? (
                        <Icon
                          type="feather"
                          name="chevron-down"
                          color="#000"
                          size={30}
                        />
                      ) : (
                        <Icon
                          type="feather"
                          name="chevron-right"
                          color="#000"
                          size={30}
                        />
                      )}
                    </TouchableOpacity>
                    {dropDown && (
                      <>
                        <TouchableOpacity
                          style={[
                            styles.drawerItem,
                            state.index === 1 && styles.activeDrawerItem,
                            { marginHorizontal: 0 },
                          ]}
                          onPress={() => handlePress("Stone Details")}
                        >
                          <Text style={styles.drawerText}>Stone Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.drawerItem,
                            state.index === 2 && styles.activeDrawerItem,
                            { borderBottomWidth: 0, marginHorizontal: 0 },
                          ]}
                          onPress={() => handlePress("Stone Stock")}
                        >
                          <Text style={styles.drawerText}>Stone Stock</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.drawerItem,
                      state.index === 3 && styles.activeDrawerItem,
                    ]}
                    onPress={() => handlePress("Design Details")}
                  >
                    <Text style={styles.drawerText}>Design Details</Text>
                  </TouchableOpacity>
                  <View style={[styles.drawerItem, { paddingVertical: 8 }]}>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                      onPress={() => setdropDownjob(!dropDownjob)}
                    >
                      <Text style={styles.drawerText}>Job </Text>
                      {dropDownjob ? (
                        <Icon
                          type="feather"
                          name="chevron-down"
                          color="#000"
                          size={30}
                        />
                      ) : (
                        <Icon
                          type="feather"
                          name="chevron-right"
                          color="#000"
                          size={30}
                        />
                      )}
                    </TouchableOpacity>
                    {dropDownjob && (
                      <>
                        <TouchableOpacity
                          style={[
                            styles.drawerItem,
                            state.index === 4 && styles.activeDrawerItem,
                            { marginHorizontal: 0 },
                          ]}
                          onPress={() => handlePress("JobWork Details")}
                        >
                          <Text style={styles.drawerText}>Job Master</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.drawerItem,
                            state.index === 6 && styles.activeDrawerItem,
                            { borderBottomWidth: 0, marginHorizontal: 0 },
                          ]}
                          onPress={() => handlePress("Job work Team")}
                        >
                          <Text style={styles.drawerText}>Job work Team</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.drawerItem,
                            state.index === 7 && styles.activeDrawerItem,
                            { borderBottomWidth: 0, marginHorizontal: 0 },
                          ]}
                          onPress={() => handlePress("Per Day Work by Team")}
                        >
                          <Text style={styles.drawerText}>Work by Team</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.drawerItem,
                      state.index === 5 && styles.activeDrawerItem,
                    ]}
                    onPress={() => handlePress("Challan")}
                  >
                    <Text style={styles.drawerText}>Challan</Text>
                  </TouchableOpacity>
                </>
              );
            case "Job Work":
              return (
                <>
                  <TouchableOpacity
                    style={[
                      styles.drawerItem,
                      state.index === 0 && styles.activeDrawerItem,
                    ]}
                    onPress={() => handlePress("Home")}
                  >
                    <Text style={styles.drawerText}>Home</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.drawerItem,
                      state.index === 1 && styles.activeDrawerItem,
                    ]}
                    onPress={() => handlePress("Team")}
                  >
                    <Text style={styles.drawerText}>Teams</Text>
                  </TouchableOpacity>
                </>
              );
            case "Carrier":
              return (
                <>
                  <TouchableOpacity
                    style={[
                      styles.drawerItem,
                      state.index === 0 && styles.activeDrawerItem,
                    ]}
                    onPress={() => handlePress("Challan")}
                  >
                    <Text style={styles.drawerText}>Challan</Text>
                  </TouchableOpacity>
                </>
              );
            default:
              return (
                <>
                  <TouchableOpacity
                    style={[
                      styles.drawerItem,
                      state.index === 0 && styles.activeDrawerItem,
                    ]}
                    onPress={() => handlePress("Home")}
                  >
                    <Text style={styles.drawerText}>Home</Text>
                  </TouchableOpacity>
                  <View style={[styles.drawerItem, { paddingVertical: 8 }]}>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                      onPress={() => setdropDown(!dropDown)}
                    >
                      <Text style={styles.drawerText}>Stone </Text>
                      {dropDown ? (
                        <Icon
                          type="feather"
                          name="chevron-down"
                          color="#000"
                          size={30}
                        />
                      ) : (
                        <Icon
                          type="feather"
                          name="chevron-right"
                          color="#000"
                          size={30}
                        />
                      )}
                    </TouchableOpacity>
                    {dropDown && (
                      <>
                        <TouchableOpacity
                          style={[
                            styles.drawerItem,
                            state.index === 1 && styles.activeDrawerItem,
                            { marginHorizontal: 0 },
                          ]}
                          onPress={() => handlePress("Stone Details")}
                        >
                          <Text style={styles.drawerText}>Stone Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.drawerItem,
                            state.index === 2 && styles.activeDrawerItem,
                            { borderBottomWidth: 0, marginHorizontal: 0 },
                          ]}
                          onPress={() => handlePress("Stone Stock")}
                        >
                          <Text style={styles.drawerText}>Stone Stock</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.drawerItem,
                      state.index === 3 && styles.activeDrawerItem,
                    ]}
                    onPress={() => handlePress("Design Details")}
                  >
                    <Text style={styles.drawerText}>Design Details</Text>
                  </TouchableOpacity>
                  <View style={[styles.drawerItem, { paddingVertical: 8 }]}>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                      onPress={() => setdropDownjob(!dropDownjob)}
                    >
                      <Text style={styles.drawerText}>Job </Text>
                      {dropDownjob ? (
                        <Icon
                          type="feather"
                          name="chevron-down"
                          color="#000"
                          size={30}
                        />
                      ) : (
                        <Icon
                          type="feather"
                          name="chevron-right"
                          color="#000"
                          size={30}
                        />
                      )}
                    </TouchableOpacity>
                    {dropDownjob && (
                      <>
                        <TouchableOpacity
                          style={[
                            styles.drawerItem,
                            state.index === 4 && styles.activeDrawerItem,
                            { marginHorizontal: 0 },
                          ]}
                          onPress={() => handlePress("JobWork Details")}
                        >
                          <Text style={styles.drawerText}>Job Master</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.drawerItem,
                            state.index === 7 && styles.activeDrawerItem,
                            { borderBottomWidth: 0, marginHorizontal: 0 },
                          ]}
                          onPress={() => handlePress("Job work Team")}
                        >
                          <Text style={styles.drawerText}>Job work Team</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.drawerItem,
                            state.index === 8 && styles.activeDrawerItem,
                            { borderBottomWidth: 0, marginHorizontal: 0 },
                          ]}
                          onPress={() => handlePress("Per Day Work by Team")}
                        >
                          <Text style={styles.drawerText}>Work by Team</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.drawerItem,
                      state.index === 5 && styles.activeDrawerItem,
                    ]}
                    onPress={() => handlePress("Users")}
                  >
                    <Text style={styles.drawerText}>Users</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.drawerItem,
                      state.index === 6 && styles.activeDrawerItem,
                    ]}
                    onPress={() => handlePress("Challan")}
                  >
                    <Text style={styles.drawerText}>Challan</Text>
                  </TouchableOpacity>
                </>
              );
          }
        })()}
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
    borderBottomColor: "#ccc",
    backgroundColor: "transparent",
  },
  activeDrawerItem: {
    backgroundColor: "#c6f5f5",
  },
  drawerText: {
    fontSize: 16,
    color: "#333",
  },
  logoutContainer: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  logoutButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
});

export default DrawerView;
