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
    text_list = "\n".join(payload["messages"])
    preference = payload["preference"]

    output_parser = CommaSeparatedListOutputParser()
    format_instructions = output_parser.get_format_instructions()
    model = ChatOpenAI(model="gpt-3.5-turbo", model_kwargs={'temperature': 0})

    messages = [
        SystemMessage(content="You are a helpful assistant that can classify whether each item in a list fits user preference. The labels you can use are yes or no."),
        HumanMessage(content="Here is the user\'s preference:"),
        HumanMessage(content=preference),
        HumanMessage(content="Here is a list of texts. Please indicate with a 'yes' or 'no' whether the user would like to read each item in the list based on the above preference."),
        HumanMessage(content=text_list),
        HumanMessage(content=format_instructions),
    ]

    # print(messages)
    output = model(messages)
    print("MODEL OUTPUT", output.content)
    output = output_parser.parse(output.content)
    # Convert yes or no to boolean by first converting to lowercase
    output = [True if x.lower() == "yes" else False for x in output]
    return json.dumps(output)

if __name__ == "__main__":
    tweets = """Max Tegmark@tegmark·4h·Only 4% of Americans strongly disagree with the proposed pause on AI more powerful than #GPT4, so loud pause critics linked to big tech aren\'t representative. Upton Sinclair said "It is difficult to get a man to understand something, when his salary depends on his not…\xa0Show more586628142.1K
                Andrew Carr@andrew_n_carr·46mWow the new Segment Anything model from Meta is pretty amazingread image descriptionALT8516
                The Daily Show RetweetedJordan Klepper@jordanklepper·4hA curious public demands more volleyball clarity.Quote TweetThe Daily Show@TheDailyShow·5h.@jordanklepper got to ask George Santos a few important questions at Trump\'s arraignment.491251,494221.6K
                NYU AI School \'23@nyuaischool·21hLast 2 days to apply to the NYU AI School 2023 for a unique, in-person experience with leading researchers from NYU, Google, and more! We\'re working on rolling admissions so if you\'re waiting to submit your application we encourage you to do it soon :)nyu-mll.github.ioNYU AI SchoolNYU AI School3161,804
                disney adult catholic convert@synanthropy·3h> be me> browsing lex in the bathtub looking 4 gay apartments> someone is offering a FREE book of mormon ticket tonight?!> hellyeah> shower fast; scarf down dinner; sprint 2 train> 30min early to theater> meet my new friend outside> showtime!> watch musical> it\'s reddit.3521,030
                Andrew Carr@andrew_n_carr·24malchemy15322
                Akiyoshi Kitaoka@AkiyoshiKitaoka·12h久しぶりに作った。92131,25489.7KShow this thread
                Jonathan Fischoff@jfischoff·1hTencent released the model and code for their text2video system. There model is very similar to SD but with a 3D U-Net. I was most interested in the design of their U-Net, but there were a ton of details, however, I found this section interesting in light of more recent work.Quote TweetAK@_akhaliq·2h1:05Latent Video Diffusion Models for High-Fidelity Long Video Generationgithub: https://github.com/VideoCrafter/VideoCrafter…project page: https://yingqinghe.github.io/LVDM/Show this thread19337,243Show this thread
                Andrew White@andrewwhite01·2hI\'m building an interface to agents in @LangChainAI - is there a way to get hooks/events of some kind to get feedback on progress?3142,472
                Harrison Chase@hwchase17·2hReplying to @andrewwhite01 and @LangChainAIwe have a concept of callbacks - we use it for streamingits not super well documented, but see here for an example:github.comchat-langchain/main.py at master · hwchase17/chat-langchainContribute to hwchase17/chat-langchain development by creating an account on GitHub.191,139"""
    tweets = list(map(lambda x: x.strip(), tweets.split("\n")))
    event = {
        "body": json.dumps({
            "messages": tweets,
            "preference": "I dislike Elon Musk and politics. I like reading about adademic research."
        })
    }
    print(router(event, None))