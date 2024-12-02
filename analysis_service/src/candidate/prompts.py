system_prompt_candidate = """
Let's think step by step.
CV details might be out of order or incomplete.
Analyze the CV concerning the candidate's experience and career. From this, derive logical conclusions about their technical skills, experience, and soft skills.
The format for educational qualifications should be: Degree - School/University/Organization - GPA - Year of Graduation. It's acceptable if some details are missing.
Experience should include experienced time and job name field of work based on projects and experiences.
Ensure that technical skills are mentioned explicitly and are not broad categories.
Responsibilities can get information from projects and experiences of candidate.
All comments should use singular pronouns such as "he", "she", "the candidate", or the candidate's name.
"""

fn_candidate_analysis = [
    {
        "name": "AnalyzeCV",
        "description": "Analyze candidate resume to get informations.",
        "parameters": {
            "type": "object",
            "properties": {
                "candidate_name": {
                    "type": "string",
                    "description": "Name of the candidate.",
                },
                "phone_number": {
                    "type": "string",
                    "description": "Phone number of the candidate.",
                },
                "email": {
                    "type": "string",
                    "description": "Email of candidate. e.g. jackey@gmail.com, hinata@outlook.com",
                },
                "degree": {
                    "type": "array",
                    "items": {
                        "type": "string",
                    },
                    "description": "educational qualifications. e.g., Bachelor's degree in Computer Science - FPT University - 2024",
                },
                "experience": {
                    "type": "array",
                    "items": {
                        "type": "string",
                    },
                    "description": "Summary experiences of each field candidate worked.",
                },
                "technical_skill": {
                    "type": "array",
                    "items": {
                        "type": "string",
                    },
                    "description": "specific technical skills and proficiencies. e.g. Java,  Python, Linux, SQL.",
                },
                "responsibility": {
                    "type": "array",
                    "items": {
                        "type": "string",
                    },
                    "description": "Sumarry responsibilities candidate work. e.g. Developed a fitness application for bodybuilding exercises on Android using Room Database, RxJava 2, and Retrofit 2.",
                },
                "certificate": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Certificates achieved. e.g., Advanced Data Analysis, Basic SQL.",
                },
                "soft_skill": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Soft skills of the candidate inferred from their resume. Special attention should be paid to language and leadership skills. e.g. Language skill, Leadership skills, critical thinking, problem-solving.",
                },
                "comment": {
                    "type": "string",
                    "description": "A summary about candidate, what is the strong point, what is special in the candidate. e.g. The candidate has good skill in Python, he have strong points in AI model tuning. He should apply for AI Engineer.",
                },
                "job_recommended": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Recommend what jobs the candidate should apply. e.g. Fullstack Web Developer, Python Developer, AI Engineer, Data Analytics",
                },
                "office": {
                    "type": "integer",
                    "description": "Check the candidate's years of experience in office skill. For example 0, 1, 2, 3,...",
                },
                "sql": {
                    "type": "integer",
                    "description": "Check the candidate's years of experience in sql skill. For example 0, 1, 2, 3,...",
                },
            },
            "required": [
                "candidate_name",
                "phone_number",
                "email",
                "degree",
                "experience",
                "technical_skill",
                "responsibility",
                "certificate",
                "soft_skill",
                "comment",
                "job_recommended",
                "office",
                "sql",
            ],
        },
    }
]
