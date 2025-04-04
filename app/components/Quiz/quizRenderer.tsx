// components/quiz/QuizRenderer.tsx
import { useState } from "react";
import { QuizData, Question, SelectedAnswers } from "./types";
import QuestionCard from "./questionCard";
import SubmitButton from "./submitButton";
import { QuizWithAsignatura } from "./types";


interface QuizRendererProps {
  quizData: QuizWithAsignatura;
}

export default function QuizRenderer({ quizData }: QuizRendererProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  if (!quizData) {
    return <div>No quiz data available</div>;
  }

  let questions: Question[] = [];
  try {
    questions = JSON.parse(quizData.raw_quiz_text);
  } catch (e) {
    console.error("Error parsing questions:", e);
    return <div>Error parsing quiz questions</div>;
  }

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    if (!showResults) {
      setSelectedAnswers((prev) => ({
        ...prev,
        [questionIndex]: answer,
      }));
    }
  };

  const handleSubmit = () => {
    const totalQuestions = questions.length;
    const correctAnswers = questions.reduce((acc, question, index) => {
      return acc + (selectedAnswers[index] === question.answer ? 1 : 0);
    }, 0);
    
    setScore((correctAnswers / totalQuestions) * 100);
    setShowResults(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-center">{quizData.name}</h1>
      <p>{`Asignatura: ${quizData.asignatura.name}`}</p>

      {score !== null && (
        <div className="mb-8 text-center">
          <p className="text-2xl font-bold">
            Your Score: {score.toFixed(0)}%
          </p>
          <p className="text-gray-600">
            ({questions.reduce((acc, _, index) => 
              acc + (selectedAnswers[index] === questions[index].answer ? 1 : 0), 0
            )} out of {questions.length} correct)
          </p>
        </div>
      )}

      <div className="space-y-8">
        {questions.map((question, index) => (
          <QuestionCard
            key={index}
            question={question}
            questionIndex={index}
            selectedAnswers={selectedAnswers}
            onAnswerSelect={handleAnswerSelect}
            showResults={showResults}
          />
        ))}
      </div>

      {!showResults && questions.length > 0 && (
        <SubmitButton onSubmit={handleSubmit} />
      )}

      {showResults && (
        <button
          className="mt-8 mx-auto block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          onClick={() => {
            setShowResults(false);
            setScore(null);
            setSelectedAnswers({});
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
