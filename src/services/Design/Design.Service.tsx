
import { db } from "../firebaseConfig";
import firestore from "@react-native-firebase/firestore";

const designCollection = db.collection('design_details')

export async function addDesignDetails(values: any) {
    try {
        const res = await designCollection.add(JSON.parse(JSON.stringify(values)))
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

export const getDesignDetails = async () => {
    try {
        const querySnapshot = await designCollection.where('isDeleted', '!=', true).get();
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
export const updateDesignDetails = async (values: any) => {
    try {
        const res = await designCollection.doc(values.id).update(JSON.parse(JSON.stringify(values)))
        return true;
    } catch (error) {
        console.error('error', error)
        return error;
    }

}
export const deleteDesignDetail = async (values: any) => {
    try {
        const finalData = { ...values, ...{ isDeleted: true } }
        await designCollection.doc(values.id).update(finalData);
        return true;
    } catch (error) {
        console.error('error', error)
        return error;
    }
}

export async function checkDesignNumberExists(designNo: string) {
    try {
        const querySnapshot = await designCollection
            .where('designNo', '==', designNo)
            .get();
        // console.log(querySnapshot.docs, 'querySnapshot', querySnapshot.empty);

        if (querySnapshot.empty) {
            // design number exists in the collection
            return false;
        } else {
            const data = querySnapshot.docs.map(doc => ({
                ...doc.data(),
            }));
            // design number does not exist in the collection
            return data;
        }
    } catch (error) {
        console.error('Error checking mobile number:', error);
        // Handle error
        return false;
    }
}