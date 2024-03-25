import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GlobalStyle } from "../../../globalStyle";
import { Formik, useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Icon from "react-native-easy-icon";
import SelectDropdown from "react-native-select-dropdown";
import {
  addUsers,
  deleteUsers,
  editUsers,
  setUsers,
} from "../../redux/action/User Master/userMasterSlice";
import SearchableComponent from "../../components/Search/SearchComponent";
import { checkMobileNumberExists, registerUser } from "../../services/auth/auth.service";
import { setLoading, setToast } from "../../redux/action/Ui/Uislice";
import { deleteExistingUsers, getUsers, updateUsers } from "../../services/user/user.service";
var heightY = Dimensions.get("window").height;
interface InitialFormValues {
  fullName: string;
  userType: string;
  mobileNumber: string;
  uid: string;
  partyName: string;
}
const UserMaster = () => {
  const [showModal, setShowModal] = useState(false);
  const [update, setUpdate] = useState(false);
  const [data, setdata] = useState<any | null>(null); // Track the selected card's ID
  const [isVisible, setisVisible] = useState(false);
  const { jobWorks } = useSelector((state: RootState) => state.jobWorks);
  const { userMaster } = useSelector((state: RootState) => state.userMaster);
  const { user }: any = useSelector((state: RootState) => state.user);

  const [allUsers, setAllUsers] = useState<any>([]);
  const dispatch = useDispatch();
  const userMasterSchema = yup.object().shape({
    fullName: yup.string().required("Name is required"),
    userType: yup.string().required("User Type is required"),
    mobileNumber: yup
      .string()
      .required("Mobile number is required")
      .min(10, "Mobile number must be 10 digit number")
      .max(10, "Mobile number must be 10 digit number"),
  });
  const [initialFormValues, setInitialFormValues] = useState<InitialFormValues>(
    {
      fullName: "",
      userType: "",
      mobileNumber: "",
      uid: "",
      partyName: "",
    }
  );

  useEffect(() => {
    dispatch(setLoading(true))
    getUsers().then((res) => {
      dispatch(setLoading(false))
      if (res) {
        let userLists = res.filter((data) => data.mobileNumber !== user?.mobileNumber)
        dispatch(setUsers(userLists))
      }
    })
  }, []);
  useEffect(() => {
    console.log('userMaster', userMaster);

    setAllUsers([...userMaster]);
  }, [userMaster]);

  const formik = useFormik<InitialFormValues>({
    initialValues: initialFormValues,
    validationSchema: userMasterSchema,
    onSubmit: async (values: any) => {
      dispatch(setLoading(true))
      if (update) {
        updateUsers(values).then((res) => {
          dispatch(setLoading(false))
          if (res)
            dispatch(editUsers({ ...values }));
          else
            dispatch(setToast({ message: 'Something went wrong', isVisible: true, type: 'danger' }))
        })
      } else {
        let isMobileExist = await checkMobileNumberExists(values.mobileNumber)
        if (isMobileExist) {
          dispatch(setLoading(false))
          Alert.alert("Error", "Mobile number already exists", [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            { text: "OK", onPress: () => console.log("OK Pressed") },
          ]);
          return; // Do not submit the form
        }

        else {
          let finalValues: any = { ...values, email: "" }
          registerUser(finalValues).then((res) => {
            if (res)
              dispatch(addUsers({ ...res }));
          })
        }
        await dispatch(setLoading(false))
      }
      setShowModal(false);
      setUpdate(false);
      resetForm();
    },
  });
  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    isValid,
    touched,
    setFieldValue,
    resetForm,
  } = formik;
  const selectCard = (item: number) => {
    setisVisible(true);
    setdata(item);
  };
  const onClose = () => {
    setisVisible(false);
  };
  const handleClose = () => {
    setShowModal(false);
    setUpdate(false);
    resetForm();
  };
  const editUser = () => {
    setFieldValue("partyName", data.partyName);
    setFieldValue("userType", data.userType);
    setFieldValue("fullName", data.fullName);
    setFieldValue("mobileNumber", data.mobileNumber);
    setFieldValue("uid", data.uid);
    setUpdate(true);
    setisVisible(false);
    setShowModal(true);
  };
  const deleteUser = () => {
    dispatch(setLoading(true))
    deleteExistingUsers(data).then((res) => {
      dispatch(setLoading(false))
      if (res)
        dispatch(deleteUsers(data));
      else
        dispatch(setToast({ message: 'Something went wrong', isVisible: true, type: 'danger' }))
      setisVisible(false);
    })
  };
  const handleFilter = (filteredData: any) => {
    console.log("Filtered Data:", filteredData);
    setAllUsers([...filteredData]);
    // setallsample([...filteredData]);
  };
  return (
    <>
      <SafeAreaView style={[GlobalStyle.safeAreaCotainer, { height: "100%" }]}>
        <StatusBar
          backgroundColor="#fff"
          barStyle="dark-content" // Here is where you change the font-color
        />
        <View style={{ paddingHorizontal: 15 }}>
          <SearchableComponent
            data={userMaster}
            searchKey="fullName"
            placeholder={"name"}
            onFilter={handleFilter}
          />
        </View>
        <ScrollView>
          <View style={[GlobalStyle.container]}>
            <View>
              {allUsers?.map((item: any, i: any) => (
                <View
                  key={i}
                  style={[
                    GlobalStyle.card,
                    GlobalStyle.shadowProp,
                    {
                      paddingVertical: 8,
                      paddingHorizontal: 8,
                      height: "auto",
                      flexDirection: "row",
                    },
                  ]}
                >
                  <View style={GlobalStyle.leftSide}>
                    <Text style={GlobalStyle.label}>Full Name</Text>
                    <Text style={GlobalStyle.label}>User Type</Text>
                    <Text style={GlobalStyle.label}>Mobile No</Text>
                  </View>
                  <View style={GlobalStyle.middleSide}>
                    <Text
                      style={GlobalStyle.textcolor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.fullName}
                    </Text>
                    <Text
                      style={GlobalStyle.textcolor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.userType}
                    </Text>
                    <Text
                      style={GlobalStyle.textcolor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.mobileNumber}
                    </Text>
                  </View>
                  <View style={GlobalStyle.rightSide}>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Pressable onPress={() => selectCard(item)}>
                        <Icon
                          type="feather"
                          name="more-vertical"
                          color="gray"
                          size={30}
                        />
                      </Pressable>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
        <Pressable
          style={{
            position: "absolute",
            bottom: 40,
            right: 20,
            backgroundColor: "blue",
            padding: 16,
            borderRadius: 50,
          }}
          onPress={() => setShowModal(true)}
        >
          <Icon type="feather" name="plus" color="white" size={35} />
        </Pressable>
      </SafeAreaView>
      {isVisible && (
        <Modal
          visible={isVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={onClose}
          onPointerDown={onClose}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
            onTouchEnd={onClose}
          >
            <View
              style={{
                height: "20%",
                width: "100%",
                marginTop: "auto",
                backgroundColor: "white",
                elevation: 5,
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
              }}
            >
              <TouchableOpacity
                onPress={() => editUser()}
                style={[GlobalStyle.btn, { borderRadius: 15 }]}
              >
                <Icon type="feather" name="edit" color="gray" size={25} />
                <Text
                  style={{
                    color: "gray",
                    marginLeft: 10,
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  Edit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => deleteUser()}
                style={[GlobalStyle.btn, { borderRadius: 15 }]}
              >
                <Icon type="feather" name="delete" color="gray" size={25} />
                <Text
                  style={{
                    color: "gray",
                    marginLeft: 10,
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  Delete
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={GlobalStyle.btn}>
                <Icon type="entypo" name="cross" color="gray" size={25} />
                <Text
                  style={{
                    color: "gray",
                    marginLeft: 10,
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      {showModal && (
        <Modal visible={showModal} transparent={false} animationType="slide">
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              marginVertical: Platform.OS === "ios" ? 30 : 0,
              zIndex: 0,
            }}
          >
            <View
              style={{
                margin: 20,
                flex: 1,
                width: "100%",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: "black", fontSize: 20 }}>Add User</Text>
                <Pressable onPress={() => handleClose()}>
                  <Icon type="entypo" name="cross" color="black" size={35} />
                </Pressable>
              </View>

              <View
                style={{
                  padding: 10,
                }}
              >
                <View style={{ marginTop: 10 }}>
                  <View style={Style.inputField}>
                    <Text style={Style.inputLabel}>Full Name</Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <TextInput
                        onChangeText={handleChange("fullName")}
                        onBlur={() => {
                          handleBlur("fullName");
                        }}
                        value={values.fullName}
                        style={{ textAlign: 'right', fontSize: 16, color: "#000" }}
                        placeholderTextColor="gray"
                        placeholder="Enter full Name"
                      />
                    </View>
                  </View>
                  {errors.fullName && touched.fullName && (
                    <Text
                      style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}
                    >
                      {errors.fullName}
                    </Text>
                  )}
                </View>
                <View style={{ marginTop: 15 }}>
                  <View style={Style.inputField}>
                    <Text style={Style.inputLabel}>Mobile Number</Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <TextInput
                        onChangeText={handleChange("mobileNumber")}
                        onBlur={() => {
                          handleBlur("mobileNumber");
                        }}
                        value={values.mobileNumber}
                        keyboardType={"phone-pad"}
                        style={{ textAlign: 'right', fontSize: 16, color: "#000" }}
                        placeholderTextColor="gray"
                        placeholder="Enter Mobile Nunber"
                        editable={update ? false : true}
                      />
                    </View>
                  </View>
                  {errors.mobileNumber && touched.mobileNumber && (
                    <Text
                      style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}
                    >
                      {errors.mobileNumber}
                    </Text>
                  )}
                </View>
                <View style={{ marginTop: 15 }}>
                  <View style={Style.inputField}>
                    <Text style={Style.inputLabel}>User Type</Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <SelectDropdown
                        data={["carrier", "jobwork", "godown"]}
                        onSelect={(selectedItem) => {
                          setFieldValue("userType", selectedItem);
                        }}
                        buttonStyle={{
                          backgroundColor: "transparent",
                          width: "90%",
                        }}
                        defaultButtonText="Select User Type"
                        buttonTextStyle={{ textAlign: "right" }}
                        dropdownStyle={{ width: "80%", borderRadius: 10 }}
                        defaultValue={values.userType}
                      />
                    </View>
                  </View>
                  {errors.userType && touched.userType && (
                    <Text
                      style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}
                    >
                      {errors.userType}
                    </Text>
                  )}
                </View>
                {values.userType === "jobwork" && jobWorks?.length && (
                  <View style={{ marginTop: 15 }}>
                    <View style={Style.inputField}>
                      <Text style={Style.inputLabel}>Select Party</Text>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <SelectDropdown
                          data={[...jobWorks]}
                          onSelect={(selectedItem) => {
                            console.log(selectedItem, "selecteditem");
                            setFieldValue("uid", selectedItem.id);
                            setFieldValue("partyName", selectedItem.partyName);
                          }}
                          buttonTextAfterSelection={(
                            selectedItem: any,
                            index: number
                          ) => {
                            return `${selectedItem?.partyName}`;
                          }}
                          rowTextForSelection={(item: any, index: number) => {
                            return `${item.partyName}`;
                          }}
                          buttonStyle={{
                            backgroundColor: "transparent",
                            width: "90%",
                          }}
                          defaultButtonText="Select Party Name"
                          buttonTextStyle={{
                            textAlign: "right",
                            marginLeft: -6,
                          }}
                          dropdownStyle={{ width: "80%", borderRadius: 10 }}
                          defaultValue={jobWorks.find(
                            (job: any) => job.id === values.uid
                          )}
                        />
                      </View>
                    </View>
                  </View>
                )}
                <Pressable
                  style={GlobalStyle.button}
                  onPress={() => handleSubmit()}
                >
                  <Text style={GlobalStyle.btntext}>
                    {update ? "Update" : "Submit"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};
const Style = StyleSheet.create({
  cardContainer: { marginBottom: 0 },
  inputField: {
    display: 'flex',
    backgroundColor: "#F9F9F9",
    borderRadius: 15,
    fontSize: 16,
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputLabel: { color: "#05E3D5", fontSize: 14 },
  partyName: {
    fontSize: heightY * 0.018,
    marginHorizontal: 10,
    paddingTop: 10,
    fontWeight: "bold",
  },
  price: {
    fontSize: heightY * 0.018,
    margin: 10,
  },
});
export default UserMaster;
