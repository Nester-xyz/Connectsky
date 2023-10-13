import axios from 'axios';
import { BskyAgent, AtpSessionData, AtpSessionEvent } from "@atproto/api";

const agent = new BskyAgent({
    service: "https://bsky.social",
    persistSession: (_evt: AtpSessionEvent, sess?: AtpSessionData) => {
        console.log(sess);
        const sessData = JSON.stringify(sess)
        chrome.storage.sync.set({sessData}, function() {
            console.log("Value is set to" + sessData);
          })
    
        console.log("storing done")
    },
});

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response?.status === 401) {
            chrome.storage.sync.get(['sessData'], (result) => {
                const sessData = result.sessData;
                if (sessData) {
                    const sessParse = JSON.parse(sessData);
                    agent.resumeSession(sessParse)
                        .then(({ data }) => {
                            console.log(data);
                            return axios.request(error.config);
                        })
                        .catch((err) => {
                            console.error(err);
                            return Promise.reject(error);
                        });
                }
            });
              
            // if (sessData !== null) {
            //     const sessParse = JSON.parse(sessData);
            //     const { data } = await agent.resumeSession(sessParse);
            //     console.log(data);
            //     return axios.request(error.config);
            // }
        }
        return Promise.reject(error);
    }
);
