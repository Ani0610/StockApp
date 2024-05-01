import { View, Text, Modal, Platform, Pressable, TextInput, StyleSheet, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-easy-icon';
import { GlobalStyle } from '../../../globalStyle';
import { useDispatch } from 'react-redux';
import * as yup from "yup";
import { useFormik } from 'formik';
import { setLoading, setToast } from '../../redux/action/Ui/Uislice';
import { addPapers, updatePaper } from '../../services/master/master.service';
import { addDesign, editDesign } from '../../redux/action/DesignDetails/designSlice';
var heightY = Dimensions.get("window").height;

interface InitialFormValues {
    mesurement: string;
    price: string;
    id: string;
}
const AddEditDesignDetails = ({ showModal, setShowModal, data }: any) => {
    const [update, setUpdate] = useState(false);

    const dispatch = useDispatch();
    const designSchema = yup.object().shape({
        mesurement: yup.string().required("Mesurement/Size is required"),
        price: yup.string().required("Price is required"),
    });
    const [initialFormValues, setInitialFormValues] = useState<InitialFormValues>(
        {
            mesurement: "",
            price: "",
            id: "",
        }
    );
    const formik = useFormik<InitialFormValues>({
        initialValues: initialFormValues,
        validationSchema: designSchema,
        onSubmit: async (values: any) => {
            if (update) {
                dispatch(setLoading(true))
                updatePaper(values).then((res) => {
                    dispatch(setLoading(false))
                    if (res)
                        dispatch(editDesign({ ...values }));
                    else
                        dispatch(setToast({ message: 'Something went wrong', isVisible: true, type: 'danger' }))
                })
            } else {
                dispatch(setLoading(true));
                addPapers(values).then((res) => {
                    dispatch(setLoading(false))
                    if (res)
                        dispatch(addDesign(res));
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
    const handleClose = () => {
        setShowModal(false);
        setUpdate(false);
        resetForm();
    };
    useEffect(() => {
        if (data) {
            setFieldValue("mesurement", data.mesurement);
            setFieldValue("price", data.price);
            setFieldValue("id", data.id);
            setUpdate(true);
        }
    }, [data])

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
                            Add Paper Details
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
                                <Text style={Style.inputLabel}>Mesurement/Size</Text>
                                <View
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                    }}
                                >
                                    <TextInput
                                        onChangeText={handleChange("mesurement")}
                                        onBlur={() => {
                                            handleBlur("mesurement");
                                        }}
                                        value={values.mesurement}
                                        style={{ textAlign: 'right', fontSize: 16, color: "#000" }}
                                        placeholderTextColor="gray"
                                        placeholder="Enter mesurement"
                                    />
                                </View>
                            </View>
                            {errors.mesurement && touched.mesurement && (
                                <Text
                                    style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}
                                >
                                    {errors.mesurement}
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
                                        placeholder="Enter price per meter"
                                        keyboardType="numeric"
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
    mesurement: {
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
export default AddEditDesignDetails