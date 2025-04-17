import { Tables } from "@/database.types";

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