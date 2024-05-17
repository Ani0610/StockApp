import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GlobalStyle } from "../../../globalStyle";
import Icon from "react-native-easy-icon";
import { ScrollView } from "react-native-gesture-handler";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  addJobWork,
  deleteJobWork,
  editJobWork,
} from "../../redux/action/Job Work details/jobDetailsSlice";
import SearchableComponent from "../../components/Search/SearchComponent";
import {
  addPartyMaster,
  deletePartyMasters,
  editpartyMaster,
} from "../../redux/action/party master/PartymasterSlice";
import { setLoading, setToast } from "../../redux/action/Ui/Uislice";
import { addPartys, deletePaperByID, deletePartyById, updateParty } from "../../services/master/master.service";
var heightY = Dimensions.get("window").height;
interface InitialFormValues {
  partyName: string;
  address: string;
  contactNumber: string;
  gstNumber: string;
  id: string;
}
const PartyMaster = () => {
  const [showModal, setShowModal] = useState(false);
  const [update, setUpdate] = useState(false);
  const [data, setdata] = useState<any | null>(null); // Track the selected card's ID
  const [isVisible, setisVisible] = useState(false);
  const partyMasterSchema = yup.object().shape({
    partyName: yup.string().required("Party Name is required"),
    address: yup.string().required("Address is required"),
    contactNumber: yup
      .string()
      .required("Phone number is required")
      .min(10, "Phone number must be 10 digit number")
      .max(10, "Phone number must be 10 digit number"),
  });
  const { partyMaster } = useSelector((state: RootState) => state.partyMaster);
  const [partyMasterData, setPartyMasterData] = useState<any>([]);
  const dispatch = useDispatch();
  const [initialFormValues, setInitialFormValues] = useState<InitialFormValues>(
    {
      partyName: "",
      address: "",
      contactNumber: "",
      gstNumber: "",
      id: "",
    }
  );
  useEffect(() => {
    setPartyMasterData([...partyMaster]);
  }, [partyMaster]);

  const formik = useFormik<InitialFormValues>({
    initialValues: initialFormValues,
    validationSchema: partyMasterSchema,
    onSubmit: async (values: any) => {
      if (update) {
        dispatch(setLoading(true));
        updateParty(values).then((res) => {
          dispatch(setLoading(false))

          if (res)
            dispatch(editpartyMaster({ ...values }));
          else
            dispatch(setToast({ message: "Something went wrong", isVisible: true, type: 'danger' }))
        })


      } else {
        dispatch(setLoading(true))
        addPartys(values).then((res) => {
          console.log('res party-------------------', res);
          dispatch(setLoading(false))
          if (res)
            dispatch(addPartyMaster({ ...res }));
          else
            dispatch(setToast({ message: "Something went wrong", isVisible: true, type: 'danger' }))
        })

        setShowModal(false);
        setUpdate(false);
        resetForm();

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
  const editPartyMaster = () => {
    setFieldValue("partyName", data.partyName);
    setFieldValue("address", data.address);
    setFieldValue("contactNumber", data.contactNumber);
    setFieldValue("gstNumber", data.gstNumber);
    setFieldValue("id", data.id);
    setUpdate(true);
    setisVisible(false);
    setShowModal(true);
  };
  const deletePartyMaster = () => {
    Alert.alert("Are you sure?", "You want to delete this?", [
      {
        text: 'Cancel',
        onPress: () => console.log("Cancel Pressed"),
        style: 'cancel',

      },
      {
        text: "Yes",
        onPress: (() => {
          setisVisible(false);
          dispatch(setLoading(true))
          deletePartyById(data).then((res) => {
            dispatch(setLoading(false))
            setisVisible(false);
            if (res) {
              dispatch(deletePartyMasters(data));
            }
            else {
              dispatch(setToast({ message: "Something went wrong", isVisible: true, type: 'danger' }))
            }
          })
        })
      }
    ])
  };

  const handleClose = () => {
    setShowModal(false);
    setUpdate(false);
    resetForm();
  };
  const handleFilter = (filteredData: any) => {
    console.log("Filtered Data:", filteredData);
    setPartyMasterData([...filteredData]);
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
            data={partyMaster}
            searchKey="partyName"
            placeholder={"party name"}
            onFilter={handleFilter}
          />
        </View>
        <ScrollView>
          <View style={[GlobalStyle.container]}>
            <View>
              {partyMasterData?.map((item: any, i: any) => (
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
                    <Text style={GlobalStyle.label}>Party Name</Text>
                    <Text style={GlobalStyle.label}>GST Number</Text>
                    <Text style={GlobalStyle.label}>Contact No</Text>
                    <Text style={GlobalStyle.label}>Address</Text>
                  </View>
                  <View style={GlobalStyle.middleSide}>
                    <Text
                      style={GlobalStyle.textcolor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.partyName}
                    </Text>

                    <Text
                      style={GlobalStyle.textcolor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.gstNumber}
                    </Text>
                    <Text
                      style={GlobalStyle.textcolor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.contactNumber}
                    </Text>
                    <Text
                      style={GlobalStyle.textcolor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.address}
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
            backgroundColor: "#24acf2",
            padding: 16,
            borderRadius: 50,
          }}
          onPress={() => setShowModal(true)}
        >
          <Icon type="feather" name="plus" color="white" size={20} />
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
                onPress={() => editPartyMaster()}
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
                onPress={() => deletePartyMaster()}
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
                <Text style={{ color: "black", fontSize: 20 }}>Add Party</Text>
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
                    <Text style={Style.inputLabel}>Party Name</Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <TextInput
                        onChangeText={handleChange("partyName")}
                        onBlur={() => {
                          handleBlur("partyName");
                        }}
                        value={values.partyName}
                        style={{ textAlign: 'right', fontSize: 16, color: "#000" }}
                        placeholderTextColor="gray"
                        placeholder="Enter Party Name"
                      />
                    </View>
                  </View>
                  {errors.partyName && touched.partyName && (
                    <Text
                      style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}
                    >
                      {errors.partyName}
                    </Text>
                  )}
                </View>
                <View style={{ marginTop: 15 }}>
                  <View style={Style.inputField}>
                    <Text style={Style.inputLabel}>Contact Number</Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <TextInput
                        onChangeText={handleChange("contactNumber")}
                        onBlur={() => {
                          handleBlur("contactNumber");
                        }}
                        keyboardType={"phone-pad"}
                        value={values.contactNumber}
                        style={{ textAlign: 'right', fontSize: 16, color: "#000" }}
                        placeholderTextColor="gray"
                        placeholder="Enter Contact Number"
                      />
                    </View>
                  </View>
                  {errors.contactNumber && touched.contactNumber && (
                    <Text
                      style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}
                    >
                      {errors.contactNumber}
                    </Text>
                  )}
                </View>
                <View style={{ marginTop: 15 }}>
                  <View style={Style.inputField}>
                    <Text style={Style.inputLabel}>GST Number</Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <TextInput
                        onChangeText={handleChange("gstNumber")}
                        onBlur={() => {
                          handleBlur("gstNumber");
                        }}
                        value={values.gstNumber}
                        style={{ textAlign: 'right', fontSize: 16, color: "#000" }}
                        placeholderTextColor="gray"
                        placeholder="Enter gst number"
                      />
                    </View>
                  </View>
                  {errors.gstNumber && touched.gstNumber && (
                    <Text
                      style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}
                    >
                      {errors.gstNumber}
                    </Text>
                  )}
                </View>

                <View style={{ marginTop: 15 }}>
                  <View style={Style.inputField}>
                    <Text style={Style.inputLabel}>Address</Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <TextInput
                        onChangeText={handleChange("address")}
                        onBlur={() => {
                          handleBlur("address");
                        }}
                        value={values.address}
                        style={{ textAlign: 'right', fontSize: 16, color: "#000" }}
                        placeholderTextColor="gray"
                        placeholder="Enter address"
                      />
                    </View>
                  </View>
                  {errors.address && touched.address && (
                    <Text
                      style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}
                    >
                      {errors.address}
                    </Text>
                  )}
                </View>
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
  contactNumber: {
    fontSize: heightY * 0.018,
    margin: 10,
  },
});
export default PartyMaster;
function deleteParty(data: any): any {
  throw new Error("Function not implemented.");
}

