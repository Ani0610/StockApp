import { View, Text, Modal } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { GlobalStyle } from '../../../globalStyle'
import Icon from 'react-native-easy-icon'

const ActionBarModel = ({ modalHeight="20%",isEditable=true,isDeletable=true,isVisible, onClose, editAction, deleteAction, isExtraButton = false, extraButton }: any) => {
    return (
        <View>
            <Modal
                visible={isVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={onClose}
                onPointerDown={onClose}
            >
                <View
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(0,0,0,0.5)",
                    }}
                    onTouchEnd={onClose}
                >
                    <View
                        style={{
                            height: {modalHeight},
                            width: "100%",
                            marginTop: "auto",
                            backgroundColor: "white",
                            elevation: 5,
                            borderTopLeftRadius: 15,
                            borderTopRightRadius: 15,
                        }}
                    >
                        {isExtraButton && 
                        <>
                            {extraButton}
                        </>
                        }
                        {isEditable &&

                        <TouchableOpacity
                            onPress={() => editAction()}
                            style={[GlobalStyle.btn, { borderRadius: 15 }]}
                        >
                            <Icon type="feather" name="edit" color="gray" size={25} />
                            <Text
                                style={{
                                    color: "gray",
                                    marginLeft: 10,
                                    fontWeight: "bold",
                                    fontSize: 18,
                                }}
                            >
                                Edit
                            </Text>
                        </TouchableOpacity>
                        }
                        {isDeletable &&
                        <TouchableOpacity
                            onPress={() => deleteAction()}
                            style={[GlobalStyle.btn, { borderRadius: 15 }]}
                        >
                            <Icon type="feather" name="delete" color="gray" size={25} />
                            <Text
                                style={{
                                    color: "gray",
                                    marginLeft: 10,
                                    fontWeight: "bold",
                                    fontSize: 18,
                                }}
                            >
                                Delete
                            </Text>
                        </TouchableOpacity>
                        }
                        <TouchableOpacity onPress={onClose} style={GlobalStyle.btn}>
                            <Icon type="entypo" name="cross" color="gray" size={25} />
                            <Text
                                style={{
                                    color: "gray",
                                    marginLeft: 10,
                                    fontWeight: "bold",
                                    fontSize: 18,
                                }}
                            >
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default ActionBarModel