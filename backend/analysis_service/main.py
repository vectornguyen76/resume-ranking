import ast
import json
import logging
import os
import time

import config
import jsbeautifier
import openai
from analysis_service.function_template import *
from langchain.chat_models import ChatOpenAI
from langchain.document_loaders import Docx2txtLoader, PyPDFLoader
from langchain.schema import HumanMessage, SystemMessage

# Create logger for this module
logger = logging.getLogger("app")
model_name = "gpt-3.5-turbo-16k"
# model_name = "gpt-4"


def output2json(output):
    """GPT Output Object >>> json"""
    # output_string = ast.literal_eval(output.function_call.arguments)
    opts = jsbeautifier.default_options()
    return json.loads(jsbeautifier.beautify(output["function_call"]["arguments"], opts))


def content2json(output):
    """GPT output string >>> json"""
    return json.loads(output.content)


def json2file(data, file_dir, file_name):
    """write json to file"""
    with open(file_dir + file_name, "w") as outfile:
        opts = jsbeautifier.default_options()
        opts.indent_size = 2
        outfile.write(jsbeautifier.beautify(json.dumps(data), opts))


def prompt_scoring_cv(resume, req):
    """generate prompt string >>> string"""
    return "\ncandidate:" + str(resume) + "\nRequirements:" + str(req)


def prompt_scoring_cv1(resume_path, req_path):
    with open(resume_path, "r") as f:
        candidate = json.load(f)
    with open(req_path, "r") as f:
        requirement = json.load(f)

    # Merge the two JSON objects by section
    merged_data = {}

    degree_requirement = requirement.get("Degree", [])
    degree_candidate = candidate.get("Degree", [])
    merged_data["Degree"] = {
        "requirement": degree_requirement,
        "candidate": degree_candidate,
    }

    experience_requirement = requirement.get("Experience", [])
    experience_candidate = candidate.get("Experience", [])
    merged_data["Experience"] = {
        "requirement": experience_requirement,
        "candidate": experience_candidate,
    }

    # Merge the "TechnicalSkills" section
    technical_skills_requirement = requirement.get("TechnicalSkills", [])
    technical_skills_candidate = candidate.get("TechnicalSkills", [])
    merged_data["TechnicalSkills"] = {
        "requirement": technical_skills_requirement,
        "candidate": technical_skills_candidate,
    }

    # Merge the "Responsibilities" section
    responsibilities_requirement = requirement.get("Responsibilities", [])
    responsibilities_candidate = candidate.get("Responsibilities", [])
    merged_data["Responsibilities"] = {
        "requirement": responsibilities_requirement,
        "candidate": responsibilities_candidate,
    }

    # Merge the "Certificates" section
    certificates_requirement = requirement.get("Certificates", [])
    certificates_candidate = candidate.get("Certificates", [])
    merged_data["Certificates"] = {
        "requirement": certificates_requirement,
        "candidate": certificates_candidate,
    }

    # Merge the "SoftSkills" section
    soft_skills_requirement = requirement.get("SoftSkills", [])
    soft_skills_candidate = candidate.get("SoftSkills", [])
    merged_data["SoftSkills"] = {
        "requirement": soft_skills_requirement,
        "candidate": soft_skills_candidate,
    }

    # Write the merged data to a new JSON file
    # with open('merged_file.json', 'w') as merged_file:
    # json.dump(merged_data, merged_file, indent=4)

    # print("Merged data saved to merged_file.json")
    # _printed = json.dumps(merged_data, indent=2)
    # print(_printed)
    return str(merged_data)


def json2dict(path):
    with open(path) as f:
        data = json.load(f)
    return data


