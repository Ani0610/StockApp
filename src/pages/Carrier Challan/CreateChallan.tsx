import React, { useEffect, useState } from "react";
import {
  Image,
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
import Icon from "react-native-easy-icon";
import { useDispatch, useSelector } from "react-redux";
import ImageUploadScreen from "../../components/imageUpload/ImageUploadScreen";
import fs, { touch } from "react-native-fs";
import * as Yup from "yup";
import { useFormik } from "formik";
import { RootState } from "../../redux/store";
import SelectDropdown from "react-native-select-dropdown";
import {
  addChallan,
  editChallan,
} from "../../redux/action/Challan/ChallanSlice";
import DatePicker from "react-native-date-picker";
import { formatDate } from "../../services/dateFormate";
import { addDeliveredDesign } from "../../redux/action/delivered design/deliveredDesignSlice";
import { editDesignMaster } from "../../redux/action/DesignsMaster/designMasterSlice";
import { setLoading, setToast } from "../../redux/action/Ui/Uislice";
import { addChallanService, getchallanCount, updateChallanDetails } from "../../services/challan/challan.service";
import { uploadSingleImage } from "../../services/file/file.service";
import { updateDesignDetails } from "../../services/Design/Design.Service";
interface InitialFormValues {
  challanNo: number;
  designNo: string;
  challanType: string;
  piece: string;
  maalImg: string;
  itemName: string;
  partyName: string;
  date: any;
  challanImg: string;
  // status: string;
  carrierPersonName: string;
  carrierPersonUid: string;
  carrierPersonMobNo: string;
  id: string;
  partyUID: string;
}
const CreateChallan = ({ navigation, route }: any) => {
  const [iscamaraModalVisible, setIscamaraModalVisible] = useState(false);
  const [iscamaraModalVisibleMaterial, setIscamaraModalVisibleMaterial] =
    useState(false);
  const { user }: any = useSelector((state: RootState) => state.user);
  const [update, setUpdate] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setselectedDate] = useState<any>();
  const dispatch = useDispatch();
  const [challanimg, setchallanimg] = useState<any>();
  const [selectedImage, setSelectedImage] = useState<any>();
  const { userMaster } = useSelector((state: RootState) => state.userMaster);
  const [carrierPersons, setCarrierPersons] = useState<any>([]);
  const [designsNumber, setdesignsNumber] = useState<any>([]);
  const { designsMaster } = useSelector(
    (state: RootState) => state.designMaster
  );
  const [initialFormValues, setInitialFormValues] = useState<InitialFormValues>(
    {
      challanNo: 0,
      challanType: "",
      designNo: "",
      piece: "",
      maalImg: "",
      challanImg: "",
      itemName: "",
      partyName: "",
      date: new Date(),
      // status: "",
      carrierPersonName: "",
      carrierPersonUid: "",
      carrierPersonMobNo: "",
      id: "",
      partyUID: "",
    }
  );
  const { partyMaster } = useSelector((state: RootState) => state.partyMaster);

  const challanSchema = Yup.object().shape({
    challanNo: Yup.number(),
    designNo: Yup.string().when([], (inputs: any, schema: any) => {
      if (user?.userType === "Carrier") {
        return schema;
      }
      return schema;
    }),
    challanType: Yup.string().required("Challan Type is required"),
    partyName: Yup.string().required("Party Name is required"),
    date: Yup.string().required("Date is required"),
    piece: Yup.string().required("Number of Sample is required"),
    maalImg: Yup.string().required("Material Image is required"),
    challanImg: Yup.string().required("Sample Image is required"),
    // status: Yup.string().required("Status is required"),
    carrierPersonName: Yup.string().required("Carrier Person Name is required"),
  });
  useEffect(() => {
    const carrier: any = userMaster.filter(
      (item: any) => item.userType === "carrier"
    );
    setCarrierPersons([...carrier]);
  }, [userMaster]);
  const formik = useFormik<InitialFormValues>({
    initialValues: initialFormValues,
    validationSchema: challanSchema,
    onSubmit: async (values: any) => {
      try {
        if (values.challanType === "Out") {
          const data: any = designsMaster.find(
            (obj: any) =>
              obj.partyUID === values.partyUID
            // &&
            // obj.designNo == values.designNo
          );
          if (data) {
            const newData = { ...data, availableStocks: values.piece };
            const newData1 = {
              ...data,
              availableStocks: data.availableStocks - values.piece,
            };
            dispatch(addDeliveredDesign({ ...newData }));
            dispatch(editDesignMaster({ ...newData1 }));
          }
        }


        if (update) {
          dispatch(setLoading(true))
          updateChallanDetails(values).then((res) => {
            if (res)
              dispatch(editChallan({ ...values }));
            else
              dispatch(setToast({ message: 'Something went wrong', isVisible: true, type: 'danger' }))
          }).catch((err) => console.error(err))
            .finally(() => {
              dispatch(setLoading(false));
              resetForm();
              navigation.goBack();
            })
        } else {
          dispatch(setLoading(true))
          if (values.challanType === "In") {
            addChallanService(values).then((res) => {
              if (res)
                dispatch(addChallan(res));
              else
                dispatch(setToast({ message: 'Something went wrong', isVisible: true, type: 'danger' }))
            }).catch((err) => console.error(err))
              .finally(() => {
                dispatch(setLoading(false));
                resetForm();
                navigation.goBack();
              })
          } else {
            const data: any = await designsMaster.find(
              (obj: any) =>
                obj.partyUID === values.partyUID
                &&
                obj.designNo == values.designNo
            );

            if (data) {
              const newData1 = {
                ...data,
                availableStocks: Number(data.availableStocks) - Number(values.piece),
              };
              // console.log(newData1.availableStocks);
              try {
                let res = await updateDesignDetails(newData1)
                if (res) {
                  dispatch(editDesignMaster({ ...values }));
                  addChallanService(values).then((res) => {
                    if (res)
                      dispatch(addChallan(res));
                    else
                      dispatch(setToast({ message: 'Something went wrong', isVisible: true, type: 'danger' }))
                  }).catch((err) => console.error(err))
                    .finally(() => {
                      dispatch(setLoading(false));
                      resetForm();
                      navigation.goBack();
                    })
                }
                else {
                  dispatch(setLoading(false));
                  dispatch(setToast({ message: "Something went wrong", isVisible: true, type: 'danger' }))
                }
              } catch (error) {
                dispatch(setLoading(false));
                dispatch(setToast({ message: "Something went wrong", isVisible: true, type: 'danger' }))
              }
            }

          }
        }
      } catch (error) {
        // Handle errors here
        console.error("An error occurred:", error);
        // Optionally, you can provide feedback to the user about the error
      }
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
  useEffect(() => {
    if (route.params) {
      dispatch(setLoading(true));
      patchData();

    } else {
      setInitialFormValues({
        challanNo: 0,
        designNo: "",
        piece: "",
        maalImg: "",
        challanImg: "",
        itemName: "",
        partyName: "",
        date: new Date(),
        // status: "",
        carrierPersonName: "",
        carrierPersonUid: "",
        carrierPersonMobNo: "",
        id: "",
        partyUID: "",
        challanType: "",
      });
      if (user?.userType === "Carrier") {
        setFieldValue("carrierPersonName", user.fullName);
        setFieldValue("carrierPersonUid", user.useruid);
        setFieldValue("carrierPersonMobNo", user.mobileNumber);
      }
      setUpdate(false);
      dispatch(setLoading(true));
      getchallanCount().then((res: any) => {
        // console.log('----------------count-------------------', res)
        setFieldValue("challanNo", res)
        // console.log(res)

      }).catch(e => console.error(e)).finally(() => dispatch(setLoading(false)))

    }
  }, [route.params]);
  useEffect(() => {

  }, [route.param])

  const patchData = () => {
    setFieldValue("challanNo", route.params?.challanNo || "");
    setFieldValue("designNo", route.params?.designNo || "");
    setFieldValue("piece", route.params?.piece);
    setFieldValue("maalImg", route.params?.maalImg);
    setFieldValue("challanImg", route.params?.challanImg);
    setFieldValue("itemName", route.params?.itemName);
    setFieldValue("partyName", route.params?.partyName);
    setFieldValue("date", new Date(route.params?.date));
    setFieldValue("status", route.params?.status);
    setFieldValue("carrierPersonName", route.params?.carrierPersonName);
    setFieldValue("carrierPersonUid", route.params?.carrierPersonUid);
    setFieldValue("carrierPersonMobNo", route.params?.carrierPersonMobNo);
    setFieldValue("partyUID", route.params?.partyUID);
    setFieldValue("challanType", route.params?.challanType);
    setFieldValue("id", route.params?.id);
    setUpdate(true);
    dispatch(setLoading(false))
  };
  useEffect(() => {
    if (values.partyUID) {
      const desgnNumber = designsMaster.filter(
        (item: any) => item.partyUID === values.partyUID
      );
    }
  }, [values.partyUID]);

  const closecamaraModel = () => {
    setIscamaraModalVisible(false);
    setIscamaraModalVisibleMaterial(false);
  };
  const uploadProfileImage = (selectedImage: any) => {
    dispatch(setLoading(true));
    uploadSingleImage(selectedImage, 'challanImage').then((res) => {
      if (res)
        setFieldValue("challanImg", res);
      else
        setFieldValue("challanImg", "")
    }).catch((e) => console.error(e)).finally(() => {
      dispatch(setLoading(false))
    })
  };
  const uploadProfileImageMaterial = (selectedImage: any) => {
    dispatch(setLoading(true));
    uploadSingleImage(selectedImage, 'maalImage').then((res) => {
      if (res)
        setFieldValue("maalImg", res);
      else
        setFieldValue("maalImg", "")
    }).catch((e) => console.error(e)).finally(() => {
      dispatch(setLoading(false))
    })
    // fs.readFile(selectedImage.uri, "base64").then((imgRes) => {
    // });
  };
  const closeImage = () => {
    setchallanimg(null);
  };
  const closeImageModal = () => {
    setSelectedImage(null);
  };
  const openDatePicker = () => {
    setDatePickerVisible(true);
  };

  const handleDateChange = (date: any) => {
    setFieldValue("date", date);
    setDatePickerVisible(false);
  };

  return (
    <>
      <SafeAreaView style={[GlobalStyle.safeAreaCotainer, { height: "100%" }]}>
        <StatusBar
          backgroundColor="#fff"
          barStyle="dark-content" // Here is where you change the font-color
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 20,
            marginTop: 15,
          }}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => navigation.goBack()}
          >
            <Icon type="feather" name="arrow-left" color="#000" size={35} />
          </TouchableOpacity>
          <View
            style={{
              flex: 5,
              justifyContent: "center",
              alignItems: "center",
              marginLeft: -35,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,
                color: "#000",
                fontWeight: "bold",
              }}
            >
              Create Challan
            </Text>
          </View>
        </View>
        <ScrollView>
          <View
            style={{
              padding: 10,
            }}
          >
            {route?.params &&
              <View style={{ marginTop: 10 }}>

                <View style={[styles.inputField]}>
                  <Text style={styles.inputLabel}>Challan Number</Text>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{ width: "100%", fontSize: 14, color: "black" }}
                    >
                      {values.challanNo}
                    </Text>
                  </View>

                </View>

              </View>
            }
            <View style={{ marginTop: 10 }}>
              <View style={[styles.inputField]}>
                <Text style={styles.inputLabel}>Date</Text>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{ width: "100%", fontSize: 14, color: "black" }}
                    onPress={() => openDatePicker()}
                  >
                    {values.date ? formatDate(values.date) : formatDate(new Date())}
                  </Text>
                </View>
                <DatePicker
                  modal
                  open={datePickerVisible}
                  date={values.date || new Date()}
                  mode="date"
                  onConfirm={(date) => {
                    handleDateChange(date);
                  }}
                  onCancel={() => {
                    setDatePickerVisible(false);
                  }}
                />
              </View>
              {errors.date && touched.date && (
                <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>
                  {errors?.date}
                </Text>
              )}
            </View>
            <View style={{ marginTop: 10 }}>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Select Challan Type</Text>
                <SelectDropdown
                  data={["In", "Out"]}
                  onSelect={(selectedItem) => {
                    // console.log(selectedItem)
                    setFieldValue("challanType", selectedItem);
                  }}
                  buttonStyle={{
                    backgroundColor: "transparent",
                    width: "60%",
                    height: 30,
                  }}
                  buttonTextStyle={{
                    textAlign: "right",
                    marginRight: 0
                  }}
                  defaultButtonText="Select Challan Type"
                  dropdownStyle={{ borderRadius: 10, width: '55%' }}
                  defaultValue={values.challanType}
                />
              </View>
              {errors.challanType && touched.challanType && (
                <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>
                  {errors.challanType}
                </Text>
              )}
            </View>
            {values.challanType === "Out" &&
              <View style={{ marginTop: 15 }}>
                <View style={styles.inputField}>
                  <Text style={styles.inputLabel}>Select Design</Text>
                  <SelectDropdown
                    data={[...designsMaster]}
                    onSelect={(selectedItem) => {
                      setFieldValue("partyUID", selectedItem.partyUID);
                      setFieldValue("partyName", selectedItem.partyName);
                      setFieldValue("designNo", selectedItem.designNo);
                    }}
                    search={true}
                    searchPlaceHolder={"Search by Design Number"}
                    buttonTextAfterSelection={(
                      selectedItem: any,
                      index: number
                    ) => {
                      return `${selectedItem?.designNo}-${selectedItem?.partyName}`;
                    }}
                    rowTextForSelection={(item: any, index: number) => {
                      return `${item?.designNo}-${item?.partyName}`;
                    }}
                    buttonStyle={{
                      backgroundColor: "transparent",
                      width: "75%",
                      height: 30,
                    }}
                    defaultButtonText="Select Design"
                    buttonTextStyle={{
                      textAlign: "right",
                      marginRight: 0,
                    }}
                    searchInputStyle={{ width: 500 }}
                    dropdownStyle={{ width: "70%", borderRadius: 10 }}
                    defaultValue={designsMaster.find(
                      (party: any) => party.partyUID === values.partyUID
                    )}
                  />
                </View>
                {errors.designNo && touched.designNo && (
                  <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>
                    {errors.designNo}
                  </Text>
                )}
              </View>
            }
            <View style={{ marginTop: 15 }}>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Select Party Name</Text>

                <SelectDropdown
                  data={[...partyMaster]}
                  onSelect={(selectedItem) => {
                    setFieldValue("partyUID", selectedItem.id);
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
                    width: "60%",
                    height: 30,

                  }}
                  defaultButtonText="Select Party Name"
                  buttonTextStyle={{
                    textAlign: "right",
                    marginRight: 0,
                  }}
                  dropdownStyle={{ width: "55%", borderRadius: 10 }}
                  defaultValue={partyMaster.find(
                    (party: any) => party.id === values.partyUID
                  )}
                />
              </View>
              {errors.partyName && touched.partyName && (
                <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>
                  {errors.partyName}
                </Text>
              )}
            </View>

            {/* {user?.userType !== "Carrier" && (
              <View style={{ marginTop: 15 }}>
                <View style={styles.inputField}>
                  <Text style={styles.inputLabel}>Design No</Text>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <TextInput
                      onChangeText={handleChange("designNo")}
                      onBlur={() => {
                        handleBlur("designNo");
                      }}
                      value={values.designNo}
                      style={{
                        flex: 1,
                        fontSize: 16,
                        color: "#000",
                        padding: 0,
                      }}
                      placeholderTextColor="gray"
                      placeholder="Enter Design No"
                    />
                  </View>
                </View>
                {errors.designNo && touched.designNo && (
                  <Text
                    style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}
                  >
                    {errors.designNo}
                  </Text>
                )}
              </View>
            )} */}
            <View style={{ marginTop: 15 }}>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Item Name</Text>
                <View
                  style={{

                    alignItems: "center",
                  }}
                >
                  <TextInput
                    onChangeText={handleChange("itemName")}
                    onBlur={() => {
                      handleBlur("itemName");
                    }}
                    value={values.itemName}
                    style={{ flex: 1, fontSize: 16, color: "#000", padding: 0, textAlign: 'right' }}
                    placeholderTextColor="gray"
                    placeholder="Enter Item Name"

                  />
                </View>
              </View>
              {errors.itemName && touched.itemName && (
                <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>
                  {errors.itemName}
                </Text>
              )}
            </View>
            <View style={{ marginTop: 15 }}>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Piece /Meter</Text>
                <View
                  style={{

                    alignItems: "center",
                  }}
                >
                  <TextInput
                    onChangeText={handleChange("piece")}
                    onBlur={() => {
                      handleBlur("piece");
                    }}
                    value={values.piece}
                    style={{ flex: 1, fontSize: 16, color: "#000", padding: 0, textAlign: 'right' }}
                    placeholderTextColor="gray"
                    placeholder="Enter Number of piece"
                  />
                </View>
              </View>
              {errors.piece && touched.piece && (
                <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>
                  {errors.piece}
                </Text>
              )}
            </View>
            <View style={{ marginTop: 15 }}>
              <View
                style={[
                  {
                    backgroundColor: "#F9F9F9",
                    borderRadius: 15,
                    padding: 10
                  },
                  { width: "100%", height: values.maalImg ? 110 : "auto" },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text style={styles.inputLabel}>Maal Photo</Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Pressable
                        onPress={() => setIscamaraModalVisibleMaterial(true)}
                      >
                        <Text style={{ color: "gray" }}>Upload Maal Photo</Text>
                      </Pressable>
                    </View>
                  </View>
                  <View>
                    {values.maalImg && (
                      <View style={{ width: "100%" }}>
                        <View
                          style={{
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 15,
                            padding: 10,
                            width: "30%",
                          }}
                        >
                          <View
                            style={{
                              width: "100%",
                              aspectRatio: 1, // Create a perfect square
                              // overflow: 'hidden', // Hide any content outside the square
                              borderWidth: 2, // Add a border for a circular shape
                              borderColor: "white",
                              borderRadius: 10,
                            }}
                          >
                            <TouchableOpacity
                              onPress={() => setSelectedImage(values.maalImg)}
                            >
                              <Image
                                source={{ uri: values.maalImg }}
                                style={{
                                  width: 80,
                                  height: 80,
                                  resizeMode: "cover", // Cover the entire circle
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                          <TouchableOpacity
                            style={{
                              position: "absolute",
                              left: 80,
                              backgroundColor: "black",
                              borderRadius: 50,
                              width: 28,
                              height: 28,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onPress={closeImage}
                          >
                            <Icon
                              type="entypo"
                              name="cross"
                              color="white"
                              size={20}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </View>
              {errors.maalImg && touched.maalImg && (
                <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>
                  {errors.maalImg}
                </Text>
              )}
            </View>
            <View style={{ marginTop: 15 }}>
              <View
                style={[
                  {
                    backgroundColor: "#F9F9F9",
                    borderRadius: 15,
                    padding: 10
                  },
                  { width: "100%", height: values.challanImg ? 110 : "auto" },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text style={styles.inputLabel}>Challan Photo</Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Pressable onPress={() => setIscamaraModalVisible(true)}>
                        <Text style={{ color: "gray" }}>
                          Upload Challan Photo
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                  <View>
                    {values.challanImg && (
                      <View style={{ width: "100%" }}>
                        <View
                          style={{
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 15,
                            padding: 10,
                            width: "30%",
                          }}
                        >
                          <View
                            style={{
                              width: "100%",
                              aspectRatio: 1, // Create a perfect square
                              // overflow: 'hidden', // Hide any content outside the square
                              borderWidth: 2, // Add a border for a circular shape
                              borderColor: "white",
                              borderRadius: 10,
                            }}
                          >
                            <TouchableOpacity
                              onPress={() =>
                                setSelectedImage(values.challanImg)
                              }
                            >
                              <Image
                                source={{ uri: values.challanImg }}
                                style={{
                                  width: 80,
                                  height: 80,
                                  resizeMode: "cover", // Cover the entire circle
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                          <TouchableOpacity
                            style={{
                              position: "absolute",
                              left: 80,
                              backgroundColor: "black",
                              borderRadius: 50,
                              width: 28,
                              height: 28,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onPress={closeImage}
                          >
                            <Icon
                              type="entypo"
                              name="cross"
                              color="white"
                              size={20}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </View>
              {errors.challanImg && touched.challanImg && (
                <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>
                  {errors.challanImg}
                </Text>
              )}
            </View>
            {/* <View style={{ marginTop: 15 }}>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Status</Text>
                <SelectDropdown
                  data={["Dispatch", "In Transit", "Shipped", "Delivered"]}
                  onSelect={(selectedItem) => {
                    setFieldValue("status", selectedItem);
                  }}
                  buttonStyle={{
                    backgroundColor: "transparent",
                    // width: "100%",
                    height: 30,
                  }}
                  defaultButtonText="Select Status"
                  buttonTextStyle={{ textAlign: 'right' }}
                  dropdownStyle={{ width: "60%", borderRadius: 10, }}
                  defaultValue={values.status}
                />
              </View>
              {errors.status && touched.status && (
                <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>
                  {errors.status}
                </Text>
              )}
            </View> */}
            {user.userType !== "Carrier" && (
              <View style={{ marginTop: 15 }}>
                <View style={styles.inputField}>
                  <Text style={styles.inputLabel}>Carrier Person</Text>

                  <SelectDropdown
                    data={[...carrierPersons]}
                    onSelect={(selectedItem) => {
                      setFieldValue(
                        "carrierPersonName",
                        selectedItem.fullName
                      );
                      setFieldValue("carrierPersonUid", selectedItem.useruid);
                      setFieldValue(
                        "carrierPersonMobNo",
                        selectedItem.mobileNumber
                      );
                    }}
                    buttonTextAfterSelection={(
                      selectedItem: any,
                      index: number
                    ) => {
                      return `${selectedItem?.fullName}`;
                    }}
                    rowTextForSelection={(item: any, index: number) => {
                      return `${item.fullName}`;
                    }}
                    buttonStyle={{
                      backgroundColor: "transparent",
                      width: "80%",
                      height: 30,
                      marginRight: 0
                    }}
                    defaultButtonText="Select Carrier"
                    buttonTextStyle={{
                      textAlign: "right",
                      marginRight: 20
                    }}
                    dropdownStyle={{ width: "70%", borderRadius: 10 }}
                    defaultValue={carrierPersons.find(
                      (person: any) =>
                        person.useruid === values.carrierPersonUid
                    )}
                  />
                </View>
                {errors.carrierPersonName && touched.carrierPersonName && (
                  <Text
                    style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}
                  >
                    {errors.carrierPersonName}
                  </Text>
                )}
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
        </ScrollView>
      </SafeAreaView>
      {iscamaraModalVisible && (
        <ImageUploadScreen
          isVisible={iscamaraModalVisible}
          onClose={closecamaraModel}
          uploadFunction={uploadProfileImage}
        />
      )}
      {iscamaraModalVisibleMaterial && (
        <ImageUploadScreen
          isVisible={iscamaraModalVisibleMaterial}
          onClose={closecamaraModel}
          uploadFunction={uploadProfileImageMaterial}
        />
      )}
      {selectedImage && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={selectedImage !== null}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "black",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: Platform.OS == "ios" ? 25 : 0,
            }}
          >
            <Image
              source={{ uri: selectedImage }}
              style={{ width: "90%", height: "90%", resizeMode: "contain" }}
            />
            <TouchableOpacity
              style={{
                position: "absolute",
                top: Platform.OS === "ios" ? 60 : 20,
                right: 20,
              }}
              onPress={closeImageModal}
            >
              <Icon type="entypo" name="cross" color="white" size={30} />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  inputField: {
    display: 'flex',
    backgroundColor: "#F9F9F9",
    borderRadius: 15,
    fontSize: 16,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputLabel: { color: "#05E3D5", fontSize: 14, },
});
export default CreateChallan;
