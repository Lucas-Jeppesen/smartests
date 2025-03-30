import { Question, SelectedAnswers } from "./types";

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  selectedAnswers: SelectedAnswers;
  onAnswerSelect: (questionIndex: number, answer: string) => void;
  showResults?: boolean; // Added to handle showing correct/incorrect answers
}

export default function QuestionCard({
  question,
  questionIndex,
  selectedAnswers,
  onAnswerSelect,
  showResults = false,
}: QuestionCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-950">
        {questionIndex + 1}. {question.question}
      </h2>

      <div className="space-y-2">
        {question.options.map((option, optionIndex) => {
          const isSelected = selectedAnswers[questionIndex] === option;
          const isCorrect = option === question.answer;
          
          let optionClassName = "flex items-center space-x-3 p-3 rounded-lg cursor-pointer ";
          
          if (showResults) {
            if (isCorrect) {
              optionClassName += "bg-green-100";
            } else if (isSelected && !isCorrect) {
              optionClassName += "bg-red-100";
            }
          } else {
            optionClassName += "hover:bg-gray-50";
          }

          return (
            <label key={optionIndex} className={optionClassName}>
              <input
                type="radio"
                name={`question-${questionIndex}`}
                value={option}
                checked={isSelected}
                onChange={() => onAnswerSelect(questionIndex, option)}
                disabled={showResults}
                className="form-radio h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700">{option}</span>
              {showResults && isCorrect && (
                <span className="ml-2 text-green-600">✓</span>
              )}
              {showResults && isSelected && !isCorrect && (
                <span className="ml-2 text-red-600">✗</span>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}
