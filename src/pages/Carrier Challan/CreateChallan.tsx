import React, { useEffect, useState } from 'react'
import { Image, Modal, Platform, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { GlobalStyle } from '../../../globalStyle'
import Icon from 'react-native-easy-icon'
import { useDispatch, useSelector } from 'react-redux'
import ImageUploadScreen from '../../components/imageUpload/ImageUploadScreen'
import fs, { touch } from 'react-native-fs'
import * as Yup from "yup"
import { useFormik } from 'formik'
import { RootState } from '../../redux/store'
import SelectDropdown from 'react-native-select-dropdown'
import { addChallan, editChallan } from '../../redux/action/Challan/ChallanSlice'
interface InitialFormValues {
    designNo: string,
    numberOfSample: string,
    materialImg: string,
    sampleImg: string,
    status: string,
    carrierPersonName: string,
    carrierPersonUid: string,
    carrierPersonMobNo: string,
    id: undefined,

}
const CreateChallan = ({ navigation ,route}: any) => {
    const [iscamaraModalVisible, setIscamaraModalVisible] = useState(false);
    const [iscamaraModalVisibleMaterial, setIscamaraModalVisibleMaterial] = useState(false);
    const {user}:any = useSelector((state: RootState) => state.user)
    const [update, setUpdate] = useState(false);

    const dispatch = useDispatch()
    const [sampleimg, setSampleimg] = useState<any>();
    const [selectedImage, setSelectedImage] = useState<any>();
    const { userMaster } = useSelector((state: RootState) => state.userMaster)
    const [carrierPersons, setCarrierPersons] = useState<any>([])
    const [initialFormValues, setInitialFormValues] = useState<InitialFormValues>({
        designNo: '',
        numberOfSample: '',
        materialImg: '',
        sampleImg: '',
        status: '',
        carrierPersonName: '',
        carrierPersonUid: '',
        carrierPersonMobNo: '',
        id: undefined,

    });
    const challanSchema = Yup.object().shape({
        designNo: Yup.string().required('Design Number is required'),
        numberOfSample: Yup.string().required('Number of Sample is required'),
        materialImg: Yup.string().required('Material Image is required'),
        sampleImg: Yup.string().required('Sample Image is required'),
        status: Yup.string().required('Status is required'),
        carrierPersonName: Yup.string().required('Carrier Person Name is required'),
        id: Yup.number(),
    });
    useEffect(() => {
        const carrier: any = userMaster.filter((item: any) => item.userType === "Carrier")
        setCarrierPersons([...carrier])
    }, [userMaster])
    const formik = useFormik<InitialFormValues>({
        initialValues: initialFormValues,
        validationSchema: challanSchema,
        onSubmit: async (values: any) => {
            if (update) {                
                dispatch(editChallan({ ...values }))
            } else {                
                values.id = Math.floor(2360 + Math.random() * 6438)
                dispatch(addChallan({ ...values }))
            }
            resetForm()
            navigation.goBack()

        },
    });
    const { handleChange, handleBlur, handleSubmit, values, errors, isValid, touched, setFieldValue, resetForm } = formik
useEffect(() => {
  if (route.params) {
    patchData()
    setUpdate(true)
  }else{
    setInitialFormValues({
        designNo: '',
        numberOfSample: '',
        materialImg: '',
        sampleImg: '',
        status: '',
        carrierPersonName: user.userType?user.fullName:'',
        carrierPersonUid: user.userType?user.useruid:'',
        carrierPersonMobNo: user.userType?user.mobileNumber:'',
        id: undefined,
    })
    setUpdate(false)
  }
}, [route.params])
const patchData =()=>{
    setFieldValue('designNo',route.params?.designNo)
    setFieldValue('numberOfSample',route.params?.numberOfSample)
    setFieldValue('materialImg',route.params?.materialImg)
    setFieldValue('sampleImg',route.params?.sampleImg)
    setFieldValue('status',route.params?.status)
    setFieldValue('carrierPersonName',route.params?.carrierPersonName)
    setFieldValue('carrierPersonUid',route.params?.carrierPersonUid)
    setFieldValue('carrierPersonMobNo',route.params?.carrierPersonMobNo)
    setFieldValue('id',route.params?.id)
}
    const closecamaraModel = () => {
        setIscamaraModalVisible(false)
        setIscamaraModalVisibleMaterial(false)
    }
    const uploadProfileImage = (selectedImage: any) => {
        fs.readFile(selectedImage.uri, "base64").then((imgRes) => {
            setFieldValue('sampleImg', `data:image/jpeg;base64,${imgRes}`)
        })
    }
    const uploadProfileImageMaterial = (selectedImage: any) => {
        fs.readFile(selectedImage.uri, "base64").then((imgRes) => {
            setFieldValue('materialImg', `data:image/jpeg;base64,${imgRes}`)
        })
    }
    const closeImage = () => {
        setSampleimg(null);
    };
    const closeImageModal = () => {
        setSelectedImage(null)
    }
    return (
        <>
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
                        <Text style={{ textAlign: 'center', fontSize: 20, color: '#000', fontWeight: 'bold' }}>Create Challan</Text>
                    </View>
                </View>
                <ScrollView>
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
                                style={styles.inputField}>
                                <Text style={styles.inputLabel}>Number of Sample</Text>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <TextInput
                                        onChangeText={handleChange('numberOfSample')}
                                        onBlur={() => { handleBlur('numberOfSample') }}
                                        value={values.numberOfSample}
                                        style={{ flex: 1, fontSize: 16, color: '#000' }}
                                        placeholderTextColor='gray'
                                        placeholder='Enter Number of Sample'
                                    />

                                </View>
                            </View>
                            {errors.numberOfSample && touched.numberOfSample &&
                                <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>{errors.numberOfSample}</Text>
                            }
                        </View>
                        <View style={{ marginTop: 15 }}>
                            <View
                                style={[styles.inputField, { width: '100%', height: values.materialImg ? 110 : 80 }]}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View>

                                        <Text style={styles.inputLabel}>Material Imgage</Text>
                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center',marginTop:10 }}>
                                            <Pressable onPress={() => setIscamaraModalVisibleMaterial(true)}><Text style={{color:'gray'}}>Upload Sample</Text></Pressable>
                                        </View>
                                    </View>
                                    <View>
                                        {values.materialImg && (
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
                                                        <TouchableOpacity onPress={() => setSelectedImage(values.materialImg)}>

                                                            <Image
                                                                source={{ uri: values.materialImg }}
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
                            {errors.materialImg && touched.materialImg &&
                                <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>{errors.materialImg}</Text>
                            }
                        </View>
                        <View style={{ marginTop: 15 }}>
                            <View
                                style={[styles.inputField, { width: '100%', height: values.sampleImg ? 110 : 80 }]}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View>

                                        <Text style={styles.inputLabel}>Sample Imgage</Text>
                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' ,marginTop:10}}>
                                            <Pressable onPress={() => setIscamaraModalVisible(true)}><Text style={{color:'gray'}}>Upload Sample</Text></Pressable>
                                        </View>
                                    </View>
                                    <View>
                                        {values.sampleImg && (
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
                                                        <TouchableOpacity onPress={() => setSelectedImage(values.sampleImg)}>

                                                            <Image
                                                                source={{ uri: values.sampleImg }}
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
                        <View style={{ marginTop: 15 }}>
                            <View
                                style={styles.inputField}>
                                <Text style={styles.inputLabel}>Status</Text>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <SelectDropdown
                                        data={['Dispatch', 'In Transit', "Shipped", 'Completed']}
                                        onSelect={(selectedItem) => {
                                            setFieldValue('status', selectedItem)
                                        }}
                                        buttonStyle={{ backgroundColor: 'transparent',width:'100%'}}
                                        defaultButtonText='Select Status'
                                        buttonTextStyle={{ textAlign: 'left', marginLeft: -6 }}
                                        dropdownStyle={{ width: '80%', borderRadius: 10 }}
                                        defaultValue={values.status}
                                    />

                                </View>
                            </View>
                            {errors.status && touched.status &&
                                <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>{errors.status}</Text>
                            }
                        </View>
                        {user.userType !=="Carrier" &&
                        <View style={{ marginTop: 15 }}>
                            <View
                                style={styles.inputField}>
                                <Text style={styles.inputLabel}>Carrier Person</Text>
                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <SelectDropdown
                                        data={[...carrierPersons]}
                                        onSelect={(selectedItem) => {
                                            setFieldValue('carrierPersonName', selectedItem.fullName)
                                            setFieldValue('carrierPersonUid', selectedItem.useruid)
                                            setFieldValue('carrierPersonMobNo', selectedItem.mobileNumber)
                                        }}
                                        buttonTextAfterSelection={(selectedItem: any, index: number) => {
                                            return `${selectedItem?.fullName}`
                                        }}
                                        rowTextForSelection={(item: any, index: number) => {
                                            return `${item.fullName}`;
                                        }}
                                        buttonStyle={{ backgroundColor: 'transparent',width:'100%'}}
                                        defaultButtonText='Select Carrier Person'
                                        buttonTextStyle={{ textAlign: 'left', marginLeft: -6 }}
                                        dropdownStyle={{ width: '80%', borderRadius: 10 }}
                                        defaultValue={carrierPersons.find((person:any) => person.useruid === values.carrierPersonUid)}
                                    />

                                </View>
                            </View>
                            {errors.carrierPersonName && touched.carrierPersonName &&
                                <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>{errors.carrierPersonName}</Text>
                            }
                        </View>}
                        <Pressable style={GlobalStyle.button} onPress={() => handleSubmit()}>
                            <Text style={GlobalStyle.btntext}>{update?'Update':'Submit'}</Text>
                        </Pressable>
                    </View>
                </ScrollView>

            </SafeAreaView>
            {
                iscamaraModalVisible && <ImageUploadScreen isVisible={iscamaraModalVisible} onClose={closecamaraModel} uploadFunction={uploadProfileImage}
                />
            }
            {
                iscamaraModalVisibleMaterial && <ImageUploadScreen isVisible={iscamaraModalVisibleMaterial} onClose={closecamaraModel} uploadFunction={uploadProfileImageMaterial}
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
        </>
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
export default CreateChallan
