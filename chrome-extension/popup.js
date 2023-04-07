function saveOptions() {
    // Get the value of text inside textarea with id preference:
    var preference_val = document.getElementById('preference').value;
    chrome.storage.sync.set({ "preference": preference_val }).then(() => {
        console.log("Value is set to " + preference_val);
    });

    // Get value of text inside textarea with id openai-api-key:
    var openai_api_key_val = document.getElementById('openai-api-key').value;
    chrome.storage.sync.set({ "openai_api_key": openai_api_key_val }).then(() => {
        console.log("OpenAI API key saved.");
    });
}

window.addEventListener('load', function () {
    // Get the value of preference from storage and set it to the textarea
    chrome.storage.sync.get(["preference"]).then((result) => {
        console.log("Value currently is " + result.preference);
        if (result.preference == null || result.preference == "") {
            result.preference = "";
            document.getElementById('preference').classList.add("is-invalid");
        }
        document.getElementById('preference').value = result.preference;
    });

    // Get the value of openai_api_key from storage and set it to the textarea
    chrome.storage.sync.get(["openai_api_key"]).then((result) => {
        if (result.openai_api_key == null || result.openai_api_key == "") {
            result.openai_api_key = "";
            document.getElementById('openai-api-key').classList.add("is-invalid");
            document.getElementById('openai-api-key').value = "";
        } else {
            // Mask the API key with asterisks except for the initial few letters.
            var masked_key = result.openai_api_key.substring(0, 4) + "**********";
            document.getElementById('openai-api-key').value = masked_key;
        }
        
    });
    document.getElementById('save-button').addEventListener('click', saveOptions);
});
