import { Image } from "react-native";

export const GetImageAspectRatio = (uri, callback) => {
    Image.getSize(
        uri,
        (width, height) => {
            if (width && height) {
                callback(width / height);
            }
        },
        (error) => {
            console.error(`Couldn't get the image size, check the URI: ${error}`);
            callback(1); 
        }
    );
};