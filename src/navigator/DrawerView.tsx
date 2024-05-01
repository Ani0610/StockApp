import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-easy-icon";
import { useDispatch, useSelector } from "react-redux";
import { setToast } from "../redux/action/Ui/Uislice";
import { logOut, setUser } from "../redux/action/User/userSlice";
import { RootState } from "../redux/store";


const DrawerView = ({ navigation, state }: any) => {
  const dispatch = useDispatch();
  const [dropDown, setdropDown] = useState(null);
  const [dropDownjob, setdropDownjob] = useState(null);
  const [masterDropdown, setmasterDropdown] = useState(null);
  const { user }: any = useSelector((state: RootState) => state.user);

  const handlePress = (screenName: string) => {
    navigation.navigate(screenName);
  };

  const handleLogout = () => {
    Alert.alert("Are you sure!", "Do you want to logout?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Logout", onPress: () => {
          dispatch(logOut())
          dispatch(setUser(null));
          dispatch(setToast({ message: 'Logout Successfully!!', isVisible: true, type: 'success' }))
        }
      },
    ]);

  };

  const adminMenu = [
    {
      name: 'Home',
      label: "Home",
      isSubmenu: false
    },
    {
      name: 'Master', label: "Masters",
      isSubmenu: true,
      item: [{ name: 'Stone Details', label: "Stone" },
      { name: 'Design Details', label: "Paper" },
      { name: 'JobWork Details', label: "Jobwork" },
      { name: 'Users', label: "Users" },
      { name: 'Party Master', label: "Party" },
      { name: 'Category', label: "Category" }]
    },
    { name: 'Stone Stock', label: "Stone Stock", isSubmenu: false },

    {
      name: 'Job Work', label: "Job work", isSubmenu: true, item: [
        { name: 'Job work Report', label: "Report", isSubmenu: false },
        // { name: 'Job work Team', label: "Team", isSubmenu: false },
        // { name: 'Per Day Work by Team', label: "Work By Team", isSubmenu: false },
      ]
    },
    {
      name: 'GodownReceive', label: "Receive Maal", isSubmenu: false,
    },

    { name: 'Challan', label: "Challan", isSubmenu: false },
  ]

  const MenuCopomponent = ({ items }: any) => (
    <>
      {/* {console.log(items, 'items=----------')} */}
      {items && items.length && items.map((menu: any, i: any) => (
        <React.Fragment key={i}>
          {
            menu.isSubmenu ?
              <View style={[styles.drawerItem, { paddingVertical: 8 }]}>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                  onPress={() => setdropDown(i)}
                >
                  <Text style={styles.drawerText}>{menu.label} </Text>
                  {dropDown == i ? (
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
                {dropDown === i &&
                  menu.item.map((submenu: any, index: any) => (
                    <TouchableOpacity key={index}
                      style={[
                        styles.drawerItem,
                        masterDropdown === index && styles.activeDrawerItem,
                      ]}
                      onPress={() => { setmasterDropdown(index); handlePress(submenu.name) }}
                    >
                      <Text style={styles.drawerText}>{submenu.label}</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>
              :
              <TouchableOpacity
                style={[
                  styles.drawerItem,
                  dropDown === i && styles.activeDrawerItem,
                ]}
                onPress={() => {
                  setmasterDropdown(null);
                  setdropDown(i)
                  handlePress(menu.name)
                }}
              >
                <Text style={styles.drawerText}>{menu.label}</Text>
              </TouchableOpacity>
          }
        </React.Fragment>
      ))
      }
    </>
  )
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {(() => {
          switch (user?.userType) {
            case "admin":
              return (
                <MenuCopomponent items={adminMenu} />
              );
            case "godown":
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
                      onPress={() => setmasterDropdown(null)}
                    >
                      <Text style={styles.drawerText}>Master </Text>
                      {masterDropdown ? (
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
                    {masterDropdown && (
                      <>
                        <View
                          style={[styles.drawerItem, { paddingVertical: 8 }]}
                        >
                          <TouchableOpacity
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                            onPress={() => setdropDown(null)}
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
                                <Text style={styles.drawerText}>
                                  Stone Details
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={[
                                  styles.drawerItem,
                                  state.index === 2 && styles.activeDrawerItem,
                                  { borderBottomWidth: 0, marginHorizontal: 0 },
                                ]}
                                onPress={() => handlePress("Stone Stock")}
                              >
                                <Text style={styles.drawerText}>
                                  Stone Stock
                                </Text>
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
                        <View
                          style={[styles.drawerItem, { paddingVertical: 8 }]}
                        >
                          <TouchableOpacity
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                            onPress={() => setdropDownjob(null)}
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
                                <Text style={styles.drawerText}>
                                  Job Master
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={[
                                  styles.drawerItem,
                                  state.index === 6 && styles.activeDrawerItem,
                                  { borderBottomWidth: 0, marginHorizontal: 0 },
                                ]}
                                onPress={() => handlePress("Job work Team")}
                              >
                                <Text style={styles.drawerText}>
                                  Job work Team
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={[
                                  styles.drawerItem,
                                  state.index === 7 && styles.activeDrawerItem,
                                  { borderBottomWidth: 0, marginHorizontal: 0 },
                                ]}
                                onPress={() =>
                                  handlePress("Per Day Work by Team")
                                }
                              >
                                <Text style={styles.drawerText}>
                                  Work by Team
                                </Text>
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
                    )}
                  </View>
                </>
              );
            case "jobwork":
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
                    onPress={() => handlePress("Work By Team")}
                  >
                    <Text style={styles.drawerText}>Job by team</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.drawerItem,
                      state.index === 2 && styles.activeDrawerItem,
                    ]}
                    onPress={() => handlePress("Team")}
                  >
                    <Text style={styles.drawerText}>Teams</Text>
                  </TouchableOpacity>
                </>
              );
            case "carrier":
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
                      onPress={() => setmasterDropdown(null)}
                    >
                      <Text style={styles.drawerText}>Master </Text>
                      {masterDropdown ? (
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
                    {masterDropdown && (
                      <>
                        <View
                          style={[styles.drawerItem, { paddingVertical: 8 }]}
                        >
                          <TouchableOpacity
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                            onPress={() => setdropDown(null)}
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
                                <Text style={styles.drawerText}>
                                  Stone Details
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={[
                                  styles.drawerItem,
                                  state.index === 2 && styles.activeDrawerItem,
                                  { borderBottomWidth: 0, marginHorizontal: 0 },
                                ]}
                                onPress={() => handlePress("Stone Stock")}
                              >
                                <Text style={styles.drawerText}>
                                  Stone Stock
                                </Text>
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
                        <View
                          style={[styles.drawerItem, { paddingVertical: 8 }]}
                        >
                          <TouchableOpacity
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                            onPress={() => setdropDownjob(null)}
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
                                <Text style={styles.drawerText}>
                                  Job Master
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={[
                                  styles.drawerItem,
                                  state.index === 7 && styles.activeDrawerItem,
                                  { marginHorizontal: 0 },
                                ]}
                                onPress={() => handlePress("Job work Team")}
                              >
                                <Text style={styles.drawerText}>
                                  Job work Team
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={[
                                  styles.drawerItem,
                                  state.index === 8 && styles.activeDrawerItem,
                                  { borderBottomWidth: 0, marginHorizontal: 0 },
                                ]}
                                onPress={() =>
                                  handlePress("Per Day Work by Team")
                                }
                              >
                                <Text style={styles.drawerText}>
                                  Work by Team
                                </Text>
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
                        <TouchableOpacity
                          style={[
                            styles.drawerItem,
                            state.index === 9 && styles.activeDrawerItem,
                          ]}
                          onPress={() => handlePress("Party Master")}
                        >
                          <Text style={styles.drawerText}>Party Master</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.drawerItem,
                            state.index === 10 && styles.activeDrawerItem,
                          ]}
                          onPress={() => handlePress("Category Master")}
                        >
                          <Text style={styles.drawerText}>Category Master</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
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
