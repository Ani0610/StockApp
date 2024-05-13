import { db } from "../firebaseConfig";
import firestore from "@react-native-firebase/firestore";

const jobCollection = db.collection('assign_job')

export async function addAssignJobService(values: any) {
    try {
        const res = await jobCollection.add(values)
        await res.update({
            id: res.id,
            createdAt: firestore.FieldValue.serverTimestamp(),
            isDeleted: false
        });
        const docSnapshot = await res.get();
        const addedData = await docSnapshot.data();
        return addedData;
    } catch (error) {
        console.error('error---', error);
        return false;
    }
}

export const getAssignJobDetails = async () => {
    try {
        const querySnapshot = await jobCollection.where('isDeleted', '!=', true).get();
        if (querySnapshot.empty) {
            return false;
        } else {
            const data = querySnapshot.docs.map(doc => ({
                ...doc.data(),
            }));
            return data;
        }
    } catch (error) {
        console.error(error);
    }
}
export const getAssignJobDetailsForUID = async (UID: string) => {
    try {
        const querySnapshot = await jobCollection.where('isDeleted', '!=', true).where("assignTo", '==', UID).get();
        if (querySnapshot.empty) {
            return false;
        } else {
            const data = querySnapshot.docs.map(doc => ({
                ...doc.data(),
            }));
            return data;
        }
    } catch (error) {
        return false;
        console.error(error);
    }
}
export const updateAssignJobDetails = async (values: any) => {
    try {
        const res = await jobCollection.doc(values.id).update(JSON.parse(JSON.stringify(values)))
        return true;
    } catch (error) {
        console.error('error', error)
        return error;
    }

}
export const deleteAssignJobDetail = async (values: any) => {
    try {
        const finalData = { ...values, ...{ isDeleted: true } }
        await jobCollection.doc(values.id).update(finalData);
        return true;
    } catch (error) {
        console.error('error', error)
        return error;
    }
}