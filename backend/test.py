from analysis_service.main import *
from analysis_service.main import DocumentAnalyzer

analyzer = DocumentAnalyzer()


job_name = "test job"
job_description = """
Job Responsibilities Include, But Not Limited To The Followings


Verifying provided data schema.
Doing data extraction, transformation as WorldQuant standard
Extracting, transforming and onboarding data
Data analysis and quality assurance for your product
Collaborating with other teams to improve the pipeline and deliver high productivity
Leading, guiding, mentoring other team members


What You’ll Bring


Strong at Python programing skills is a must
Skillful in data manipulation (complex join, subqueries, unions.. via SQL or dataframe library)
Experienced with Linux command at user level
Experienced with PySpark, Pandas is a big plus
Intelligence, systematically analyzing skills
Dedicated and self-disciplined with a strong work ethic and be willing to help others
Proactive and possess good communication skills within a global team environment.
"""

job_description1 = """
data engineer
"""

print("test ...")
print(analyzer.analyse_candidate(file_name="resume(6).pdf"))
# print(analyzer.analyse_candidate(file_name="test.pdf"))
# analyzer.analyse_candidate(file_name="CV-NguyenVanPhuoc-FresherAIEngineer.pdf")

print("job ...")
# analyzer.analyse_job(job_name, job_description)


print("match...")
# cv_file_name = "resume(6).json"
cv_file_name = "20231018130446-CV-NguyenVanPhuoc-FresherAIEngineer.json"
# cv_file_name = "resume(10).json"
# job_file_name = "AI Engineer.json"
job_file_name = "test job.json"

# analyzer.analyse_matching(cv_file_name, job_file_name)
# print(system_prompt_candidate)

# for i in range(15, 40):
#     file_name = "resume("+str(i)+").pdf"
#     print(file_name)
#     analyzer.analyse_candidate(file_name)


# from langchain.chat_models import ChatOpenAI
# from langchain.schema import HumanMessage, SystemMessage

# llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.7)
# output_analysis = llm.predict_messages([SystemMessage(content=system_prompt_jd), HumanMessage(content=job_description)], functions=fn_job_analysis)
# print(output_analysis.additional_kwargs["function_call"]["arguments"])
