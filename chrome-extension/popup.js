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

    // Get the value of checkbox with id twitter, zhihu:
    var twitter_val = document.getElementById('twitter').checked;
    var zhihu_val = document.getElementById('zhihu').checked;
    chrome.storage.sync.set({ "twitter": twitter_val, "zhihu": zhihu_val }).then(() => {
        console.log("Twitter: " + twitter_val + ", Zhihu: " + zhihu_val);
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

    // Get the value of twitter, zhihu from storage and set it to the checkbox
    chrome.storage.sync.get(["twitter", "zhihu"]).then((result) => {
        if (result.twitter == null) {
            result.twitter = true;
        }
        if (result.zhihu == null) {
            result.zhihu = true;
        }
        document.getElementById('twitter').checked = result.twitter;
        document.getElementById('zhihu').checked = result.zhihu;
    });

    document.getElementById('save-button').addEventListener('click', saveOptions);
});
