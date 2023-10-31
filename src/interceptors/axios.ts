import axios from "axios";
import { BskyAgent, AtpSessionData, AtpSessionEvent } from "@atproto/api";

const agent = new BskyAgent({
  service: "https://bsky.social",
  persistSession: (_evt: AtpSessionEvent, sess?: AtpSessionData) => {
    console.log(sess);
    if (sess) {
      const sessData = JSON.stringify(sess);
      chrome.storage.sync.set({ sessData }, () => {
        console.log("Session data stored successfully!");
      });
    }
  },
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const result = await new Promise<{ sess?: string }>(
          (resolve, reject) => {
            chrome.storage.sync.get("sessData", (result) => {
              if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
              }
              resolve(result);
            });
          }
        );

        const sessData = result.sess;
        console.log(sessData);

        if (typeof sessData === "string") {
          const sessParse = JSON.parse(sessData);
          const { data } = await agent.resumeSession(sessParse);
          console.log(data);
          return axios.request(error.config);
        }
      } catch (storageError) {
        console.error("Error reading from chrome storage:", storageError);
      }
    }

    return Promise.reject(error);
  }
);
