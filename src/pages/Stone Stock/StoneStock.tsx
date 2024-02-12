import React, { useState } from 'react'
import { Dimensions, Modal, Platform, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { GlobalStyle } from '../../../globalStyle'
import Icon from 'react-native-easy-icon'
import { ScrollView } from 'react-native-gesture-handler'
import { useFormik } from 'formik'
import * as yup from "yup"
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { deleteStone } from '../../redux/action/StoneDetails/stoneSlice'
import SelectDropdown from 'react-native-select-dropdown'
import { addStonestock, editstoneStock } from '../../redux/action/Stone Stock/stoneStock'
var heightY = Dimensions.get("window").height;

interface InitialFormValues {
    stoneType: string,
    price: string,
    stonePerBag: string,
    pricePerStone: number,
    avilablestone: number,
    totalBags: string,
    id: undefined,

}
const StoneStock = () => {
    const [showModal, setShowModal] = useState(false);
    const [update, setUpdate] = useState(false);
    const [data, setdata] = useState<any | null>(null); // Track the selected card's ID
    const [isVisible, setisVisible] = useState(false);
    const stoneSchema = yup.object().shape({
        stoneType: yup.string().required('Stone Type is required'),
        stonePerBag: yup.string().required('Stone per bag is required'),
        price: yup.string().required('Price is required')
    })
    const { stone } = useSelector((state: RootState) => state.stone)
    const { stoneStock } = useSelector((state: RootState) => state.stoneStock)
    const dispatch = useDispatch()
    const [initialFormValues, setInitialFormValues] = useState<InitialFormValues>({
        stoneType: '',
        price: '',
        stonePerBag: '',
        pricePerStone: 0,
        avilablestone: 0,
        totalBags: '',
        id: undefined
    });
    const formik = useFormik<InitialFormValues>({
        initialValues: initialFormValues,
        validationSchema: stoneSchema,
        onSubmit: (async (values: any) => {
            values.avilablestone = Number((values.stonePerBag * values.totalBags))
            if (update) {
                dispatch(editstoneStock({ ...values }))

            } else {
                values.id = Math.floor(2000 + Math.random() * 9000)
                dispatch(addStonestock({ ...values }))
            }
            setShowModal(false)
            setUpdate(false)
            resetForm();
        }),
    });
    const { handleChange, handleBlur, handleSubmit, values, errors, isValid, touched, setFieldValue, resetForm } = formik
    const selectCard = (item: number) => {
        setisVisible(true)
        setdata(item);
    };
    const onClose = () => {
        setisVisible(false)
    }
    const editStoneStock = () => {
        setFieldValue('stoneType', data.stoneType)
        setFieldValue('stonePerBag', data.stonePerBag)
        setFieldValue('pricePerStone', data.pricePerStone)
        setFieldValue('avilablestone', data.avilablestone)
        setFieldValue('totalBags', data.totalBags)
        setFieldValue('price', data.price)
        setFieldValue('id', data.id)
        setUpdate(true)
        setisVisible(false)
        setShowModal(true)
    }
    const deleteStoneStock = () => {
        dispatch(deleteStone(data))
        setisVisible(false)
    }
    const handleClose = () => {
        setShowModal(false)
        setUpdate(false)
        resetForm()
    }
    return (
        <>
            <SafeAreaView style={[GlobalStyle.safeAreaCotainer, { height: '100%' }]}>
                <StatusBar
                    backgroundColor="#fff"
                    barStyle="dark-content" // Here is where you change the font-color
                />
                <ScrollView>
                    <View style={[GlobalStyle.container]}>
                        <View>
                            {stoneStock?.map((item: any, i: any) => (
                                <View key={i} style={[GlobalStyle.card, GlobalStyle.shadowProp, {
                                    paddingVertical: 8,
                                    paddingHorizontal: 8,
                                    height: 'auto',
                                    flexDirection: 'row'
                                }]}>
                                    <View style={GlobalStyle.leftSide}>
                                        <Text style={GlobalStyle.label}>Stone Type</Text>
                                        <Text style={GlobalStyle.label}>Stones</Text>
                                        <Text style={GlobalStyle.label}>Price</Text>
                                        <Text style={GlobalStyle.label}>Stone Price</Text>
                                        <Text style={GlobalStyle.label}>Stone Stock</Text>

                                    </View>
                                    <View style={GlobalStyle.middleSide}>
                                        <Text style={GlobalStyle.textcolor} numberOfLines={1} ellipsizeMode="tail">{item.stoneType}</Text>
                                        <Text style={GlobalStyle.textcolor} numberOfLines={1} ellipsizeMode="tail">{item.stonePerBag}(1 Bag)</Text>
                                        <Text style={GlobalStyle.textcolor} numberOfLines={1} ellipsizeMode="tail">{item.price}₹(1 Bag)</Text>
                                        <Text style={GlobalStyle.textcolor} numberOfLines={1} ellipsizeMode="tail">{item.pricePerStone}₹(1 Stone)</Text>
                                        <Text style={GlobalStyle.textcolor} numberOfLines={1} ellipsizeMode="tail">{item.avilablestone}</Text>

                                    </View>
                                    <View style={GlobalStyle.rightSide}>
                                        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                            <Pressable onPress={() => selectCard(item)}>
                                                <Icon type="feather" name="more-vertical" color="gray" size={30} />
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
                <Pressable style={{ position: 'absolute', bottom: 40, right: 20, backgroundColor: 'blue', padding: 16, borderRadius: 50 }} onPress={() => setShowModal(true)}>
                    <Icon type="feather" name="plus" color="white" size={35} />
                </Pressable>
            </SafeAreaView>
            {isVisible &&
                <Modal visible={isVisible} animationType="slide"
                    transparent={true} onRequestClose={onClose} onPointerDown={onClose}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }} onTouchEnd={onClose}>
                        <View style={{
                            height: "20%",
                            width: "100%",
                            marginTop: 'auto',
                            backgroundColor: 'white',
                            elevation: 5,
                            borderTopLeftRadius: 15,
                            borderTopRightRadius: 15
                        }}>

                            <TouchableOpacity onPress={() => editStoneStock()} style={[GlobalStyle.btn, { borderRadius: 15 }]}>
                                <Icon type="feather" name="edit" color="gray" size={25} />
                                <Text style={{ color: 'gray', marginLeft: 10, fontWeight: 'bold', fontSize: 18 }}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteStoneStock()} style={[GlobalStyle.btn, { borderRadius: 15 }]}>
                                <Icon type="feather" name="delete" color="gray" size={25} />
                                <Text style={{ color: 'gray', marginLeft: 10, fontWeight: 'bold', fontSize: 18 }}>Delete</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onClose} style={GlobalStyle.btn}>
                                <Icon type="entypo" name="cross" color="gray" size={25} />
                                <Text style={{ color: 'gray', marginLeft: 10, fontWeight: 'bold', fontSize: 18 }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            }
            {showModal &&
                <Modal visible={showModal} transparent={false} animationType="slide">
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, marginVertical: Platform.OS === "ios" ? 30 : 0, zIndex: 0 }}>
                        <View style={{
                            margin: 20,
                            flex: 1,
                            width: '100%'
                        }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ color: 'black', fontSize: 20 }}>Add Stone Details</Text>
                                <Pressable onPress={() => handleClose()} >
                                    <Icon type="entypo" name="cross" color="black" size={35} />
                                </Pressable>
                            </View>

                            <View style={{
                                padding: 10
                            }}>
                                <View style={{ marginTop: 10 }}>
                                    <View
                                        style={Style.inputField}>
                                        <Text style={Style.inputLabel}>Stone Type</Text>
                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <SelectDropdown
                                                data={[...stone]}
                                                onSelect={(selectedItem) => {
                                                    console.log(selectedItem, 'selected item');
                                                    setFieldValue('stoneType', selectedItem.stoneType)
                                                    setFieldValue('stonePerBag', selectedItem.stonePerBag)
                                                    setFieldValue('pricePerStone', selectedItem.pricePerStone)
                                                    setFieldValue('price', selectedItem.price)

                                                }}
                                                buttonTextAfterSelection={(selectedItem: any, index: number) => {
                                                    return `${selectedItem?.stoneType}`
                                                }}
                                                rowTextForSelection={(item: any, index: number) => {
                                                    return `${item?.stoneType}`;
                                                }}
                                                buttonStyle={{ backgroundColor: 'transparent',width:'100%' }}
                                                defaultButtonText='Select stone Type'
                                                buttonTextStyle={{ textAlign: 'left', marginLeft: -6 }}
                                                dropdownStyle={{ width: '80%', borderRadius: 10 }}
                                                defaultValue={stone.find((st:any) => st.stoneType === values.stoneType)}
                                            />
                                        </View>
                                    </View>
                                    {errors.stoneType && touched.stoneType &&
                                        <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>{errors.stoneType}</Text>
                                    }
                                </View>
                                <View style={{ marginTop: 15 }}>
                                    <View
                                        style={Style.inputField}>
                                        <Text style={Style.inputLabel}>Total Bags</Text>
                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <TextInput
                                                onChangeText={handleChange('totalBags')}
                                                onBlur={() => { handleBlur('totalBags') }}
                                                value={values.totalBags}
                                                style={{ flex: 1, fontSize: 16, color: '#000' }}
                                                placeholderTextColor='gray'
                                                placeholder='Enter total bag'
                                            />

                                        </View>
                                    </View>
                                    {errors.totalBags && touched.totalBags &&
                                        <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>{errors.totalBags}</Text>
                                    }
                                </View>
                                <View style={{ marginTop: 15 }}>
                                    <View
                                        style={Style.inputField}>
                                        <Text style={Style.inputLabel}>Stone Per Bag</Text>
                                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                            <TextInput
                                                onChangeText={handleChange('stonePerBag')}
                                                onBlur={() => { handleBlur('stonePerBag') }}
                                                value={values.stonePerBag}
                                                style={{ flex: 1, fontSize: 16, color: '#000' }}
                                                placeholderTextColor='gray'
                                                placeholder='Enter stone per bag'
                                            />
                                        </View>
                                    </View>
                                    {errors.stonePerBag && touched.stonePerBag &&
                                        <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>{errors.stonePerBag}</Text>
                                    }
                                </View>
                                <Pressable style={GlobalStyle.button} onPress={() => handleSubmit()}>
                                    <Text style={GlobalStyle.btntext}>{update ? 'Update' : 'Submit'}</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>}
        </>
    )
}
const Style = StyleSheet.create({
    cardContainer: { marginBottom: 0 },
    inputField: {
        backgroundColor: '#F9F9F9',
        borderRadius: 15,
        fontSize: 16,
        padding: 10,
    },
    inputLabel: { color: '#05E3D5', fontSize: 14 },
    stoneType: {
        fontSize: heightY * 0.018,
        marginHorizontal: 10,
        paddingTop: 10,
        fontWeight: 'bold'
    },
    price: {
        fontSize: heightY * 0.018,
        margin: 10
    },
})
export default StoneStock
