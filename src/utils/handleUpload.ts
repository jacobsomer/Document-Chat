/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {supportedExtensions} from "./consts";

const isSupported = (file: File): boolean => {
    const extension = file.name.split(".").pop();
    return supportedExtensions.includes(extension|| "");
}

const handleObjectUploadURL = "https://chat-boba-extract-fhpwesohfa-ue.a.run.app/createEmbeddingForObject"

const handleTextUploadURL = "https://chat-boba-extract-fhpwesohfa-ue.a.run.app/createEmbeddingForText"


export const handleObjectUpload = async (url: string, userID: string): Promise<string> => {
    const response = await fetch(handleObjectUploadURL, {
        method: "POST",
        body: JSON.stringify({
            url: url,
            userID: userID,
        })
    });
    const data = await response.json();
    return data
}

export const handleTextUpload = async (url: string, text: string, userID: string): Promise<string> => {
    const response = await fetch(handleTextUploadURL, {
        method: "POST",
        body: JSON.stringify({
            url: url,
            text: text,
            userID: userID,
        })
    });
    const data = await response.json();
    return data
}


    