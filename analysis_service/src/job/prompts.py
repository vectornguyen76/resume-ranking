system_prompt_job = """
Let's think step by step.
Respond using only the provided information and do not rely on your basic knowledge. The details given might be out of sequence or incomplete.
Experience should include required duration time and job name field of work.
Only use the given data to determine educational qualifications and certificates; do not make assumptions about these qualifications.
However, you are allowed to combine the provided details to draw logical conclusions about soft skills.
"""

fn_job_analysis = [
    {
        "name": "AnalyzeJob",
        "description": "Read the job description and answer question.",
        "parameters": {
            "type": "object",
            "properties": {
                "degree": {
                    "type": "array",
                    "items": {
                        "type": "string",
                    },
                    "description": "educational qualifications required, e.g., Bachelor's degree in Computer Science.",
                },
                "experience": {
                    "type": "array",
                    "items": {
                        "type": "string",
                    },
                    "description": "Experiences required at position.",
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
                    "description": "Responsibilities for position candidate required. e.g. Evaluate and prioritize the many services and products that can benefit from AI, Work on the product and architectural implications, that is build, deploy, and test models",
                },
                "certificate": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Required certificates for the position, e.g., CompTIA Security+.",
                },
                "soft_skill": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Soft skills required for the job, inferred from the provided information. e.g. Language, communication, teamwork, adaptability.",
                },
            },
            "required": [
                "degree",
                "experience",
                "technical_skill",
                "responsibility",
                "certificate",
                "soft_skill",
            ],
        },
    }
]
