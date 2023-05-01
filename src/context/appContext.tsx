import React from "react";

export const appContext = React.createContext<{ setPostText: (text: string) => void, postText: string }>(
    {
        setPostText: (text: string) => { },
        postText: '',
    }
);