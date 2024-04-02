type RoleModel = {
  id: number;
  name: string;
  description: string;
};

type PermissionModel = {
  id: number;
  name: string;
  description: string;
  roles: RoleModel[];
};

type FAQCategoryModel = {
  id: number;
  name: string;
};

type DocumentsModel = {
  id: number;
  faq_id: number;
  page: string;
  document: string;
};

type AddDocumentModel = {
  document: string;
  page: string;
};

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
  id: number;
  data: {
    question: string;
    answer: string;
  };
}

interface UserModel {
  id: number;
  email: string;
  display_name: string;
  created_at: string;
  block: boolean;
  roles: RoleModel[];
}

interface CandidateDetailModel {
  _id: string;
  candidate_name: string;
  phone_number: string;
  email: string;
  comment: string;
  job_recommended: string[];
  cv_name: string;
  created_at: any;
  degree: string[];
  experience: string[];
  responsibility: string[];
  soft_skill: string[];
  technical_skill: string[];
  certificate: string[];
}

interface JobDetailModel {
  _id: string;
  job_name: string;
  created_at: any;
  degree: string[];
  experience: string[];
  responsibility: string[];
  soft_skill: string[];
  technical_skill: string[];
  certificate: string[];
}

interface MatchingDetailModel {
  _id: string;
  candidate_name: string;
  email: string;
  phone_number: string;
  job_recommended: string;
  cv_name: string;
  job_name: string;
  score: string;
  summary_comment: string;
  degree: { score: number; comment: string };
  experience: { score: number; comment: string };
  responsibility: { score: number; comment: string };
  soft_skill: { score: number; comment: string };
  technical_skill: { score: number; comment: string };
  certificate: { score: number; comment: string };
}

interface CandidateModel {
  _id: string;
  candidate_name: string;
  phone_number: string;
  email: string;
  comment: string;
  job_recommended: string;
  cv_name: string;
  created_at: any;
  degree: string[];
  experience: string[];
  responsibility: string[];
  soft_skill: string[];
  technical_skill: string[];
  certificate: string[];
}

interface CandidateResponseModel {
  results: CandidateModel[];
  total_file: number;
  total_page: number;
}

interface ChannelModel {
  id: number;
  name: string;
}

interface GetListQAHistoryModel {
  results: QAHistoryModel[];
  total_qa: number;
  total_page: number;
}

interface QAHistoryModel {
  id: number;
  question: string;
  answer: string;
  feedback: number;
  llm: string;
  time_question: string;
  time_answer: string;
  channel: ChannelModel;
  user: UserModel;
  id_faq: boolean;
  is_faq: number;
}

interface FeedbackModel {
  feedback: number;
}

interface FilesToLLM {
  file_id: number;
  llm: string;
}

interface FAQModel {
  id: number;
  question: string;
  answer: string;
  documents: DocumentsModel[];
  used: number;
  created_at: string;
  faq_category: FAQCategoryModel;
}

interface JobModel {
  _id: string;
  job_name: string;
  job_description: string;
  created_at: string;
}

interface FAQResponeModel {
  results: JobModel[];
  total_page: number;
  total_job: number;
}

interface JobMatchingModel {
  id: string;
  candidate_name: string;
  candidate_email: string;
  candidate_phone: string;
  cv_name: string;
  score: string;
  comment: string;
  matching_status: boolean;
}

interface JobMatchingResponeModel {
  results: JobMatchingModel[];
  total_page: number;
  total_matching: number;
}

interface ModifyFAQModel {
  job_name: string;
  job_description: string;
}

interface DataFormModel {
  id?: number;
  job_name: string;
  job_description: string;
}
