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
    prompt = PromptTemplate(
        template="The user has the following preference:\n {preference}. \n"
                "The following is a list of texts, with each line representing a separate item. " 
                "Please indicate with a 'yes' or 'no' whether the user would like to read each item in the list based on the above preference.\n"
                "{text_list}\n{format_instructions}",
        input_variables=["preference", "text_list"],
        partial_variables={"format_instructions": format_instructions}
    )

    # preference = "I dislike Elon Musk and politics. I like reading about adademic research."
    # text_list = """
    # Serena Ge@serenaa_ge·5hLmao “girls don’t appreciate my engineering rizz”18873
    # Jane Manchun Wong@wongmjane·12hVercel is working on Docs AIread image descriptionALT1130545111.4K
    # Wingstop@wingstopThe perfect cure.wingstop.comOrder Wingstop332293.8K
    # Eugene Yan@eugeneyan·1h @LangChainAI meetup in Seattle was 🔥 Got the chance to query the @yoheinakajima LLM over drinks
    # """
    model = ChatOpenAI(temperature=0, model="gpt-3.5-turbo")
    _input = prompt.format(preference=preference, text_list=text_list)

    messages = [
        SystemMessage(content="You are a helpful assistant that can classify whether each item in a list fits user preference. The labels you can use are yes or no."),
        HumanMessage(content=preference),
        HumanMessage(content="Here is a list of texts. Please indicate with a 'yes' or 'no' whether the user would like to read each item in the list based on the above preference."),
        HumanMessage(content=text_list),
        HumanMessage(content=format_instructions),
    ]

    print(_input)
    output = model(messages)
    print(output)
    output = output_parser.parse(output.content)
    # Convert yes or no to boolean by first converting to lowercase
    output = [True if x.lower() == "yes" else False for x in output]
    return json.dumps(output)

if __name__ == "__main__":
    event = {
        "body": json.dumps({
            "messages": [
                "Serena Ge@serenaa_ge·5hLmao “girls don’t appreciate my engineering rizz”18873",
                "Jane Manchun Wong@wongmjane·12hVercel is working on Docs AIread image descriptionALT1130545111.4K",
                "Wingstop@wingstopThe perfect cure.wingstop.comOrder Wingstop332293.8K"],
            "preference": "I dislike Elon Musk and politics. I like reading about adademic research."
        })
    }
    print(router(event, None))