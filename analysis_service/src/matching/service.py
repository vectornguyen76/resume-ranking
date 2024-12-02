import json
import time

import jsbeautifier
from langchain.schema import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from src.matching.config import matching_config
from src.matching.prompts import fn_matching_analysis, system_prompt_matching
from src.utils import LOGGER


def output2json(output):
    """GPT Output Object >>> json"""
    opts = jsbeautifier.default_options()
    return json.loads(jsbeautifier.beautify(output["function_call"]["arguments"], opts))


def generate_content(job, candidate):
    content = "\nRequirement:" + str(job) + "\nCandidate:" + str(candidate)
    return content


def analyse_matching(matching_data):
    start = time.time()
    LOGGER.info("Start analyse matching")

    content = generate_content(job=matching_data.job, candidate=matching_data.candidate)

    llm = ChatOpenAI(model=matching_config.MODEL_NAME, temperature=0.5)
    completion = llm.predict_messages(
        [
            SystemMessage(content=system_prompt_matching),
            HumanMessage(content=content),
        ],
        functions=fn_matching_analysis,
    )
    output_analysis = completion.additional_kwargs

    json_output = output2json(output=output_analysis)

    # Extract scores and store them in a list
    weights = {
        "degree": 0.1,  # The importance of the candidate's degree
        "experience": 0.2,  # The weight given to the candidate's relevant work experience
        "technical_skill": 0.3,  # Weight for technical skills and qualifications
        "responsibility": 0.25,  # How well the candidate's past responsibilities align with the job
        "certificate": 0.1,  # The significance of relevant certifications
        "soft_skill": 0.05,  # Importance of soft skills like communication, teamwork, etc.
    }
    total_weight = 0
    weighted_score = 0

    for section in json_output:
        if section != "summary_comment":
            weighted_score += int(json_output[section]["score"]) * weights[section]
            total_weight += weights[section]

    final_score = weighted_score / total_weight

    json_output["score"] = final_score

    LOGGER.info("Done analyse matching")
    LOGGER.info(f"Time analyse matching: {time.time() - start}")

    return json_output
