import { Json, Tables } from "@/database.types";

export interface Question {
    question: string;
    options: string[];
    answer: string; // Changed from correctAnswer to answer to match the data
  }
  
export interface QuizData {
  id: string;
  status: "processing" | "complete";
  raw_quiz_text: string;
}

export interface SelectedAnswers {
  [key: string]: string;
}


export type QuizWithAsignatura = Tables<'quiz'> & {
  asignatura: {
    id: string;
    name: string;
    color: string;
  }
}



export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface UserAnswers {
  [questionIndex: string]: string;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: Array<{
    question: string;
    userAnswer: string;
    correctAnswer: string;
  }>;
  correctlyAnswered: Array<{
    question: string;
    answer: string;
  }>;
  score: number;
}


export type TestData = {
  id: string;
  name: string;
  formated_date: string;
  num_questions: number;
  asignatura: {
    id: string;
    name: string;
    color: string;
  }
};


export type Attempt = {
  id: number;
  created_at: string;
  user_id: string;
  quiz_id: string;
  score: number;
  attemp_raw_data: Json;
};


