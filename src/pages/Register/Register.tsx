import { useRoute } from '@react-navigation/native';
import { Formik } from 'formik'
import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native'
import * as yup from "yup"
import { GlobalStyle } from '../../../globalStyle'
import Icon from 'react-native-easy-icon'
import SelectDropdown from 'react-native-select-dropdown';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/action/User/userSlice';


const Register = () => {
    const route = useRoute();
    const { mobileNumber } = route.params as { mobileNumber: string };
    const dispatch = useDispatch()
    const registerSchema = yup.object().shape({
        fname: yup.string().required('First Name is required')
            .min(2, 'First name must be at least 2 characters long')
            .max(20, 'First name must not exceed 20 characters')
            .matches(/^[a-zA-Z0-9\s]*$/, 'Invalid character in first name'),
        lname: yup.string().required('Last Name is required')
            .min(2, 'First name must be at least 2 characters long')
            .max(20, 'First name must not exceed 20 characters')
            .matches(/^[a-zA-Z0-9\s]*$/, 'Invalid character in first name'),
        email: yup.string().email("Please enter valid email")
            .required('Email is required').matches(/@[^.]*\./, "Please enter valid email"),
        userType: yup.string().required('User Type is required'),

    })
    const onRegister = (values: any) => {
        console.log('values', { ...values, mobileNumber: mobileNumber });
        dispatch(setUser({ ...values, mobileNumber: mobileNumber }))

    }
    return (
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "height" : undefined}>
            <SafeAreaView style={GlobalStyle.safeAreaCotainer}>
                <StatusBar
                    backgroundColor="#fff"
                    barStyle="dark-content" // Here is where you change the font-color
                />
                <ScrollView nestedScrollEnabled={true} keyboardShouldPersistTaps={'always'}>
                    <View style={GlobalStyle.centerContentPage}>
                        <View style={Style.authContainer}>
                            {/* <GigwaveIcon /> */}
                            <Text style={[GlobalStyle.title, { marginTop: 20 }]}>Register</Text>
                            <Text style={{ color: '#949494', marginBottom: 20, fontSize: 18 }}>Please enter your details to register</Text>
                            <Formik
                                initialValues={{
                                    fname: '',
                                    lname: '',
                                    email: '',
                                    userType: ''
                                }}
                                validationSchema={registerSchema}
                                onSubmit={values => onRegister(values)}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched, setFieldValue }) => (
                                    <View style={{ padding: 10 }}>
                                        <View style={[GlobalStyle.fieldwithIcon]}>
                                            <View style={{ marginRight: 10 }}>
                                                <Icon type="fontisto" name="person" color="gray" size={20} />
                                            </View>
                                            <TextInput style={{ flex: 1, fontSize: 16, color: '#000' }}
                                                onChangeText={handleChange('fname')}
                                                onBlur={() => { handleBlur('fname') }}
                                                value={values.fname}
                                                placeholder='First Name'
                                                placeholderTextColor='gray'

                                            />
                                        </View>
                                        <View style={{ marginBottom: 10 }}>
                                            {touched.fname && errors.fname &&
                                                <Text style={GlobalStyle.errorMsg}>{errors.fname}</Text>
                                            }
                                        </View>
                                        <View style={[GlobalStyle.fieldwithIcon]}>
                                            <View style={{ marginRight: 10 }}>
                                                <Icon type="fontisto" name="person" color="gray" size={20} />
                                            </View>
                                            <TextInput style={{ flex: 1, fontSize: 16, color: '#000' }}
                                                onChangeText={handleChange('lname')}
                                                onBlur={() => { handleBlur('lname') }}
                                                value={values.lname}
                                                placeholder='Last Name'
                                                placeholderTextColor='gray'

                                            />
                                        </View>
                                        <View style={{ marginBottom: 10 }}>
                                            {errors.lname && touched.lname &&
                                                <Text style={GlobalStyle.errorMsg}>{errors.lname}</Text>
                                            }
                                        </View>
                                        <View style={[GlobalStyle.fieldwithIcon]}>
                                            <View style={{ marginRight: 10 }}>
                                                <Icon type="feather" name="lock" color="gray" size={20} />
                                            </View>
                                            <TextInput style={{ flex: 1, fontSize: 16, color: '#000' }}
                                                onChangeText={handleChange('email')}
                                                onBlur={() => { handleBlur('email') }}
                                                value={values.email}
                                                keyboardType='email-address'
                                                placeholder='Email'
                                                placeholderTextColor='gray'

                                            />
                                        </View>
                                        <View style={{ marginBottom: 10 }}>
                                            {errors.email && touched.email &&
                                                <Text style={GlobalStyle.errorMsg}>{errors.email}</Text>
                                            }
                                        </View>
                                        <View style={[GlobalStyle.fieldwithIcon]}>
                                            <View style={{ marginRight: 10 }}>
                                                <Icon type="feather" name="lock" color="gray" size={20} />
                                            </View>
                                            <SelectDropdown
                                                data={['Admin', 'Godown', 'Carrier Person']}
                                                onSelect={(selectedItem) => {
                                                    setFieldValue('userType', selectedItem)

                                                }}
                                                buttonStyle={{ backgroundColor: 'transparent', width: '92%' }}
                                                defaultButtonText='Select user type'
                                                buttonTextStyle={{ textAlign: 'left' }}
                                                dropdownStyle={{ width: '70%', borderRadius: 10 }}
                                                defaultValue={''}
                                            />
                                        </View>
                                        <View style={{ marginBottom: 10 }}>
                                            {errors.userType && touched.userType &&
                                                <Text style={GlobalStyle.errorMsg}>{errors.userType}</Text>
                                            }
                                        </View>
                                        <Pressable style={GlobalStyle.button} onPress={() => handleSubmit()}>
                                            <Text style={GlobalStyle.btntext}>Create Account</Text>
                                        </Pressable>
                                    </View>
                                )}
                            </Formik>
                        </View>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}
const Style = StyleSheet.create({
    authContainer: {
        height: '100%',
        display: "flex",
        alignItems: "center",
        padding: 20
    },
    footer: {
        marginBottom: 20,
        display: 'flex',
        flexDirection: 'row'
    },
    footerText: {
        fontWeight: "bold",
        color: 'black',
        fontSize: 18
    }
})
export default Register
