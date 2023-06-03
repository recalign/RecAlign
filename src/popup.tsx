function saveOptions(): void {
    // Get the value of text inside textarea with id preference:
    // const preference_val: string = (document.getElementById('preference') as HTMLTextAreaElement).value;
    // chrome.storage.sync.set({ "preference": preference_val }).then(() => {
    //     console.log("Value is set to " + preference_val);
    // });

    // Get the list of tags from the DOM
    const tags = Array.from(document.querySelectorAll('.tag'));

    // Create a new array of preference objects
    const preferences = tags.map((tag) => {
        const name = tag.querySelector('.tag-name')!.textContent;
        const enabled = (tag.querySelector('input[type="checkbox"]') as HTMLInputElement)!.checked;
        return { name, enabled };
    });

    // Save the preferences array to storage
    chrome.storage.sync.set({ preferences }).then(() => {
        console.log("Preferences saved:", preferences);
    });

    // Get value of text inside textarea with id openai-api-key:
    const openai_api_key_val: string = (document.getElementById('openai-api-key') as HTMLTextAreaElement).value;
    chrome.storage.sync.set({ "openai_api_key": openai_api_key_val }).then(() => {
        console.log("OpenAI API key saved.");
    });

    // Get the value of checkbox with id twitter, zhihu:
    const twitter_val: boolean = (document.getElementById('twitter') as HTMLInputElement).checked;
    const zhihu_val: boolean = (document.getElementById('zhihu') as HTMLInputElement).checked;
    chrome.storage.sync.set({ "twitter": twitter_val, "zhihu": zhihu_val }).then(() => {
        console.log("Twitter: " + twitter_val + ", Zhihu: " + zhihu_val);
    });
}


function createPreferenceTag(name: string, enabled: boolean): HTMLElement {
    const tag = document.createElement('span');
    tag.className = 'tag';
    
    const tagName = document.createElement('span');
    tagName.className = 'tag-name';
    tagName.textContent = name;
    tag.appendChild(tagName);
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = enabled;
    tag.appendChild(checkbox);
    
    return tag;
}

function addPreference() {
    const input = document.getElementById('preference') as HTMLInputElement;
    const preferenceName = input.value.trim();
    
    if (preferenceName) {
        const tagContainer = document.getElementById('tag-container')!;
        const tag = createPreferenceTag(preferenceName, true);
        tagContainer.appendChild(tag);
    
        input.value = '';
    }
}


window.addEventListener('load', function (): void {
    // Get the value of preference from storage and set it to the textarea
    // chrome.storage.sync.get(["preference"]).then((result: { [key: string]: any }) => {
    //     console.log("Value currently is " + result.preference);
    //     if (result.preference == null || result.preference == "") {
    //         result.preference = "";
    //         (document.getElementById('preference') as HTMLTextAreaElement).classList.add("is-invalid");
    //     }
    //     (document.getElementById('preference') as HTMLTextAreaElement).value = result.preference;
    // });

    // Load the preferences from storage and display them as tags
    chrome.storage.sync.get(["preferences"]).then((result: { [key: string]: any }) => {
        const tagContainer = document.getElementById('tag-container')!;
        const preferences = result.preferences || [];

        preferences.forEach((pref: { name: string, enabled: boolean }) => {
        const tag = createPreferenceTag(pref.name, pref.enabled);
        tagContainer.appendChild(tag);
        });
    });

    // Get the value of openai_api_key from storage and set it to the textarea
    chrome.storage.sync.get(["openai_api_key"]).then((result: { [key: string]: any }) => {
        if (result.openai_api_key == null || result.openai_api_key == "") {
            result.openai_api_key = "";
            (document.getElementById('openai-api-key') as HTMLTextAreaElement).classList.add("is-invalid");
            (document.getElementById('openai-api-key') as HTMLTextAreaElement).value = "";
        } else {
            (document.getElementById('openai-api-key') as HTMLTextAreaElement).value = result.openai_api_key;
        }
        
    });

    // Get the value of twitter, zhihu from storage and set it to the checkbox
    chrome.storage.sync.get(["twitter", "zhihu"]).then((result: { [key: string]: any }) => {
        if (result.twitter == null) {
            result.twitter = true;
        }
        if (result.zhihu == null) {
            result.zhihu = true;
        }
        (document.getElementById('twitter') as HTMLInputElement).checked = result.twitter;
        (document.getElementById('zhihu') as HTMLInputElement).checked = result.zhihu;
    });

    document.getElementById('save-button')!.addEventListener('click', saveOptions);
    document.getElementById('add-preference-button')!.addEventListener('click', addPreference);

});
