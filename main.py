import os
import json
from langchain.output_parsers import CommaSeparatedListOutputParser
from langchain.prompts import PromptTemplate, ChatPromptTemplate, HumanMessagePromptTemplate
from langchain.chat_models import ChatOpenAI
from langchain.schema import (
    AIMessage,
    HumanMessage,
    SystemMessage
)

def router(event, context):
    payload = json.loads(event["body"])
    # Prepend a index to each text in the list
    payload["messages"] = [f"{i+1}. {text}" for i, text in enumerate(payload["messages"])]
    api_key = payload["openai_api_key"]
    openai.api_key = api_key

    text_list = "\n".join(payload["messages"])
    preference = payload["preference"]

    output_parser = CommaSeparatedListOutputParser()
    format_instructions = output_parser.get_format_instructions()
    model = ChatOpenAI(model="gpt-3.5-turbo", model_kwargs={'temperature': 0})

    messages = [
        SystemMessage(content="You are a reading assistant that classifies whether each item in a list fits user preference. The labels you can use are yes or no."),
        HumanMessage(content="Here is my preference:"),
        HumanMessage(content=preference),
        HumanMessage(content="Here is a list of texts. Please indicate with a 'yes' or 'no' whether I would like to read each item in the list based on the above preference."),
        HumanMessage(content=text_list),
        HumanMessage(content=format_instructions),
    ]

    output = model(messages)
    # print("MODEL OUTPUT", output.content)
    output = output_parser.parse(output.content)
    output = [True if x.lower() == "yes" else False for x in output]
    retval = json.dumps(output)

    # Reset the API key
    openai.api_key = ""

    return retval

if __name__ == "__main__":
    tweets = """Max Tegmark@tegmark·4h·Only 4% of Americans strongly disagree with the proposed pause on AI more powerful than #GPT4, so loud pause critics linked to big tech aren\'t representative. Upton Sinclair said "It is difficult to get a man to understand something, when his salary depends on his not…\xa0Show more586628142.1K
                Andrew Carr@andrew_n_carr·46mWow the new Segment Anything model from Meta is pretty amazingread image descriptionALT8516
                The Daily Show RetweetedJordan Klepper@jordanklepper·4hA curious public demands more volleyball clarity.Quote TweetThe Daily Show@TheDailyShow·5h.@jordanklepper got to ask George Santos a few important questions at Trump\'s arraignment.491251,494221.6K
                NYU AI School \'23@nyuaischool·21hLast 2 days to apply to the NYU AI School 2023 for a unique, in-person experience with leading researchers from NYU, Google, and more! We\'re working on rolling admissions so if you\'re waiting to submit your application we encourage you to do it soon :)nyu-mll.github.ioNYU AI SchoolNYU AI School3161,804"""
    tweets = list(map(lambda x: x.strip(), tweets.split("\n")))
    event = {
        "body": json.dumps({
            "messages": tweets,
            "preference": "I like reading about adademic research."
        })
    }
    print(router(event, None))