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
    [key: number]: string;
  }
  