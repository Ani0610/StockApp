import storage from '@react-native-firebase/storage';
import { storagPath } from '../firebaseConfig';

export const uploadMultiImages = async (images:any[]) => {
    try {
      const uploadPromises = images.map(async (image, index) => {
        const currentTimeStampInMillis = new Date().getTime();
        const reference = storage().ref(`${storagPath}/design/image${currentTimeStampInMillis}_${index}`);
        await reference.putFile(image.uri);
        const downloadURL = await reference.getDownloadURL();
        console.log('File uploaded successfully:', downloadURL);
        return downloadURL;
      });

      const downloadURLs = await Promise.all(uploadPromises);
      return downloadURLs;
      console.log('All files uploaded successfully:', downloadURLs);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  export const uploadSingleImage=async(image:any,type:string)=>{
    try {
      const currentTimeStampInMillis = new Date().getTime();
      const reference = storage().ref(`${storagPath}/${type}/image${currentTimeStampInMillis}`);
      await reference.putFile(image.uri);
      const downloadURL = await reference.getDownloadURL();
      console.log('File uploaded successfully:', downloadURL);
      return downloadURL;
    } catch (error) {
      
    }
  }
