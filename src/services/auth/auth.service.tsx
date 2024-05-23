import auth, { firebase } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { db } from "../firebaseConfig";

export async function signInWithPhoneNumber(phoneNumber: string) {
    try {
        // console.log('mobile', phoneNumber)
        // await auth().verifyPhoneNumber('+91' + phoneNumber);
        // firebase.auth().settings.appVerificationDisabledForTesting = true;
        // const settings = auth().settings;
        // console.log(settings.appVerificationDisabledForTesting);
        const confirmation = await auth().signInWithPhoneNumber('+91' + phoneNumber);
        return confirmation;

    } catch (error) {
        console.error('error---', error);
        return false;
    }
}

export async function registerUser(values: any) {
    try {
        const isUserExist = await checkMobileNumberExists(values.mobileNumber);
        if (!isUserExist) {
            const collection = await db.collection('users');
            const res = await collection.add(values)
            await res.update({
                uid: res.id,
                createdAt: firestore.FieldValue.serverTimestamp()
            });
            const docSnapshot = await res.get();
            const addedData = await docSnapshot.data();
            return addedData;
        } else {
            return false;
        }
    } catch (error) {
        console.error('error---', error);
        return false;
    }

}

export async function checkMobileNumberExists(mobileNumber: string) {
    try {
        const querySnapshot = await db
            .collection('users')
            .where('mobileNumber', '==', mobileNumber)
            .get();
        // console.log(querySnapshot.docs, 'querySnapshot', querySnapshot.empty);

        if (querySnapshot.empty) {
            // Mobile number exists in the collection
            return false;
        } else {
            const data = querySnapshot.docs.map(doc => ({
                ...doc.data(),
            }));
            // Mobile number does not exist in the collection
            return data;
        }
    } catch (error) {
        console.error('Error checking mobile number:', error);
        // Handle error
        return false;
    }
}