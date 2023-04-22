type typeValue = "popup" | "normal" | "panel";

chrome.action.onClicked.addListener((tab) => {
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
});

//Login page redirect once installing the app
chrome.runtime.onInstalled.addListener(function() {
  chrome.tabs.create({ url: "./welcome.html" });
});

//To create same login welcome page while clicked on extension icon
chrome.action.onClicked.addListener(function(tab) {
  chrome.tabs.create({ url: chrome.runtime.getURL("./welcome.html") });
});
