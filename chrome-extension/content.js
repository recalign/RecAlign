// Set up a cache dictionary to store classification result for
// tweets that have been classified before.
var classification_cache = new Map();


function checkVisible(elm) {
    var rect = elm.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}

function clean_twitter() {
    // Check whether twitter is enabled
    chrome.storage.sync.get(["twitter"]).then((result) => {
        if (result.twitter == null) {
            result.twitter = true;
        }
        if (result.twitter) {
            console.log("Extension running...");
            // All tweet containers:
            var containers = document.querySelectorAll("article[data-testid='tweet']");
            var tweets = [];

            var filter = Array.prototype.filter,
                containers = filter.call(containers, function (container) {
                    return checkVisible(container);
                });

            // Only keep tweets that have not been classified before.
            var new_tweets = [];
            var new_container = [];
            for (var i = 0; i < containers.length; i++) {
                // Find the outermost div with data-testid="tweetText" and get the text content
                var txt_div = containers[i].querySelector("div[data-testid='tweetText']");
                if (txt_div == null) {
                    console.log("[DISCOVERY] fail to find tweet text for " + containers[i].textContent.replaceAll("\n", ""));
                    tweets.push("");
                    continue;
                }

                var tweet = txt_div.textContent.replaceAll("\n", "");
                tweets.push(tweet);

                // Partially hide tweets that have not been classified yet.
                parent = containers[i].closest("div[data-testid='cellInnerDiv']");
                if (!classification_cache.has(tweets[i]) && parent) {
                    parent.style.opacity = "0.3";
                }

                // If tweet is new, add it to the list of tweets and add article to filtered_articles and add tweet to cache
                if (!classification_cache.has(tweet)) {
                    new_tweets.push(tweet);
                    new_container.push(containers[i]);
                }
            }

            // If there are no new tweets, return
            if (new_tweets.length == 0) {
                return;
            }

            chrome.storage.sync.get(["preference", "openai_api_key"]).then((result) => {
                console.log("Preference is " + result.preference);
                var data = {
                    "messages": new_tweets,
                    "preference": result.preference,
                    "openai_api_key": result.openai_api_key,
                };

                // Send the data to the server and log the response to console
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "https://hiubwe6637gmpslsccd4ofi3de0yaeqa.lambda-url.us-east-2.on.aws/");
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.send(JSON.stringify(data));
                console.log("[Backend]", "Request sent...");
                xhr.onloadend = function () {
                    var response = JSON.parse(xhr.responseText);
                    console.log("[BACKEND]", response);
                    for (var i = 0; i < response.length; i++) {
                        // Set the cache to the corresponding response for the tweet
                        classification_cache.set(new_tweets[i], response[i]);
                    }

                    for (var i = 0; i < containers.length; i++) {
                        // If the cache does not contain the tweet, log the error
                        if (!classification_cache.has(tweets[i])) {
                            console.log("[ERROR] cache does not contain tweet " + new_tweets[i]);
                            continue;
                        }
                        var keep = classification_cache.get(tweets[i]);
                        if (!keep) {
                            // Find and hide the closest parent div with data-testid="cellInnerDiv"
                            containers[i].closest("div[data-testid='cellInnerDiv']").style.display = "none";
                            console.log("[REMOVE] tweet" + containers[i].textContent.replaceAll("\n", ""));
                        } else {
                            // Set opacity to 1
                            containers[i].closest("div[data-testid='cellInnerDiv']").style.opacity = "1";
                            console.log("[KEEP] keeping tweet" + containers[i].textContent.replaceAll("\n", ""));
                        }
                    }
                }
            });
        }
    });
}

