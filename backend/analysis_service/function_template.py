from datetime import datetime


def present():
    # Get current date and time
    now = datetime.now()
    # Format the output
    formatted_date = now.strftime("%B %Y")
    # print(formatted_date)
    return formatted_date


system_prompt_candidate = f"""
Let's think step by step.
CV details might be out of order or incomplete.
Analyze the CV concerning the candidate's experience and career. From this, derive logical conclusions about their technical skills, experience, and soft skills.
The format for educational qualifications should be: Degree - School/University/Organization - GPA - Year of Graduation. It's acceptable if some details are missing.
Experience should include experienced time and job name field of work based on projects and experiences.
Ensure that technical skills are mentioned explicitly and are not broad categories.
Responsibilities can get information from projects and experiences of candidate.
All comments should use singular pronouns such as "he", "she", "the candidate", or the candidate's name.
"""

system_prompt_jd = """
Let's think step by step.
Respond using only the provided information and do not rely on your basic knowledge. The details given might be out of sequence or incomplete.
Experience should include required duration time and job name field of work.
Only use the given data to determine educational qualifications and certificates; do not make assumptions about these qualifications.
However, you are allowed to combine the provided details to draw logical conclusions about soft skills.
"""

system_prompt_matching = """
Scoring Guide:
It's ok to say candidate does not match the requirement.
Degree Section: Prioritize major than degree level. Candidate with degrees more directly relevant to the required degree should receive higher score, even if their degree level is lower.
Experience Section: Candidate with more relevant experience field get higher score.
Technical Skills Section: Candidate with more relevant technical skills get higher score.
Responsibilities Section: Candidate with more relevant responsibilities get higher score.
Certificates Section: Candidate with required certificates get higher score. Candidate without required certificates get no score. Candidate with related certificates to the position get medium score.
Soft Skills Section: Prioritize foreign language and leadership skills. Candidate with more relevant soft skills get higher score.
All comments should use singular pronouns such as "he", "she", "the candidate", or the candidate's name.
"""

fn_job_analysis = [
    {
        "name": "analysisReq",
        "description": "Read the job description and answer question.",
        "parameters": {
            "type": "object",
            "properties": {
                "Degree": {
                    "type": "array",
                    "items": {
                        "type": "string",
                    },
                    "description": "educational qualifications required, e.g., Bachelor's degree in Computer Science.",
                },
                "Experience": {
                    "type": "array",
                    "items": {
                        "type": "string",
                    },
                    "description": "Experiences required at position.",
                },
                "TechnicalSkills": {
                    "type": "array",
                    "items": {
                        "type": "string",
                    },
                    "description": "specific technical skills and proficiencies. e.g. Java,  Python, Linux, SQL.",
                },
                "Responsibilities": {
                    "type": "array",
                    "items": {
                        "type": "string",
                    },
                    "description": "Responsibilities for position candidate required. e.g. Evaluate and prioritize the many services and products that can benefit from AI, Work on the product and architectural implications, that is build, deploy, and test models",
                },
                "Certificates": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Required certificates for the position, e.g., CompTIA Security+.",
                },
                "SoftSkills": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Soft skills required for the job, inferred from the provided information. e.g. Language, communication, teamwork, adaptability.",
                },
            },
            "required": [
                "Degree",
                "Experience",
                "TechnicalSkills",
                "Responsibilities",
                "Certificates",
                "SoftSkills",
            ],
        },
    }
]

