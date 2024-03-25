import fireStore from "@react-native-firebase/firestore"

// for production build just change collection name to 'prod'
export const db=fireStore().collection('test').doc('environment')