function clean_zhihu() {
    // Check whether zhihu is enabled
    chrome.storage.sync.get(["zhihu"]).then((result) => {
        if (result.zhihu == null) {
            result.zhihu = true;
        }
        if (result.zhihu) {
            console.log("Zhihu extension running...");
            // All tweet containers:
            var containers = document.querySelectorAll(".Card.TopstoryItem");
            var tweets = [];

            // Only keep tweets that have not been classified before.
            var new_tweets = [];
            var new_container = [];
            for (var i = 0; i < containers.length; i++) {
                // Find the outermost div with data-testid="tweetText" and get the text content
                // var txt_div = containers[i].querySelector("div[data-testid='tweetText']");
                var if_adver = containers[i].querySelector(".ContentItem");
                if (if_adver == null) {
                    console.log("This is an adver");
                    // console.log(containers[i].textContent)
                    var tweet = `This is an advertisement ${i}`;
                    containers[i].style.display = "none";
                    // tweets.push(tweet);
                } else {
                    console.log("This is not an adver")
                    // console.log(`error: ${i}`)
                    if (containers[i].querySelector(".ContentItem").dataset.zop) {

                        var author_and_title = JSON.parse(containers[i].querySelector(".ContentItem").dataset.zop);
                        var author = author_and_title.authorName;
                        var title = author_and_title.title;
                    } else {
                        var title = containers[i].querySelector(".ContentItem").querySelector(".QuestionItem-title").textContent;
                        var author = "";
                    }
                    var main_text = containers[i].querySelector(".ContentItem").querySelector(".RichText.ztext").textContent.replaceAll("\n", "");
                    var tweet = `Author: ${author}, Title: ${title}, Previous: ${main_text}`;
                    console.log(tweet)
                }

                tweets.push(tweet);
                // If tweet is new, add it to the list of tweets and add article to filtered_articles and add tweet to cache
                if (!classification_cache.has(tweet)) {
                    new_tweets.push(tweet);
                    new_container.push(containers[i]);
                }
            }

            // If there are no new tweets, return
            if (new_tweets.length == 0) {
                return;
            }

            chrome.storage.sync.get(["preference"]).then((result) => {
                console.log("Value currently is " + result.preference);
                preference = result.preference;
                var data = {
                    "messages": new_tweets,
                    "preference": preference
                };

                // Send the data to the server and log the response to console
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "https://hiubwe6637gmpslsccd4ofi3de0yaeqa.lambda-url.us-east-2.on.aws/");
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.send(JSON.stringify(data));
                console.log("[Backend]", "Request sent...");
                xhr.onloadend = function () {
                    var response = JSON.parse(xhr.responseText);
                    console.log("[BACKEND]", response);
                    for (var i = 0; i < response.length; i++) {
                        // Set the cache to the corresponding response for the tweet
                        classification_cache.set(new_tweets[i], response[i]);
                    }

                    for (var i = 0; i < containers.length; i++) {
                        // If the cache does not contain the tweet, log the error
                        if (!classification_cache.has(tweets[i])) {
                            console.log("[ERROR] cache does not contain tweet: " + tweets[i]);
                            continue;
                        }
                        var keep = classification_cache.get(tweets[i]);
                        if (!keep) {
                            // Find and hide the closest parent div with data-testid="cellInnerDiv"
                            containers[i].style.display = "none";
                            console.log("[REMOVE] tweet: " + tweets[i]);
                        } else {
                            console.log("[KEEP] keeping tweet: " + tweets[i]);
                        }
                    }
                }
            });
        }
    });
}

// Run every 3 seconds.
setInterval(function () {
    // Prevent multiple instances from running at the same time.
    if (this.inProgress) {
        return;
    }
    this.inProgress = true;

    // If the user is on Twitter, run the Twitter extension
    if (window.location == "https://twitter.com/home" || window.location == "https://www.twitter.com/home") {
        clean_twitter();
        // If the user is on Zhihu, run the Zhihu extension
    } else if (window.location == "https://www.zhihu.com/" || window.location == "https://www.zhihu.com/follow") {
        clean_zhihu();
    }
    this.inProgress = false;
}, 3000);