fn_cv_analysis = [
    {
        "name": "analyzeCV",
        "description": "analyze candidate information.",
        "parameters": {
            "type": "object",
            "properties": {
                "PersonalInformation": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string",
                            "description": "name of the candidate.",
                        },
                        "phone": {
                            "type": "string",
                            "description": "phone number of the candidate.",
                        },
                        "email": {
                            "type": "string",
                            "description": "email of candidate. e.g. jackey@gmail.com, hinata@outlook.com",
                        },
                    },
                },
                "Degree": {
                    "type": "array",
                    "items": {
                        "type": "string",
                    },
                    "description": "educational qualifications. e.g., Bachelor's degree in Computer Science - FPT University - 2024",
                },
                "Experience": {
                    "type": "array",
                    "items": {
                        "type": "string",
                    },
                    "description": "Summary experiences of each field candidate worked.",
                },
                "TechnicalSkills": {
                    "type": "array",
                    "items": {
                        "type": "string",
                    },
                    "description": "specific technical skills and proficiencies. e.g. Java,  Python, Linux, SQL.",
                },
                "Responsibilities": {
                    "type": "array",
                    "items": {
                        "type": "string",
                    },
                    "description": "Sumarry responsibilities candidate work. e.g. Developed a fitness application for bodybuilding exercises on Android using Room Database, RxJava 2, and Retrofit 2.",
                },
                "Certificates": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Certificates achieved. e.g., Advanced Data Analysis, Basic SQL.",
                },
                "SoftSkills": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Soft skills of the candidate inferred from their resume. Special attention should be paid to language and leadership skills. e.g. Language skill, Leadership skills, critical thinking, problem-solving.",
                },
                "Comment": {
                    "type": "string",
                    "description": "A summary about candidate, what is the strong point, what is special in the candidate. e.g. The candidate has good skill in Python, he have strong points in AI model tuning. He should apply for AI Engineer.",
                },
                "JobRecommend": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Recommend what jobs the candidate should apply. e.g. Fullstack Web Developer, Python Developer, AI Engineer, Data Analytics",
                },
            },
            "required": [
                "PersonalInformation",
                "Degree",
                "Experience",
                "TechnicalSkills",
                "Responsibilities",
                "Certificates",
                "SoftSkills",
                "Comment",
                "JobRecommend",
            ],
        },
    }
]

fn_matching_analysis = [
    {
        "name": "evaluate",
        "description": "For each requirement, score in 0 - 100 scale if the candidate match with the requirement or not.",
        "parameters": {
            "type": "object",
            "properties": {
                "Degree": {
                    "type": "object",
                    "properties": {
                        "score": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 100,
                            "description": "Score if the candidate match with the requirement or not",
                        },
                        "comments": {
                            "type": "string",
                            "description": "What match the requirement, what does not match the requirement",
                        },
                    },
                    "required": ["score", "comments"],
                },
                "Experience": {
                    "type": "object",
                    "properties": {
                        "score": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 100,
                            "description": "Score if the candidate match with the requirement or not. e.g. 75 ",
                        },
                        "comments": {
                            "type": "string",
                            "description": "What match the requirement, what does not match the requirement",
                        },
                    },
                    "required": ["score", "comments"],
                },
                "TechnicalSkills": {
                    "type": "object",
                    "properties": {
                        "score": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 100,
                            "description": "Score if the candidate match with the requirement or not. e.g. 75",
                        },
                        "comments": {
                            "type": "string",
                            "description": "What match the requirement, what does not match the requirement.",
                        },
                    },
                    "required": ["score", "comments"],
                },
                "Responsibilities": {
                    "type": "object",
                    "properties": {
                        "score": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 100,
                            "description": "Score if the candidate match with the requirement or not. e.g. 75",
                        },
                        "comments": {
                            "type": "string",
                            "description": "What match the requirement, what does not match the requirement.",
                        },
                    },
                    "required": ["score", "comments"],
                },
                "Certificates": {
                    "type": "object",
                    "properties": {
                        "score": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 100,
                            "description": "Score if the candidate match with the requirement or not.",
                        },
                        "comments": {
                            "type": "string",
                            "description": "What match the requirement, what does not match the requirement.",
                        },
                    },
                    "required": ["score", "comments"],
                },
                "SoftSkills": {
                    "type": "object",
                    "properties": {
                        "score": {
                            "type": "integer",
                            "minimum": 0,
                            "maximum": 100,
                            "description": "Score if the candidate match with the requirement or not. e.g. 75",
                        },
                        "comments": {
                            "type": "string",
                            "description": "What match the requirement, what does not match the requirement, special soft skill in the CV.",
                        },
                    },
                    "required": ["score", "comments"],
                },
                "SummaryComment": {
                    "type": "string",
                    "description": "Give comment about matching candidate based on requirement",
                },
            },
            "required": [
                "Degree",
                "Experience",
                "TechnicalSkills",
                "Responsibilities",
                "Certificates",
                "SoftSkills",
                "SummaryComment",
            ],
        },
    }
]
