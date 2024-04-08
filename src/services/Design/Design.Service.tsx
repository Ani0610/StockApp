
import { db } from "../firebaseConfig";
import firestore from "@react-native-firebase/firestore";

const designCollection = db.collection('design_details')

export async function addDesignDetails(values: any) {
    try {


        console.log('values', JSON.stringify(values))
        const res = await designCollection.add(JSON.parse(JSON.stringify(values)))
        await res.update({
            id: res.id,
            createdAt: firestore.FieldValue.serverTimestamp()
        });
        const docSnapshot = await res.get();
        const addedData = await docSnapshot.data();
        return addedData;
    } catch (error) {
        console.error('error---', error);
        return false;
    }
}

export const getDesignDetails = async () => {
    const querySnapshot = await designCollection.get();
    if (querySnapshot.empty) {
        return false;
    } else {
        const data = querySnapshot.docs.map(doc => ({
            ...doc.data(),
        }));
        return data;
    }
}
export const updateDesignDetails = async (values: any) => {
    try {
        const res = await designCollection.doc(values.id).update(values)

        return true;
    } catch (error) {
        console.error('error', error)
        return error;
    }

}
export const deleteDesignDetail = async (values: any) => {
    try {
        await designCollection.doc(values.id).delete();
        return true;
    } catch (error) {
        console.error('error', error)
        return error;
    }
}