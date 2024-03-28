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
import { Formik, useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  addDesign,
  deleteDesign,
  editDesign,
} from "../../redux/action/DesignDetails/designSlice";
import {
  addJobWork,
  deleteJobWork,
  editJobWork,
} from "../../redux/action/Job Work details/jobDetailsSlice";
import SearchableComponent from "../../components/Search/SearchComponent";
import { setLoading, setToast } from "../../redux/action/Ui/Uislice";
import { addJobWorks, deleteJobWorkById, updateJobWork } from "../../services/master/master.service";
var heightY = Dimensions.get("window").height;
interface InitialFormValues {
  partyName: string;
  workType: string;
  price: string;
  itemName: string;
  id: string;
}
const JobWorkDetails = () => {
  const [showModal, setShowModal] = useState(false);
  const [update, setUpdate] = useState(false);
  const [data, setdata] = useState<any | null>(null); // Track the selected card's ID
  const [isVisible, setisVisible] = useState(false);
  const jobWorksSchema = yup.object().shape({
    partyName: yup.string().required("Party Name is required"),
    workType: yup.string().required("Work Type is required"),
    price: yup.string().required("Price is required"),
  });
  const { jobWorks } = useSelector((state: RootState) => state.jobWorks);
  const [allJobWork, setAlljobWork] = useState<any>([]);
  const dispatch = useDispatch();
  const [initialFormValues, setInitialFormValues] = useState<InitialFormValues>(
    {
      partyName: "",
      workType: "",
      price: "",
      itemName: "",
      id: "",
    }
  );
  useEffect(() => {
    setAlljobWork([...jobWorks]);
  }, [jobWorks]);

  const formik = useFormik<InitialFormValues>({
    initialValues: initialFormValues,
    validationSchema: jobWorksSchema,
    onSubmit: async (values: any) => {
      if (update) {
        dispatch(setLoading(true));
        updateJobWork(values).then((res) => {
          dispatch(setLoading(false))

          if (res)
            dispatch(editJobWork({ ...values }));
          else
            dispatch(setToast({ message: "Something went wrong", isVisible: true, type: 'danger' }))
        })


      } else {
        dispatch(setLoading(true))
        addJobWorks(values).then((res) => {
          console.log('res jobwork-------------------', res);
          dispatch(setLoading(false))
          if (res)
            dispatch(addJobWork({ ...res }));
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
  const editJobWorkDetails = () => {
    setFieldValue("partyName", data.partyName);
    setFieldValue("workType", data.workType);
    setFieldValue("price", data.price);
    setFieldValue("itemName", data.itemName);
    setFieldValue("id", data.id);
    setUpdate(true);
    setisVisible(false);
    setShowModal(true);
  };
  const deleteJobWorkDetails = () => {
    Alert.alert("Are you sure?", "You want to delete this?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Yes", onPress: (() => {
          setisVisible(false);
          dispatch(setLoading(true))
          deleteJobWorkById(data).then((res) => {
            dispatch(setLoading(false))
            setisVisible(false);
            if (res) {
              dispatch(deleteJobWork(data));
            }
            else {
              dispatch(setToast({ message: "Something went wrong", isVisible: true, type: 'danger' }))
            }
          })
        })
      }
    ]);
  };



  const handleClose = () => {
    setShowModal(false);
    setUpdate(false);
    resetForm();
  };
  const handleFilter = (filteredData: any) => {
    console.log("Filtered Data:", filteredData);
    setAlljobWork([...filteredData]);
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
            data={jobWorks}
            searchKey="workType"
            placeholder={"workType"}
            onFilter={handleFilter}
          />
        </View>
        <ScrollView>
          <View style={[GlobalStyle.container]}>
            <View>
              {allJobWork?.map((item: any, i: any) => (
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
                    <Text style={GlobalStyle.label}>Work Type</Text>
                    <Text style={GlobalStyle.label}>Item Name</Text>
                    <Text style={GlobalStyle.label}>Price</Text>
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
                      {item.workType}
                    </Text>
                    <Text
                      style={GlobalStyle.textcolor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.itemName}
                    </Text>
                    <Text
                      style={GlobalStyle.textcolor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.price}₹(1 Unit)
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

                  {/* <View style={{ flex: 1, width: 'auto' }}>
                                        <View style={{
                                            display: 'flex', flexDirection: 'column',
                                        }}>
                                            <Text style={[GlobalStyle.blackColor, Style.partyName]}>
                                                Stone Type :-{item.partyName}
                                            </Text>
                                            <Text style={[GlobalStyle.blackColor, Style.price]}>
                                                Price :- {item.price}
                                            </Text>
                                        </View>

                                    </View> */}
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
                onPress={() => editJobWorkDetails()}
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
                onPress={() => deleteJobWorkDetails()}
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
                <Text style={{ color: "black", fontSize: 20 }}>
                  Add Job Work Details
                </Text>
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
                    <Text style={Style.inputLabel}>Work Type</Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <TextInput
                        onChangeText={handleChange("workType")}
                        onBlur={() => {
                          handleBlur("workType");
                        }}
                        value={values.workType}
                        style={{ textAlign: 'right', fontSize: 16, color: "#000" }}
                        placeholderTextColor="gray"
                        placeholder="Enter work Type"
                      />
                    </View>
                  </View>
                  {errors.workType && touched.workType && (
                    <Text
                      style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}
                    >
                      {errors.workType}
                    </Text>
                  )}
                </View>
                <View style={{ marginTop: 15 }}>
                  <View style={Style.inputField}>
                    <Text style={Style.inputLabel}>Item Name</Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <TextInput
                        onChangeText={handleChange("itemName")}
                        onBlur={() => {
                          handleBlur("itemName");
                        }}
                        value={values.itemName}
                        style={{ textAlign: 'right', fontSize: 16, color: "#000" }}
                        placeholderTextColor="gray"
                        placeholder="Enter item name"
                      />
                    </View>
                  </View>
                  {errors.itemName && touched.itemName && (
                    <Text
                      style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}
                    >
                      {errors.itemName}
                    </Text>
                  )}
                </View>
                <View style={{ marginTop: 15 }}>
                  <View style={Style.inputField}>
                    <Text style={Style.inputLabel}>Price</Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <TextInput
                        onChangeText={handleChange("price")}
                        onBlur={() => {
                          handleBlur("price");
                        }}
                        value={values.price}
                        style={{ textAlign: 'right', fontSize: 16, color: "#000" }}
                        placeholderTextColor="gray"
                        placeholder="Enter price per unit"
                        keyboardType="number-pad"
                      />
                    </View>
                  </View>
                  {errors.price && touched.price && (
                    <Text
                      style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}
                    >
                      {errors.price}
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
  price: {
    fontSize: heightY * 0.018,
    margin: 10,
  },
});
export default JobWorkDetails;
