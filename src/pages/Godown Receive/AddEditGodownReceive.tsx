import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from "yup";
import { GlobalStyle } from '../../../globalStyle';
import { RootState } from '../../redux/store';
import { formatDate } from '../../services/dateFormate';


import DatePicker from 'react-native-date-picker';
import ImageUploadScreen from '../../components/imageUpload/ImageUploadScreen';
import { editDesignMaster } from '../../redux/action/DesignsMaster/designMasterSlice';
import { setLoading, setToast } from '../../redux/action/Ui/Uislice';
import { addReceiveMaal } from '../../redux/action/receive_maal/receiveMaalSlice';
import { updateDesignDetails } from '../../services/Design/Design.Service';
import { addReceiveMaalService, getChallanDetails, getJobNumberCount, updateReceiveMaalDetails } from '../../services/challan/challan.service';
import { uploadSingleImage } from '../../services/file/file.service';

interface InitialFormValues {
    jobNo: number;
    challanNo: string;
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
const AddEditGodownReceive = ({ navigation, route }: any) => {
    const dispatch = useDispatch();
    const { partyMaster } = useSelector((state: RootState) => state.partyMaster);
    const { user }: any = useSelector((state: RootState) => state.user);
    const { userMaster } = useSelector((state: RootState) => state.userMaster);
    const { designsMaster } = useSelector((state: RootState) => state.designMaster);
    const [carrierPersons, setCarrierPersons] = useState<any>([]);
    const [selectedImage, setSelectedImage] = useState<any>();
    const [iscamaraModalVisibleMaterial, setIscamaraModalVisibleMaterial] = useState(false);
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [inChallans, setInChallan] = useState([])
    const [update, setUpdate] = useState(false);
    const [rowData, setRowdata] = useState<any>();
    // useEffect(() => {

    // }, [])

    useEffect(() => {
        console.log(route?.params);
        if (route?.params && route?.params.rowData) {
            dispatch(setLoading(true));
            getChallanDetails().then((res: any) => {
                if (res && res.findIndex((data: any) => data.challanType === "In") > -1) {
                    setInChallan(res)
                    const selectedItem = route?.params?.rowData;
                    setRowdata(rowData)
                    setFieldValue("challanNo", selectedItem.challanNo);
                    setFieldValue("challanType", selectedItem.challanType);
                    setFieldValue("partyName", selectedItem.partyName);
                    setFieldValue("partyUID", selectedItem.partyUID);
                    setFieldValue("date", new Date());
                    setFieldValue("itemName", selectedItem.itemName);
                    setFieldValue("piece", selectedItem.piece);
                    setFieldValue("carrierPersonName", selectedItem.carrierPersonName);
                    setFieldValue("carrierPersonUid", selectedItem.carrierPersonUid);
                    setFieldValue("carrierPersonMobNo", selectedItem.carrierPersonMobNo);
                    setFieldValue("cardImg", selectedItem.cardImg);
                    setUpdate(true)
                }
            }).catch(e => console.error(e)).then(() => dispatch(setLoading(false)))
        } else {
            dispatch(setLoading(true));
            getChallanDetails().then((res: any) => {
                if (res && res.findIndex((data: any) => data.challanType === "In") > -1) {
                    const commonChallanNos = res.map((entry: any) => entry.challanNo)
                        .filter((challanNo: any) => route.params.map((entry: any) => entry.challanNo).includes(challanNo));
                    const filteredData = res.filter((entry: any) => !commonChallanNos.includes(entry.challanNo));
                    console.log(filteredData)
                    setInChallan(filteredData)
                }
            }).catch(e => console.error(e)).then(() => dispatch(setLoading(false)))
        }
    }, [route.params])
    const closeImage = () => {
        setSelectedImage(null);
    };
    const closecamaraModel = () => {
        // setIscamaraModalVisible(false);
        setIscamaraModalVisibleMaterial(false);
    };
    // const uploadProfileImage = (selectedImage: any) => {
    //     fs.readFile(selectedImage.uri, "base64").then((imgRes) => {
    //         setFieldValue("challanImg", `data:image/jpeg;base64,${imgRes}`);
    //     });
    // };
    const uploadProfileImageMaterial = (selectedImage: any) => {
        // fs.readFile(selectedImage.uri, "base64").then((imgRes) => {
        dispatch(setLoading(true))
        uploadSingleImage(selectedImage, 'card_shades').then((url) => {
            if (url)
                setFieldValue("cardImg", url);
            else
                setFieldValue("cardImg", "");
        }).catch(e => console.error(e))
            .finally(() => {
                dispatch(setLoading(false))
            })
        // });
    };
    const handleDateChange = (date: any) => {
        setFieldValue("date", date);
        setDatePickerVisible(false);
    };
    const [initialFormValues, setInitialFormValues] = useState<InitialFormValues>(
        {
            jobNo: 0,
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
            (item: any) => item.userType === "carrier"
        );
        setCarrierPersons([...carrier]);
    }, [userMaster]);

