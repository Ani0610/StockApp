import { db } from "../firebaseConfig";

export const getUsers = async () => {
    const collection = await db.collection('users');
    const querySnapshot = await collection.get();
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
}
export const updateUsers = async (values: any) => {
    try {
        const collection = await db.collection('users');
        const res = await collection.doc(values.uid).update(values)

        return true;
    } catch (error) {
        console.error('error', error)
        return error;
    }

}
export const deleteExistingUsers = async (values: any) => {
    try {
        const collection = await db.collection('users');
        await collection.doc(values.uid).delete();

        return true;
    } catch (error) {
        console.error('error', error)
        return error;
    }

}