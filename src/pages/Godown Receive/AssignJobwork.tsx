import { View, Text, SafeAreaView, StatusBar, Pressable } from 'react-native'
import React, { useState } from 'react'
import { useFormik } from 'formik';
import * as yup from "yup";
import { GlobalStyle } from '../../../globalStyle';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { ScrollView } from 'react-native';
import Icon from 'react-native-easy-icon';
import { TextInput } from 'react-native-gesture-handler';
import SelectDropdown from 'react-native-select-dropdown';

interface InitialFormValues {
    jobNo: string;
    designNo: string;
    jobwork: string;
    piece: string;
}
const AssignJobwork = ({ navigation }: any) => {
    const { jobWorks } = useSelector((state: RootState) => state.jobWorks);

    const [initialFormValues, setInitialFormValues] = useState<InitialFormValues>(
        {
            jobNo: "123",
            designNo: "123",
            jobwork: "",
            piece: "",
        }
    );
    const assignSchema = yup.object().shape({
        jobNo: yup.string().required("Job Number is required"),
        designNo: yup.string().required("Design number is required"),
        jobwork: yup.string().required("Jobwork is required"),
        piece: yup.number().required("Piece is required")
    });
    const formik = useFormik<InitialFormValues>({
        initialValues: initialFormValues,
        validationSchema: assignSchema,
        onSubmit: async (values: any) => {
            console.log(values, 'values');
            navigation.goBack();
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
                            <TextInput
                                onChangeText={handleChange("jobNo")}
                                onBlur={() => {
                                    handleBlur("jobNo");
                                }}
                                readOnly
                                value={values.jobNo}
                                style={{ fontSize: 16, color: "#000", textAlign: 'right' }}
                                placeholderTextColor="gray"
                                placeholder="Enter Stone Type"
                            />
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
                                setFieldValue("jobwork", selectedItem?.workType)
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
                                width: "80%",
                                padding: 0,
                                height: 50,
                            }}
                            defaultButtonText={"Select Job Work"}
                            buttonTextStyle={{
                                textAlign: "center",
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
                        <Text style={GlobalStyle.inputLabel}>Piece</Text>
                        <View
                            style={{
                                alignItems: "center",
                                justifyContent: 'flex-end'
                            }}
                        >
                            <TextInput
                                onChangeText={handleChange("piece")}
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