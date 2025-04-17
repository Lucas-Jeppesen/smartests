'use client';

import { useForm } from "@tanstack/react-form";
import { Question, SelectedAnswers } from "./types";
import QuestionCard from "./questionCard";
import SubmitButton from "./submitButton";
import { QuizWithAsignatura } from "./types";
import { evaluateQuiz } from "@/app/utils/general-helpers";
import { Calendar, CircleHelp, LibraryBig } from "lucide-react";
import { formatDate } from "@/app/utils/general-helpers";


interface QuizRendererProps {
  quizData: QuizWithAsignatura;
}


const colorVariants = {
  red: 'text-red-700',
  orange: 'text-orange-700',
  amber: 'text-amber-700',
  yellow: 'text-yellow-700',
  lime: 'text-lime-700',
  green: 'text-green-700',
  emerald: 'text-emerald-700',
  teal: 'text-teal-700',
  cyan: 'text-cyan-700',
  sky: 'text-sky-700',
  blue: 'text-blue-700',
  indigo: 'text-indigo-700',
  violet: 'text-violet-700',
  purple: 'text-purple-700',
  fuchsia: 'text-fuchsia-700',
  pink: 'text-pink-700',
  rose: 'text-rose-700',
  slate: 'text-slate-700',
};
type ColorVariant = keyof typeof colorVariants;


export default function QuizRenderer({ quizData }: QuizRendererProps) {

  const defaultValues = {
    answers: {} as SelectedAnswers
  };

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      const attempData = evaluateQuiz(questions, value.answers);
      console.log(attempData);

    },
  });

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

  const formatedDate = formatDate(quizData.created_at);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-semibold mb-4 text-center text-green-4">{quizData.name}</h1>
      <div className='flex items-center gap-8 justify-center mb-8'>
          <div className='flex items-center gap-1'>
            <Calendar className='w-4 h-4'/>
            <p className='font-medium text-sm text-green-gray pt-[2px]'>{formatedDate}</p>
          </div>
          <div className='flex items-center gap-1'>
            <CircleHelp className='w-4 h-4'/>
            <p className='font-medium text-sm text-green-gray'>{`${quizData.num_questions} preguntas`}</p>
          </div>
          <div className={`flex items-center gap-1 ${colorVariants[quizData.asignatura.color as ColorVariant]}`} >
            <LibraryBig className='w-4 h-4'/>
            <p className='font-medium text-sm'>{quizData.asignatura.name}</p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="space-y-8">
            {questions.map((question, index) => (
              <form.Field
                key={index}
                name={`answers.${index}`}
              >
                {(field) => (
                  <QuestionCard
                    key={index}
                    question={question}
                    questionIndex={index}
                    selectedAnswers={form.state.values.answers}
                    onAnswerSelect={(_, answer) => field.setValue(answer)}
                    showResults={false}
                  />
                )}
              </form.Field>
            ))}
          </div>

          <div className="mt-6">
            <SubmitButton onSubmit={form.handleSubmit} />
          </div>
        </form>
    </div>
  );
}
