import { Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { Pressable, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native'
import * as yup from "yup"
import { GlobalStyle } from '../../../globalStyle'
import Icon from 'react-native-easy-icon'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { setUser } from '../../redux/action/User/userSlice'
import { checkMobileNumberExists, signInWithPhoneNumber } from '../../services/auth/auth.service'
import { setLoading, setToast } from '../../redux/action/Ui/Uislice'
import { adminPhones } from '../../services/firebaseConfig'
import auth from '@react-native-firebase/auth';


const Login = ({ navigation }: any) => {
    const [isOtpsent, setOtpSend] = useState(false);
    const [mobile, setMobile] = useState("");
    const [confirm, setConfirm]: any = useState();

    const { userMaster } = useSelector((state: RootState) => state.userMaster)
    const { jobWorks } = useSelector((state: RootState) => state.jobWorks)
    const dispatch = useDispatch()
    const loginPhoneSchema = yup.object().shape({
        phone: yup.string().required('Phone number is required')
            .min(10, 'Phone number must be 10 digit number')
            .max(10, 'Phone number must be 10 digit number')
    })
    const loginCodeSchema = yup.object().shape({
        code: yup.string().required('Code is required')
            .matches(/^\d{6}$/, 'OTP code must be six digits')
    })
    function onAuthStateChanged(user:any) {
        if (user) {
          // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
          // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
          // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
          // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
        }
      }
    
      useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
      }, []);
    const onLogin = async (values: any) => {
        dispatch(setLoading(true));
        const existingUser: any = await checkMobileNumberExists(values.phone);
        if (existingUser || adminPhones.includes(values.phone)) {
            signInWithPhoneNumber(values.phone).then((res: any) => {
                dispatch(setLoading(false))
                if (res) {
                    setOtpSend(true)
                    setMobile(values.phone)
                    setConfirm(res)
                }
                else
                    dispatch(setToast({ message: 'Something went wrong', isVisible: true, type: 'danger' }))
            }).catch((error) => {
                console.error(error);
                dispatch(setLoading(false))
            })
        }
        else {
            dispatch(setLoading(false))
            dispatch(setToast({ message: 'User does not exist, please contact admin!', isVisible: true, type: 'danger' }))
        }
    }
    const onSubmit = async (values: any) => {
        try {
            await dispatch(setLoading(true));
            await confirm.confirm(values.code);
            const existingUser: any = await checkMobileNumberExists(mobile);
            if (existingUser) {
                console.log(existingUser, 'existingUser');
                dispatch(setUser(existingUser[0]))
                dispatch(setLoading(false))
                dispatch(setToast({ message: 'Login Sucessful', isVisible: true, type: 'success' }))
            } else {
                dispatch(setLoading(false))
                dispatch(setToast({ message: 'Login Sucessful', isVisible: true, type: 'success' }))
                navigation.navigate('Register', { mobileNumber: mobile })
            }
        } catch (error) {
            dispatch(setLoading(false))
            console.log('Invalid code.');
        }
        setOtpSend(false)


    }
    return (
        <SafeAreaView style={GlobalStyle.safeAreaCotainer}>
            <StatusBar
                backgroundColor="#fff"
                barStyle="dark-content" // Here is where you change the font-color
            />
            <View style={GlobalStyle.centerContentPage}>
                <View style={Style.authContainer}>
                    <View>
                        {/* <GigwaveIcon /> */}
                    </View>
                    {/* <Image source={require('../../assets/images/gigwave.png')} /> */}
                    {!isOtpsent ?
                        <>
                            <Text style={[GlobalStyle.title, { marginTop: 20 }]}>Login</Text>
                            <Text style={{ color: '#949494' }}>Enter Login Details</Text>
                        </>
                        : <>
                            <Text style={[GlobalStyle.title, { marginTop: 20 }]}>User Verification</Text>
                            <Text style={{ color: '#949494' }}>We Sent a Code To Your Phone</Text>
                            <Text style={{ color: '#949494' }}>{mobile ? mobile : ''}</Text>
                        </>
                    }
                    {
                        !isOtpsent ?
                            <Formik
                                initialValues={{ phone: '' }}
                                validationSchema={loginPhoneSchema}
                                onSubmit={values => onLogin(values)}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, resetForm }) => (
                                    <View style={{ padding: 10 }}>

                                        <View style={GlobalStyle.fieldwithIcon}>
                                            <View style={{ marginRight: 10 }}>
                                                <View>
                                                    <Icon type="feather" name="phone" color="gray" size={20} />
                                                </View>
                                            </View>
                                            <TextInput style={{ flex: 1, fontSize: 16, color: '#000' }}
                                                onChangeText={handleChange('phone')}
                                                onBlur={() => { handleBlur('phone') }}
                                                value={values.phone}
                                                keyboardType={'phone-pad'}
                                                placeholder='Phone'
                                                maxLength={10}
                                                placeholderTextColor='gray'

                                            />
                                        </View>
                                        {errors.phone &&
                                            <Text style={GlobalStyle.errorMsg}>{errors.phone}</Text>
                                        }
                                        <Pressable style={GlobalStyle.button} disabled={!isValid} onPress={() => { handleSubmit() }}>
                                            <Text style={GlobalStyle.btntext}>Continue</Text>
                                        </Pressable>
                                    </View>
                                )}
                            </Formik>
                            :
                            <Formik
                                initialValues={{ code: '' }}
                                validationSchema={loginCodeSchema}
                                onSubmit={values => onSubmit(values)}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, isValid }) => (
                                    <View style={{ padding: 10 }}>
                                        <View style={[GlobalStyle.fieldwithIcon]}>
                                            <View style={{ marginRight: 10 }}>
                                                <Icon type="feather" name="lock" color="gray" size={20} />
                                            </View>
                                            <TextInput style={{ flex: 1, fontSize: 16, color: '#000' }}
                                                onChangeText={handleChange('code')}
                                                onBlur={() => { handleBlur('code') }}
                                                value={values.code}
                                                keyboardType={'numeric'}
                                                placeholder='Code'
                                                maxLength={10}
                                                placeholderTextColor='gray'
                                            />
                                        </View>
                                        {errors.code &&
                                            <Text style={GlobalStyle.errorMsg}>{errors.code}</Text>
                                        }
                                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                            <Text onPress={() => setOtpSend(false)} style={[GlobalStyle.blackColor, { marginBottom: 10, flex: 1 }]}>Return to Login</Text>
                                            {/* <Text style={[GlobalStyle.themeColor, { marginBottom: 10 }]}> or </Text> */}
                                            <Text onPress={() => console.log('resend code')} style={[GlobalStyle.blackColor, { marginBottom: 10 }]}>Resend Code </Text>
                                        </View>
                                        <Pressable style={GlobalStyle.button} disabled={!isValid} onPress={() => handleSubmit()}>
                                            <Text style={GlobalStyle.btntext}>Login</Text>
                                        </Pressable>
                                    </View>
                                )}
                            </Formik>
                    }
                </View>
                {/* <View style={Style.footer}>
          <Text style={[Style.footerText]}>
            Don’t have an account?
          </Text>
          <Text onPress={() => navigation.navigate('Signup')} style={[Style.footerText, GlobalStyle.themeColor, { paddingStart: 5 }]}>
            Register here
          </Text>
        </View> */}
            </View>
        </SafeAreaView>

    )
}
const Style = StyleSheet.create({
    authContainer: {
        height: '75%',
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
        fontSize: 16
    }
})
export default Login
