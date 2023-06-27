import React, { useState, ChangeEvent, FormEvent, useEffect, CSSProperties } from 'react';
import { SlClose } from 'react-icons/sl'
import { agent, refreshSession } from '../../../utils';
import ClipLoader from "react-spinners/ClipLoader";

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
};
type props = {
    setShowCommentModal: React.Dispatch<React.SetStateAction<boolean>>;
    profileImg: string | undefined;
    caption: string | undefined;
    author: string | undefined;
    uri: string | undefined;
    cid: string | undefined;
}
const PostComments = ({ setShowCommentModal, profileImg, caption, author, uri, cid }: props) => {
    const [textFieldValue, setTextFieldValue] = useState('');
    const [avatarURL, setAvatarURL] = useState("");
    const [isReplying, setIsReplying] = useState(false);
    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setTextFieldValue(e.target.value);
    };

    const handleSubmit = async (e: FormEvent) => {
        setIsReplying(true);
        try {
            e.preventDefault();
            console.log(textFieldValue);
            if (uri === undefined && cid === undefined) return;
            await refreshSession();
            new Promise(resolve => {
                setTimeout(resolve, 5000);
            });
            // const response = await agent.post({ text: textFieldValue, reply: { root: { uri: uri!, cid: cid! }, parent: { uri: uri!, cid: cid! } } })
            // console.log(response);
            setIsReplying(false);
            setTextFieldValue('');
        } catch (error) {
            console.log(error);
            setIsReplying(false);
        }
        // Perform your desired operation or API call here
        // Update the status based on the operation result
    };

    useEffect(() => {
        chrome.storage.sync.get(["avatar"], function (result) {
            console.log("Value currently is " + result.avatar);
            setAvatarURL(result.avatar); // Set the state within the callback
            console.log(result.avatar);
        });
    }, []);



    return (
        <div className='flex justify-center items-center p-4 min-w-[400px]'>


            <div className="bg-white rounded-lg shadow-lg p-6 w-full">
                {/* Header */}
                <div className="flex justify-between mb-2">
                    <button
                        onClick={() => setShowCommentModal(false)}
                        className="px-4 rounded-md focus:outline-none font-bold text-xl"
                    >
                        <SlClose />
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 bg-blue-500 text-white text-md py-2 rounded-lg focus:outline-none"
                    >
                        {isReplying ? <ClipLoader
                            color={'#ffffff'}
                            loading={isReplying}
                            cssOverride={override}
                            size={150}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        /> : "Reply"}
                    </button>
                </div>

                {/* Data Section */}
                <div className='flex gap-2 border-y-2 border-slate-300 py-2'>
                    <div className='w-10 h-10 flex-shrink-0'>
                        <img src={profileImg} alt="" className='rounded-full w-10 h-10 aspect-square' />
                    </div>
                    <div>
                        <p className='text-lg'>{author}</p>
                        <p className='text-md line-clamp-3'>{caption}</p>
                    </div>
                </div>

                {/* Text Field */}

                <div className="flex gap-1 items-start my-4">
                    <div className='w-10 h-10 flex-shrink-0'>
                        <img src={avatarURL} alt="profile-img" className='rounded-full w-10 h-10 aspect-square' />
                    </div>
                    <div className='w-full'>
                        <textarea
                            value={textFieldValue}
                            onChange={handleInputChange}
                            placeholder='Write your reply'
                            className='w-full h-20 px-3 py-1 border-none resize-none focus:outline-none'
                        ></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostComments;
