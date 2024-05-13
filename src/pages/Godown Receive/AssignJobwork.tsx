import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import SelectDropdown from 'react-native-select-dropdown';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from "yup";
import { GlobalStyle } from '../../../globalStyle';
import { setLoading, setToast } from '../../redux/action/Ui/Uislice';
import { addAssignJobs } from '../../redux/action/assignJob/assignJobSlice';
import { RootState } from '../../redux/store';
import { addAssignJobService } from '../../services/jobwork/jobwork.service';
import { getStonesByID, updateStone } from '../../services/master/master.service';

interface InitialFormValues {
    challanNo: number;
    jobNo: string;
    designNo: string;
    jobwork: string;
    piece: string;
    worktype: string;
    assignTo: string;
    partyName: string;
    partyUid:string;
    stoneType: any;
    status:string;
}
const AssignJobwork = ({ navigation, route }: any) => {
    const { jobWorks } = useSelector((state: RootState) => state.jobWorks);
    const { assignJobs }: any = useSelector((state: RootState) => state.assignJobs)
    const { stoneStock }: any = useSelector((state: RootState) => state.stoneStock)
    const { designsMaster }: any = useSelector((state: RootState) => state.designMaster)
    const [maxPiece, setMaxPiece] = useState("");
    const [existingDesign, setExistingDesign] = useState<any>();
    const [selectedDesignStoneDetails, setSelectedStoneDetails] = useState<any>([]);
    const dispatch = useDispatch()
    const [initialFormValues, setInitialFormValues] = useState<InitialFormValues>(
        {
            challanNo: NaN,
            jobNo: "",
            designNo: "",
            jobwork: "",
            piece: "",
            worktype: "",
            assignTo: "",
            partyName: "",
            partyUid:"",
            stoneType: null,
            status:"PENDING"
        }
    );

    const assignSchema = Yup.object().shape({
        jobNo: Yup.string().required("Job Number is required"),
        challanNo: Yup.string().required("Challan Number is required"),
        designNo: Yup.string().required("Design number is required"),
        jobwork: Yup.string().required("Jobwork is required"),
        piece: Yup.number().required("Piece is required"),
        worktype: Yup.string().required("WorkType is required"),
    });
    const formik = useFormik<InitialFormValues>({
        initialValues: initialFormValues,
        validationSchema: assignSchema,
        onSubmit: async (values: any) => {
            if (values.piece && values.piece > 0) {
                if (values.worktype === "stone") {
                    if (values.stoneType) {
                        const stoneUsed = Number(values.stoneType?.stonesPerDesign) * Number(values.piece)
                        if (stoneUsed < values.stoneType?.availableStock) {
                            values.stoneType.availableStock = values.stoneType?.availableStock - stoneUsed;
                            delete values.stoneType.stonesPerDesign;
                            console.log('values---------------------------', values.stoneType);
                            try {
                                dispatch(setLoading(true));
                                let stoneRes = await updateStone(values.stoneType)
                                addAssignJobService(values).then((res) => {
                                    if (res) {
                                        dispatch(addAssignJobs(res))
                                    }
                                    else {
                                        dispatch(setToast({ message: 'Something went wrong', isVisible: true, type: 'danger' }))
                                    }
                                }).catch((e) => console.error(e)).finally(() => {
                                    dispatch(setLoading(false))
                                    navigation.goBack();
                                    resetForm();
                                })
                            } catch (error) {
                                dispatch(setLoading(false))
                                console.error(error)
                            }
                        }
                        else {
                            dispatch(setToast({ message: `Can't Assign Jobwork as Stone has less stock available`, isVisible: true, type: 'danger' }))
                        }
                    }
                    else {
                        dispatch(setToast({ message: 'Stone Type is required!', isVisible: true, type: 'danger' }))
                    }
                }
                else {
                    dispatch(setLoading(true));
                    addAssignJobService(values).then((res) => {
                        if (res) {
                            dispatch(addAssignJobs(res))
                        }
                        else {
                            dispatch(setToast({ message: 'Something went wrong', isVisible: true, type: 'danger' }))
                        }
                    }).catch((e) => console.error(e)).finally(() => {
                        dispatch(setLoading(false))
                        navigation.goBack();
                        resetForm();
                    })
                }
            }
            else {
                dispatch(setToast({ message: 'Pieces must be greater than 0 !', isVisible: true, type: 'danger' }))
            }
        }
    })

    const worktype = ["stone", "paper", "other"];
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
        // console.log('params--------------assign', route.params?.rowData)
        if (route.params)
            patchValues()
    }, [route.params])
    useEffect(() => {
        if (designsMaster?.length) {
            const existingDesign = designsMaster.find((data: any) => data.designNo === values.designNo);
            if (existingDesign) {
                setExistingDesign(existingDesign)
            }
        }
    }, [designsMaster, values.designNo],)
    const patchValues = () => {
        let data = route.params?.rowData;
        if (data) {
            setFieldValue("jobNo", data.jobNo)
            setFieldValue("challanNo", data.challanNo)
            setFieldValue("designNo", data.designNo)
            setFieldValue("piece", data.piece)
            setFieldValue("assignTo", data.id)
            setMaxPiece(data.piece)
        }
    }
    const getStoneStocksfromUid = (stoneData: any[]) => {
        if (stoneData?.length) {
            const stones: any[] = [];
            dispatch(setLoading(true))
            stoneData?.forEach((stone, index) => {
                getStonesByID(stone.stoneuid).then((res: any) => {
                    stones.push({ ...res, ...{ stonesPerDesign: stone.stoneunit } })
                    console.log('res', stones);
                }).finally(() => {
                    if (stoneData?.length - 1 === index) {
                        dispatch(setLoading(false))
                        setSelectedStoneDetails(stones)
                    }
                })

            })
        }
    }

    return (
        <>
            <View
                style={{
                    padding: 10,
                }}
            >
                <View style={{ marginTop: 10 }}>
                    <View style={[GlobalStyle.inputField, { width: '100%' }]}>
                        <Text style={GlobalStyle.inputLabel}>Job Number</Text>
                        <View
                            style={{
                                alignItems: "center",
                            }}
                        >
                            {/* <TextInput
                                onChangeText={handleChange("jobNo")}
                                onBlur={() => {
                                    handleBlur("jobNo");
                                }}
                                readOnly
                                value={values.jobNo}
                                style={{ fontSize: 16, color: "#000", textAlign: 'right' }}
                                placeholderTextColor="gray"
                                placeholder="Enter Job Number"
                            /> */}
                            <Text style={{ fontSize: 16, color: "#000", textAlign: 'right', padding: 10 }}>{values.jobNo}</Text>
                        </View>
                    </View>
                    {errors.jobNo && touched.jobNo && (
                        <Text
                            style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}
                        >
                            {errors.jobNo}
                        </Text>
                    )}
                </View>
                <View style={{ marginTop: 15 }}>
                    <View style={GlobalStyle.inputField}>
                        <Text style={GlobalStyle.inputLabel}>Challan No.</Text>
                        <View
                            style={{ alignItems: "center" }}
                        >
                            <Text style={{ fontSize: 16, color: "#000", textAlign: 'right', padding: 10 }}>{values.challanNo}</Text>

                        </View>
                    </View>
                    {errors.challanNo && touched.challanNo && (
                        <Text
                            style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}
                        >
                            {errors.challanNo}
                        </Text>
                    )}
                </View>
                <View style={{ marginTop: 15 }}>
                    <View style={GlobalStyle.inputField}>
                        <Text style={GlobalStyle.inputLabel}>Design No.</Text>
                        <View
                            style={{ alignItems: "center" }}
                        >
                            <TextInput
                                onChangeText={handleChange("designNo")}
                                onBlur={() => { handleBlur("designNo"); }}
                                value={values.designNo}
                                readOnly
                                style={{ fontSize: 16, color: "#000", textAlign: 'right' }}
                                placeholderTextColor="gray"
                                placeholder="Enter design number"
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
                <View style={{ marginTop: 15 }}>
                    <View style={GlobalStyle.inputField}>
                        <Text style={[GlobalStyle.inputLabel, { width: '45%' }]}>Job Work</Text>
                        <SelectDropdown
                            data={[...jobWorks]}
                            onSelect={(selectedItem) => {
                                console.log('selectedItem', selectedItem)
                                var jobs: any;
                                var pieces: any;
                                if (assignJobs?.length > 0) {
                                    jobs = assignJobs.filter((data: any) => data.assignTo === selectedItem.id)
                                    pieces = jobs.reduce((piece: Number, item: any) => {
                                        console.log(piece, item.piece)
                                        return Number(piece) + Number(item.piece);
                                    }, 0);
                                }
                                setFieldValue("jobwork", selectedItem?.workType)
                                setFieldValue("assignTo", selectedItem?.id)
                                setFieldValue("partyName", selectedItem?.partyName)
                                setFieldValue("partyUid", selectedItem?.partyUid)
                                if (jobs) {
                                    let finalPiece = Number(values.piece) - Number(pieces) || 0
                                    setFieldValue("piece", finalPiece.toString())
                                    setMaxPiece(finalPiece.toString())
                                }
                            }}
                            buttonTextAfterSelection={(
                                selectedItem: any,
                                index: number
                            ) => {
                                return `${selectedItem?.workType} - ${selectedItem?.partyName}`;
                            }}
                            rowTextForSelection={(
                                item: any,
                                index: number
                            ) => {
                                return `${item?.workType} - ${item.partyName}`;
                            }}
                            buttonStyle={{
                                backgroundColor: "transparent",
                                width: "60%",
                                padding: 0,
                                height: 50,
                            }}
                            defaultButtonText={"Select Job Work"}
                            buttonTextStyle={{
                                textAlign: "right",
                                color: "#000",
                                fontSize: 16,
                                padding: 0,
                                width: 'auto'
                            }}
                            dropdownStyle={{
                                width: '50%',
                            }}
                            defaultValue={values.jobwork}
                        />
                    </View>
                </View>
                {errors.jobwork &&
                    errors.jobwork &&
                    touched.jobwork &&
                    touched.jobwork && (
                        <Text style={GlobalStyle.errorMsg}>
                            {errors.jobwork}
                        </Text>
                    )}
                <View style={{ marginTop: 15 }}>
                    <View style={GlobalStyle.inputField}>
                        <Text style={[GlobalStyle.inputLabel, { width: '45%' }]}>Work Type</Text>
                        <SelectDropdown
                            data={[...worktype]}
                            onSelect={(selectedItem) => {
                                if (selectedItem === "stone") {
                                    const stonesData = JSON.parse(JSON.stringify(existingDesign.stoneDetails))
                                    console.log('stone Details', stonesData)
                                    getStoneStocksfromUid(stonesData)
                                }
                                setFieldValue("worktype", selectedItem)
                                setFieldValue("stoneType", "")
                            }}
                            buttonTextAfterSelection={(
                                selectedItem: any,
                                index: number
                            ) => {
                                return `${selectedItem}`;
                            }}
                            rowTextForSelection={(
                                item: any,
                                index: number
                            ) => {
                                return `${item}`;
                            }}
                            buttonStyle={{
                                backgroundColor: "transparent",
                                width: "60%",
                                padding: 0,
                                height: 50,
                            }}
                            defaultButtonText={"Select Work Type"}
                            buttonTextStyle={{
                                textAlign: "right",
                                color: "#000",
                                fontSize: 16,
                                padding: 0,
                                width: 'auto'
                            }}
                            dropdownStyle={{
                                width: '60%',
                            }}
                            defaultValue={values.worktype}
                        />
                    </View>
                    {errors.worktype &&
                        touched.worktype &&
                        <Text style={GlobalStyle.errorMsg}>
                            {errors.worktype}
                        </Text>

                    }
                </View>
                {values.worktype === "stone" &&

                    <View style={{ marginTop: 15 }}>
                        <View style={GlobalStyle.inputField}>
                            <Text style={[GlobalStyle.inputLabel, { width: '35%' }]}>Issue Stone</Text>
                            <SelectDropdown
                                data={[...selectedDesignStoneDetails]}
                                onSelect={(selectedItem) => {
                                    console.log(selectedItem);
                                    setFieldValue("stoneType", selectedItem)
                                }}
                                buttonTextAfterSelection={(
                                    selectedItem: any,
                                    index: number
                                ) => {
                                    return `${selectedItem.stoneType}- ${selectedItem.availableStock}`;
                                }}
                                rowTextForSelection={(
                                    item: any,
                                    index: number
                                ) => {
                                    return `${item.stoneType} - ${item.availableStock}`;
                                }}
                                buttonStyle={{
                                    backgroundColor: "transparent",
                                    width: "70%",
                                    padding: 0,
                                    height: 50,
                                }}
                                defaultButtonText={"Select Stones"}
                                buttonTextStyle={{
                                    textAlign: "right",
                                    color: "#000",
                                    fontSize: 16,
                                    padding: 0,
                                    width: 'auto'
                                }}
                                dropdownStyle={{
                                    width: '70%',
                                }}
                                defaultValue={values.stoneType}
                            />
                        </View>
                        {errors.stoneType &&
                            errors.stoneType &&
                            touched.stoneType &&
                            touched.stoneType && (
                                <Text style={GlobalStyle.errorMsg}>
                                    {errors?.stoneType}
                                </Text>
                            )}
                    </View>
                }
                <View style={{ marginTop: 15 }}>
                    <View style={GlobalStyle.inputField}>
                        <Text style={GlobalStyle.inputLabel}>Piece</Text>
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: 'flex-end'
                            }}
                        >
                            <TextInput
                                onChangeText={(text) => {

                                    if (parseInt(text) <= Number(maxPiece) || text === '') {
                                        setFieldValue("piece", text);
                                    }
                                    else {
                                        if (Number(maxPiece) === 0)
                                            dispatch(setToast({ message: `All Pieces has been already assigned`, isVisible: true, type: 'danger' }))
                                        else
                                            dispatch(setToast({ message: `You cannot assign more then ${maxPiece}. `, isVisible: true, type: 'danger' }))

                                    }
                                }}
                                onBlur={() => {
                                    handleBlur("piece");
                                }}
                                keyboardType={'numeric'}
                                value={values.piece}
                                style={{ fontSize: 16, color: "#000", textAlign: 'right' }}
                                placeholderTextColor="gray"
                                placeholder="Enter stone per bag"
                            />
                        </View>
                    </View>
                    {errors.piece && touched.piece && (
                        <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>
                            {errors.piece}
                        </Text>
                    )}
                </View>
                <Pressable
                    style={[GlobalStyle.button, { width: '50%', alignSelf: 'center' }]}
                    onPress={() => handleSubmit()}

                >
                    <Text style={GlobalStyle.btntext}>
                        Assign
                    </Text>
                </Pressable>
            </View>
        </>
    )
}

export default AssignJobwork