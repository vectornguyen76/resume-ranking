type Message = {
  id?: number;
  type: "apiMessage" | "userMessage";
  message: string;
  sourceDoc?: string;
  refDoc?: RefDoc[];
  feedback?: number;
};

type MessageState = {
  history: [string, string][];
  messages: Message[];
};

type RefDoc = {
  page: number;
  documentname: string;
  content: string;
};

type MessageSocket = {
  id: number;
  message: string;
  sourceDoc?: string;
  refDoc?: RefDoc[];
};
