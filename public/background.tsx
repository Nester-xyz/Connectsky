import { agent, refreshSession } from "../src/utils";
type typeValue = "popup" | "normal" | "panel";
let responseReceived: boolean = false;

function createWindow() {
  // Define variables for the window properties
  let redirect = "../index.html";
  let type: typeValue = "popup";
  let width = 400;
  let height = 600;
  let screenLeft: number;
  let screenTop: number;
  // Get the display info and calculate the center of the screen
  chrome.system.display.getInfo((displayInfo) => {
    if (displayInfo.length > 0) {
      let primaryDisplay = displayInfo.find((display) => display.isPrimary);
      if (primaryDisplay) {
        screenLeft = Math.round(
          primaryDisplay.bounds.left + (primaryDisplay.bounds.width - width) / 2
        );
        screenTop = Math.round(
          primaryDisplay.bounds.top +
            (primaryDisplay.bounds.height - height) / 2
        );
      } else {
        screenLeft = 400;
        screenTop = 800;
      }

      // Create the new window at the center of the screen
      chrome.windows.create(
        {
          url: redirect,
          type: type,
          width: width,
          height: height,
          left: screenLeft,
          top: screenTop,
        },
        (window) => {
          console.log("Window opened:", window);
        }
      );
    } else {
      // Handle error - no displays found
      console.error("No displays found");
    }
  });
}

// function to either create a window / display login page
function onClickHandler() {
  chrome.storage.sync.get("isLoggedIn", function (result) {
    if (result.isLoggedIn) {
      createWindow();
      console.log(result.isLoggedIn + "yes worked");
    } else {
      chrome.tabs.create({ url: "./welcome.html" });
    }
  });
}

// Reading message passed from Welcome.tsx to either create a window / display login page
chrome.action.onClicked.addListener(onClickHandler);

//Login page redirect once installing the app
chrome.runtime.onInstalled.addListener(function () {
  chrome.tabs.create({ url: "./welcome.html" });
});

// Message passing from loginSuccess to create a window after logging from welcome.tsx
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.isWindowCreate !== undefined) {
    createWindow();
    sendResponse({ message: "createWindow has been successfully triggered!" });
  }
});


// Icon Notification Counter
chrome.action.setBadgeBackgroundColor({ color: '#005063' });
function updateBadgeText(text: string | number | null) {
  if (typeof text === 'number') {
    chrome.action.setBadgeText({ text: text.toString() });
  } else if (typeof text === 'string') {
    chrome.action.setBadgeText({ text });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
}



async function getUnreadNotifications() {
  try {
    await refreshSession();
    const { data } = await agent.countUnreadNotifications();
    const counter = data.count;

    if (counter > 9) {
      updateBadgeText("9+");
    } else if (counter === 0) {
     updateBadgeText(null)
    } else {
      updateBadgeText(counter);
    }
  } catch (error) {
    console.log(error);
  }
}


//checks for notifications in 2 minutes interval
setInterval(getUnreadNotifications, 20000);
