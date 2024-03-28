import { db } from "../firebaseConfig";
import firestore from "@react-native-firebase/firestore";

const collectionStone = db.collection('stones');
const collectionCategory = db.collection('categories');
const collectionPaper = db.collection('paper');

// ## stone Master API starts
export async function addStones(values: any) {
    try {
        const res = await collectionStone.add(values)
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

export const getStones = async () => {
    const querySnapshot = await collectionStone.get();
    if (querySnapshot.empty) {
        return false;
    } else {
        const data = querySnapshot.docs.map(doc => ({
            ...doc.data(),
        }));
        return data;
    }
}
export const updateStone= async (values: any) => {
    try {
        const res = await collectionStone.doc(values.id).update(values)

        return true;
    } catch (error) {
        console.error('error', error)
        return error;
    }

}
export const deleteStoneByID = async (values: any) => {
    try {
        await collectionStone.doc(values.id).delete();
        return true;
    } catch (error) {
        console.error('error', error)
        return error;
    }
}

// ## stone Master API end

// ## categories Master API starts

export async function addCategories(values: any) {
    try {
        const res = await collectionCategory.add(values)
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

export const getCategories = async () => {
    const querySnapshot = await collectionCategory.get();
    if (querySnapshot.empty) {
        return false;
    } else {
        const data = querySnapshot.docs.map(doc => ({
            ...doc.data(),
        }));
        return data;
    }
}
export const updateCategory = async (values: any) => {
    try {
        const res = await collectionCategory.doc(values.id).update(values)

        return true;
    } catch (error) {
        console.error('error', error)
        return error;
    }

}
export const deleteCategoryByID = async (values: any) => {
    try {
        await collectionCategory.doc(values.id).delete();
        return true;
    } catch (error) {
        console.error('error', error)
        return error;
    }

}
// ## Categories Master API ends

// ## Paper Master API starts

export async function addPapers(values: any) {
    try {
        const res = await collectionPaper.add(values)
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

export const getPapers = async () => {
    const querySnapshot = await collectionPaper.get();
    if (querySnapshot.empty) {
        return false;
    } else {
        const data = querySnapshot.docs.map(doc => ({
            ...doc.data(),
        }));
        return data;
    }
}
export const updatePaper = async (values: any) => {
    try {
        const res = await collectionPaper.doc(values.id).update(values)
        return true;
    } catch (error) {
        console.error('error', error)
        return error;
    }

}
export const deletePaperByID = async (values: any) => {
    try {
        await collectionPaper.doc(values.id).delete();
        return true;
    } catch (error) {
        console.error('error', error)
        return error;
    }

}
// ## Paper Master API ends
