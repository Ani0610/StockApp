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
  addStone,
  deleteStone,
  editStone,
  setStone,
} from "../../redux/action/StoneDetails/stoneSlice";
import SearchableComponent from "../../components/Search/SearchComponent";
import { addStones, deleteStoneByID, getStones, updateStone } from "../../services/master/master.service";
import { setLoading, setToast } from "../../redux/action/Ui/Uislice";
var heightY = Dimensions.get("window").height;

interface InitialFormValues {
  stoneType: string;
  price: string;
  stonePerBag: string;
  pricePerStone: number;
  id: "";
}
const StoneDetails = () => {
  const [showModal, setShowModal] = useState(false);
  const [update, setUpdate] = useState(false);
  const [data, setdata] = useState<any | null>(null); // Track the selected card's ID
  const [isVisible, setisVisible] = useState(false);
  const stoneSchema = yup.object().shape({
    stoneType: yup.string().required("Stone Type is required"),
    stonePerBag: yup.string().required("Stone per bag is required"),
    price: yup.string().required("Price is required"),
  });
  const { stone } = useSelector((state: RootState) => state.stone);
  const [allStone, setAllStone] = useState<any>();
  const dispatch = useDispatch();
  const [initialFormValues, setInitialFormValues] = useState<InitialFormValues>(
    {
      stoneType: "",
      price: "",
      stonePerBag: "",
      pricePerStone: 0,
      id: "",
    }
  );
  useEffect(() => {
    setAllStone([...stone]);
  }, [stone]);
  useEffect(() => {
    dispatch(setLoading(true))
    getStones().then((res) => {
      dispatch(setLoading(false))
      if (res) {
        dispatch(setStone(res))
      }
      else {
        dispatch(setToast({ message: 'No Data Found', isVisible: true, type: 'danger' }))
      }
    })
  }, []);

  const formik = useFormik<InitialFormValues>({
    initialValues: initialFormValues,
    validationSchema: stoneSchema,
    onSubmit: async (values: any) => {
      values.pricePerStone = Number(values.price / values.stonePerBag).toFixed(2);
      if (update) {
        updateStone(values).then((res) => {
          dispatch(setLoading(false))
          if (res) {
            dispatch(editStone(values));
          } else {
            dispatch(setToast({ message: 'Something went wrong', isVisible: true, type: 'danger' }))
          }
        })
        dispatch(editStone({ ...values }));
      } else {
        dispatch(setLoading(true));
        addStones(values).then((res) => {
          dispatch(setLoading(false))
          if (res) {
            dispatch(addStone(res));
          } else {
            dispatch(setToast({ message: 'Something went wrong', isVisible: true, type: 'danger' }))
          }
        })
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
  const editStoneDetails = () => {
    setFieldValue("stoneType", data.stoneType);
    setFieldValue("stonePerBag", data.stonePerBag);
    setFieldValue("pricePerStone", data.pricePerStone);
    setFieldValue("price", data.price);
    setFieldValue("id", data.id);
    setUpdate(true);
    setisVisible(false);
    setShowModal(true);
  };
  const deleteStoneDetails = () => {
    Alert.alert("Are you sure?", "You want to delete this?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Yes", onPress: () => deleteStones(data)
      },
    ]);
    setisVisible(false);
  };
  const deleteStones = (data: any) => {
    dispatch(setLoading(true));
    deleteStoneByID(data).then((res) => {
      dispatch(setLoading(false))
      if (res) {
        dispatch(deleteStone(data));
      }
      else {
        dispatch(setToast({ message: 'Something went wrong', isVisible: true, type: 'danger' }))
      }
    })
  }
  const handleClose = () => {
    setShowModal(false);
    setUpdate(false);
    resetForm();
  };
  const handleFilter = (filteredData: any) => {
    console.log("Filtered Data:", filteredData);
    setAllStone([...filteredData]);
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
            data={stone}
            searchKey="stoneType"
            placeholder={"stone type"}
            onFilter={handleFilter}
          />
        </View>
        <ScrollView>
          <View style={[GlobalStyle.container]}>
            <View>
              {allStone?.map((item: any, i: any) => (
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
                    <Text style={GlobalStyle.label}>Stone Type</Text>
                    <Text style={GlobalStyle.label}>Stones</Text>
                    <Text style={GlobalStyle.label}>Price</Text>
                    <Text style={GlobalStyle.label}>Stone Price</Text>
                  </View>
                  <View style={GlobalStyle.middleSide}>
                    <Text
                      style={GlobalStyle.textcolor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.stoneType}
                    </Text>
                    <Text
                      style={GlobalStyle.textcolor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.stonePerBag}(1 Bag)
                    </Text>
                    <Text
                      style={GlobalStyle.textcolor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.price}₹(1 Bag)
                    </Text>
                    <Text
                      style={GlobalStyle.textcolor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.pricePerStone}₹(1 Stone)
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
                onPress={() => editStoneDetails()}
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
                onPress={() => deleteStoneDetails()}
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
                  Add Stone Details
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
                    <Text style={Style.inputLabel}>Stone Type</Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <TextInput
                        onChangeText={handleChange("stoneType")}
                        onBlur={() => {
                          handleBlur("stoneType");
                        }}
                        value={values.stoneType}
                        style={{ textAlign: 'right', fontSize: 16, color: "#000" }}
                        placeholderTextColor="gray"
                        placeholder="Enter Stone Type"

                      />
                    </View>
                  </View>
                  {errors.stoneType && touched.stoneType && (
                    <Text
                      style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}
                    >
                      {errors.stoneType}
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
                        placeholder="Enter price per bag"
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
                <View style={{ marginTop: 15 }}>
                  <View style={Style.inputField}>
                    <Text style={Style.inputLabel}>Stone Per Bag</Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <TextInput
                        onChangeText={handleChange("stonePerBag")}
                        onBlur={() => {
                          handleBlur("stonePerBag");
                        }}
                        value={values.stonePerBag}
                        style={{ textAlign: 'right', fontSize: 16, color: "#000" }}
                        placeholderTextColor="gray"
                        placeholder="Enter stone per bag"
                      />
                    </View>
                  </View>
                  {errors.stonePerBag && touched.stonePerBag && (
                    <Text
                      style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}
                    >
                      {errors.stonePerBag}
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
  stoneType: {
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
export default StoneDetails;
