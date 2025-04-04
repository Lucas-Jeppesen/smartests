// components/quiz/SubmitButton.tsx
interface SubmitButtonProps {
    onSubmit: () => void;
    disabled?: boolean;
  }
  
  export default function SubmitButton({
    onSubmit,
    disabled = false,
  }: SubmitButtonProps) {
    return (
      <div className="mt-8 flex flex-col items-center gap-2">
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          onClick={onSubmit}
          disabled={disabled}
        >
          Submit Quiz
        </button>
      </div>
    );
  }
  