import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    secure:process.env.NODE_ENV!=='development'?true:false,
});
//accepts base64 image
export async function uploadImage(imageString){
    try {
        const results = await cloudinary.uploader.upload(imageString);
        return results;  
    } catch (error) {
        console.log(error);
        return null;
    } 
}