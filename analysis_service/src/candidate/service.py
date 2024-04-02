import json
import os
import time
from datetime import datetime

import jsbeautifier
from langchain.schema import HumanMessage, SystemMessage
from langchain_community.document_loaders import Docx2txtLoader, PyPDFLoader
from langchain_openai import ChatOpenAI
from src.candidate.config import candidate_config
from src.candidate.prompts import fn_candidate_analysis, system_prompt_candidate
from src.utils import LOGGER


async def save_cv_candidate(file):
    # Prepend the current datetime to the filename
    file_name = datetime.now().strftime("%Y%m%d%H%M%S-") + file.filename

    # Construct the full image path based on the settings
    image_path = candidate_config.CV_UPLOAD_DIR + file_name

    # Read the contents of the uploaded file asynchronously
    contents = await file.read()

    # Write the uploaded contents to the specified image path
    with open(image_path, "wb") as f:
        f.write(contents)

    return file_name


def output2json(output):
    """GPT Output Object >>> json"""
    opts = jsbeautifier.default_options()
    return json.loads(jsbeautifier.beautify(output["function_call"]["arguments"], opts))


def load_pdf_docx(file_path):
    # Determine the file type and choose the appropriate loader
    if os.path.basename(file_path).lower().endswith((".pdf", ".docx")):
        loader = (
            PyPDFLoader(file_path)
            if file_path.lower().endswith(".pdf")
            else Docx2txtLoader(file_path)
        )

    # Load and split the document using the selected loader
    documents = loader.load_and_split()

    return documents


def read_cv_candidate(file_name):
    file_path = candidate_config.CV_UPLOAD_DIR + file_name

    documents = load_pdf_docx(file_path=file_path)
    content = ""
    for page in documents:
        content += page.page_content
    return content


def analyse_candidate(cv_content):
    start = time.time()
    LOGGER.info("Start analyse candidate")

    llm = ChatOpenAI(model=candidate_config.MODEL_NAME, temperature=0.5)
    completion = llm.predict_messages(
        [
            SystemMessage(content=system_prompt_candidate),
            HumanMessage(content=cv_content),
        ],
        functions=fn_candidate_analysis,
    )

    output_analysis = completion.additional_kwargs
    json_output = output2json(output=output_analysis)

    LOGGER.info("Done analyse candidate")
    LOGGER.info(f"Time analyse candidate: {time.time() - start}")

    return json_output
