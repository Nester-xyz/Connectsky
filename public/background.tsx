type typeValue = "popup" | "normal" | "panel";
let responseReceived: boolean = false;

// Define an onclick listener for the tab creation event
function onClickedHandler(tab) {
  // Create the new window at the center of the screen
  chrome.tabs.create({ url: "./welcome.html" });
}

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

// Reading message passed from Welcome.tsx to either create a window / display login page
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request === true) {
    createWindow();
    chrome.action.onClicked.addListener(createWindow);
    responseReceived = true;
    console.log("Received message with value of true");
    sendResponse(true); // Send a response indicating that the message was received
    chrome.action.onClicked.removeListener(onClickedHandler);
  }
});

// Add the onclick listener to the action button
if (responseReceived === false) {
  chrome.action.onClicked.addListener(onClickedHandler);
} else {
  chrome.action.onClicked.removeListener(onClickedHandler);
}

//Login page redirect once installing the app
chrome.runtime.onInstalled.addListener(function () {
  chrome.tabs.create({ url: "./welcome.html" });
});
