interface AnswerOptionProps {
    option: string;
    questionIndex: number;
    isSelected: boolean;
    isCorrect: boolean;
    showResults: boolean;
    onSelect: (questionIndex: number, answer: string) => void;
  }
  
  export default function AnswerOption({
    option,
    questionIndex,
    isSelected,
    isCorrect,
    showResults,
    onSelect,
  }: AnswerOptionProps) {
    let className = "flex items-center space-x-3 p-3 rounded-lg cursor-pointer ";
    
    if (showResults) {
      if (isCorrect) {
        className += "bg-green-100";
      } else if (isSelected && !isCorrect) {
        className += "bg-red-100";
      }
    } else {
      className += "hover:bg-gray-50";
    }
  
    return (
      <label className={className}>
        <input
          type="radio"
          name={`question-${questionIndex}`}
          value={option}
          checked={isSelected}
          onChange={() => onSelect(questionIndex, option)}
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
  }
  