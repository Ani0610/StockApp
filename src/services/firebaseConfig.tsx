import fireStore from "@react-native-firebase/firestore"

// for production build just change collection name to 'prod'
export const db = fireStore().collection('test').doc('environment')
export const adminPhones=["9033173363","9898017408","7304055333","9909435137"]