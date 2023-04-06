function saveOptions() {
    // Get the value of text inside textarea with id preference:
    var preference_val = document.getElementById('preference').value;
    chrome.storage.sync.set({ "preference": preference_val }).then(() => {
        console.log("Value is set to " + preference_val);
    });
}

window.addEventListener('load', function () {
    // Get the value of preference from storage and set it to the textarea
    chrome.storage.sync.get(["preference"]).then((result) => {
        console.log("Value currently is " + result.preference);
        document.getElementById('preference').value = result.preference;
    });
    document.getElementById('save-button').addEventListener('click', saveOptions);
});
