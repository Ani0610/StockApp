

import { db } from "../firebaseConfig";
import firestore from "@react-native-firebase/firestore";

const challanCollection = db.collection('challan')
const receiveCollection = db.collection('receive_maal')

export async function addChallanService(values: any) {
    try {
        const res = await challanCollection.add(JSON.parse(JSON.stringify(values)))
        await res.update({
            challanNo: values.challanNo + 1,
            id: res.id,
            createdAt: firestore.FieldValue.serverTimestamp(),
            isDeleted: false
        });
        await db.update({ "challanCount": values.challanNo + 1 })
        const docSnapshot = await res.get();
        const addedData = await docSnapshot.data();
        return addedData;
    } catch (error) {
        console.error('error---', error);
        return false;
    }
}

export const getChallanDetails = async () => {
    try {
        const querySnapshot = await challanCollection.where('isDeleted', '!=', true).get();
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
export const updateChallanDetails = async (values: any) => {
    try {
        const res = await challanCollection.doc(values.id).update(JSON.parse(JSON.stringify(values)))
        return true;
    } catch (error) {
        console.error('error', error)
        return error;
    }

}
export const deleteChallanDetail = async (values: any) => {
    try {
        const finalData = { ...values, ...{ isDeleted: true } }
        await challanCollection.doc(values.id).update(finalData);
        return true;
    } catch (error) {
        console.error('error', error)
        return error;
    }
}

export const getchallanCount = async () => {
    try {
        const documentSnapshot = await db.get()
        if (documentSnapshot.exists) {
            // Access the document data
            const data = documentSnapshot.data();
            return data?.challanCount;
        } else {
            // console.log('Document does not exist');
            return 0;
        }
    } catch (error) {
        console.error(error);

    }
}
export async function addReceiveMaalService(values: any) {
    try {
        const res = await receiveCollection.add(JSON.parse(JSON.stringify(values)))
        await res.update({
            jobNo: values.jobNo + 1,
            id: res.id,
            createdAt: firestore.FieldValue.serverTimestamp(),
            isDeleted: false
        });
        await db.update({ "jobNumbercount": values.jobNo + 1 })
        const docSnapshot = await res.get();
        const addedData = await docSnapshot.data();
        return addedData;
    } catch (error) {
        console.error('error---', error);
        return false;
    }
}

export const getReceiveMaalDetails = async () => {
    try {
        const querySnapshot = await receiveCollection.where('isDeleted', '!=', true).get();
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
export const updateReceiveMaalDetails = async (values: any) => {
    try {
        const res = await receiveCollection.doc(values.id).update(JSON.parse(JSON.stringify(values)))
        return true;
    } catch (error) {
        console.error('error', error)
        return error;
    }

}
export const deleteReceiveMaalDetail = async (values: any) => {
    try {
        const finalData = { ...values, ...{ isDeleted: true } }
        await receiveCollection.doc(values.id).update(finalData);
        return true;
    } catch (error) {
        console.error('error', error)
        return error;
    }
}
export const getJobNumberCount = async () => {
    try {
        const documentSnapshot = await db.get()
        if (documentSnapshot.exists) {
            // Access the document data
            const data = documentSnapshot.data();
            return data?.jobNumbercount;
        } else {
            // console.log('Document does not exist');
            return 0;
        }
    } catch (error) {
        console.error(error);

    }
}
