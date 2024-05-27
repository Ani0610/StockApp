import {
    View,
    Text,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    TextInput,
    Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-easy-icon";
import { GlobalStyle } from "../../../globalStyle";
import { useFormik, Formik } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { setLoading, setToast } from "../../redux/action/Ui/Uislice";
import {
    addJobWorks,
    updateJobWork,
} from "../../services/master/master.service";
import {
    addJobWork,
    editJobWork,
} from "../../redux/action/Job Work details/jobDetailsSlice";
import { workType } from "../../components/UI/commonComponent";
import SelectDropdown from "react-native-select-dropdown";
import { TouchableOpacity } from "react-native-gesture-handler";
interface InitialFormValues {
    partyName: string;
    workType: string;
    price: string;
    itemName: string;
    id: string;
}

var heightY = Dimensions.get("window").height;

const AddEditJobwork = ({ showModal, setShowModal, data }: any) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [workTypeValue, setWorkTypeValue] = useState("");
    const [customWorkType, setCustomWorkType] = useState("");

    const workTypeOptions = [...workType];

    const handleChangeWorkType = (selectedItem:any) => {
        setWorkTypeValue(selectedItem);
        if (selectedItem === "other") {
            setShowDropdown(false);
        } else {
            setShowDropdown(true);
        }
    };

    //   useEffect(() => {
    //     if (data) {
    //       setWorkTypeValue(data.workType);
    //       setShowModal(true);
    //     }
    //   }, [data]);


    useEffect(() => {
        if (data) {
            if (!workType.includes(data.workType)) {
                setWorkTypeValue("other");
                setCustomWorkType(data.workType);
                setShowDropdown(false);
            } else {
                setWorkTypeValue(data.workType);
                setShowDropdown(true);
            }
            setFieldValue("partyName", data.partyName);
            setFieldValue("workType", data.workType);
            setFieldValue("price", data.price);
            setFieldValue("itemName", data.itemName);
            setFieldValue("id", data.id);
            setUpdate(true);
            setShowModal(true);
        }
    }, [data]);



    const [update, setUpdate] = useState(false);
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

    const jobWorksSchema = yup.object().shape({
        partyName: yup.string().required("Party Name is required"),
        workType: yup.string().required("Work Type is required"),
        price: yup.string().required("Price is required"),
    });
    const handleClose = () => {
        setShowModal(false);
        setUpdate(false);
        resetForm();
    };
    useEffect(() => {
        if (data) {
            setFieldValue("partyName", data.partyName);
            setFieldValue("workType", data.workType);
            setFieldValue("price", data.price);
            setFieldValue("itemName", data.itemName);
            setFieldValue("id", data.id);
            setUpdate(true);
            setShowModal(true);
        }
    }, [data]);

    const formik = useFormik<InitialFormValues>({
        initialValues: initialFormValues,
        validationSchema: jobWorksSchema,
        onSubmit: async (values: any) => {

            if (values.workType === 'other') {
                values.workType = customWorkType;
            }

            if (update) {
                dispatch(setLoading(true));
                updateJobWork(values).then((res) => {
                    dispatch(setLoading(false));

                    if (res) dispatch(editJobWork({ ...values }));
                    else
                        dispatch(
                            setToast({
                                message: "Something went wrong",
                                isVisible: true,
                                type: "danger",
                            })
                        );
                });
            } else {
                dispatch(setLoading(true));
                addJobWorks(values).then((res) => {
                    console.log("res jobwork-------------------", res);
                    dispatch(setLoading(false));
                    if (res) dispatch(addJobWork({ ...res }));
                    else
                        dispatch(
                            setToast({
                                message: "Something went wrong",
                                isVisible: true,
                                type: "danger",
                            })
                        );
                });

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
    return (
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
                                        style={{ textAlign: "right", fontSize: 16, color: "#000" }}
                                        placeholderTextColor="gray"
                                        placeholder="Enter Party Names"
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
                            <Text style={[GlobalStyle.inputLabel, { width: "45%" }]}>
                                Work Type
                            </Text>
                            <View
                                style={[
                                    Style.inputField,
                                    { flexDirection: "row", alignItems: "center" },
                                ]}
                            >
                                <SelectDropdown
                                    data={workTypeOptions}
                                    onSelect={(selectedItem) => {
                                        handleChangeWorkType(selectedItem);
                                        handleChange("workType")(selectedItem);
                                    }}
                                    //   defaultButtonText="Select Work Type"
                                    defaultButtonText={workTypeValue === "Select Work Type" ? customWorkType : "other"}
                                    buttonTextAfterSelection={(selectedItem, index) => {
                                        return `${selectedItem}`;
                                    }}
                                    rowTextForSelection={(item, index) => {
                                        return `${item}`;
                                    }}
                                    buttonStyle={{
                                        flex: 1,
                                        backgroundColor: "transparent",
                                        padding: 0,
                                        height: 50,
                                    }}
                                    buttonTextStyle={{
                                        textAlign: "right",
                                        color: "#000",
                                        fontSize: 16,
                                        padding: 0,
                                    }}
                                    defaultValue={values.workType}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowDropdown(!showDropdown)}
                                >
                                    <Icon
                                        type="entypo"
                                        name="chevron-down"
                                        color="black"
                                        size={20}
                                        style={{ marginRight: 10 }}
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.workType && touched.workType && (
                                <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>
                                    {errors.workType}
                                </Text>
                            )}
                            {workTypeValue === "other" && (
                                <View style={[Style.inputField, { marginTop: 10 }]}>
                                    <Text style={[GlobalStyle.inputLabel, { width: "45%" }]}>
                                        Work Type Name
                                    </Text>
                                    <TextInput
                                        value={customWorkType}
                                        onChangeText={(text) => {
                                            setCustomWorkType(text);
                                            handleChange("workType")(text);
                                        }}
                                        placeholder="Enter Work Type"
                                        style={{
                                            textAlign: "right",
                                            fontSize: 16,
                                            color: "#000",
                                            flex: 1,
                                        }}
                                    />
                                </View>
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
                                        style={{ textAlign: "right", fontSize: 16, color: "#000" }}
                                        placeholderTextColor="gray"
                                        placeholder="Enter item name"
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
                                        style={{ textAlign: "right", fontSize: 16, color: "#000" }}
                                        placeholderTextColor="gray"
                                        placeholder="Enter price per unit"
                                        keyboardType="number-pad"
                                    />
                                </View>
                            </View>
                            {errors.price && touched.price && (
                                <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>
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
    );
};
const Style = StyleSheet.create({
    cardContainer: { marginBottom: 0 },
    inputField: {
        display: "flex",
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
export default AddEditJobwork;
