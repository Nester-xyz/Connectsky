chrome.action.onClicked.addListener((tab) => {
  // Define variables for the window properties
  let redirect = "../index.html";
  let type = "popup";
  let width = 400;
  let height = 600;

  // Get the display info and calculate the center of the screen
  chrome.system.display.getInfo((displayInfo) => {
    if (displayInfo.length > 0) {
      let primaryDisplay = displayInfo.find((display) => display.isPrimary);
      let screenLeft = Math.round(
        primaryDisplay.bounds.left + (primaryDisplay.bounds.width - width) / 2
      );
      let screenTop = Math.round(
        primaryDisplay.bounds.top + (primaryDisplay.bounds.height - height) / 2
      );

      // Create the new window at the center of the screen
      chrome.windows.create({
        url: redirect,
        type: type,
        width: width,
        height: height,
        left: screenLeft,
        top: screenTop,
      });
    } else {
      // Handle error - no displays found
      console.error("No displays found");
    }
  });
});
