import React from "react";
import { Context } from "vm";
import { activePageCheck } from "../utils";

export const appContext = React.createContext<{
    setPostText: (text: string) => void,
    postText: string,
    fileRef: React.RefObject<HTMLInputElement>,
    setUploadedFile: (file: Uint8Array | null) => void,
    uploadedFile: Uint8Array | null
    setActivePage: (page: activePageCheck) => void;
}>(
    {
        setPostText: (text: string) => { },
        postText: '',
        fileRef: React.createRef<HTMLInputElement>(),
        setUploadedFile: (file: Uint8Array | null) => { },
        uploadedFile: null,
        setActivePage: (page: activePageCheck) => { }
    }
);