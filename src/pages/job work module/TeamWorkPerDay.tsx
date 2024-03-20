import React, { useEffect, useState } from 'react'
import { Dimensions, Modal, Platform, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { GlobalStyle } from '../../../globalStyle'
import * as yup from "yup"
import { FieldArray, FormikProvider, useFormik } from 'formik'
import Icon from 'react-native-easy-icon'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { addjobTeam, deletejobTeam, editjobTeam } from '../../redux/action/ job work/JobTeamSlice'
import SelectDropdown from 'react-native-select-dropdown'
import { addperDayWork, deleteperDayWork, editperDayWork } from '../../redux/action/ job work/WorkPerDaySlice'
var heightY = Dimensions.get("window").height;

interface InitialFormValues {
    teamName: string,
    teamPersons: any,
    total: number
    useruid: any,
    price: any,
    id: undefined,
    partyName: string,
    workType: string
}
const TeamWorkPerDay = () => {
    const [showModal, setShowModal] = useState(false);
    const [update, setUpdate] = useState(false);
    const [data, setdata] = useState<any | null>(null); // Track the selected card's ID
    const [isVisible, setisVisible] = useState(false);
    const { user }: any = useSelector((state: RootState) => state.user)
    const { teams }: any = useSelector((state: RootState) => state.teams)
    const { perDayWorks }: any = useSelector((state: RootState) => state.perDayWorks)
    const [work, setWork] = useState<any>([])
    const dispatch = useDispatch()
    const [initialFormValues, setInitialFormValues] = useState<InitialFormValues>({
        teamName: '',
        teamPersons: [],
        total: 0,
        useruid: '',
        price: '',
        id: undefined,
        partyName: '',
        workType: '',
    });
    const teamSchema = yup.object().shape({
        teamName: yup.string().required('Team Name is required'),
        teamPersons: yup.array().of(
            yup.object().shape({
                personName: yup.string().required('Person name is required'),
                unit: yup.string().required('unit is required'),
                cost: yup.string().required('cost is required'),
            })
        ),
    })
    useEffect(() => {
        if (user.userType === "Job Work") {
            const wk: any = perDayWorks.filter((item: any) => item.useruid === user.useruid)
            setWork([...wk])
        } else {
            setWork([...perDayWorks])
        }
    }, [user.userType, perDayWorks])
    const formik = useFormik<InitialFormValues>({
        initialValues: initialFormValues,
        validationSchema: teamSchema,
        onSubmit: (async (values: any) => {
            values.total = await values.teamPersons.reduce((price: any, item: any) => Number(price) + Number(item.cost), 0).toFixed(2);
            if (update) {
                dispatch(editperDayWork({ ...values }))
            } else {
                values.id = Math.floor(2000 + Math.random() * 9000)
                dispatch(addperDayWork({ ...values }))
            }
            setShowModal(false)
            setUpdate(false)
            resetForm();
        }),
    });
    const { handleChange, handleBlur, handleSubmit, values, errors, isValid, touched, setFieldValue, resetForm } = formik
    const handleClose = () => {
        setShowModal(false)
        setUpdate(false)
        resetForm()
    }
    const selectCard = (item: number) => {
        setisVisible(true)
        setdata(item);
    };
    const onClose = () => {
        setisVisible(false)
    }
    const editTeamworkperDay = () => {
        setFieldValue('total', data.total)
        setFieldValue('teamName', data.teamName)
        setFieldValue('teamPersons', data.teamPersons)
        setFieldValue('useruid', data.useruid)
        setFieldValue('price', data.price)
        setFieldValue('id', data.id)
        setFieldValue('pertyName', data.pertyName)
        setFieldValue('workType', data.workType)
        setUpdate(true)
        setisVisible(false)
        setShowModal(true)

    }
    const deleteTeamworkPerDay = () => {
        dispatch(deleteperDayWork(data))
        setisVisible(false)
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
                            {work?.map((item: any, i: any) => (
                                <View key={i} style={[GlobalStyle.card, GlobalStyle.shadowProp, {
                                    paddingVertical: 8,
                                    paddingHorizontal: 8,
                                    height: 'auto',
                                    flexDirection: 'row'
                                }]}>
                                    <View style={GlobalStyle.leftSide}>
                                        <Text style={GlobalStyle.label}>Team Name</Text>
                                        <Text style={GlobalStyle.label}>Party Name</Text>
                                        <Text style={GlobalStyle.label}>Work Type</Text>
                                        <Text style={GlobalStyle.label}>Total</Text>
                                    </View>
                                    <View style={GlobalStyle.middleSide}>
                                        <Text style={GlobalStyle.textcolor} numberOfLines={1} ellipsizeMode="tail">{item.teamName}</Text>
                                        <Text style={GlobalStyle.textcolor} numberOfLines={1} ellipsizeMode="tail">{item.partyName}</Text>
                                        <Text style={GlobalStyle.textcolor} numberOfLines={1} ellipsizeMode="tail">{item.workType}</Text>
                                        <Text style={GlobalStyle.textcolor} numberOfLines={1} ellipsizeMode="tail">{item.total}</Text>


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

                            <TouchableOpacity onPress={() => editTeamworkperDay()} style={[GlobalStyle.btn, { borderRadius: 15 }]}>
                                <Icon type="feather" name="edit" color="gray" size={25} />
                                <Text style={{ color: 'gray', marginLeft: 10, fontWeight: 'bold', fontSize: 18 }}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteTeamworkPerDay()} style={[GlobalStyle.btn, { borderRadius: 15 }]}>
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
                    <ScrollView>

                        <FormikProvider value={formik}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10, marginVertical: Platform.OS === "ios" ? 30 : 0, zIndex: 0 }}>
                                <View style={{
                                    margin: 20,
                                    flex: 1,
                                    width: '100%'
                                }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ color: 'black', fontSize: 20 }}>Add Team Details</Text>
                                        <Pressable onPress={() => handleClose()} >
                                            <Icon type="entypo" name="cross" color="black" size={35} />
                                        </Pressable>
                                    </View>

                                    <View style={{
                                        padding: 10
                                    }}>

                                        <View style={{ marginTop: 15 }}>
                                            <View
                                                style={Style.inputField}>
                                                <Text style={Style.inputLabel}>Team Name</Text>
                                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                    <SelectDropdown
                                                        data={[...teams]}
                                                        onSelect={(selectedItem: any) => {
                                                            const arry: any = []
                                                            selectedItem.teamPersonName.map((item: any) => {
                                                                arry.push({ personName: item.personName, unit: 0, cost: 0 })
                                                            })
                                                            setFieldValue('teamName', selectedItem?.teamName)
                                                            setFieldValue('useruid', selectedItem?.useruid)
                                                            setFieldValue('price', selectedItem?.price)
                                                            setFieldValue('partyName', selectedItem?.partyName)
                                                            setFieldValue('workType', selectedItem?.workType)
                                                            setFieldValue('teamPersons', arry)

                                                        }}
                                                        buttonTextAfterSelection={(selectedItem: any, index: number) => {
                                                            return `${selectedItem?.teamName}`
                                                        }}
                                                        rowTextForSelection={(item: any, index: number) => {
                                                            return `${item?.teamName}`;
                                                        }}
                                                        buttonStyle={{ backgroundColor: 'transparent', width: '90%' }}
                                                        defaultButtonText={values.teamName ? values.teamName : 'Select Team'}
                                                        buttonTextStyle={{ textAlign: 'right', marginLeft: -6 }}
                                                        dropdownStyle={{ width: '80%', borderRadius: 10 }}
                                                        defaultValue={teams.find((team: any) => team.teamName === values.teamName)}
                                                    />
                                                    {/* <TextInput
                                                    onChangeText={handleChange('teamName')}
                                                    onBlur={() => { handleBlur('teamName') }}
                                                    value={values.teamName}
                                                    style={{ flex: 1, fontSize: 16, color: '#000' }}
                                                    placeholderTextColor='gray'
                                                    placeholder='Enter team name'
                                                /> */}

                                                </View>
                                            </View>
                                            {errors.teamName && touched.teamName &&
                                                <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>{errors.teamName}</Text>
                                            }
                                        </View>
                                        <View style={{ marginTop: 10 }}>

                                            <FieldArray name="teamPersons">
                                                {({ replace, remove, push }) => (
                                                    <View>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Team Person Name</Text>
                                                            {/* <Pressable onPress={() => push({
                                                            personName: ''
                                                        })}>
                                                            <Icon type="feather" name="plus" color="blue" size={25} />
                                                        </Pressable> */}
                                                        </View>
                                                        {values.teamPersons?.length > 0 &&
                                                            values.teamPersons.map((person: any, i: any) => (
                                                                <View key={i} style={[{
                                                                    borderRadius: 10,
                                                                    width: '100%',
                                                                }, { borderWidth: 0.5, borderColor: 'lightgray', padding: 5, marginVertical: 5 }]}>
                                                                    {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                                    <Pressable onPress={() => remove(i)} >
                                                                        <Icon type="entypo" name="cross" color="black" size={25} />
                                                                    </Pressable>
                                                                </View> */}
                                                                    <View>

                                                                        <View style={{ marginTop: 15 }}>
                                                                            <View
                                                                                style={Style.inputField}>
                                                                                <Text style={Style.inputLabel}>Person Name</Text>
                                                                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                                                    <TextInput
                                                                                        onChangeText={(text) => {
                                                                                            replace(i, { ...person, personName: text })
                                                                                        }}
                                                                                        value={person.personName}
                                                                                        style={{ textAlign: 'right', fontSize: 16, color: '#000' }}
                                                                                        placeholderTextColor='gray'
                                                                                        placeholder='Enter person Name'
                                                                                        editable={false}
                                                                                    />

                                                                                </View>
                                                                            </View>
                                                                            {errors.teamPersons && errors.teamPersons[i] && touched.teamPersons && touched.teamPersons[i] &&
                                                                                <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>{errors.teamPersons[i].personName}</Text>
                                                                            }
                                                                        </View>
                                                                        <View style={{ marginTop: 15 }}>
                                                                            <View
                                                                                style={Style.inputField}>
                                                                                <Text style={Style.inputLabel}>Unit</Text>
                                                                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                                                    <TextInput
                                                                                        onChangeText={(text: any) => {
                                                                                            replace(i, { ...person, unit: text, cost: text * values.price })
                                                                                        }}
                                                                                        value={person.unit.toString()}
                                                                                        style={{ textAlign: 'right', fontSize: 16, color: '#000' }}
                                                                                        placeholderTextColor='gray'
                                                                                        placeholder='Enter unit'
                                                                                    />

                                                                                </View>
                                                                            </View>
                                                                            {errors.teamPersons && errors.teamPersons[i] && touched.teamPersons && touched.teamPersons[i] &&
                                                                                <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>{errors.teamPersons[i].unit}</Text>
                                                                            }
                                                                        </View>
                                                                        <View style={{ marginTop: 15 }}>
                                                                            <View
                                                                                style={Style.inputField}>
                                                                                <Text style={Style.inputLabel}>Cost Per Person</Text>
                                                                                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                                                    <TextInput
                                                                                        onChangeText={(text) => {
                                                                                            replace(i, { ...person, cost: text })
                                                                                        }}
                                                                                        value={person.cost.toString()}
                                                                                        style={{ textAlign: 'right', fontSize: 16, color: '#000' }}
                                                                                        placeholderTextColor='gray'
                                                                                        placeholder='Enter cost person'
                                                                                        editable={false}
                                                                                    />

                                                                                </View>
                                                                            </View>
                                                                            {errors.teamPersons && errors.teamPersons[i] && touched.teamPersons && touched.teamPersons[i] &&
                                                                                <Text style={[GlobalStyle.errorMsg, { marginHorizontal: 10 }]}>{errors.teamPersons[i].cost}</Text>
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
                                        <Pressable style={GlobalStyle.button} onPress={() => handleSubmit()}>
                                            <Text style={GlobalStyle.btntext}>{update ? 'Update' : 'Submit'}</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </FormikProvider>
                    </ScrollView>
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
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    // inputField: {
    //     display: 'flex',
    //     backgroundColor: "#F9F9F9",
    //     borderRadius: 15,
    //     fontSize: 16,
    //     padding: 5,
    //     flexDirection: "row",
    //     justifyContent: "space-between",
    //     alignItems: "center",
    //   },
    inputLabel: { color: '#05E3D5', fontSize: 14 },
    partyName: {
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
export default TeamWorkPerDay
