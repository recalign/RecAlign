// document.body.innerHTML = document.body.innerHTML.replace("Programming Language", "ChatGPT"); // replace content a and content b with required text
console.log("hey this might be working.")

// // Run after 5 seconds
// setTimeout(function() {

function clean() {
    var articles = document.querySelectorAll("article[data-testid='tweet']");
    // Make an empty list
    var tweets = [];
    console.log(articles);
    // // Iterate over the divs
    for (var i = 0; i < articles.length; i++) {
        // Print the text content of the div
        // Add the content to tweets:
        tweets.push(articles[i].textContent.replaceAll("\n", ""));
    }

    preference = "I like reading about adademic research on AI.";
    // Make a json object with the tweets and preference
    var data = {
        "messages": tweets,
        "preference": preference
    };
    console.log(data);
    // Send the data to the server and log the response to console
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://hiubwe6637gmpslsccd4ofi3de0yaeqa.lambda-url.us-east-2.on.aws/");
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
    xhr.onloadend = function() {
        console.log(xhr.responseText);
        // Parse the response
        var response = JSON.parse(xhr.responseText);
        // loop over response, which is a list of "yes" or "no", and remove the corresponding tweet
        // if the response is "no"
        for (var i = 0; i < response.length; i++) {
            if (!response[i]) {
                // Remove the closest parent div with data-testid="cellInnerDiv"
                articles[i].closest("div[data-testid='cellInnerDiv']").remove();
                console.log("removing tweet" + articles[i].textContent.replaceAll("\n", ""));
            } else {
                console.log("keeping tweet" + articles[i].textContent.replaceAll("\n", ""));
            }
        }
    }
}
// Run every 5 seconds for a maximum of 5 times
setTimeout(clean, 5000);