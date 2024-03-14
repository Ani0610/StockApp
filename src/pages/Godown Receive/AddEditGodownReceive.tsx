import { View, Text, Pressable, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from "yup";
import { GlobalStyle } from '../../../globalStyle';
import SelectDropdown from 'react-native-select-dropdown';
import { formatDate } from '../../services/dateFormate';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Icon from 'react-native-easy-icon';
import fs, { touch } from "react-native-fs";

import ImageUploadScreen from '../../components/imageUpload/ImageUploadScreen';

interface InitialFormValues {
    challanNo: string
    designNo: string;
    challanType: string;
    piece: string;
    itemName: string;
    partyName: string;
    date: any;
    status: string;
    carrierPersonName: string;
    carrierPersonUid: string;
    carrierPersonMobNo: string;
    id: undefined;
    partyUID: undefined;
    cardImg: string;
}
const AddEditGodownReceive = ({ navigation }: any) => {
    const { partyMaster } = useSelector((state: RootState) => state.partyMaster);
    const { user }: any = useSelector((state: RootState) => state.user);
    const { userMaster } = useSelector((state: RootState) => state.userMaster);
    const { designsMaster } = useSelector((state: RootState) => state.designMaster);
    const [carrierPersons, setCarrierPersons] = useState<any>([]);
    const [selectedImage, setSelectedImage] = useState<any>();
    const [iscamaraModalVisibleMaterial, setIscamaraModalVisibleMaterial] = useState(false);

    const closeImage = () => {
        setSelectedImage(null);
    };
    const closecamaraModel = () => {
        // setIscamaraModalVisible(false);
        setIscamaraModalVisibleMaterial(false);
    };
    const uploadProfileImage = (selectedImage: any) => {
        fs.readFile(selectedImage.uri, "base64").then((imgRes) => {
            setFieldValue("challanImg", `data:image/jpeg;base64,${imgRes}`);
        });
    };
    const uploadProfileImageMaterial = (selectedImage: any) => {
        fs.readFile(selectedImage.uri, "base64").then((imgRes) => {
            setFieldValue("cardImg", `data:image/jpeg;base64,${imgRes}`);
        });
    };
    const [initialFormValues, setInitialFormValues] = useState<InitialFormValues>(
        {
            challanNo: "",
            challanType: "",
            designNo: "",
            piece: "",
            itemName: "",
            partyName: "",
            date: "",
            status: "",
            carrierPersonName: "",
            carrierPersonUid: "",
            carrierPersonMobNo: "",
            id: undefined,
            partyUID: undefined,
            cardImg: ""
        }
    );
    useEffect(() => {
        const carrier: any = userMaster.filter(
            (item: any) => item.userType === "Carrier"
        );
        setCarrierPersons([...carrier]);
    }, [userMaster]);
    const challanSchema = Yup.object().shape({
        challanNo: Yup.string().required("Challan Type is required"),
        designNo: Yup.string().when([], (inputs: any, schema: any) => {
            //   if (user?.userType === "Carrier") {
            // return schema;
            //   }
            return schema.required("Design Number is required");
        }),
        challanType: Yup.string().required("Challan Type is required"),
        partyName: Yup.string().required("Party Name is required"),
        date: Yup.string().required("Date is required"),
        piece: Yup.string().required("Number of Sample is required"),
        status: Yup.string().required("Status is required"),
        carrierPersonName: Yup.string().required("Carrier Person Name is required"),
        cardImg: Yup.string()
    });
    const formik = useFormik<InitialFormValues>({
        initialValues: initialFormValues,
        validationSchema: challanSchema,
        onSubmit: async (values: any) => {
            onSubmit: async (values: any) => {

            };
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
        <>
            <ScrollView>
                <View
                    style={{
                        padding: 10,
                    }}
                >
                    <View style={{ marginTop: 10 }}>
                        <View style={styles.inputField}>
                            <Text style={styles.inputLabel}>Challan Number</Text>

                            <SelectDropdown
                                data={[{ id: '123' }]}
                                onSelect={(selectedItem) => {
                                    setFieldValue("challanNo", selectedItem.id);
                                    // setFieldValue("challanNo", selectedItem.partyName);
                                }}
                                buttonTextAfterSelection={(
                                    selectedItem: any,
                                    index: number
                                ) => {
                                    return `${selectedItem?.id}`;
                                }}
                                rowTextForSelection={(item: any, index: number) => {
                                    return `${item.id}`;
                                }}
                                buttonStyle={{
                                    backgroundColor: "transparent",
                                    width: "85%",
                                    height: 30,
                                }}
                                defaultButtonText="Select Challan Number"
                                buttonTextStyle={{
                                    marginRight: 0
                                }}
                                dropdownStyle={{ width: "60%", borderRadius: 10 }}
                            // defaultValue={null}
                            />
                        </View>
                        {errors.partyName && touched.partyName && (
                            <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>
                                {errors.partyName}
                            </Text>
                        )}
                    </View>
                    <View style={styles.inputField}>
                        <Text style={styles.inputLabel}>Select Design Number</Text>
                        <SelectDropdown
                            data={[...designsMaster]}
                            onSelect={(selectedItem) => {
                                setFieldValue("partyUID", selectedItem.partyUID);
                                setFieldValue("partyName", selectedItem.partyName);
                                setFieldValue("designNo", selectedItem.designNo);
                            }}
                            // search={true}
                            // searchPlaceHolder={"Search by Design Number"}
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
                                width: "70%",
                                height: 30,
                            }}
                            defaultButtonText="Select Design Number"
                            buttonTextStyle={{
                                marginRight: 10,
                            }}
                            dropdownStyle={{ width: "60%", borderRadius: 10 }}
                            defaultValue={designsMaster.find(
                                (party: any) => party.partyUID === values.partyUID
                            )}
                        />
                    </View>
                    <View style={{ marginTop: 15 }}>

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
                                // onPress={() => openDatePicker()}
                                >
                                    {values.date ? formatDate(values.date) : "Select Date"}
                                </Text>
                            </View>
                            {/* <DatePicker
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
                /> */}
                        </View>
                        {errors.date && touched.date && (
                            <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>
                                {errors.date}
                            </Text>
                        )}
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <View style={styles.inputField}>
                            <Text style={styles.inputLabel}>Select Challan Type</Text>
                            <SelectDropdown
                                data={["In", "Out"]}
                                onSelect={(selectedItem) => {
                                    setFieldValue("challanType", selectedItem);
                                }}
                                buttonStyle={{
                                    backgroundColor: "transparent",
                                    width: "80%",
                                    height: 30,
                                }}
                                buttonTextStyle={{
                                    // textAlign: "right",
                                    marginRight: 0
                                }}
                                defaultButtonText="Select Challan Type"
                                dropdownStyle={{ borderRadius: 10, width: '60%' }}
                                defaultValue={values.challanType}
                            />
                        </View>
                        {errors.challanType && touched.challanType && (
                            <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>
                                {errors.challanType}
                            </Text>
                        )}
                    </View>
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
                                    width: "85%",
                                    height: 30,
                                }}
                                defaultButtonText="Select Party Name"
                                buttonTextStyle={{
                                    // textAlign: "right",
                                    marginRight: 0
                                }}
                                dropdownStyle={{ width: "60%", borderRadius: 10 }}
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
              
                    <View style={{ marginTop: 10}}>
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
                                    style={{ flex: 1, fontSize: 16, color: "#000", padding: 0 }}
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
                                    style={{ flex: 1, fontSize: 16, color: "#000", padding: 0 }}
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
                                        width: "100%",
                                        height: 30,
                                    }}
                                    defaultButtonText="Select Carrier Person"
                                    buttonTextStyle={{ marginRight: 10 }}
                                    dropdownStyle={{ width: "80%", borderRadius: 10 }}
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
                    <View style={{ marginTop: 15 }}>
                        <View
                            style={[
                                {
                                    backgroundColor: "#F9F9F9",
                                    borderRadius: 15,
                                    padding: 10
                                },
                                { width: "100%", height: values.cardImg ? 110 : "auto" },
                            ]}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <View>
                                    <Text style={styles.inputLabel}>Card Shade Photo</Text>
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
                                            <Text style={{ color: "gray" }}>Upload Card Shade</Text>
                                        </Pressable>
                                    </View>
                                </View>
                                <View>
                                    {values.cardImg && (
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
                                                        onPress={() => setSelectedImage(values.cardImg)}
                                                    >
                                                        <Image
                                                            source={{ uri: values.cardImg }}
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
                        {errors.cardImg && touched.cardImg && (
                            <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>
                                {errors.cardImg}
                            </Text>
                        )}
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-evenly' }}>
                        <Pressable
                            style={GlobalStyle.button}
                            onPress={() => handleSubmit()}
                        >
                            <Text style={GlobalStyle.btntext}>
                                Receive
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[GlobalStyle.button, { backgroundColor: 'red' }]}
                            onPress={() => { resetForm(); navigation.goBack() }}
                        >
                            <Text style={GlobalStyle.btntext}>
                                Reject
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
            {iscamaraModalVisibleMaterial && (
                <ImageUploadScreen
                    isVisible={iscamaraModalVisibleMaterial}
                    onClose={closecamaraModel}
                    uploadFunction={uploadProfileImageMaterial}
                />
            )}
        </>

    )
}

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
    inputLabel: { color: "#05E3D5", fontSize: 14 },
});
export default AddEditGodownReceive