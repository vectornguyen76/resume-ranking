type RoleModel = {
  id: number,
  name: string,
  description: string,
}

type PermissionModel = {
  id: number,
  name: string,
  description: string,
  roles: RoleModel[]
}

type FAQCategoryModel = {
  id: number,
  name: string
}

type DocumentsModel = {
  id: number,
  faq_id: number,
  page: string,
  document: string,
}

type AddDocumentModel = {
  document: string,
  page: string,
}

interface InputItem {
  documentname: string;
  number: number;
}

interface MessageType {
  text: string;
  createdAt: any;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
}

interface MessageData {
  id: number,
  data: {
    question: string,
    answer: string
  }
}

interface UserModel {
  id: number,
  email: string,
  display_name: string,
  created_at: string,
  block: boolean,
  roles: RoleModel[],
}



interface CandidateDetailModel {
  id: number,
  candidate_name: string,
  candidate_phone: string,
  candidate_email: string,
  candidate_summary: string,
  recommended_jobs: string,
  cv_name: string,
  cv_hash: string,
  cv_type: string,
  cv_size: number,
  cv_date: any,
  education: string[],
  experiment: string[],
  responsibilities: string[],
  soft_skills: string[],
  technical_skills: string[],
  certification: string[],
}

interface JobDetailModel {
  id: number,
  job_name: string,
  created_at: any,
  education: string[],
  experiment: string[],
  responsibilities: string[],
  soft_skills: string[],
  technical_skills: string[],
  certification: string[],
}

interface MatchingDetailModel {
  id: number,
  candidate_name: string,
  candidate_email: string,
  candidate_phone: string,
  recommended_jobs: string,
  cv_name: string,
  job_name: string,
  score: string,
  comment: string,
  education_comment: string[],
  education_score: string[],
  experiment_comment: string[],
  experiment_score: string[],
  responsibilities_comment: string[],
  responsibilities_score: string[],
  soft_skills_comment: string[],
  soft_skills_score: string[],
  technical_skills_comment: string[],
  technical_skills_score: string[],
  certification_comment: string[],
  certification_score: string[],
}

interface CandidateModel {
  id: number,
  candidate_name: string,
  candidate_phone: string,
  candidate_email: string,
  candidate_summary: string,
  recommended_jobs: string,
  cv_name: string,
  cv_hash: string,
  cv_type: string,
  cv_size: number,
  cv_date: any,
}

interface CandidateResponseModel {
  results: CandidateModel[],
  total_file: number,
  total_page: number
}

interface ChannelModel {
  id: number,
  name: string
}

interface GetListQAHistoryModel {
  results: QAHistoryModel[],
  total_qa: number,
  total_page: number
}

interface QAHistoryModel {
  id: number,
  question: string,
  answer: string,
  feedback: number,
  llm: string,
  time_question: string,
  time_answer: string,
  channel: ChannelModel,
  user: UserModel,
  id_faq: boolean,
  is_faq: number;
}

interface FeedbackModel {
  feedback: number
}

interface FilesToLLM {
  file_id: number,
  llm: string,
}

interface FAQModel {
  id: number,
  question: string,
  answer: string,
  documents: DocumentsModel[],
  used: number,
  created_at: string,
  faq_category: FAQCategoryModel
}

interface JobModel {
  id: number,
  job_name: string,
  job_description: string,
  created_at: string,
}

interface FAQResponeModel {
  results: JobModel[],
  total_page: number,
  total_job: number
}

interface JobMatchingModel {
  id: number,
  candidate_name: string,
  candidate_email: string,
  candidate_phone: string,
  cv_name: string,
  score: string,
  comment: string,
  matching_status: boolean,
}

interface JobMatchingResponeModel {
  results: JobMatchingModel[],
  total_page: number,
  total_matching: number
}

interface ModifyFAQModel {
  job_name: string,
  job_description: string,
}

interface DataFormModel {
	id?: number,
	job_name: string,
	job_description: string,
}