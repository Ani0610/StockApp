import React, { useEffect } from 'react';
import { Alert, Modal, PermissionsAndroid, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImagePicker, { Image } from 'react-native-image-crop-picker';
import { PERMISSIONS, request } from 'react-native-permissions';
import Icon from 'react-native-easy-icon';
import { GlobalStyle } from '../../../globalStyle'; // adjust the import path as needed

interface UploadPhotosProps {
    isVisible: boolean;
    onClose: () => void;
    uploadFunction: (images: any[]) => void; // changed type to any[] to handle multiple images
}

const MultipleImageUploadScreen = ({ isVisible, onClose, uploadFunction }: UploadPhotosProps) => {
    useEffect(() => {
        if (isVisible) requestCameraPermission();
    }, [isVisible]);

    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs access to your camera',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("Camera Permission Granted");
                } else {
                    console.log('Camera permission denied');
                }
            } catch (err) {
                console.warn(err);
            }
        } else {
            request(PERMISSIONS.IOS.CAMERA)
                .then(result => console.log(result, 'camera permission granted'))
                .catch(() => console.warn('camera permission denied'))
                .finally(() => {
                    request(PERMISSIONS.IOS.PHOTO_LIBRARY)
                        .then(result => console.log(result, 'photo permission granted'))
                        .catch(() => console.warn('photo permission denied'));
                });
        }
    };

    const selectCamera = () => {
        onClose();
        setTimeout(() => {
            ImagePicker.openCamera({
                multiple: true,
                mediaType: 'photo',
                cropping: true,
                compressImageMaxHeight:800,
                compressImageMaxWidth:800,
                compressImageQuality:0.6
            })
                .then((images: Image[] | Image) => {
                    const selectedImages: any = Array.isArray(images)
                        ? images.length < 4 ? images.map(image => ({
                            uri: image.path,
                            width: image.width,
                            height: image.height,
                            mime: image.mime    
                        })) :
                            Alert.alert(
                                "Upload Limit Reached",
                                "You can only upload a maximum of 3 images."
                            )
                        : [
                            {
                                uri: images.path,
                                width: images.width,
                                height: images.height,
                                mime: images.mime,
                            },
                        ];

                    if (selectedImages.length > 0) {
                        uploadFunction(selectedImages);
                    }
                })
                .catch(error => {
                    console.log('ImagePicker Error: ', error);
                });
        }, 200);
    };

    const selectImage = () => {
        ImagePicker.openPicker({
            multiple: true,
            mediaType: 'photo',
            cropping: false,
            compressImageQuality:0.6,
            compressImageMaxHeight:800,
            compressImageMaxWidth:800,
        })
            .then((images: Image[] | Image) => {
                const selectedImages: any = Array.isArray(images)
                    ? images.map(image => ({
                        uri: image.path,
                        width: image.width,
                        height: image.height,
                        mime: image.mime,
                    }))
                    : [
                        {
                            uri: images.path,
                            width: images.width,
                            height: images.height,
                            mime: images.mime,
                        },
                    ];

                if (selectedImages.length > 0) {
                    uploadFunction(selectedImages);
                }
            })
            .catch(error => {
                console.log('ImagePicker Error: ', error);
            });
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
            onPointerDown={onClose}
            style={{ zIndex: 999 }}
        >
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                }}
                onTouchEnd={onClose}
            >
                <View
                    style={{
                        height: '25%',
                        width: '100%',
                        marginTop: 'auto',
                        backgroundColor: 'white',
                        elevation: 5,
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                    }}
                >
                    <TouchableOpacity onPress={selectCamera} style={[styles.btn, { borderRadius: 15 }]}>
                        <Icon type="feather" name="camera" color="black" size={30} />
                        <Text style={[GlobalStyle.btntext, { color: 'black', marginLeft: 10 }]}>Open Camera</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={selectImage} style={styles.btn}>
                        <Icon type="entypo" name="image" color="black" size={30} />
                        <Text style={[GlobalStyle.btntext, { color: 'black', marginLeft: 10 }]}>Select from Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onClose} style={styles.btn}>
                        <Icon type="entypo" name="cross" color="black" size={30} />
                        <Text style={[GlobalStyle.btntext, { color: 'black', marginLeft: 10 }]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default MultipleImageUploadScreen;

const styles = StyleSheet.create({
    btn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
});