class DocumentAnalyzer:
    def __init__(self):
        self.cv_upload_dir = config.CV_UPLOAD_DIR
        self.cv_analysis_dir = config.CV_ANALYSIS_DIR
        self.job_analysis_dir = config.JOB_ANALYSIS_DIR
        self.matching_analysis_dir = config.MATCHING_ANALYSIS_DIR
        self.fn_cv_analysis = fn_cv_analysis
        self.fn_job_analysis = fn_job_analysis
        self.fn_matching_analysis = fn_matching_analysis
        self.system_prompt_candidate = system_prompt_candidate
        self.system_prompt_jd = system_prompt_jd
        self.system_prompt_matching = system_prompt_matching

    def load_pdf_docx(self, file_path):
        if os.path.basename(file_path).endswith(".pdf") or os.path.basename(
            file_path
        ).endswith(".PDF"):
            loader = PyPDFLoader(file_path)
        elif os.path.basename(file_path).endswith(".docx") or os.path.basename(
            file_path
        ).endswith(".DOCX"):
            loader = Docx2txtLoader(file_path)

        documents = loader.load_and_split()
        return documents

    def json_filename(self, file_name):
        """abc.pdf >>> abc.json"""
        base_name, file_extension = os.path.splitext(file_name)
        json_filename = base_name + ".json"
        return json_filename

    def get_cv(self, file_name):
        """load 1 CV to string"""
        file_path = self.cv_upload_dir + file_name

        data = self.load_pdf_docx(file_path=file_path)
        _context = ""
        for x in data:
            _context = _context + x.page_content
        return _context

    def gpt_analysis(self, content, func, fcall="auto"):
        """GPT Prompt to Get formatted output"""
        completion = openai.ChatCompletion.create(
            model=config.GPT_MODEL,
            messages=[{"role": "user", "content": content}],
            functions=func,
            function_call=fcall,
            temperature=0.2,
        )
        output = completion.choices[0].message
        return output

    def gpt_prompt(self, prompt):
        """Normal GPT prompt: string >>> string"""
        completion = openai.ChatCompletion.create(
            model=config.GPT_MODEL, messages=[{"role": "user", "content": prompt}]
        )
        output = completion.choices[0].message
        return output

    def generate_content(self, cv_file_name, job_file_name):
        """generate content for matching"""
        cv_file_path = self.cv_analysis_dir + cv_file_name
        job_file_path = self.job_analysis_dir + job_file_name

        cv = json2dict(cv_file_path)
        _ = cv.pop("PersonalInformation")
        _ = cv.pop("Comment")
        _ = cv.pop("JobRecommend")
        req = json2dict(job_file_path)

        # content = "\nresumeAnalysis.json:" + str(cv) + "\nrequirementAnalysis.json:" + str(req)
        # content = "\nCandidate:" + str(cv) + "\nRequirement:" + str(req)
        content = "\nRequirement:" + str(req) + "\nCandidate:" + str(cv)

        # content = prompt_scoring_cv1(cv_file_path, job_file_path)
        # content = prompt_scoring_cv(cv, req)
        return content

    def test_cv(self, file_path, req):
        """process 1 CV"""
        if not os.path.exists(config.default_json_folder):
            os.makedirs(config.default_json_folder)
            logger.info(f"folder {config.default_json_folder} created")

        json2file(
            output2json(self.gpt_analysis(self.get_cv(file_path), self.fn_cv_analysis)),
            config.default_json_resume_filename,
        )
        logger.info(f"done: Resume: {file_path}")
        json2file(
            output2json(self.gpt_analysis(req, self.fn_cv_analysis)),
            config.default_json_req_filename,
        )
        logger.info("done: Requirement")
        json2file(
            output2json(
                self.gpt_analysis(self.generate_content(), self.fn_matching_analysis)
            ),
            config.default_json_score_filename,
        )
        logger.info("done: Evaluate")

    def analysis_cvs(self):
        """process CVs in folder"""
        if not os.path.exists(self.output_path):
            os.makedirs(self.output_path)
        file_list = os.listdir(self.cv_upload_dir)
        for filename in file_list:
            logger.info(f"analyzing: {filename}")
            file_path = os.path.join(self.cv_upload_dir, filename)
            json_save_path = os.path.join(
                self.output_path, self.json_filename(filename)
            )

            if os.path.isfile(file_path):
                resume = self.get_cv(file_path)
                json2file(
                    output2json(self.gpt_analysis(resume, self.fn_cv_analysis)),
                    json_save_path,
                )

        logger.info(f"Done {self.cv_upload_dir} >>> {self.output_path}")

    def analyse_candidate(self, file_name):
        start = time.time()
        logger.info("Start analyse candidate")

        content = self.get_cv(file_name=file_name)
        logger.info(f"Time read CV: {time.time() - start}")

        # output_analysis = self.gpt_analysis(content=content, func=self.fn_cv_analysis)

        # completion = openai.ChatCompletion.create(
        #     model= config.GPT_MODEL,
        #     messages=[
        #         {"role": "system", "content": self.system_prompt_candidate},
        #         {"role": "user", "content": content}
        #     ],
        #     functions=self.fn_cv_analysis,
        #     function_call="auto",
        #     temperature= 0.9
        # )
        # output_analysis = completion.choices[0].message
        # print("output_analysis", output_analysis)

        llm = ChatOpenAI(model=model_name, temperature=0.5)
        completion = llm.predict_messages(
            [
                SystemMessage(content=system_prompt_candidate),
                HumanMessage(content=content),
            ],
            functions=fn_cv_analysis,
        )

        output_analysis = completion.additional_kwargs
        json_output = output2json(output=output_analysis)

        file_name_json = self.json_filename(file_name=file_name)

        json2file(
            data=json_output, file_dir=self.cv_analysis_dir, file_name=file_name_json
        )

        logger.info("Done analyse candidate")
        logger.info(f"Time analyse candidate: {time.time() - start}")

        recommended_jobs = recommended_jobs = ", ".join(json_output["JobRecommend"])
        return {
            "name": json_output["PersonalInformation"]["name"],
            "phone": json_output["PersonalInformation"]["phone"],
            "email": json_output["PersonalInformation"]["email"],
            "summary": json_output["Comment"],
            "recommended_jobs": recommended_jobs,
        }

    def analyse_job(self, job_name, job_description):
        start = time.time()
        logger.info("Start analyse job")

        # output_analysis = self.gpt_analysis(content=job_description, func=self.fn_job_analysis)

        # completion = openai.ChatCompletion.create(
        #     model= config.GPT_MODEL,
        #     messages=[
        #         {"role": "system", "content": self.system_prompt_jd},
        #         {"role": "user", "content": job_description}
        #     ],
        #     functions=self.fn_job_analysis,
        #     function_call="auto",
        #     temperature=0.5
        # )
        # output_analysis = completion.choices[0].message
        # print("output_analysis", output_analysis)

        llm = ChatOpenAI(model=model_name, temperature=0.5)
        completion = llm.predict_messages(
            [
                SystemMessage(content=system_prompt_jd),
                HumanMessage(content=job_description),
            ],
            functions=fn_job_analysis,
        )
        output_analysis = completion.additional_kwargs
        # print(completion.additional_kwargs["function_call"]["arguments"])
        print(output_analysis)
        json_output = output2json(output=output_analysis)

        file_name_json = job_name + ".json"
        json2file(
            data=json_output, file_dir=self.job_analysis_dir, file_name=file_name_json
        )

        logger.info("Done analyse job")
        logger.info(f"Time analyse job: {time.time() - start}")

    def get_matching_filename(self, cv_file_name, job_file_name):
        base_cv_name, _ = os.path.splitext(cv_file_name)
        base_job_name, _ = os.path.splitext(job_file_name)

        matching_filename = f"{base_job_name}-{base_cv_name}.json"

        return matching_filename

    def analyse_matching(self, cv_file_name, job_file_name):
        start = time.time()
        logger.info("Start analyse matching")

        content = self.generate_content(
            cv_file_name=cv_file_name, job_file_name=job_file_name
        )
        # print(content)
        # output_analysis = self.gpt_analysis(content=content, func=self.fn_matching_analysis)

        # completion = openai.ChatCompletion.create(
        #     model= config.GPT_MODEL,
        #     messages=[
        #         {"role": "system", "content": self.system_prompt_matching},
        #         {"role": "user", "content": content}
        #     ],
        #     functions=self.fn_matching_analysis,
        #     function_call="auto",
        #     temperature=0.8
        # )
        # output_analysis = completion.choices[0].message
        # print("output_analysis", output_analysis)

        llm = ChatOpenAI(model=model_name, temperature=0.5)
        completion = llm.predict_messages(
            [
                SystemMessage(content=system_prompt_matching),
                HumanMessage(content=content),
            ],
            functions=fn_matching_analysis,
        )
        output_analysis = completion.additional_kwargs

        json_output = output2json(output=output_analysis)

        matching_filename = self.get_matching_filename(cv_file_name, job_file_name)
        json2file(
            data=json_output,
            file_dir=self.matching_analysis_dir,
            file_name=matching_filename,
        )

        logger.info("Done analyse matching")
        logger.info(f"Time analyse matching: {time.time() - start}")

        # Return personal infor, score, comment

        # Extract scores and store them in a list
        weights = {
            "Degree": 0.1,  # The importance of the candidate's degree
            "Experience": 0.2,  # The weight given to the candidate's relevant work experience
            "TechnicalSkills": 0.3,  # Weight for technical skills and qualifications
            "Responsibilities": 0.25,  # How well the candidate's past responsibilities align with the job
            "Certificates": 0.1,  # The significance of relevant certifications
            "SoftSkills": 0.05,  # Importance of soft skills like communication, teamwork, etc.
        }
        total_weight = 0
        weighted_score = 0

        for section in json_output:
            if section != "SummaryComment":
                weighted_score += int(json_output[section]["score"]) * weights[section]
                total_weight += weights[section]

        finalscore = weighted_score / total_weight
        return {"score": finalscore, "comment": json_output["SummaryComment"]}
