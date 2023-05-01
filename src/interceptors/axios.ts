import axios from 'axios';
import { BskyAgent, AtpSessionData, AtpSessionEvent } from "@atproto/api";

const agent = new BskyAgent({
    service: "https://bsky.social",
    persistSession: (_evt: AtpSessionEvent, sess?: AtpSessionData) => {
        console.log(sess);
        const sessData = JSON.stringify(sess)
        localStorage.setItem("sess", sessData);
        console.log("storing done")
    },
});

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response?.status === 401) {
            const sessData = localStorage.getItem("sess");
            if (sessData !== null) {
                const sessParse = JSON.parse(sessData);
                const { data } = await agent.resumeSession(sessParse);
                console.log(data);
                return axios.request(error.config);
            }
        }
        return Promise.reject(error);
    }
);
