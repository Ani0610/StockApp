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
import { setLoading, setToast } from "../redux/action/Ui/Uislice";
import { logOut, setUser } from "../redux/action/User/userSlice";
import { RootState } from "../redux/store";
import { Subscription, forkJoin } from "rxjs";
import { getCategories, getJobWork, getPapers, getParty, getStones } from "../services/master/master.service";
import { getUsers } from "../services/user/user.service";
import { setStone } from "../redux/action/StoneDetails/stoneSlice";
import { setDesign } from "../redux/action/DesignDetails/designSlice";
import { setJobWork } from "../redux/action/Job Work details/jobDetailsSlice";
import { setCategory } from "../redux/action/Category/categorySlice";
import { setPartyMaster } from "../redux/action/party master/PartymasterSlice";
import { setUsers } from "../redux/action/User Master/userMasterSlice";


const DrawerView = ({ navigation, state }: any) => {
  const dispatch = useDispatch();
  const [dropDown, setdropDown] = useState(null);
  const [dropDownjob, setdropDownjob] = useState(null);
  const [masterDropdown, setmasterDropdown] = useState(null);
  const { user }: any = useSelector((state: RootState) => state.user);

  const handlePress = (screenName: string) => {
    navigation.navigate(screenName);
  };
  let subscription: Subscription;

  const fetchData = () => {
    const stones = getStones();
    const papers = getPapers();
    const jobworks = getJobWork();
    const categories = getCategories();
    const parties = getParty();
    const users = getUsers();
    dispatch(setLoading(true))
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


      },
      error: (err) => {
        // Handle error
        console.error("Error fetching data:", err);
      },
      complete: () => {
        dispatch(setLoading(false));
        subscription.unsubscribe()
      }
    });
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
      iconName: 'home',
      iconType: 'Feather',
      isSubmenu: false
    },
    {
      name: 'Master',
      label: "Masters",
      iconName: 'people',
      iconType: 'material',
      isSubmenu: true,
      item: [{ name: 'Stone Details', label: "Stone", iconName: 'diamond', iconType: 'FontAwesome' },
      { name: 'Design Details', label: "Paper", iconName: 'map', iconType: 'Feather' },
      { name: 'JobWork Details', label: "Jobwork", iconName: 'group-work', iconType: 'Entypo' },
      { name: 'Users', label: "Users", iconName: 'person', iconType: 'material' },
      { name: 'Party Master', label: "Party", iconName: 'person-add', iconType: 'material' },
      { name: 'Category', label: "Category", iconName: 'file-copy', iconType: 'material' }]
    },
    { name: 'Stone Stock', label: "Stone Stock", isSubmenu: false, iconName: 'inventory', iconType: 'material' },

    {
      name: 'Job Work', label: "Job work", isSubmenu: true, iconName: 'group-work', iconType: 'Entypo', item: [
        { name: 'Job work Report', label: "Report", isSubmenu: false, iconName: 'table-view', iconType: 'material' },
        { name: 'Job work Team', label: "Team", isSubmenu: false, iconName: 'people', iconType: 'material' },
        { name: 'Per Day Work by Team', label: "Work By Team", isSubmenu: false, iconName: 'run-circle', iconType: 'material' },
      ]
    },
    {
      name: 'GodownReceive', label: "Receive Maal", isSubmenu: false, iconName: 'upload-file', iconType: 'material'
    },

    { name: 'Challan', label: "Challan", isSubmenu: false, iconName: 'book', iconType: 'Feather' },
  ]

  const MenuCopomponent = ({ items }: any) => (
    <>
      {/* {console.log(items, 'items=----------')} */}

      <TouchableOpacity
        style={[
          styles.drawerItem,
          { display: 'flex', flexDirection: 'row', alignItems: 'center' },
        ]}
        onPress={() => {
          navigation.closeDrawer();
          fetchData();
        }}
      >
        <Icon
          type='material'
          name='sync'
          color="#000"
          size={24}
        />
        <Text style={styles.drawerText}>Sync</Text>
      </TouchableOpacity>
      {items && items.length && items.map((menu: any, i: any) => (
        <React.Fragment key={i}>
          {
            menu.isSubmenu ?
              <View style={[styles.drawerItem, { paddingVertical: 8 }]}>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: 'space-between'
                  }}
                  onPress={() => setdropDown(i)}
                >
                  <View style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}>
                    <Icon
                      type={menu.iconType}
                      name={menu.iconName}
                      color="#000"
                      size={24}
                    />
                    <Text style={styles.drawerText}>{menu.label} </Text>
                  </View>
                  {dropDown == i ? (
                    <Icon
                      type="feather"
                      name="chevron-down"
                      color="#000"
                      size={24}
                    />
                  ) : (
                    <Icon
                      type="feather"
                      name="chevron-right"
                      color="#000"
                      size={24}
                    />
                  )}
                </TouchableOpacity>
                {dropDown === i &&
                  menu.item.map((submenu: any, index: any) => (
                    <TouchableOpacity key={index}
                      style={[
                        styles.drawerItem,
                        { display: 'flex', flexDirection: 'row', alignItems: 'center' },
                        masterDropdown === index && styles.activeDrawerItem,
                      ]}
                      onPress={() => { setmasterDropdown(index); handlePress(submenu.name) }}
                    >
                      <Icon
                        type={submenu.iconType}
                        name={submenu.iconName}
                        color="#000"
                        size={24}
                      />
                      <Text style={styles.drawerText}>{submenu.label}</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>
              :
              <TouchableOpacity
                style={[
                  styles.drawerItem,
                  { display: 'flex', flexDirection: 'row', alignItems: 'center' },
                  dropDown === i && styles.activeDrawerItem,
                ]}
                onPress={() => {
                  setmasterDropdown(null);
                  setdropDown(i)
                  handlePress(menu.name)
                }}
              >
                <Icon
                  type={menu.iconType}
                  name={menu.iconName}
                  color="#000"
                  size={24}
                />
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
                          size={24}
                        />
                      ) : (
                        <Icon
                          type="feather"
                          name="chevron-right"
                          color="#000"
                          size={24}
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
                                size={24}
                              />
                            ) : (
                              <Icon
                                type="feather"
                                name="chevron-right"
                                color="#000"
                                size={24}
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
                                size={24}
                              />
                            ) : (
                              <Icon
                                type="feather"
                                name="chevron-right"
                                color="#000"
                                size={24}
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
                          size={24}
                        />
                      ) : (
                        <Icon
                          type="feather"
                          name="chevron-right"
                          color="#000"
                          size={24}
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
                                size={24}
                              />
                            ) : (
                              <Icon
                                type="feather"
                                name="chevron-right"
                                color="#000"
                                size={24}
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
                                size={24}
                              />
                            ) : (
                              <Icon
                                type="feather"
                                name="chevron-right"
                                color="#000"
                                size={24}
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
        <Icon
          type='material'
          name='logout'
          color="#000"
          size={24}
        />
          <Text style={styles.drawerText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    color: "#FFF"
  },
  scrollContainer: {
    flex: 1,
    paddingVertical: 20,
  },
  drawerItem: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
    backgroundColor: "transparent",
    color: "#FFF",

  },
  activeDrawerItem: {
    backgroundColor: "#24acf2",
    color: "#000"
  },
  drawerText: {
    fontSize: 14,
    color: "#000",
    marginLeft: 10
  },
  logoutContainer: {
    borderTopWidth: 1,
    borderTopColor: "#f1f1f1",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  logoutButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    display:'flex',
    flexDirection:'row'
  },
});

export default DrawerView;
