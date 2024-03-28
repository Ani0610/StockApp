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
import SearchableComponent from "../../components/Search/SearchComponent";
import {
  addCategory,
  deleteCategory,
  editCategory,
  setCategory,
} from "../../redux/action/Category/categorySlice";
import { addCategories, deleteCategoryByID, getCategories, updateCategory } from "../../services/master/master.service";
import { setLoading, setToast } from "../../redux/action/Ui/Uislice";
import { readFileAssets } from "react-native-fs";
var heightY = Dimensions.get("window").height;

interface InitialFormValues {
  category: string;
  id: string;
}

const CategoryMaster = () => {
  const [showModal, setShowModal] = useState(false);
  const [update, setUpdate] = useState(false);
  const [data, setdata] = useState<any | null>(null); // Track the selected card's ID
  const [isVisible, setisVisible] = useState(false);
  const categorySchema = yup.object().shape({
    category: yup.string().required("Category is required"),
  });
  const { categories } = useSelector((state: RootState) => state.categories);
  const [allcategorys, setAllcategorys] = useState<any>([]);
  const dispatch = useDispatch();
  const [initialFormValues, setInitialFormValues] = useState<InitialFormValues>(
    {
      category: "",
      id: "",
    }
  );
  const formik = useFormik<InitialFormValues>({
    initialValues: initialFormValues,
    validationSchema: categorySchema,
    onSubmit: async (values: any) => {
      if (update) {
        dispatch(setLoading(true));
        updateCategory(values).then((res) => {
          dispatch(setLoading(false))
          if (res)
            dispatch(editCategory({ ...values }));
          else
            dispatch(setToast({ message: 'Something went wrong', isVisible: true, type: 'danger' }))
        })
      } else {
        dispatch(setLoading(true))
        addCategories(values).then((res) => {
          console.log('res categories-------------------', res);
          dispatch(setLoading(false))
          if (res)
            dispatch(addCategory({ ...res }));
          else
            dispatch(setToast({ message: 'Something went wrong', isVisible: true, type: 'danger' }))
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
  useEffect(() => {
    setAllcategorys([...categories]);
  }, [categories]);

  useEffect(() => {
    dispatch(setLoading(true))
    getCategories().then((res) => {
      dispatch(setLoading(false))
      if (res) {
        dispatch(setCategory(res))
      } else {
        dispatch(setToast({ message: 'Something went wrong', isVisible: true, type: 'danger' }))
      }
    })
  }, [])

  const onClose = () => {
    setisVisible(false);
  };
  const editCategoryMaster = () => {
    console.log('edit categoris', data);

    setFieldValue("category", data.category);
    setFieldValue("id", data.id);
    setUpdate(true);
    setisVisible(false);
    setShowModal(true);
  };
  const deleteCategoryMaster = () => {
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
          deleteCategoryByID(data).then((res) => {
            dispatch(setLoading(false))
            setisVisible(false);
            if (res) {
              dispatch(deleteCategory(data));
            }
            else {
              dispatch(setToast({ message: 'Something went wrong', isVisible: true, type: 'danger' }))

            }
          })
        }
        )
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
    setAllcategorys([...filteredData]);
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
            data={categories}
            searchKey="category"
            placeholder={"category"}
            onFilter={handleFilter}
          />
        </View>
        <ScrollView>
          <View style={[GlobalStyle.container]}>
            <View>
              {allcategorys?.map((item: any, i: any) => (
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
                    <Text style={GlobalStyle.label}>Category</Text>
                  </View>
                  <View style={GlobalStyle.middleSide}>
                    <Text
                      style={GlobalStyle.textcolor}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.category}
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
                onPress={() => editCategoryMaster()}
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
                onPress={() => deleteCategoryMaster()}
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
                  Add Category
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
                    <Text style={Style.inputLabel}>Category</Text>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <TextInput
                        onChangeText={handleChange("category")}
                        onBlur={() => {
                          handleBlur("category");
                        }}
                        value={values.category}
                        style={{ textAlign: 'right', fontSize: 16, color: "#000" }}
                        placeholderTextColor="gray"
                        placeholder="Enter category"
                      />
                    </View>
                  </View>
                  {errors.category && touched.category && (
                    <Text
                      style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}
                    >
                      {errors.category}
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
  category: {
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

export default CategoryMaster;
