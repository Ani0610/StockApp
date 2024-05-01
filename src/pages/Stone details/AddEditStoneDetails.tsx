import { View, Text, Modal, Pressable, Platform, Dimensions, TextInput, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { addStones, updateStone } from '../../services/master/master.service';
import { setLoading, setToast } from '../../redux/action/Ui/Uislice';
import { addStone, editStone } from '../../redux/action/StoneDetails/stoneSlice';
import Icon from "react-native-easy-icon";
import * as yup from "yup";
import { GlobalStyle } from '../../../globalStyle';
var heightY = Dimensions.get("window").height;

interface InitialFormValues {
    stoneType: string;
    price: string;
    stonePerBag: string;
    pricePerStone: number;
    id: "";
    availableStock: number;
}
const AddEditStoneDetails = ({ showModal, setShowModal, update, setUpdate, setisVisible, data }: any) => {
    const dispatch = useDispatch();

    const [initialFormValues, setInitialFormValues] = useState<InitialFormValues>(
        {
            stoneType: "",
            price: "",
            stonePerBag: "",
            pricePerStone: 0,
            id: "",
            availableStock: 0
        }
    );
    useEffect(() => {
        if (update) {
            editStoneDetails()
        }
    }, [update])
    const editStoneDetails = () => {
        setFieldValue("stoneType", data.stoneType);
        setFieldValue("stonePerBag", data.stonePerBag);
        setFieldValue("pricePerStone", data.pricePerStone);
        setFieldValue("price", data.price);
        setFieldValue("id", data.id);
        setisVisible(false);
        setShowModal(true);
    };
    const handleClose = () => {
        setShowModal(false);
        setUpdate(false);
        resetForm();
    };
    const stoneSchema = yup.object().shape({
        stoneType: yup.string().required("Stone Type is required"),
        stonePerBag: yup.string().required("Stone per bag is required"),
        price: yup.string().required("Price is required"),
    });
    const formik = useFormik<InitialFormValues>({
        initialValues: initialFormValues,
        validationSchema: stoneSchema,
        onSubmit: async (values: any) => {
            values.pricePerStone = Number(values.price / values.stonePerBag).toFixed(4);
            dispatch(setLoading(true));
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
    )
}

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
export default AddEditStoneDetails