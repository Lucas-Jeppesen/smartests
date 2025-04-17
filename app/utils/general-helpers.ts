import { QuizQuestion, UserAnswers, QuizResult } from "../components/Quiz/types";


export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}
  



export function evaluateQuiz(quizData: QuizQuestion[], userAnswers: UserAnswers): QuizResult {
  const results: QuizResult = {
    totalQuestions: quizData.length,
    correctAnswers: 0,
    incorrectAnswers: [],
    correctlyAnswered: [],
    score: 0
  };
  
  quizData.forEach((questionData, index) => {
    const userAnswer = userAnswers[index.toString()];
    const correctAnswer = questionData.answer;
    
    if (userAnswer === correctAnswer) {
      results.correctAnswers++;
      results.correctlyAnswered.push({
        question: questionData.question,
        answer: correctAnswer
      });
    } else {
      results.incorrectAnswers.push({
        question: questionData.question,
        userAnswer: userAnswer,
        correctAnswer: correctAnswer
      });
    }
  });
  
  results.score = (results.correctAnswers / results.totalQuestions) * 100;
  return results;
}