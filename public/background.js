chrome.action.onClicked.addListener((tab) => {
  chrome.windows.create(
    {
      url: "../index.html",
      type: "popup",
      width: 800,
      height: 600,
    },
    (window) => {
      console.log("Window opened:", window);
    }
  );
});
