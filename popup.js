const toggle = document.getElementById("toggleStraight");

chrome.storage.sync.get(["enabled"], (result) => {
  toggle.checked = !!result.enabled;
});

toggle.addEventListener("change", () => {
  chrome.storage.sync.set({ enabled: toggle.checked });
});
