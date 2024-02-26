import React, { useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
  Image,
  StyleSheet,
  ImageBackground,
  TextInput,
  Modal,
  Platform,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-easy-icon";
import { GlobalStyle } from "../../../globalStyle";
import { FieldArray, FormikProvider, useFormik } from "formik";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SelectDropdown from "react-native-select-dropdown";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ImageUploadScreen from "../../components/imageUpload/ImageUploadScreen";
import fs, { touch } from "react-native-fs";
import * as Yup from "yup";
import {
  addDesignMaster,
  editDesignMaster,
  deleteDesignMaster,
  setDesignMaster,
  addMaster,
} from "../../redux/action/DesignsMaster/designMasterSlice";
import { editstoneStock } from "../../redux/action/Stone Stock/stoneStock";
import HorizontalSlider from "../../components/HorizontalSlider/HorizontalSlider";
import MultipleImageUploadScreen from "../../components/imageUpload/MultipleImageUpload";
import { formatDate } from "../../services/dateFormate";
import DatePicker from "react-native-date-picker";
import { setLoading } from "../../redux/action/Ui/Uislice";

interface InitialFormValues {
  designNo: string;
  sampleImg: any;
  stoneDetails: any;
  category: string;
  designDetails: any;
  jobworkDetails: any;
  totalstones: string;
  totlDesigns: string;
  totalJobWorks: string;
  total: string;
  partyName: string;
  partyUID: undefined;
  availableStocks: string;
  id: undefined;
  profitPercentage: string;
  profitRupee: number;
  discountPercentage: string;
  discountRupee: number;
  grandTotal: number;
  date: any;
}
const CreateSampleDesign = ({ navigation, route }: any) => {
  const { stoneStock } = useSelector((state: RootState) => state.stoneStock);
  const { designs } = useSelector((state: RootState) => state.designs);
  const { jobWorks } = useSelector((state: RootState) => state.jobWorks);
  const [iscamaraModalVisible, setIscamaraModalVisible] = useState(false);
  const dispatch = useDispatch();
  const [sampleimg, setSampleimg] = useState<any>();
  const [selectedImage, setSelectedImage] = useState<any>(false);
  const { partyMaster } = useSelector((state: RootState) => state.partyMaster);
  const { categoryes } = useSelector((state: RootState) => state.categoryes);

  const [initialFormValues, setInitialFormValues] = useState<InitialFormValues>(
    {
      designNo: "",
      availableStocks: "",
      category: "",
      sampleImg: [],
      stoneDetails: [
        {
          stoneType: "",
          stoneunit: "",
          stoneuid: "",
          totalOneStone: "",
          expecredPrice: "",
          price: "",
        },
      ],
      designDetails: [
        {
          measurement: "",
          designunit: "",
          designuid: "",
          totalOneDesign: "",
          expecredPrice: "",
          price: "",
        },
      ],
      jobworkDetails: [
        {
          partyName: "",
          workType: "",
          unit: "",
          jobuid: "",
          totalOnewJobWork: "",
          expecredPrice: "",
          price: "",
        },
      ],
      totalstones: "",
      totlDesigns: "",
      totalJobWorks: "",
      total: "",
      id: undefined,
      partyName: "",
      partyUID: undefined,
      date: "",
      profitPercentage: "",
      profitRupee: 0,
      discountPercentage: "",
      discountRupee: 0,
      grandTotal: 0,
    }
  );
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [update, setUpdate] = useState(false);
  useEffect(() => {
    if (route.params) {
      patchData();
      setUpdate(true);
    } else {
      setInitialFormValues({
        designNo: "",
        availableStocks: "",
        category: "",
        sampleImg: [],
        stoneDetails: [
          {
            stoneType: "",
            stoneunit: "",
            stoneuid: "",
            totalOneStone: "",
            expecredPrice: "",

            price: "",
          },
        ],
        designDetails: [
          {
            measurement: "",
            designunit: "",
            designuid: "",
            totalOneDesign: "",
            expecredPrice: "",

            price: "",
          },
        ],
        jobworkDetails: [
          {
            partyName: "",
            workType: "",
            unit: "",
            jobuid: "",
            totalOnewJobWork: "",
            expecredPrice: "",

            price: "",
          },
        ],
        totalstones: "",
        totlDesigns: "",
        totalJobWorks: "",
        total: "",
        id: undefined,
        partyName: "",
        partyUID: undefined,
        date: "",
        profitPercentage: "",
        profitRupee: 0,
        discountPercentage: "",
        discountRupee: 0,
        grandTotal: 0,
      });
      setUpdate(false);
    }
  }, [route.params]);
  const sampleSchema = Yup.object().shape({
    designNo: Yup.string().required("Design Number is required"),
    partyName: Yup.string().required("Party Name is required"),
    category: Yup.string().required("Category is required"),
    availableStocks: Yup.string().required("Stock is required"),
    sampleImg: Yup.array().min(1, "At least one sample image is required"),
    stoneDetails: Yup.array().of(
      Yup.object().shape({
        stoneType: Yup.string().required("Stone Type is required"),
        stoneunit: Yup.string().required("Stone Unit is required"),
        stoneuid: Yup.string().required("Stone UID is required"),
        totalOneStone: Yup.number().required("Total One Stone is required"),
        price: Yup.number().required("Price is required"),
      })
    ),
    designDetails: Yup.array().of(
      Yup.object().shape({
        measurement: Yup.string().required("Measurement is required"),
        designunit: Yup.string().required("Design Unit is required"),
        designuid: Yup.string().required("Design UID is required"),
        totalOneDesign: Yup.number().required("Total One Design is required"),
        price: Yup.number().required("Price is required"),
      })
    ),
    jobworkDetails: Yup.array().of(
      Yup.object().shape({
        partyName: Yup.string().required("Party Name is required"),
        workType: Yup.string().required("Work Type is required"),
        unit: Yup.string().required("Unit is required"),
        jobuid: Yup.string().required("Job UID is required"),
        totalOnewJobWork: Yup.number().required(
          "Total One Job Work is required"
        ),
        price: Yup.number().required("Price is required"),
      })
    ),
    totalstones: Yup.number().required("Total Stones is required"),
    totlDesigns: Yup.number().required("Total Designs is required"),
    totalJobWorks: Yup.number().required("Total Job Works is required"),
    total: Yup.number().required("Total is required"),
    id: Yup.number(),
  });
  const formik = useFormik<InitialFormValues>({
    initialValues: initialFormValues,
    validationSchema: sampleSchema,
    onSubmit: async (values: any) => {
      values.stoneDetails.map((stone: any) => updateStock(stone));
      if (update) {
        values.total = Number(values.total).toFixed(2);
        dispatch(editDesignMaster({ ...values }));
      } else {
        values.id = Math.floor(2000 + Math.random() * 9000);
        values.total = Number(values.total).toFixed(2);
        dispatch(addDesignMaster({ ...values }));
      }
      resetForm();
      navigation.goBack();
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
  const updateStock = async (item: any) => {
    const findIndex = await stoneStock.findIndex(
      (item1: any) => item1.id === item.stoneuid
    );
    let newObj = {
      ...stoneStock[findIndex],
      avilablestone:
        stoneStock[findIndex].avilablestone - parseInt(item.stoneunit),
    };
    dispatch(editstoneStock({ ...newObj }));
    stoneStock[findIndex] = newObj;
  };
  const patchData = () => {
    setFieldValue("designNo", route.params.designNo);
    setFieldValue("sampleImg", route.params.sampleImg);
    setFieldValue("stoneDetails", route.params.stoneDetails);
    setFieldValue("designDetails", route.params.designDetails);
    setFieldValue("jobworkDetails", route.params.jobworkDetails);
    setFieldValue("totalstones", route.params.totalstones);
    setFieldValue("totlDesigns", route.params.totlDesigns);
    setFieldValue("totalJobWorks", route.params.totalJobWorks);
    setFieldValue("category", route.params.category);
    setFieldValue("total", route.params.total);
    setFieldValue("partyName", route.params.partyName);
    setFieldValue("partyUID", route.params.partyUID);
    setFieldValue("availableStocks", route.params.availableStocks);
    setFieldValue("id", route.params.id);
    setFieldValue("date", route.params.date);
    setFieldValue("profitPercentage", route.params.profitPercentage);
    setFieldValue("profitRupee", route.params.profitRupee);
    setFieldValue("discountPercentage", route.params.discountPercentage);
    setFieldValue("discountRupee", route.params.discountRupee);
    setFieldValue("grandTotal", route.params.grandTotal);
    dispatch(setLoading(false));
  };
  useEffect(() => {
    totalofStone();
  }, [values.stoneDetails]);
  useEffect(() => {
    totalofDesign();
  }, [values.designDetails]);
  useEffect(() => {
    totalofJobwork();
  }, [values.jobworkDetails]);
  const totalofStone = async () => {
    const total = await values.stoneDetails.reduce(
      (stone: any, item: any) => Number(stone) + Number(item.totalOneStone),
      0
    );
    setFieldValue("totalstones", total);
    const totalAmount =
      (values.totlDesigns ? Number(values.totlDesigns) : 0) +
      (values.totalJobWorks ? Number(values.totalJobWorks) : 0) +
      total;
    setFieldValue("total", totalAmount);
    let profRupee: any = 0;
    let disRupee: any = 0;
    if (values.profitPercentage) {
      profRupee = (values.profitPercentage / 100) * Number(totalAmount);
      setFieldValue("profitRupee", profRupee);
    }
    if (values.discountPercentage) {
      disRupee = (values.discountPercentage / 100) * Number(totalAmount);
      setFieldValue("discountRupee", disRupee);
    }
    setFieldValue(
      "grandTotal",
      Number(totalAmount) + Number(profRupee) + Number(disRupee)
    );
  };

  const totalofDesign = async () => {
    const total = values.designDetails.reduce(
      (design: any, item: any) => design + item.totalOneDesign,
      0
    );
    setFieldValue("totlDesigns", total);
    const totalAmount =
      (values.totalstones ? Number(values.totalstones) : 0) +
      total +
      (values.totalJobWorks ? Number(values.totalJobWorks) : 0);
    setFieldValue("total", totalAmount);
    let profRupee: any = 0;
    let disRupee: any = 0;
    if (values.profitPercentage) {
      profRupee = (values.profitPercentage / 100) * Number(totalAmount);
      setFieldValue("profitRupee", profRupee);
    }
    if (values.discountPercentage) {
      disRupee = (values.discountPercentage / 100) * Number(totalAmount);
      setFieldValue("discountRupee", disRupee);
    }
    setFieldValue(
      "grandTotal",
      Number(totalAmount) + Number(profRupee) + Number(disRupee)
    );
  };

  const totalofJobwork = async () => {
    const total = await values.jobworkDetails?.reduce(
      (job: any, item: any) => job + item.totalOnewJobWork,
      0
    );
    setFieldValue("totalJobWorks", total);
    const totalAmount =
      (values.totalstones ? Number(values.totalstones) : 0) +
      (values.totlDesigns ? Number(values.totlDesigns) : 0) +
      total;
    setFieldValue("total", totalAmount);
    let profRupee: any = 0;
    let disRupee: any = 0;
    if (values.profitPercentage) {
      profRupee = (values.profitPercentage / 100) * Number(totalAmount);
      setFieldValue("profitRupee", profRupee);
    }
    if (values.discountPercentage) {
      disRupee = (values.discountPercentage / 100) * Number(totalAmount);
      setFieldValue("discountRupee", disRupee);
    }
    setFieldValue(
      "grandTotal",
      Number(totalAmount) + Number(profRupee) + Number(disRupee)
    );
  };

  const closecamaraModel = () => {
    setIscamaraModalVisible(false);
  };
  const uploadProfileImage = async (selectedImage: any) => {
    console.log("uploaded image", selectedImage);
    const images: any[] = [];

    try {
      await Promise.all(
        selectedImage.map(async (img: any) => {
          const imgRes = await fs.readFile(img.uri, "base64");
          images.push(`data:image/jpeg;base64,${imgRes}`);
        })
      );

      console.log("length", images.length);
      setFieldValue("sampleImg", [...values.sampleImg, ...images]);
      // Do whatever you need with the images array here
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };
  const closeImage = (i: any) => {
    console.log("selected index", i);

    // Create a copy of the sampleImg array
    const updatedSampleImg = [...values.sampleImg];

    // Remove the element at index i
    updatedSampleImg.splice(i, 1);

    // Update the state with the new array
    setFieldValue("sampleImg", updatedSampleImg);
  };

  const closeImageModal = () => {
    setSelectedImage(false);
  };
  const openDatePicker = () => {
    setDatePickerVisible(true);
  };

  const handleDateChange = (date: any) => {
    setFieldValue("date", date);
    setDatePickerVisible(false);
  };
  const handleTotalProfile = (item: any) => {
    const totalProfitRupee = (item / 100) * Number(values.total);
    setFieldValue("profitPercentage", item);
    setFieldValue("profitRupee", Number(totalProfitRupee).toFixed(2));
    setFieldValue(
      "grandTotal",
      Number(
        Number(values.total) +
          Number(totalProfitRupee) +
          Number(values.discountRupee)
      ).toFixed(2)
    );
  };
  const handleTotalDiscount = (item: any) => {
    const totalDiscountRupee = (item / 100) * Number(values.total);
    setFieldValue("discountPercentage", item);
    setFieldValue("discountRupee", Number(totalDiscountRupee).toFixed(2));
    setFieldValue(
      "grandTotal",
      Number(
        Number(values.total) +
          Number(totalDiscountRupee) +
          Number(values.profitRupee)
      ).toFixed(2)
    );
  };
  return (
    <SafeAreaView style={[GlobalStyle.safeAreaCotainer, { height: "100%" }]}>
      {/* <StatusBar
        backgroundColor="#fff"
        barStyle="dark-content" // Here is where you change the font-color
      /> */}
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
            Create Design
          </Text>
        </View>
      </View>
      {/* <GestureHandlerRootView> */}
      <ScrollView>
        <FormikProvider value={formik}>
          <View
            style={{
              padding: 0,
            }}
          >
            <View style={{ marginTop: 10 }}>
              <View style={[styles.inputField]}>
                <Text style={styles.inputLabel}>Date</Text>
                <View style={{ width: "60%" }}>
                  <Text
                    style={{ width: "100%", fontSize: 14, color: "gray" }}
                    onPress={() => openDatePicker()}
                  >
                    {values.date ? formatDate(values.date) : "Select Date"}
                  </Text>
                </View>
                <DatePicker
                  modal
                  open={datePickerVisible}
                  date={new Date()}
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
                  {errors.date}
                </Text>
              )}
            </View>
            <View style={{ marginTop: 15 }}>
              <View style={[styles.inputField, { flexDirection: "row" }]}>
                <Text style={styles.inputLabel}>Design No</Text>
                <View style={{ width: "60%" }}>
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
                    placeholder="Enter design No"
                  />
                </View>
              </View>
              {errors.designNo && touched.designNo && (
                <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>
                  {errors.designNo}
                </Text>
              )}
            </View>
            <View style={{ marginTop: 15 }}>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Select Category</Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 0,
                    justifyContent: "center",
                    width: "60%",
                  }}
                >
                  <SelectDropdown
                    data={[...categoryes]}
                    onSelect={(selectedItem) => {
                      setFieldValue("category", selectedItem.category);
                    }}
                    buttonTextAfterSelection={(
                      selectedItem: any,
                      index: number
                    ) => {
                      return `${selectedItem?.category}`;
                    }}
                    rowTextForSelection={(item: any, index: number) => {
                      return `${item.category}`;
                    }}
                    buttonStyle={{
                      backgroundColor: "transparent",
                      width: "100%",
                      height: 30,
                    }}
                    defaultButtonText="Select Category"
                    buttonTextStyle={{
                      textAlign: "left",
                      marginLeft: -5,
                    }}
                    dropdownStyle={{
                      width: "60%",
                      borderRadius: 10,
                      marginRight: 50,
                    }}
                    defaultValue={categoryes.find(
                      (cate: any) => cate.category === values.category
                    )}
                  />
                </View>
              </View>
              {errors.partyName && touched.partyName && (
                <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>
                  {errors.partyName}
                </Text>
              )}
            </View>
            <View style={{ marginTop: 15 }}>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Stock /Piece</Text>
                <View style={{ width: "60%" }}>
                  <TextInput
                    onChangeText={handleChange("availableStocks")}
                    onBlur={() => {
                      handleBlur("availableStocks");
                    }}
                    keyboardType="numeric"
                    value={values.availableStocks}
                    style={{
                      flex: 1,
                      fontSize: 16,
                      color: "#000",
                      padding: 0,
                    }}
                    placeholderTextColor="gray"
                    placeholder="Enter Stock/Piece"
                  />
                </View>
              </View>
              {errors.availableStocks && touched.availableStocks && (
                <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>
                  {errors.availableStocks}
                </Text>
              )}
            </View>
            <View style={{ marginTop: 15 }}>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Select Party Name</Text>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 0,
                    justifyContent: "center",
                    width: "60%",
                  }}
                >
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
                      width: "100%",
                      height: 30,
                    }}
                    defaultButtonText="Select Party Name"
                    buttonTextStyle={{
                      textAlign: "left",
                      marginLeft: -5,
                    }}
                    dropdownStyle={{
                      width: "60%",
                      borderRadius: 10,
                      marginRight: 50,
                    }}
                    defaultValue={partyMaster.find(
                      (Party: any) => Party.id === values.partyUID
                    )}
                  />
                </View>
              </View>
              {errors.partyName && touched.partyName && (
                <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>
                  {errors.partyName}
                </Text>
              )}
            </View>
            <View style={{ marginTop: 15 }}>
              <View
                style={[
                  {
                    width: "100%",
                    backgroundColor: "#F9F9F9",
                    borderRadius: 15,
                    padding: 10,
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View>
                    <Text style={[styles.inputLabel]}>Sample Image</Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Pressable onPress={() => setIscamaraModalVisible(true)}>
                        <Text style={{ color: "gray" }}>Upload Sample</Text>
                      </Pressable>
                    </View>
                  </View>
                  <View style={{ marginTop: 30 }}>
                    <TouchableOpacity onPress={() => setSelectedImage(true)}>
                      {values.sampleImg.length > 0 && (
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Icon
                            type="foundation"
                            name="photo"
                            color="#000"
                            size={30}
                          />
                          <Text style={{ color: "#000", fontWeight: "bold" }}>
                            {" "}
                            {values.sampleImg.length} Images Uploaded
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {errors.sampleImg && touched.sampleImg && (
                <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>
                  {errors.sampleImg}
                </Text>
              )}
            </View>
            <View style={{ marginTop: 10 }}>
              {/* <FieldArray name="stoneDetails">
                  {({ replace, remove, push }) => (
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                          Stone Details
                        </Text>
                        {values.stoneDetails &&
                          values.stoneDetails.every(
                            (st: any) =>
                              st.stoneType &&
                              st.stoneunit &&
                              st.stoneuid &&
                              st.price &&
                              st.totalOneStone
                          ) && (
                            <Pressable
                              onPress={() =>
                                push({
                                  stoneType: "",
                                  stoneunit: "",
                                  stoneuid: "",
                                  price: "",
                                  totalOneStone: "",
                                })
                              }
                            >
                              <Icon
                                type="feather"
                                name="plus"
                                color="blue"
                                size={25}
                              />
                            </Pressable>
                          )}
                      </View>
                      <HorizontalSlider>
                        {values.stoneDetails?.length > 0 &&
                          values.stoneDetails.map((stone1: any, i: any) => (
                            <View
                              key={i}
                              style={[
                                {
                                  // backgroundColor: '#f5f5f5',
                                  borderRadius: 10,
                                  // paddingVertical: 15,
                                  // paddingHorizontal: 20,
                                  width: "100%",
                                  // marginVertical: 10,
                                },
                                {
                                  borderWidth: 0.5,
                                  borderColor: "lightgray",
                                  padding: 5,
                                  marginVertical: 5,
                                },
                              ]}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "flex-end",
                                }}
                              >
                                {values.stoneDetails.length > 1 && (
                                  <Pressable onPress={() => remove(i)}>
                                    <Icon
                                      type="entypo"
                                      name="cross"
                                      color="black"
                                      size={25}
                                    />
                                  </Pressable>
                                )}
                              </View>
                              <View>
                                <View style={{ marginTop: 10 }}>
                                  <View style={styles.inputField}>
                                    <Text style={styles.inputLabel}>
                                      Stone Type
                                    </Text>
                                    <View
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                      }}
                                    >
                                      <SelectDropdown
                                        data={[...stoneStock]}
                                        onSelect={(selectedItem) => {
                                          replace(i, {
                                            ...stone1,
                                            stoneType: selectedItem.stoneType,
                                            price: selectedItem.pricePerStone,
                                            stoneuid: selectedItem.id,
                                          });
                                        }}
                                        buttonTextAfterSelection={(
                                          selectedItem: any,
                                          index: number
                                        ) => {
                                          return `${selectedItem?.stoneType}`;
                                        }}
                                        rowTextForSelection={(
                                          item: any,
                                          index: number
                                        ) => {
                                          return `${item?.stoneType}`;
                                        }}
                                        buttonStyle={{
                                          backgroundColor: "transparent",
                                          width: "100%",
                                        }}
                                        defaultButtonText={
                                          stone1.stoneType
                                            ? stone1.stoneType
                                            : "Select stone Type"
                                        }
                                        buttonTextStyle={{
                                          textAlign: "left",
                                          marginLeft: -6,
                                        }}
                                        dropdownStyle={{
                                          width: "80%",
                                          borderRadius: 10,
                                        }}
                                        defaultValue={""}
                                      />
                                    </View>
                                  </View>
                                  {errors.stoneDetails &&
                                    errors.stoneDetails[i] &&
                                    touched.stoneDetails &&
                                    touched.stoneDetails[i] && (
                                      <Text
                                        style={[
                                          GlobalStyle.errorMsg,
                                          { marginHorizontal: 10 },
                                        ]}
                                      >
                                        {errors.stoneDetails[i].stoneType}
                                      </Text>
                                    )}
                                </View>
                                <View
                                  style={{
                                    marginTop: 15,
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    width: "100%",
                                  }}
                                >
                                  <View
                                    style={[
                                      styles.inputField,
                                      { width: "50%", marginRight: 3 },
                                    ]}
                                  >
                                    <Text style={styles.inputLabel}>Price</Text>
                                    <View
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                      }}
                                    >
                                      <TextInput
                                        onChangeText={handleChange("price")}
                                        editable={false}
                                        onBlur={() => {
                                          handleBlur("price");
                                        }}
                                        value={stone1.price.toString()}
                                        style={{
                                          flex: 1,
                                          fontSize: 16,
                                          color: "#000",
                                        }}
                                        placeholderTextColor="gray"
                                        placeholder="Enter price"
                                      />
                                    </View>
                                    {errors.stoneDetails &&
                                      errors.stoneDetails[i] &&
                                      touched.stoneDetails &&
                                      touched.stoneDetails[i] && (
                                        <Text
                                          style={[
                                            GlobalStyle.errorMsg,
                                            { marginHorizontal: 10 },
                                          ]}
                                        >
                                          {errors.stoneDetails[i].price}
                                        </Text>
                                      )}
                                  </View>
                                  <View
                                    style={[
                                      styles.inputField,
                                      { width: "50%", marginLeft: 3 },
                                    ]}
                                  >
                                    <Text style={styles.inputLabel}>Unit</Text>
                                    <View
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                      }}
                                    >
                                      <TextInput
                                        onChangeText={async (text: any) => {
                                          replace(i, {
                                            ...stone1,
                                            stoneunit: text,
                                            totalOneStone: text * stone1.price,
                                          });
                                        }}
                                        value={stone1.stoneunit}
                                        style={{
                                          flex: 1,
                                          fontSize: 16,
                                          color: "#000",
                                        }}
                                        placeholderTextColor="gray"
                                        placeholder="Enter unit"
                                      />
                                    </View>
                                    {errors.stoneDetails &&
                                      errors.stoneDetails[i] &&
                                      touched.stoneDetails &&
                                      touched.stoneDetails[i] && (
                                        <Text
                                          style={[
                                            GlobalStyle.errorMsg,
                                            { marginHorizontal: 10 },
                                          ]}
                                        >
                                          {errors.stoneDetails[i].stoneunit}
                                        </Text>
                                      )}
                                  </View>
                                </View>
                              </View>
                            </View>
                          ))}
                      </HorizontalSlider>
                    </View>
                  )}
                </FieldArray> */}
              <FieldArray name="stoneDetails">
                {({ replace, remove, push }) => (
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: "gray",
                        }}
                      >
                        Stone Details
                      </Text>
                      {values.stoneDetails &&
                        values.stoneDetails.every(
                          (st: any) =>
                            st.stoneType &&
                            st.stoneunit &&
                            st.stoneuid &&
                            st.price &&
                            st.totalOneStone
                        ) && (
                          <Pressable
                            onPress={() =>
                              push({
                                stoneType: "",
                                stoneunit: "",
                                stoneuid: "",
                                price: "",
                                totalOneStone: "",
                                expecredPrice: "",
                              })
                            }
                          >
                            <Icon
                              type="feather"
                              name="plus"
                              color="blue"
                              size={25}
                            />
                          </Pressable>
                        )}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        borderWidth: 0.5,
                        borderColor: "#000",
                        backgroundColor: "#f5f6f7",
                        alignItems: "center",
                        padding: 5,
                        paddingHorizontal: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          width: "30%",
                          textAlign: "center",
                          color: "gray",
                        }}
                      >
                        Stone Type
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          width: "20%",
                          textAlign: "center",
                          color: "gray",
                        }}
                      >
                        Price
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          width: "20%",
                          textAlign: "center",
                          color: "gray",
                        }}
                      >
                        Exp. Price
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          width: "20%",
                          textAlign: "center",
                          color: "gray",
                        }}
                      >
                        Unit
                      </Text>
                      <Text></Text>
                    </View>
                    {values.stoneDetails?.length > 0 &&
                      values.stoneDetails.map((stone1: any, i: any) => (
                        <View
                          key={i}
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            borderBottomWidth: 1,
                            borderColor: "lightgray",
                            paddingHorizontal: 2,
                          }}
                        >
                          <View
                            style={{
                              width: "30%",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <SelectDropdown
                              data={[...stoneStock]}
                              onSelect={(selectedItem) => {
                                replace(i, {
                                  ...stone1,
                                  stoneType: selectedItem.stoneType,
                                  price: selectedItem.pricePerStone,
                                  stoneuid: selectedItem.id,
                                });
                              }}
                              buttonTextAfterSelection={(
                                selectedItem: any,
                                index: number
                              ) => {
                                return `${selectedItem?.stoneType}`;
                              }}
                              rowTextForSelection={(
                                item: any,
                                index: number
                              ) => {
                                return `${item?.stoneType}`;
                              }}
                              buttonStyle={{
                                backgroundColor: "transparent",
                                width: "100%",
                                padding: 0,
                                height: 20,
                              }}
                              defaultButtonText={
                                stone1.stoneType
                                  ? stone1.stoneType
                                  : "Select stone Type"
                              }
                              buttonTextStyle={{
                                textAlign: "center",
                                color: "#000",
                                fontSize: 14,
                                padding: 0,
                              }}
                              dropdownStyle={{
                                width: "100%",
                                padding: 0,
                              }}
                              defaultValue={""}
                            />
                            {errors.stoneDetails &&
                              errors.stoneDetails[i] &&
                              touched.stoneDetails &&
                              touched.stoneDetails[i] && (
                                <Text style={GlobalStyle.errorMsg}>
                                  {errors.stoneDetails[i].stoneType}
                                </Text>
                              )}
                          </View>
                          <View style={{ width: "20%", alignItems: "center" }}>
                            <TextInput
                              onChangeText={handleChange(
                                `stoneDetails[${i}].price`
                              )}
                              editable={false}
                              onBlur={() => {
                                handleBlur(`stoneDetails[${i}].price`);
                              }}
                              value={stone1.price.toString()}
                              style={{
                                fontSize: 14,
                                color: "#000",
                                textAlign: "center",
                                padding: 0,
                              }}
                              placeholderTextColor="gray"
                              placeholder="Enter price"
                            />
                            {errors.stoneDetails &&
                              errors.stoneDetails[i] &&
                              touched.stoneDetails &&
                              touched.stoneDetails[i] && (
                                <Text style={GlobalStyle.errorMsg}>
                                  {errors.stoneDetails[i].price}
                                </Text>
                              )}
                          </View>
                          <View style={{ width: "20%", alignItems: "center" }}>
                            <TextInput
                              onChangeText={(text) =>
                                replace(i, {
                                  ...stone1,
                                  expecredPrice: text,
                                })
                              }
                              editable={true}
                              onBlur={() => {
                                handleBlur(`stoneDetails[${i}].expecredPrice`);
                              }}
                              value={stone1.expecredPrice.toString()}
                              style={{
                                fontSize: 14,
                                color: "#000",
                                textAlign: "center",
                                padding: 0,
                              }}
                              keyboardType="numeric"
                              placeholderTextColor="gray"
                              placeholder="Exep. price"
                            />
                          </View>
                          <View style={{ width: "20%", alignItems: "center" }}>
                            <TextInput
                              onChangeText={async (text: any) => {
                                replace(i, {
                                  ...stone1,
                                  stoneunit: text,
                                  totalOneStone: text * stone1.price,
                                });
                              }}
                              value={stone1.stoneunit}
                              style={{
                                fontSize: 14,
                                color: "#000",
                                textAlign: "center",
                                padding: 0,
                              }}
                              placeholderTextColor="gray"
                              placeholder="Enter unit"
                            />
                            {errors.stoneDetails &&
                              errors.stoneDetails[i] &&
                              touched.stoneDetails &&
                              touched.stoneDetails[i] && (
                                <Text style={GlobalStyle.errorMsg}>
                                  {errors.stoneDetails[i].stoneunit}
                                </Text>
                              )}
                          </View>
                          <View
                            style={{
                              margin: 0,
                              paddingVertical: 0,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {values.stoneDetails.length > 1 && (
                              <Pressable
                                onPress={() => remove(i)}
                                style={{ margin: 0, paddingVertical: 0 }}
                              >
                                <Icon
                                  type="entypo"
                                  name="minus"
                                  color="red"
                                  size={20}
                                />
                              </Pressable>
                            )}
                          </View>
                        </View>
                      ))}
                  </View>
                )}
              </FieldArray>
            </View>
            <View style={{ marginTop: 10 }}>
              {/* <FieldArray name="designDetails">
                  {({ replace, remove, push }) => (
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                          Design Details
                        </Text>
                        {values.designDetails &&
                          values.designDetails.every(
                            (dsgn: any) =>
                              dsgn.measurement &&
                              dsgn.designunit &&
                              dsgn.designuid &&
                              dsgn.price &&
                              dsgn.totalOneDesign
                          ) && (
                            <Pressable
                              onPress={() =>
                                push({
                                  measurement: "",
                                  designunit: "",
                                  designuid: "",
                                  price: "",
                                  totalOneDesign: "",
                                })
                              }
                            >
                              <Icon
                                type="feather"
                                name="plus"
                                color="blue"
                                size={25}
                              />
                            </Pressable>
                          )}
                      </View>
                      <HorizontalSlider>
                        {values.designDetails?.length > 0 &&
                          values.designDetails.map((design: any, i: any) => (
                            <View
                              key={i}
                              style={[
                                {
                                  // backgroundColor: '#f5f5f5',
                                  borderRadius: 10,
                                  // paddingVertical: 15,
                                  // paddingHorizontal: 20,
                                  width: "100%",
                                  // marginVertical: 10,
                                },
                                {
                                  borderWidth: 0.5,
                                  borderColor: "lightgray",
                                  padding: 5,
                                  marginVertical: 5,
                                },
                              ]}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "flex-end",
                                }}
                              >
                                {values.designDetails.length > 1 && (
                                  <Pressable onPress={() => remove(i)}>
                                    <Icon
                                      type="entypo"
                                      name="cross"
                                      color="black"
                                      size={25}
                                    />
                                  </Pressable>
                                )}
                              </View>
                              <View>
                                <View style={{ marginTop: 10 }}>
                                  <View style={styles.inputField}>
                                    <Text style={styles.inputLabel}>
                                      Measurement
                                    </Text>
                                    <View
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                      }}
                                    >
                                      <SelectDropdown
                                        data={[...designs]}
                                        onSelect={(selectedItem) => {
                                          replace(i, {
                                            ...design,
                                            measurement:
                                              selectedItem.mesurement,
                                            price: selectedItem.price,
                                            designuid: selectedItem.id,
                                          });
                                        }}
                                        buttonTextAfterSelection={(
                                          selectedItem: any,
                                          index: number
                                        ) => {
                                          return `${selectedItem?.mesurement}`;
                                        }}
                                        rowTextForSelection={(
                                          item: any,
                                          index: number
                                        ) => {
                                          return `${item?.mesurement}`;
                                        }}
                                        buttonStyle={{
                                          backgroundColor: "transparent",
                                          width: "100%",
                                        }}
                                        defaultButtonText={
                                          design.measurement
                                            ? design.measurement
                                            : "Select Design"
                                        }
                                        buttonTextStyle={{
                                          textAlign: "left",
                                          marginLeft: -6,
                                        }}
                                        dropdownStyle={{
                                          width: "80%",
                                          borderRadius: 10,
                                        }}
                                        defaultValue={""}
                                      />
                                    </View>
                                  </View>
                                  {errors.designDetails &&
                                    errors.designDetails[i] &&
                                    touched.designDetails &&
                                    touched.designDetails[i] && (
                                      <Text
                                        style={[
                                          GlobalStyle.errorMsg,
                                          { marginHorizontal: 10 },
                                        ]}
                                      >
                                        {errors.designDetails[i].measurement}
                                      </Text>
                                    )}
                                </View>
                                <View
                                  style={{
                                    marginTop: 15,
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    width: "100%",
                                  }}
                                >
                                  <View
                                    style={[
                                      styles.inputField,
                                      { width: "50%", marginRight: 3 },
                                    ]}
                                  >
                                    <Text style={styles.inputLabel}>Price</Text>
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
                                        value={design.price.toString()}
                                        style={{
                                          flex: 1,
                                          fontSize: 16,
                                          color: "#000",
                                        }}
                                        placeholderTextColor="gray"
                                        placeholder="Enter price"
                                        editable={false}
                                      />
                                    </View>
                                    {errors.designDetails &&
                                      errors.designDetails[i] &&
                                      touched.designDetails &&
                                      touched.designDetails[i] && (
                                        <Text
                                          style={[
                                            GlobalStyle.errorMsg,
                                            { marginHorizontal: 10 },
                                          ]}
                                        >
                                          {errors.designDetails[i].price}
                                        </Text>
                                      )}
                                  </View>
                                  <View
                                    style={[
                                      styles.inputField,
                                      { width: "50%", marginLeft: 3 },
                                    ]}
                                  >
                                    <Text style={styles.inputLabel}>Unit</Text>
                                    <View
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                      }}
                                    >
                                      <TextInput
                                        onChangeText={(text: any) => {
                                          replace(i, {
                                            ...design,
                                            designunit: text,
                                            totalOneDesign: text * design.price,
                                          });
                                        }}
                                        value={design.designunit}
                                        style={{
                                          flex: 1,
                                          fontSize: 16,
                                          color: "#000",
                                        }}
                                        placeholderTextColor="gray"
                                        placeholder="Enter unit"
                                      />
                                    </View>
                                    {errors.designDetails &&
                                      errors.designDetails[i] &&
                                      touched.designDetails &&
                                      touched.designDetails[i] && (
                                        <Text
                                          style={[
                                            GlobalStyle.errorMsg,
                                            { marginHorizontal: 10 },
                                          ]}
                                        >
                                          {errors.designDetails[i].designunit}
                                        </Text>
                                      )}
                                  </View>
                                </View>
                              </View>
                            </View>
                          ))}
                      </HorizontalSlider>
                    </View>
                  )}
                </FieldArray> */}
              <FieldArray name="designDetails">
                {({ replace, remove, push }) => (
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: "gray",
                        }}
                      >
                        Design Details
                      </Text>
                      {values.designDetails &&
                        values.designDetails.every(
                          (dsgn: any) =>
                            dsgn.measurement &&
                            dsgn.designunit &&
                            dsgn.designuid &&
                            dsgn.price &&
                            dsgn.totalOneDesign
                        ) && (
                          <Pressable
                            onPress={() =>
                              push({
                                measurement: "",
                                designunit: "",
                                designuid: "",
                                price: "",
                                totalOneDesign: "",
                                expecredPrice: "",
                              })
                            }
                          >
                            <Icon
                              type="feather"
                              name="plus"
                              color="blue"
                              size={25}
                            />
                          </Pressable>
                        )}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        borderWidth: 0.5,
                        borderColor: "#000",
                        backgroundColor: "#f5f6f7",
                        alignItems: "center",
                        padding: 5,
                        paddingHorizontal: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          width: "30%",
                          textAlign: "center",
                          color: "gray",
                        }}
                      >
                        Measurement
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          width: "20%",
                          textAlign: "center",
                          color: "gray",
                        }}
                      >
                        Price
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          width: "20%",
                          textAlign: "center",
                          color: "gray",
                        }}
                      >
                        Expe. Price
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          width: "30%",
                          textAlign: "center",
                          color: "gray",
                        }}
                      >
                        Unit
                      </Text>
                      <Text></Text>
                    </View>
                    {values.designDetails?.length > 0 &&
                      values.designDetails.map((design: any, i: any) => (
                        <View
                          key={i}
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            borderBottomWidth: 1,
                            borderColor: "lightgray",
                            paddingHorizontal: 2,
                          }}
                        >
                          <View
                            style={{
                              width: "30%",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <SelectDropdown
                              data={[...designs]}
                              onSelect={(selectedItem) => {
                                replace(i, {
                                  ...design,
                                  measurement: selectedItem.mesurement,
                                  price: selectedItem.price,
                                  designuid: selectedItem.id,
                                });
                              }}
                              buttonTextAfterSelection={(
                                selectedItem: any,
                                index: number
                              ) => {
                                return `${selectedItem?.mesurement}`;
                              }}
                              rowTextForSelection={(
                                item: any,
                                index: number
                              ) => {
                                return `${item?.mesurement}`;
                              }}
                              buttonStyle={{
                                backgroundColor: "transparent",
                                width: "100%",
                                padding: 0,
                                height: 20,
                              }}
                              defaultButtonText={
                                design.measurement
                                  ? design.measurement
                                  : "Select Measurement"
                              }
                              buttonTextStyle={{
                                textAlign: "center",
                                color: "#000",
                                fontSize: 14,
                                padding: 0,
                              }}
                              dropdownStyle={{
                                width: "100%",
                                padding: 0,
                              }}
                              defaultValue={""}
                            />
                            {errors.designDetails &&
                              errors.designDetails[i] &&
                              touched.designDetails &&
                              touched.designDetails[i] && (
                                <Text style={GlobalStyle.errorMsg}>
                                  {errors.designDetails[i].measurement}
                                </Text>
                              )}
                          </View>
                          <View style={{ width: "20%", alignItems: "center" }}>
                            <TextInput
                              onChangeText={handleChange(
                                `designDetails[${i}].price`
                              )}
                              onBlur={() => {
                                handleBlur(`designDetails[${i}].price`);
                              }}
                              value={design.price.toString()}
                              style={{
                                fontSize: 14,
                                color: "#000",
                                textAlign: "center",
                                padding: 0,
                              }}
                              placeholderTextColor="gray"
                              placeholder="Enter price"
                              editable={false}
                            />
                            {errors.designDetails &&
                              errors.designDetails[i] &&
                              touched.designDetails &&
                              touched.designDetails[i] && (
                                <Text style={GlobalStyle.errorMsg}>
                                  {errors.designDetails[i].price}
                                </Text>
                              )}
                          </View>
                          <View style={{ width: "20%", alignItems: "center" }}>
                            <TextInput
                              onChangeText={(text) =>
                                replace(i, {
                                  ...design,
                                  expecredPrice: text,
                                })
                              }
                              editable={true}
                              onBlur={() => {
                                handleBlur(`designDetails[${i}].expecredPrice`);
                              }}
                              value={design.expecredPrice.toString()}
                              style={{
                                fontSize: 14,
                                color: "#000",
                                textAlign: "center",
                                padding: 0,
                              }}
                              keyboardType="numeric"
                              placeholderTextColor="gray"
                              placeholder="Exep. price"
                            />
                          </View>
                          <View style={{ width: "20%", alignItems: "center" }}>
                            <TextInput
                              onChangeText={(text: any) => {
                                replace(i, {
                                  ...design,
                                  designunit: text,
                                  totalOneDesign: text * design.price,
                                });
                              }}
                              value={design.designunit}
                              style={{
                                fontSize: 14,
                                color: "#000",
                                textAlign: "center",
                                padding: 0,
                              }}
                              placeholderTextColor="gray"
                              placeholder="Enter unit"
                            />
                            {errors.designDetails &&
                              errors.designDetails[i] &&
                              touched.designDetails &&
                              touched.designDetails[i] && (
                                <Text style={GlobalStyle.errorMsg}>
                                  {errors.designDetails[i].designunit}
                                </Text>
                              )}
                          </View>
                          <View
                            style={{
                              margin: 0,
                              paddingVertical: 0,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {values.designDetails.length > 1 && (
                              <Pressable
                                onPress={() => remove(i)}
                                style={{ margin: 0, paddingVertical: 0 }}
                              >
                                <Icon
                                  type="entypo"
                                  name="minus"
                                  color="red"
                                  size={20}
                                />
                              </Pressable>
                            )}
                          </View>
                        </View>
                      ))}
                  </View>
                )}
              </FieldArray>
            </View>
            <View style={{ marginTop: 10 }}>
              {/* <FieldArray name="jobworkDetails">
                  {({ replace, remove, push }) => (
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                          Job Details
                        </Text>
                        {values.jobworkDetails &&
                          values.jobworkDetails.every(
                            (jb: any) =>
                              jb.partyName &&
                              jb.workType &&
                              jb.unit &&
                              jb.jobuid &&
                              jb.totalOnewJobWork &&
                              jb.price
                          ) && (
                            <Pressable
                              onPress={() =>
                                push({
                                  partyName: "",
                                  workType: "",
                                  unit: "",
                                  jobuid: "",
                                  price: "",
                                  totalOnewJobWork: "",
                                })
                              }
                            >
                              <Icon
                                type="feather"
                                name="plus"
                                color="blue"
                                size={25}
                              />
                            </Pressable>
                          )}
                      </View>
                      <HorizontalSlider>
                        {values.jobworkDetails?.length > 0 &&
                          values.jobworkDetails.map((job: any, i: any) => (
                            <View
                              key={i}
                              style={[
                                {
                                  borderRadius: 10,
                                  width: "100%",
                                },
                                {
                                  borderWidth: 0.5,
                                  borderColor: "lightgray",
                                  padding: 5,
                                  marginVertical: 5,
                                },
                              ]}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "flex-end",
                                }}
                              >
                                {values.jobworkDetails.length > 1 && (
                                  <Pressable onPress={() => remove(i)}>
                                    <Icon
                                      type="entypo"
                                      name="cross"
                                      color="black"
                                      size={25}
                                    />
                                  </Pressable>
                                )}
                              </View>
                              <View>
                                <View style={{ marginTop: 10 }}>
                                  <View style={styles.inputField}>
                                    <Text style={styles.inputLabel}>
                                      Work Type
                                    </Text>
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
                                          replace(i, {
                                            ...job,
                                            workType: selectedItem.workType,
                                            price: selectedItem.price,
                                            jobuid: selectedItem.id,
                                            partyName: selectedItem.partyName,
                                          });
                                        }}
                                        buttonTextAfterSelection={(
                                          selectedItem: any,
                                          index: number
                                        ) => {
                                          return `${selectedItem?.workType}`;
                                        }}
                                        rowTextForSelection={(
                                          item: any,
                                          index: number
                                        ) => {
                                          return `${item?.workType} - ${item.partyName}`;
                                        }}
                                        buttonStyle={{
                                          backgroundColor: "transparent",
                                        }}
                                        defaultButtonText={
                                          job.workType
                                            ? job.workType
                                            : "Select Work Type"
                                        }
                                        buttonTextStyle={{
                                          textAlign: "left",
                                          marginLeft: -6,
                                        }}
                                        dropdownStyle={{
                                          width: "80%",
                                          borderRadius: 10,
                                        }}
                                        defaultValue={""}
                                      />
                                    </View>
                                  </View>
                                  {errors.jobworkDetails &&
                                    errors.jobworkDetails[i] &&
                                    touched.jobworkDetails &&
                                    touched.jobworkDetails[i] && (
                                      <Text
                                        style={[
                                          GlobalStyle.errorMsg,
                                          { marginHorizontal: 10 },
                                        ]}
                                      >
                                        {errors.jobworkDetails[i].workType}
                                      </Text>
                                    )}
                                </View>
                                <View style={{ marginTop: 15 }}>
                                  <View style={styles.inputField}>
                                    <Text style={styles.inputLabel}>
                                      Party Name
                                    </Text>
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
                                        value={job.partyName}
                                        style={{
                                          flex: 1,
                                          fontSize: 16,
                                          color: "#000",
                                        }}
                                        placeholderTextColor="gray"
                                        placeholder="Enter party Name"
                                        editable={false}
                                      />
                                    </View>
                                  </View>
                                  {errors.jobworkDetails &&
                                    errors.jobworkDetails[i] &&
                                    touched.jobworkDetails &&
                                    touched.jobworkDetails[i] && (
                                      <Text
                                        style={[
                                          GlobalStyle.errorMsg,
                                          { marginHorizontal: 10 },
                                        ]}
                                      >
                                        {errors.jobworkDetails[i].partyName}
                                      </Text>
                                    )}
                                </View>
                                <View
                                  style={{
                                    marginTop: 15,
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    width: "100%",
                                  }}
                                >
                                  <View
                                    style={[
                                      styles.inputField,
                                      { width: "50%", marginRight: 3 },
                                    ]}
                                  >
                                    <Text style={styles.inputLabel}>Price</Text>
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
                                        value={job.price.toString()}
                                        style={{
                                          flex: 1,
                                          fontSize: 16,
                                          color: "#000",
                                        }}
                                        placeholderTextColor="gray"
                                        placeholder="Enter price"
                                        editable={false}
                                      />
                                    </View>
                                    {errors.jobworkDetails &&
                                      errors.jobworkDetails[i] &&
                                      touched.jobworkDetails &&
                                      touched.jobworkDetails[i] && (
                                        <Text
                                          style={[
                                            GlobalStyle.errorMsg,
                                            { marginHorizontal: 10 },
                                          ]}
                                        >
                                          {errors.jobworkDetails[i].price}
                                        </Text>
                                      )}
                                  </View>
                                  <View
                                    style={[
                                      styles.inputField,
                                      { width: "50%", marginRight: 3 },
                                    ]}
                                  >
                                    <Text style={styles.inputLabel}>Unit</Text>
                                    <View
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                      }}
                                    >
                                      <TextInput
                                        onChangeText={(text: any) => {
                                          replace(i, {
                                            ...job,
                                            unit: text,
                                            totalOnewJobWork:
                                              text * Number(job.price),
                                          });
                                        }}
                                        value={job.unit}
                                        style={{
                                          flex: 1,
                                          fontSize: 16,
                                          color: "#000",
                                        }}
                                        placeholderTextColor="gray"
                                        placeholder="Enter unit"
                                      />
                                    </View>
                                    {errors.jobworkDetails &&
                                      errors.jobworkDetails[i] &&
                                      touched.jobworkDetails &&
                                      touched.jobworkDetails[i] && (
                                        <Text
                                          style={[
                                            GlobalStyle.errorMsg,
                                            { marginHorizontal: 10 },
                                          ]}
                                        >
                                          {errors.jobworkDetails[i].unit}
                                        </Text>
                                      )}
                                  </View>
                                </View>
                              </View>
                            </View>
                          ))}
                      </HorizontalSlider>
                    </View>
                  )}
                </FieldArray> */}
              <FieldArray name="jobworkDetails">
                {({ replace, remove, push }) => (
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: "gray",
                        }}
                      >
                        Job Details
                      </Text>
                      {values.jobworkDetails &&
                        values.jobworkDetails.every(
                          (jb: any) =>
                            jb.partyName &&
                            jb.workType &&
                            jb.unit &&
                            jb.jobuid &&
                            jb.totalOnewJobWork &&
                            jb.price
                        ) && (
                          <Pressable
                            onPress={() =>
                              push({
                                partyName: "",
                                workType: "",
                                unit: "",
                                jobuid: "",
                                price: "",
                                expecredPrice: "",
                                totalOnewJobWork: "",
                              })
                            }
                          >
                            <Icon
                              type="feather"
                              name="plus"
                              color="blue"
                              size={25}
                            />
                          </Pressable>
                        )}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        borderWidth: 0.5,
                        borderColor: "#000",
                        backgroundColor: "#f5f6f7",
                        alignItems: "center",
                        padding: 5,
                        paddingHorizontal: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          width: "25%",
                          textAlign: "center",
                          color: "gray",
                        }}
                      >
                        Work
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          width: "20%",
                          textAlign: "center",
                          color: "gray",
                        }}
                      >
                        Party
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          width: "15%",
                          textAlign: "center",
                          color: "gray",
                        }}
                      >
                        Price
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          width: "15%",
                          textAlign: "center",
                          color: "gray",
                        }}
                      >
                        Expe. Price
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          width: "15%",
                          textAlign: "center",
                          color: "gray",
                        }}
                      >
                        Unit
                      </Text>
                      <Text></Text>
                    </View>
                    {values.jobworkDetails?.length > 0 &&
                      values.jobworkDetails.map((job: any, i: any) => (
                        <View
                          key={i}
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            borderBottomWidth: 1,
                            borderColor: "lightgray",
                            paddingHorizontal: 2,
                          }}
                        >
                          <View
                            style={{
                              width: "25%",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <SelectDropdown
                              data={[...jobWorks]}
                              onSelect={(selectedItem) => {
                                replace(i, {
                                  ...job,
                                  workType: selectedItem.workType,
                                  price: selectedItem.price,
                                  jobuid: selectedItem.id,
                                  partyName: selectedItem.partyName,
                                });
                              }}
                              buttonTextAfterSelection={(
                                selectedItem: any,
                                index: number
                              ) => {
                                return `${selectedItem?.workType}`;
                              }}
                              rowTextForSelection={(
                                item: any,
                                index: number
                              ) => {
                                return `${item?.workType} - ${item.partyName}`;
                              }}
                              buttonStyle={{
                                backgroundColor: "transparent",
                                width: "100%",
                                padding: 0,
                                height: 20,
                              }}
                              defaultButtonText={
                                job.workType ? job.workType : "Select Work Type"
                              }
                              buttonTextStyle={{
                                textAlign: "center",
                                color: "#000",
                                fontSize: 14,
                                padding: 0,
                              }}
                              dropdownStyle={{
                                width: "100%",
                                padding: 0,
                              }}
                              defaultValue={""}
                            />
                            {errors.jobworkDetails &&
                              errors.jobworkDetails[i] &&
                              touched.jobworkDetails &&
                              touched.jobworkDetails[i] && (
                                <Text style={GlobalStyle.errorMsg}>
                                  {errors.jobworkDetails[i].workType}
                                </Text>
                              )}
                          </View>
                          <View style={{ width: "20%", alignItems: "center" }}>
                            <TextInput
                              onChangeText={handleChange(
                                `jobworkDetails[${i}].partyName`
                              )}
                              onBlur={() => {
                                handleBlur(`jobworkDetails[${i}].partyName`);
                              }}
                              value={job.partyName}
                              style={{
                                fontSize: 14,
                                color: "#000",
                                textAlign: "center",
                                padding: 0,
                              }}
                              placeholderTextColor="gray"
                              placeholder="party"
                              editable={false}
                            />
                            {errors.jobworkDetails &&
                              errors.jobworkDetails[i] &&
                              touched.jobworkDetails &&
                              touched.jobworkDetails[i] && (
                                <Text style={GlobalStyle.errorMsg}>
                                  {errors.jobworkDetails[i].partyName}
                                </Text>
                              )}
                          </View>
                          <View style={{ width: "15%", alignItems: "center" }}>
                            <TextInput
                              onChangeText={handleChange(
                                `jobworkDetails[${i}].price`
                              )}
                              onBlur={() => {
                                handleBlur(`jobworkDetails[${i}].price`);
                              }}
                              value={job.price.toString()}
                              style={{
                                fontSize: 14,
                                color: "#000",
                                textAlign: "center",
                                padding: 0,
                              }}
                              placeholderTextColor="gray"
                              placeholder=" price"
                              editable={false}
                            />
                            {errors.jobworkDetails &&
                              errors.jobworkDetails[i] &&
                              touched.jobworkDetails &&
                              touched.jobworkDetails[i] && (
                                <Text style={GlobalStyle.errorMsg}>
                                  {errors.jobworkDetails[i].price}
                                </Text>
                              )}
                          </View>
                          <View style={{ width: "15%", alignItems: "center" }}>
                            <TextInput
                              onChangeText={(text) =>
                                replace(i, {
                                  ...job,
                                  expecredPrice: text,
                                })
                              }
                              editable={true}
                              onBlur={() => {
                                handleBlur(
                                  `jobworkDetails[${i}].expecredPrice`
                                );
                              }}
                              value={job.expecredPrice.toString()}
                              style={{
                                fontSize: 14,
                                color: "#000",
                                textAlign: "center",
                                padding: 0,
                              }}
                              keyboardType="numeric"
                              placeholderTextColor="gray"
                              placeholder="Exep. price"
                            />
                          </View>
                          <View style={{ width: "15%", alignItems: "center" }}>
                            <TextInput
                              onChangeText={(text: any) => {
                                replace(i, {
                                  ...job,
                                  unit: text,
                                  totalOnewJobWork: text * Number(job.price),
                                });
                              }}
                              value={job.unit}
                              style={{
                                fontSize: 14,
                                color: "#000",
                                textAlign: "center",
                                padding: 0,
                              }}
                              placeholderTextColor="gray"
                              placeholder=" unit"
                            />
                            {errors.jobworkDetails &&
                              errors.jobworkDetails[i] &&
                              touched.jobworkDetails &&
                              touched.jobworkDetails[i] && (
                                <Text style={GlobalStyle.errorMsg}>
                                  {errors.jobworkDetails[i].unit}
                                </Text>
                              )}
                          </View>
                          <View
                            style={{
                              margin: 0,
                              paddingVertical: 0,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {values.jobworkDetails.length > 1 && (
                              <Pressable
                                onPress={() => remove(i)}
                                style={{ margin: 0, paddingVertical: 0 }}
                              >
                                <Icon
                                  type="entypo"
                                  name="minus"
                                  color="red"
                                  size={20}
                                />
                              </Pressable>
                            )}
                          </View>
                        </View>
                      ))}
                  </View>
                )}
              </FieldArray>
            </View>
            <View style={{ marginTop: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderWidth: 0.5,
                  borderColor: "#000",
                  backgroundColor: "#f5f6f7",
                  alignItems: "center",
                  padding: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "gray",
                    width: "15%",
                  }}
                >
                  Total
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "gray",
                    width: "15%",
                  }}
                >
                  Profit%
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "gray",
                    width: "15%",
                  }}
                >
                  Profit ₹
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "gray",
                    width: "15%",
                  }}
                >
                  Dis.%
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "gray",
                    width: "15%",
                  }}
                >
                  Dis.₹
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "bold",
                    textAlign: "center",
                    color: "gray",
                    width: "15%",
                  }}
                >
                  G.Total
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottomWidth: 1,
                  borderColor: "lightgray",
                  alignItems: "center",
                }}
              >
                <View style={{ padding: 0, width: "15%" }}>
                  <TextInput
                    onChangeText={handleChange("total")}
                    onBlur={() => {
                      handleBlur("total");
                    }}
                    value={values.total.toString()}
                    style={{
                      flex: 1,
                      fontSize: 13,
                      color: "#000",
                      textAlign: "center",
                    }}
                    placeholderTextColor="gray"
                    placeholder="Enter total"
                    editable={false}
                  />
                </View>
                <View style={{ padding: 0, width: "15%" }}>
                  <TextInput
                    onChangeText={(text) => handleTotalProfile(text)}
                    onBlur={() => {
                      handleBlur("profitPercentage");
                    }}
                    value={values.profitPercentage.toString()}
                    style={{
                      flex: 1,
                      fontSize: 13,
                      color: "#000",
                      textAlign: "center",
                    }}
                    placeholderTextColor="gray"
                    placeholder="%"
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ padding: 0, width: "15%" }}>
                  <TextInput
                    onChangeText={(text) => handleTotalProfile(text)}
                    onBlur={() => {
                      handleBlur("profitRupee");
                    }}
                    value={values.profitRupee.toString()}
                    style={{
                      flex: 1,
                      fontSize: 13,
                      color: "#000",
                      textAlign: "center",
                    }}
                    placeholderTextColor="gray"
                    placeholder="₹"
                    editable={false}
                  />
                </View>
                <View style={{ padding: 0, width: "15%" }}>
                  <TextInput
                    onChangeText={(text) => handleTotalDiscount(text)}
                    onBlur={() => {
                      handleBlur("discountPercentage");
                    }}
                    value={values.discountPercentage.toString()}
                    style={{
                      flex: 1,
                      fontSize: 13,
                      color: "#000",
                      textAlign: "center",
                    }}
                    placeholderTextColor="gray"
                    keyboardType="numeric"
                    placeholder="%"
                  />
                </View>
                <View style={{ padding: 0, width: "15%" }}>
                  <TextInput
                    onChangeText={handleChange("discountRupee")}
                    onBlur={() => {
                      handleBlur("discountRupee");
                    }}
                    value={values.discountRupee.toString()}
                    style={{
                      flex: 1,
                      fontSize: 13,
                      color: "#000",
                      textAlign: "center",
                    }}
                    placeholderTextColor="gray"
                    placeholder="₹"
                    editable={false}
                  />
                </View>
                <View style={{ padding: 0, width: "15%" }}>
                  <TextInput
                    onChangeText={handleChange("grandTotal")}
                    onBlur={() => {
                      handleBlur("grandTotal");
                    }}
                    value={values.grandTotal.toString()}
                    style={{
                      flex: 1,
                      fontSize: 13,
                      color: "#000",
                      textAlign: "center",
                    }}
                    placeholderTextColor="gray"
                    placeholder="₹"
                    editable={false}
                  />
                </View>
              </View>
            </View>
            {/* <View style={{ marginTop: 10 }}>
              <View style={styles.inputField}>
                <Text style={styles.inputLabel}>Total</Text>
                <View style={{ width: "60%" }}>
                  <TextInput
                    onChangeText={handleChange("total")}
                    onBlur={() => {
                      handleBlur("total");
                    }}
                    value={values.total.toString()}
                    style={{
                      flex: 1,
                      fontSize: 16,
                      color: "#000",
                      padding: 0,
                    }}
                    placeholderTextColor="gray"
                    placeholder="Enter total"
                    editable={false}
                  />
                </View>
              </View>
              {errors.total && touched.total && (
                <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>
                  {errors.total}
                </Text>
              )}
            </View> */}
            <Pressable
              style={GlobalStyle.button}
              onPress={() => handleSubmit()}
            >
              <Text style={GlobalStyle.btntext}>
                {update ? "Update" : "Submit"}
              </Text>
            </Pressable>
          </View>
        </FormikProvider>
      </ScrollView>
      {/* </GestureHandlerRootView> */}
      {iscamaraModalVisible && (
        <MultipleImageUploadScreen
          isVisible={iscamaraModalVisible}
          onClose={closecamaraModel}
          uploadFunction={uploadProfileImage}
        />
      )}
      {selectedImage && (
        <Modal transparent={true} animationType="fade" visible={selectedImage}>
          <View
            style={{
              flex: 1,
              backgroundColor: "black",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: Platform.OS == "ios" ? 25 : 0,
            }}
          >
            <ScrollView style={{ marginTop: 50 }}>
              {values.sampleImg.map((img: any, i: any) => (
                <View style={{ width: "100%", alignItems: "center" }} key={i}>
                  <View
                    style={{
                      borderTopLeftRadius: 5,
                      borderTopRightRadius: 15,
                      padding: 10,
                      width: "95%",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: "100%",
                        aspectRatio: 1,
                        borderWidth: 2,
                        borderColor: "white",
                        borderRadius: 10,
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        source={{ uri: img }}
                        style={{
                          width: "100%",
                          height: "100%",
                          resizeMode: "cover",
                        }}
                      />
                    </View>
                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        backgroundColor: "red",
                        borderRadius: 50,
                        width: 28,
                        height: 28,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => closeImage(i)}
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
              ))}
            </ScrollView>
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
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  inputField: {
    backgroundColor: "#F9F9F9",
    borderRadius: 15,
    fontSize: 16,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputLabel: { color: "#05E3D5", fontSize: 14 },
});
export default CreateSampleDesign;