    useEffect(() => {
        dispatch(setLoading(true));
        getJobNumberCount().then((data) => {
            console.log('jobNumber----------', data);

            setFieldValue("jobNo", data)

            dispatch(setLoading(false))
        })
    }, [])
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
        status: Yup.string(),
        carrierPersonName: Yup.string().required("Carrier Person Name is required"),
        cardImg: Yup.string()
    });
    const formik = useFormik<InitialFormValues>({
        initialValues: initialFormValues,
        validationSchema: challanSchema,
        onSubmit: async (values: any) => {
            console.log(values);
            // if (update) {
            //     dispatch(setLoading(true));
            //     updateReceiveMaalDetails(values).then(async (res) => {
            //         if (res) {
            //             const data: any = await designsMaster.find(
            //                 (obj: any) =>
            //                     obj.partyUID === values.partyUID
            //                     &&
            //                     obj.designNo == values.designNo
            //             );
            //             if (data) {
            //                 const newData1 = {
            //                     ...data,
            //                     availableStocks:
            //                         Number(data.availableStocks) - Number(rowData?.piece) + Number(values.piece),
            //                 };
            //                 console.log(newData1.availableStocks);
            //                 updateDesignDetails(newData1).then((res) => {
            //                     dispatch(setLoading(false))
            //                     if (res)
            //                         dispatch(editDesignMaster({ ...newData1 }));
            //                     else
            //                         dispatch(setToast({ message: 'Something went wrong', isVisible: true, type: 'danger' }))
            //                 }).finally(() => {
            //                     resetForm();
            //                     navigation.goBack();
            //                 })
            //             }
            //         }
            //     })
            // } else {

            if (values.challanType === "In") {
                dispatch(setLoading(true))
                addReceiveMaalService(values).then((res) => {
                    if (res)
                        dispatch(addReceiveMaal(res))

                }).finally(async () => {
                    const data: any = await designsMaster.find(
                        (obj: any) =>
                            obj.partyUID === values.partyUID
                            &&
                            obj.designNo == values.designNo
                    );
                    if (data) {
                        const newData1 = {
                            ...data,
                            availableStocks:
                                Number(data.availableStocks) + Number(values.piece),
                        };
                        console.log(newData1.availableStocks);
                        updateDesignDetails(newData1).then((res) => {
                            dispatch(setLoading(false))
                            if (res)
                                dispatch(editDesignMaster({ ...newData1 }));
                            else
                                dispatch(setToast({ message: 'Something went wrong', isVisible: true, type: 'danger' }))
                        }).finally(() => {
                            resetForm();
                            navigation.goBack();
                        })
                    }
                })
            }
            // }
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
                            {update
                                ?
                                <Text style={[styles.inputLabel, { color: "grey" }]}>{values.challanNo}</Text>
                                :
                                <SelectDropdown
                                    data={inChallans}
                                    onSelect={(selectedItem) => {
                                        setFieldValue("challanNo", selectedItem.challanNo);
                                        setFieldValue("challanType", selectedItem.challanType);
                                        setFieldValue("partyName", selectedItem.partyName);
                                        setFieldValue("partyUID", selectedItem.partyUID);
                                        setFieldValue("date", new Date());
                                        setFieldValue("itemName", selectedItem.itemName);
                                        setFieldValue("piece", selectedItem.piece);
                                        setFieldValue("carrierPersonName", selectedItem.carrierPersonName);
                                        setFieldValue("carrierPersonUid", selectedItem.carrierPersonUid);
                                        setFieldValue("carrierPersonMobNo", selectedItem.carrierPersonMobNo);
                                        // setFieldValue("challanNo", selectedItem.partyName);
                                    }}
                                    buttonTextAfterSelection={(
                                        selectedItem: any,
                                        index: number
                                    ) => {
                                        return `${selectedItem?.challanNo}`;
                                    }}
                                    rowTextForSelection={(item: any, index: number) => {
                                        return `${item.challanNo}`;
                                    }}
                                    buttonStyle={{
                                        backgroundColor: "transparent",
                                        width: "60%",
                                        height: 30,
                                    }}
                                    defaultButtonText="Select Challan Number"
                                    buttonTextStyle={{
                                        textAlign: 'right'
                                    }}
                                    dropdownStyle={{ width: "60%", borderRadius: 10 }}
                                // defaultValue={null}
                                />
                            }
                        </View>
                        {errors.partyName && touched.partyName && (
                            <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>
                                {errors.partyName}
                            </Text>
                        )}
                    </View>
                    {/* <View style={[styles.inputField, { marginTop: 15 }]}>
                        <Text style={styles.inputLabel}>Job Number</Text>
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Text
                                style={{ width: "100%", fontSize: 14, color: "black" }}
                            >
                                {values.jobNo}
                            </Text>
                        </View>

                    </View> */}
                    <View style={[styles.inputField, { marginTop: 15 }]}>
                        <Text style={styles.inputLabel}>Select Design Number</Text>
                        <SelectDropdown
                            data={[...designsMaster]}
                            onSelect={(selectedItem) => {
                                setFieldValue("designNo", selectedItem.designNo);
                                setFieldValue("partyUID", selectedItem.partyUID);
                                setFieldValue("partyName", selectedItem.partyName);
                            }}
                            search={true}
                            searchPlaceHolder={"Search by Design Number"}
                            searchInputStyle={{ width:250 }}
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
                                width: "60%",
                                height: 30,
                            }}
                            defaultButtonText="Select Design Number"
                            buttonTextStyle={{
                                textAlign: 'right',
                                color: update ? "grey" : "#000"
                            }}
                            dropdownStyle={{ width: "60%", borderRadius: 10 }}
                            defaultValue={designsMaster.find(
                                (party: any) => party.partyUID === values.partyUID && party.designNo === values.designNo
                            )}
                            disabled={update}
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
                                    onPress={() => setDatePickerVisible(true)}
                                >
                                    {values.date ? formatDate(values.date) : "Select Date"}
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
                                    width: "65%",
                                    height: 30,
                                }}
                                buttonTextStyle={{
                                    textAlign: "right",
                                    color: "grey"
                                }}
                                defaultButtonText="Select Challan Type"
                                dropdownStyle={{ borderRadius: 10, width: '60%' }}
                                defaultValue={values.challanType}
                                disabled={true}
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
                                    width: "70%",
                                    height: 30,
                                }}
                                defaultButtonText="Select Party Name"
                                buttonTextStyle={{
                                    textAlign: "right",
                                    // marginRight: 0
                                    color: "grey"
                                }}
                                dropdownStyle={{ width: "60%", borderRadius: 10 }}
                                defaultValue={partyMaster.find(
                                    (party: any) => party.id === values.partyUID
                                )}
                                disabled={true}
                            />
                        </View>
                        {errors.partyName && touched.partyName && (
                            <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>
                                {errors.partyName}
                            </Text>
                        )}
                    </View>

                    <View style={{ marginTop: 10 }}>
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
                                        width: "75%",
                                        height: 30,
                                    }}
                                    defaultButtonText="Select Carrier Person"
                                    buttonTextStyle={{ textAlign: 'right', color: "grey" }}
                                    dropdownStyle={{ width: "60%", borderRadius: 10 }}
                                    defaultValue={carrierPersons.find(
                                        (person: any) =>
                                            person.useruid === values.carrierPersonUid
                                    )}
                                    disabled={true}
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
                                                {/* <TouchableOpacity
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
                                                </TouchableOpacity> */}
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
                                {update ? 'Update' : 'Receive'}
                            </Text>
                        </Pressable>
                        <Pressable
                            style={[GlobalStyle.button, { backgroundColor: 'red' }]}
                            onPress={() => { resetForm(); navigation.goBack() }}
                        >
                            <Text style={GlobalStyle.btntext}>
                                Cancel
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