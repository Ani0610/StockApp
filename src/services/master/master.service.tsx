import { db } from "../firebaseConfig";
import firestore from "@react-native-firebase/firestore";

const collectionStone = db.collection('stones');
const collectionCategory = db.collection('categories');
const collectionPaper = db.collection('paper');
const collectionJobwork = db.collection('jobwork');
const collectionParty = db.collection('party')
const collectionJobworkTeam = db.collection('jobworkTeam');
const collectionJobworkTeamPerson = db.collection('jobworkTeamPerson')

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
export const updateStone = async (values: any) => {
    try {
        const res = await collectionStone.doc(values.id).update({ ...values, ...{ updateAt: firestore.FieldValue.serverTimestamp() } })
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

export const getStonesByID = async (id: any) => {
    try {
        let doc = await collectionStone.doc(id).get();

        const data = doc.data()

        return data;


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

// ## Jobwork Master API starts
export async function addJobWorks(values: any) {
    try {
        const res = await collectionJobwork.add(values)
        await res.update({
            id: res.id,
            createdAt: firestore.FieldValue.serverTimestamp()
        })
        const docSnapshot = await res.get();
        const addedData = await docSnapshot.data();
        return addedData
    }
    catch (error) {
        console.error("error---", error);
        return false;
    }
}

export const getJobWork = async () => {
    const querySnapshot = await collectionJobwork.get();
    if (querySnapshot.empty) {
        return false;
    }
    else {
        const data = querySnapshot.docs.map(doc => ({
            ...doc.data(),
        }));
        return data;
    }
}

export const updateJobWork = async (values: any) => {
    try {
        const res = await collectionJobwork.doc(values.id).update(values);
        return true;
    }
    catch (error) {
        console.error("error", error);
        return error;
    }
}

export const deleteJobWorkById = async (values: any) => {
    try {
        await collectionJobwork.doc(values.id).delete();
        return true;
    }
    catch (error) {
        console.error("error", error);
        return error;
    }
}
// ## Jobwork Master API ends

// ## Party Master API starts
export async function addPartys(values: any) {
    try {
        const res = await collectionParty.add(values)
        await res.update({
            id: res.id,
            createdAt: firestore.FieldValue.serverTimestamp()
        })
        const docSnapshot = await res.get();
        const addedData = await docSnapshot.data();
        return addedData
    }
    catch (error) {
        console.error("error---", error);
        return false;
    }

}

export const getParty = async () => {
    const querySnapshot = await collectionParty.get();
    if (querySnapshot.empty) {
        return false
    }
    else {
        const data = querySnapshot.docs.map(doc => ({
            ...doc.data(),
        }));
        return data;
    }
}

export const updateParty = async (values: any) => {
    try {
        const res = await collectionParty.doc(values.id).update(values);
        return true;
    }
    catch (error) {
        console.error("error", error);
        return error;
    }
}

export const deletePartyById = async (values: any) => {
    try {
        await collectionParty.doc(values.id).delete();
        return true;
    }
    catch (error) {
        console.error("error", error);
        return error;
    }
}


// ## Party Master API ends



// ## Jobwork Team API Start
export async function addTeam(values: any) {
    try {
        // Remove undefined fields from values
        const sanitizedValues: any = {};
        Object.keys(values).forEach((key) => {
            if (values[key] !== undefined) {
                sanitizedValues[key] = values[key];
            }
        });

        // Add the document to the collection
        const res = await collectionJobwork.add({
            ...sanitizedValues,
            createdAt: firestore.FieldValue.serverTimestamp(), // Adding the created timestamp
        });

        // Update the document with the generated ID
        await res.update({
            id: res.id,
        });

        // Get the updated document snapshot
        const docSnapshot = await res.get();

        // Get the data from the document snapshot
        const addedData = docSnapshot.data();

        return addedData;
    } catch (error) {
        console.error('Error adding team:', error);
        return false;
    }
}


export const getJobWorkTeam = async () => {
    const querySnapshot = await collectionJobworkTeam.get();
    if (querySnapshot.empty) {
        return false;
    }
    else {
        const data = querySnapshot.docs.map(doc => ({
            ...doc.data(),
        }));
        return data;
    }
}

export const updateJobWorkTeam = async (values: any) => {
    try {
        const res = await collectionJobwork.doc(values.id).update(values);
        console.log("collectionJobwork.doc(values.id)", collectionJobwork.doc(values.id))
        return true;
    }
    catch (error) {
        console.error("error", error);
        return error;
    }
}

export const deleteJobWorkTeamById = async (values: any) => {
    try {
        await collectionJobwork.doc(values.id).delete();
        return true;
    }
    catch (error) {
        console.error("error", error);
        return error;
    }
}

// ## Jobwork Team API ends




// Job Work Team Table Operations
//## New Job Work Team table collection Start
// Check if the collection exists
// export const checkTeamCollectionExists = async (collectionName:any) => {
//     const collections = await admin.firestore().listCollections();
//     const collectionExists = collections.some((col) => col.id === collectionName);
//     return collectionExists;
// };

// Add jobworkTeam if it doesn't exist
// export const addJobWorkTeamIfNotExists = async () => {
//     const collectionExists = await checkTeamCollectionExists('jobworkTeam');
//     if (!collectionExists) {
//         // Collection doesn't exist, create it
//         await admin.firestore().createCollection('jobworkTeam');
//     }
// };

// Check if a team with the same name already exists
export const checkTeamExists = async (teamName: any) => {
    const snapshot = await collectionJobworkTeam.where('teamName', '==', teamName).get();
    return !snapshot.empty;
};

// Create a new job work team with id and createdAt fields
export const createJobWorkTeam = async (data: any) => {
    try {
     
        const sanitizedData: any = {};
        Object.keys(data).forEach((key) => {
            if (data[key] !== undefined) {
                sanitizedData[key] = data[key];
            }
        });

        const res = await collectionJobworkTeam.add({
            ...sanitizedData,
            createdAt: firestore.FieldValue.serverTimestamp(), 
        });

        await res.update({
            id: res.id,
        });

        const docSnapshot = await res.get();

        const addedData = docSnapshot.data();

        return addedData;
    } catch (error) {
        console.error('Error creating job work team:', error);
        return false;
    }
};

// Add a job work team if it doesn't already exist
// export const addJobWorkTeam = async (teamData:any) => {
//     if (await checkTeamExists(teamData.teamName)) {
//         throw new Error('Team name already exists');
//     }
//     return await createJobWorkTeam(teamData);
// };

// Get all job work teams
export const getMyJobWorkTeam = async () => {
    const querySnapshot = await collectionJobworkTeam.get();
    console.log(querySnapshot)
    if (querySnapshot.empty) {
        return [];
    }
    else {
        const data = querySnapshot.docs.map(doc => ({
            ...doc.data(),
        }));
        return data;
    }
};

// Edit a job work team
export const editMyJobWorkTeam = async (teamData: any) => {
    try {
        await collectionJobworkTeam.doc(teamData.id).update(teamData);
        return true;
    } catch (error) {
        console.error('error', error);
        return false;
    }
};

// Delete a job work team by ID
export const deleteNewJobWorkTeamById = async (values: any) => {
    try {
        await collectionJobworkTeam.doc(values.id).delete();
        return true;
    } catch (error) {
        console.error('error', error);
        return false;
    }
};





// Job Work Team Person Table Operations
// Create a new job work team person with id and createdAt fields
export const createJobWorkTeamPerson = async (data: any) => {
    try {
        const sanitizedData: any = {};
        Object.keys(data).forEach((key) => {
            if (data[key] !== undefined) {
                sanitizedData[key] = data[key];
            }
        });
        const res = await collectionJobworkTeamPerson.add({
            ...sanitizedData,
            createdAt: firestore.FieldValue.serverTimestamp(),
        });
        await res.update({
            id: res.id,
        });
        const docSnapshot = await res.get();
        const addedData = docSnapshot.data();
        return addedData;
    } catch (error) {
        console.error('Error creating job work team person:', error);
        return false;
    }
};

// Add a job work team person if it doesn't already exist
export const addJobWorkTeamPerson = async (personData: any) => {

    return await createJobWorkTeamPerson(personData);
};

// Get all job work team persons
export const getMyJobWorkTeamPersons = async () => {
    const querySnapshot = await collectionJobworkTeamPerson.get();
    if (querySnapshot.empty) {
        return [];
    }
    return querySnapshot.docs.map(doc => doc.data());
};

// Edit a job work team person
export const editJobWorkTeamPerson = async (values: any) => {
    try {
        await collectionJobworkTeamPerson.doc(values.id).update(values);
        return true;
    } catch (error) {
        console.error('error', error);
        return false;
    }
};

// Delete a job work team person by ID
export const deleteJobWorkTeamPersonById = async (id: any) => {
    try {
        await collectionJobworkTeamPerson.doc(id).delete();
        return true;
    } catch (error) {
        console.error('error', error);
        return false;
    }
};

// Check if the collection exists
// export const checkPersonCollectionExists = async (collectionName:any) => {
//     const collections = await admin.firestore().listCollections();
//     const collectionExists = collections.some((col) => col.id === collectionName);
//     return collectionExists;
// };

// Add jobworkTeamPerson if it doesn't exist
// export const addJobWorkTeamPersonIfNotExists = async () => {
//     const collectionExists = await checkPersonCollectionExists('jobworkTeamPerson');
//     if (!collectionExists) {
//         // Collection doesn't exist, create it
//         await admin.firestore().createCollection('jobworkTeamPerson');
//     }
// };

// Check if a person with the same name already exists
export const checkPersonExistence = async (personName: any) => {
    const querySnapshot = await collectionJobworkTeamPerson.where('personName', '==', personName).get();
    return !querySnapshot.empty;
};