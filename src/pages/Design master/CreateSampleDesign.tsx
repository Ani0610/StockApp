import React, { useEffect, useState } from 'react'
import { Pressable, SafeAreaView, ScrollView, StatusBar, Text, View, Image, StyleSheet, ImageBackground, TextInput, Modal, Platform, TouchableOpacity } from 'react-native'
import Icon from 'react-native-easy-icon'
import { GlobalStyle } from '../../../globalStyle'
import { FieldArray, FormikProvider, useFormik } from 'formik'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import SelectDropdown from 'react-native-select-dropdown';
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import ImageUploadScreen from '../../components/imageUpload/ImageUploadScreen'
import fs, { touch } from 'react-native-fs'
import * as Yup from "yup"

interface InitialFormValues {
    designNo: string,
    sampleImg: string,
    stoneDetails: any,
    designDetails: any,
    jobworkDetails: any,
    totalstones: string,
    totlDesigns: string,
    totalJobWorks: string,
    total: string,
    id: undefined,

}
const CreateSampleDesign = ({ navigation }: any) => {
    const { stone } = useSelector((state: RootState) => state.stone)
    const { designs } = useSelector((state: RootState) => state.designs)
    const { jobWorks } = useSelector((state: RootState) => state.jobWorks)
    const [iscamaraModalVisible, setIscamaraModalVisible] = useState(false);
    const [sampleimg, setSampleimg] = useState<any>();
    const [selectedImage, setSelectedImage] = useState<any>();
    const [initialFormValues, setInitialFormValues] = useState<InitialFormValues>({
        designNo: '',
        sampleImg: '',
        stoneDetails: [{
            stoneType: '',
            stoneunit: '',
            stoneuid: '',
            totalOneStone: '',
            price: ''
        }],
        designDetails: [
            {
                measurement: '',
                designunit: '',
                designuid: '',
                totalOneDesign: '',
                price: ''
            }
        ],
        jobworkDetails: [{
            partyName: '',
            workType: '',
            unit: '',
            jobuid: '',
            totalOnewJobWork: '',
            price: ''
        }],
        totalstones: '',
        totlDesigns: '',
        totalJobWorks: '',
        total: '',
        id: undefined,
    });
    const sampleSchema = Yup.object().shape({
        designNo: Yup.string().required('Design Number is required'),
        sampleImg: Yup.string().required('Sample Image is required'),
        stoneDetails: Yup.array().of(
            Yup.object().shape({
                stoneType: Yup.string().required('Stone Type is required'),
                stoneunit: Yup.string().required('Stone Unit is required'),
                stoneuid: Yup.string().required('Stone UID is required'),
                totalOneStone: Yup.number().required('Total One Stone is required'),
                price: Yup.number().required('Price is required'),
            })
        ),
        designDetails: Yup.array().of(
            Yup.object().shape({
                measurement: Yup.string().required('Measurement is required'),
                designunit: Yup.string().required('Design Unit is required'),
                designuid: Yup.string().required('Design UID is required'),
                totalOneDesign: Yup.number().required('Total One Design is required'),
                price: Yup.number().required('Price is required'),
            })
        ),
        jobworkDetails: Yup.array().of(
            Yup.object().shape({
                partyName: Yup.string().required('Party Name is required'),
                workType: Yup.string().required('Work Type is required'),
                unit: Yup.string().required('Unit is required'),
                jobuid: Yup.string().required('Job UID is required'),
                totalOnewJobWork: Yup.number().required('Total One Job Work is required'),
                price: Yup.number().required('Price is required'),
            })
        ),
        totalstones: Yup.number().required('Total Stones is required'),
        totlDesigns: Yup.number().required('Total Designs is required'),
        totalJobWorks: Yup.number().required('Total Job Works is required'),
        total: Yup.number().required('Total is required'),
        id: Yup.number(),
    });
    const formik = useFormik<InitialFormValues>({
        initialValues: initialFormValues,
        validationSchema: sampleSchema,
        onSubmit: async (values: any) => {
            console.log(values, 'sample design');
            resetForm()
            navigation.goBack()

        },
    });
    // { console.log(formik.values, 'new formik') }
    const { handleChange, handleBlur, handleSubmit, values, errors, isValid, touched, setFieldValue, resetForm } = formik

    useEffect(() => {
        totalofStone()
    }, [values.stoneDetails])
    useEffect(() => {
        totalofDesign()
    }, [values.designDetails])
    useEffect(() => {
        totalofJobwork()
    }, [values.jobworkDetails])
    const totalofStone = async () => {
        const total = await values.stoneDetails.reduce((stone: any, item: any) => Number(stone) + Number(item.totalOneStone), 0);
        setFieldValue('totalstones', total);
        const totalAmount = (values.totlDesigns ? Number(values.totlDesigns) : 0) + (values.totalJobWorks ? Number(values.totalJobWorks) : 0) + total
        setFieldValue('total', totalAmount);
    }

    const totalofDesign = async () => {
        const total = values.designDetails.reduce((design: any, item: any) => design + item.totalOneDesign, 0);
        setFieldValue('totlDesigns', total);
        setFieldValue('total', (values.totalstones ? Number(values.totalstones) : 0) + (total) + (values.totalJobWorks ? Number(values.totalJobWorks) : 0));
    }

    const totalofJobwork = async () => {
        const total = await values.jobworkDetails?.reduce((job: any, item: any) => job + item.totalOnewJobWork, 0);
        setFieldValue('totalJobWorks', total);
        setFieldValue('total', (values.totalstones ? Number(values.totalstones) : 0) + (values.totlDesigns ? Number(values.totlDesigns) : 0) + (total));
    }

    const closecamaraModel = () => {
        setIscamaraModalVisible(false)
    }
    const uploadProfileImage = (selectedImage: any) => {
        console.log('uploades image', selectedImage);
        fs.readFile(selectedImage.uri, "base64").then((imgRes) => {
            setFieldValue('sampleImg', `data:image/jpeg;base64,${imgRes}`)
            setSampleimg(`data:image/jpeg;base64,${imgRes}`)
        })
    }
    const closeImage = () => {
        setFieldValue('sampleImg', '')
        setSampleimg(null);
    };
    const closeImageModal = () => {
        setSelectedImage(null)
    }
    return (
        <SafeAreaView style={[GlobalStyle.safeAreaCotainer, { height: '100%' }]}>
            <StatusBar
                backgroundColor="#fff"
                barStyle="dark-content" // Here is where you change the font-color
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20, marginTop: 15 }}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.goBack()}>
                    <Icon type="feather" name="arrow-left" color='#000' size={35} />
                </TouchableOpacity>
                <View style={{ flex: 5, justifyContent: 'center', alignItems: 'center', marginLeft: -35 }}>
                    <Text style={{ textAlign: 'center', fontSize: 20, color: '#000', fontWeight: 'bold' }}>Create Design</Text>
                </View>
            </View>
            <GestureHandlerRootView>
                <ScrollView>
                    <FormikProvider value={formik}>
                        <View style={{
                            padding: 20
                        }}>

                            <View style={{ marginTop: 10 }}>
                                <View
                                    style={styles.inputField}>
                                    <Text style={styles.inputLabel}>Design No</Text>
                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <TextInput
                                            onChangeText={handleChange('designNo')}
                                            onBlur={() => { handleBlur('designNo') }}
                                            value={values.designNo}
                                            style={{ flex: 1, fontSize: 16, color: '#000' }}
                                            placeholderTextColor='gray'
                                            placeholder='Enter design No'
                                        />

                                    </View>
                                </View>
                                {errors.designNo && touched.designNo &&
                                    <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>{errors.designNo}</Text>
                                }
                            </View>
                            <View style={{ marginTop: 15 }}>
                                <View
                                    style={[styles.inputField, { width: '100%', height: sampleimg ? 110 : 55 }]}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View>

                                            <Text style={styles.inputLabel}>Sample Imgage</Text>
                                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                <Pressable onPress={() => setIscamaraModalVisible(true)}><Text>Upload Sample</Text></Pressable>
                                            </View>
                                        </View>
                                        <View>
                                            {sampleimg && (
                                                <View style={{ width: '100%' }}>
                                                    <View style={{
                                                        borderTopLeftRadius: 5,
                                                        borderTopRightRadius: 15,
                                                        padding: 10,
                                                        width: '30%',
                                                    }}>
                                                        <View style={{
                                                            width: '100%',
                                                            aspectRatio: 1, // Create a perfect square
                                                            // overflow: 'hidden', // Hide any content outside the square
                                                            borderWidth: 2, // Add a border for a circular shape
                                                            borderColor: 'white',
                                                            borderRadius: 10
                                                        }}>
                                                            <TouchableOpacity onPress={() => setSelectedImage(sampleimg)}>

                                                                <Image
                                                                    source={{ uri: sampleimg }}
                                                                    style={{
                                                                        width: 80,
                                                                        height: 80,
                                                                        resizeMode: 'cover', // Cover the entire circle
                                                                    }}
                                                                />
                                                            </TouchableOpacity>
                                                        </View>
                                                        <TouchableOpacity
                                                            style={{
                                                                position: 'absolute',
                                                                left: 80,
                                                                backgroundColor: 'black',
                                                                borderRadius: 50,
                                                                width: 28,
                                                                height: 28,
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}
                                                            onPress={closeImage}
                                                        >
                                                            <Icon type="entypo" name="cross" color="white" size={20} />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </View>
                                {errors.sampleImg && touched.sampleImg &&
                                    <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>{errors.sampleImg}</Text>
                                }
                            </View>

                            <View style={{ marginTop: 10 }}>

                                <FieldArray name="stoneDetails">
                                    {({ replace, remove, push }) => (
                                        <View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Stone Details</Text>
                                                <Pressable onPress={() => push({
                                                    stoneType: '',
                                                    stoneunit: '',
                                                    stoneuid: '',
                                                    price: '',
                                                    totalOneStone: '',
                                                })}>
                                                    <Icon type="feather" name="plus" color="blue" size={25} />
                                                </Pressable>
                                            </View>
                                            {values.stoneDetails?.length > 0 &&
                                                values.stoneDetails.map((stone1: any, i: any) => (
                                                    <View key={i} style={[{
                                                        // backgroundColor: '#f5f5f5',
                                                        borderRadius: 10,
                                                        // paddingVertical: 15,
                                                        // paddingHorizontal: 20,
                                                        width: '100%',
                                                        // marginVertical: 10,
                                                    }, { borderWidth: 0.5, borderColor: 'lightgray', padding: 5, marginVertical: 5 }]}>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                            <Pressable onPress={() => remove(i)} >
                                                                <Icon type="entypo" name="cross" color="black" size={25} />
                                                            </Pressable>
                                                        </View>
                                                        <View>
                                                            <View style={{ marginTop: 10 }}>
                                                                <View
                                                                    style={styles.inputField}>
                                                                    <Text style={styles.inputLabel}>Stone Type</Text>
                                                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                                        <SelectDropdown
                                                                            data={[...stone]}
                                                                            onSelect={(selectedItem) => {
                                                                                replace(i, { ...stone1, stoneType: selectedItem.stoneType, price: selectedItem.pricePerStone, stoneuid: selectedItem.id })
                                                                            }}
                                                                            buttonTextAfterSelection={(selectedItem: any, index: number) => {
                                                                                return `${selectedItem?.stoneType}`
                                                                            }}
                                                                            rowTextForSelection={(item: any, index: number) => {
                                                                                return `${item?.stoneType}`;
                                                                            }}
                                                                            buttonStyle={{ backgroundColor: 'transparent', height: 20 }}
                                                                            defaultButtonText='Select stone Type'
                                                                            buttonTextStyle={{ textAlign: 'left', marginLeft: -6 }}
                                                                            dropdownStyle={{ width: '80%', borderRadius: 10 }}
                                                                            defaultValue={''}
                                                                        />
                                                                    </View>
                                                                </View>
                                                                {errors.stoneDetails && errors.stoneDetails[i].stoneType && touched.stoneDetails && touched.stoneDetails[i].stoneType &&
                                                                    <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>{errors.stoneDetails[i].stoneType}</Text>
                                                                }
                                                            </View>
                                                            <View style={{ marginTop: 15 }}>
                                                                <View
                                                                    style={styles.inputField}>
                                                                    <Text style={styles.inputLabel}>Price</Text>
                                                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                                        <TextInput
                                                                            onChangeText={handleChange('price')}
                                                                            editable={false}
                                                                            onBlur={() => { handleBlur('price') }}
                                                                            value={stone1.price.toString()}
                                                                            style={{ flex: 1, fontSize: 16, color: '#000' }}
                                                                            placeholderTextColor='gray'
                                                                            placeholder='Enter price'
                                                                        />

                                                                    </View>
                                                                </View>
                                                                {errors.stoneDetails && errors.stoneDetails[i].price && touched.stoneDetails && touched.stoneDetails[i].price &&
                                                                    <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>{errors.stoneDetails[i].price}</Text>
                                                                }
                                                            </View>
                                                            <View style={{ marginTop: 15 }}>
                                                                <View
                                                                    style={styles.inputField}>
                                                                    <Text style={styles.inputLabel}>Unit</Text>
                                                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                                        <TextInput
                                                                            onChangeText={async (text: any) => {
                                                                                replace(i, { ...stone1, stoneunit: text, totalOneStone: text * stone1.price })
                                                                            }}
                                                                            value={stone1.stoneunit}
                                                                            style={{ flex: 1, fontSize: 16, color: '#000' }}
                                                                            placeholderTextColor='gray'
                                                                            placeholder='Enter unit'
                                                                        />

                                                                    </View>
                                                                </View>
                                                                {errors.stoneDetails && errors.stoneDetails[i].stoneunit && touched.stoneDetails && touched.stoneDetails[i].stoneunit &&
                                                                    <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>{errors.stoneDetails[i].stoneunit}</Text>
                                                                }
                                                            </View>

                                                        </View>
                                                    </View>
                                                ))
                                            }

                                        </View>
                                    )}
                                </FieldArray>
                            </View>
                            <View style={{ marginTop: 10 }}>

                                <FieldArray name="designDetails">
                                    {({ replace, remove, push }) => (
                                        <View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Design Details</Text>
                                                <Pressable onPress={() => push({
                                                    measurement: '',
                                                    designunit: '',
                                                    designuid: '',
                                                    price: '',
                                                    totalOneDesign: ''

                                                })}>
                                                    <Icon type="feather" name="plus" color="blue" size={25} />
                                                </Pressable>
                                            </View>
                                            {values.designDetails?.length > 0 &&
                                                values.designDetails.map((design: any, i: any) => (
                                                    <View key={i} style={[{
                                                        // backgroundColor: '#f5f5f5',
                                                        borderRadius: 10,
                                                        // paddingVertical: 15,
                                                        // paddingHorizontal: 20,
                                                        width: '100%',
                                                        // marginVertical: 10,
                                                    }, { borderWidth: 0.5, borderColor: 'lightgray', padding: 5, marginVertical: 5 }]}>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                            <Pressable onPress={() => remove(i)} >
                                                                <Icon type="entypo" name="cross" color="black" size={25} />
                                                            </Pressable>
                                                        </View>
                                                        <View>
                                                            <View style={{ marginTop: 10 }}>
                                                                <View
                                                                    style={styles.inputField}>
                                                                    <Text style={styles.inputLabel}>Measurement</Text>
                                                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                                        <SelectDropdown
                                                                            data={[...designs]}
                                                                            onSelect={(selectedItem) => {
                                                                                replace(i, { ...design, measurement: selectedItem.mesurement, price: selectedItem.price, designuid: selectedItem.id })


                                                                            }}
                                                                            buttonTextAfterSelection={(selectedItem: any, index: number) => {
                                                                                return `${selectedItem?.mesurement}`
                                                                            }}
                                                                            rowTextForSelection={(item: any, index: number) => {
                                                                                return `${item?.mesurement}`;
                                                                            }}
                                                                            buttonStyle={{ backgroundColor: 'transparent', height: 20 }}
                                                                            defaultButtonText='Select Design'
                                                                            buttonTextStyle={{ textAlign: 'left', marginLeft: -6 }}
                                                                            dropdownStyle={{ width: '80%', borderRadius: 10 }}
                                                                            defaultValue={''}
                                                                        />
                                                                    </View>
                                                                </View>
                                                                {errors.designDetails && errors.designDetails[i].measurement && touched.designDetails && touched.designDetails[i].measurement &&
                                                                    <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>{errors.designDetails[i].measurement}</Text>
                                                                }
                                                            </View>
                                                            <View style={{ marginTop: 15 }}>
                                                                <View
                                                                    style={styles.inputField}>
                                                                    <Text style={styles.inputLabel}>Price</Text>
                                                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                                        <TextInput
                                                                            onChangeText={handleChange('price')}
                                                                            onBlur={() => { handleBlur('price') }}
                                                                            value={design.price.toString()}
                                                                            style={{ flex: 1, fontSize: 16, color: '#000' }}
                                                                            placeholderTextColor='gray'
                                                                            placeholder='Enter price'
                                                                            editable={false}
                                                                        />

                                                                    </View>
                                                                </View>
                                                                {errors.designDetails && errors.designDetails[i].price && touched.designDetails && touched.designDetails[i].price &&
                                                                    <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>{errors.designDetails[i].price}</Text>
                                                                }
                                                            </View>
                                                            <View style={{ marginTop: 15 }}>
                                                                <View
                                                                    style={styles.inputField}>
                                                                    <Text style={styles.inputLabel}>Unit</Text>
                                                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                                        <TextInput
                                                                            onChangeText={(text: any) => {
                                                                                replace(i, { ...design, designunit: text, totalOneDesign: text * design.price })
                                                                            }}
                                                                            value={design.designunit}
                                                                            style={{ flex: 1, fontSize: 16, color: '#000' }}
                                                                            placeholderTextColor='gray'
                                                                            placeholder='Enter unit'
                                                                        />

                                                                    </View>
                                                                </View>
                                                                {errors.designDetails && errors.designDetails[i].designunit && touched.designDetails && touched.designDetails[i].designunit &&
                                                                    <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>{errors.designDetails[i].designunit}</Text>
                                                                }
                                                            </View>

                                                        </View>
                                                    </View>
                                                ))
                                            }
                                        </View>
                                    )}
                                </FieldArray>
                            </View>
                            <View style={{ marginTop: 10 }}>

                                <FieldArray name="jobworkDetails">
                                    {({ replace, remove, push }) => (
                                        <View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Job Details</Text>
                                                <Pressable onPress={() => push({
                                                    partyName: '',
                                                    workType: '',
                                                    unit: '',
                                                    jobuid: '',
                                                    price: '',
                                                    totalOnewJobWork: '',
                                                })}>
                                                    <Icon type="feather" name="plus" color="blue" size={25} />
                                                </Pressable>
                                            </View>
                                            {values.jobworkDetails?.length > 0 &&
                                                values.jobworkDetails.map((job: any, i: any) => (
                                                    <View key={i} style={[{
                                                        // backgroundColor: '#f5f5f5',
                                                        borderRadius: 10,
                                                        // paddingVertical: 15,
                                                        // paddingHorizontal: 20,
                                                        width: '100%',
                                                        // marginVertical: 10,
                                                    }, { borderWidth: 0.5, borderColor: 'lightgray', padding: 5, marginVertical: 5 }]}>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                            <Pressable onPress={() => remove(i)} >
                                                                <Icon type="entypo" name="cross" color="black" size={25} />
                                                            </Pressable>
                                                        </View>
                                                        <View>
                                                            <View style={{ marginTop: 10 }}>
                                                                <View
                                                                    style={styles.inputField}>
                                                                    <Text style={styles.inputLabel}>Work Type</Text>
                                                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                                        <SelectDropdown
                                                                            data={[...jobWorks]}
                                                                            onSelect={(selectedItem) => {
                                                                                replace(i, { ...job, workType: selectedItem.workType, price: selectedItem.price, jobuid: selectedItem.id, partyName: selectedItem.partyName })
                                                                            }}
                                                                            buttonTextAfterSelection={(selectedItem: any, index: number) => {
                                                                                return `${selectedItem?.workType}`
                                                                            }}
                                                                            rowTextForSelection={(item: any, index: number) => {
                                                                                return `${item?.workType} - ${item.partyName}`;
                                                                            }}
                                                                            buttonStyle={{ backgroundColor: 'transparent', height: 20 }}
                                                                            defaultButtonText='Select Work Type'
                                                                            buttonTextStyle={{ textAlign: 'left', marginLeft: -6 }}
                                                                            dropdownStyle={{ width: '80%', borderRadius: 10 }}
                                                                            defaultValue={''}
                                                                        />
                                                                    </View>
                                                                </View>
                                                                {errors.jobworkDetails && errors.jobworkDetails[i].workType && touched.jobworkDetails && touched.jobworkDetails[i].workType &&
                                                                    <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>{errors.jobworkDetails[i].workType}</Text>
                                                                }
                                                            </View>
                                                            <View style={{ marginTop: 15 }}>
                                                                <View
                                                                    style={styles.inputField}>
                                                                    <Text style={styles.inputLabel}>Party Name</Text>
                                                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                                        <TextInput
                                                                            onChangeText={handleChange('partyName')}
                                                                            onBlur={() => { handleBlur('partyName') }}
                                                                            value={job.partyName}
                                                                            style={{ flex: 1, fontSize: 16, color: '#000' }}
                                                                            placeholderTextColor='gray'
                                                                            placeholder='Enter party Name'
                                                                            editable={false}
                                                                        />

                                                                    </View>
                                                                </View>
                                                                {errors.jobworkDetails && errors.jobworkDetails[i].partyName && touched.jobworkDetails && touched.jobworkDetails[i].partyName &&
                                                                    <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>{errors.jobworkDetails[i].partyName}</Text>
                                                                }
                                                            </View>
                                                            <View style={{ marginTop: 15 }}>
                                                                <View
                                                                    style={styles.inputField}>
                                                                    <Text style={styles.inputLabel}>Price</Text>
                                                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                                        <TextInput
                                                                            onChangeText={handleChange('price')}
                                                                            onBlur={() => { handleBlur('price') }}
                                                                            value={job.price.toString()}
                                                                            style={{ flex: 1, fontSize: 16, color: '#000' }}
                                                                            placeholderTextColor='gray'
                                                                            placeholder='Enter price'
                                                                            editable={false}
                                                                        />

                                                                    </View>
                                                                </View>
                                                                {errors.jobworkDetails && errors.jobworkDetails[i].price && touched.jobworkDetails && touched.jobworkDetails[i].price &&
                                                                    <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>{errors.jobworkDetails[i].price}</Text>
                                                                }
                                                            </View>

                                                            <View style={{ marginTop: 15 }}>
                                                                <View
                                                                    style={styles.inputField}>
                                                                    <Text style={styles.inputLabel}>Unit</Text>
                                                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                                        <TextInput
                                                                            onChangeText={(text: any) => {
                                                                                replace(i, { ...job, unit: text, totalOnewJobWork: text * Number(job.price) })
                                                                            }}
                                                                            value={job.unit}
                                                                            style={{ flex: 1, fontSize: 16, color: '#000' }}
                                                                            placeholderTextColor='gray'
                                                                            placeholder='Enter unit'
                                                                        />

                                                                    </View>
                                                                </View>
                                                                {errors.jobworkDetails && errors.jobworkDetails[i].unit && touched.jobworkDetails && touched.jobworkDetails[i].unit &&
                                                                    <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>{errors.jobworkDetails[i].unit}</Text>
                                                                }
                                                            </View>

                                                        </View>
                                                    </View>
                                                ))
                                            }

                                        </View>
                                    )}
                                </FieldArray>
                            </View>


                            <View style={{ marginTop: 10 }}>
                                <View
                                    style={styles.inputField}>
                                    <Text style={styles.inputLabel}>Total</Text>
                                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <TextInput
                                            onChangeText={handleChange('total')}
                                            onBlur={() => { handleBlur('total') }}
                                            value={values.total.toString()}
                                            style={{ flex: 1, fontSize: 16, color: '#000' }}
                                            placeholderTextColor='gray'
                                            placeholder='Enter total'
                                            editable={false}
                                        />

                                    </View>
                                </View>
                                {errors.total && touched.total &&
                                    <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>{errors.total}</Text>
                                }
                            </View>
                            <Pressable style={GlobalStyle.button} onPress={() => handleSubmit()}>
                                <Text style={GlobalStyle.btntext}>{'Submit'}</Text>
                            </Pressable>
                        </View>
                    </FormikProvider>
                </ScrollView>
            </GestureHandlerRootView>
            {
                iscamaraModalVisible && <ImageUploadScreen isVisible={iscamaraModalVisible} onClose={closecamaraModel} uploadFunction={uploadProfileImage}
                />
            }
            {selectedImage && (
                <Modal transparent={true} animationType="fade" visible={selectedImage !== null}>
                    <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center', paddingTop: Platform.OS == 'ios' ? 25 : 0 }}>
                        <Image source={{ uri: selectedImage }} style={{ width: '90%', height: '90%', resizeMode: 'contain' }} />
                        <TouchableOpacity style={{ position: 'absolute', top: Platform.OS === "ios" ? 60 : 20, right: 20 }} onPress={closeImageModal}>
                            <Icon type="entypo" name="cross" color="white" size={30} />
                        </TouchableOpacity>
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({

    inputField: {
        backgroundColor: '#F9F9F9',
        borderRadius: 15,
        fontSize: 16,
        padding: 10,
    },
    inputLabel: { color: '#05E3D5', fontSize: 14 },
});
export default CreateSampleDesign
