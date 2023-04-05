import json
from langchain.output_parsers import CommaSeparatedListOutputParser
from langchain.prompts import PromptTemplate, ChatPromptTemplate, HumanMessagePromptTemplate
from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI

def router(event, context):
    payload = json.loads(event["body"])
    text_list = "\n".join(payload["messages"])
    preference = payload["preference"]

    output_parser = CommaSeparatedListOutputParser()
    format_instructions = output_parser.get_format_instructions()
    prompt = PromptTemplate(
        template="The user has the following preference: {preference}. \n"
                "The following is a list of texts, with each line representing a separate item. " 
                "Please indicate with a 'yes' or 'no' whether the user would like to read each item in the list.\n"
                "{text_list}\n{format_instructions}",
        input_variables=["preference", "text_list"],
        partial_variables={"format_instructions": format_instructions}
    )

    # preference = "I dislike Elon Musk and politics. I like reading about adademic."
    # text_list = """
    # Serena Ge@serenaa_ge·5hLmao “girls don’t appreciate my engineering rizz”18873
    # Jane Manchun Wong@wongmjane·12hVercel is working on Docs AIread image descriptionALT1130545111.4K
    # Wingstop@wingstopThe perfect cure.wingstop.comOrder Wingstop332293.8K
    # Eugene Yan@eugeneyan·1h @LangChainAI meetup in Seattle was 🔥 Got the chance to query the @yoheinakajima LLM over drinks
    # """
    model = OpenAI(temperature=0)
    _input = prompt.format(preference=preference, text_list=text_list)
    output = model(_input)
    return json.dumps(output_parser.parse(output))
