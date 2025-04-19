'use client';

import { useForm } from "@tanstack/react-form";
import { Question, SelectedAnswers } from "./types";
import QuestionCard from "./questionCard";
import SubmitButton from "./submitButton";
import { QuizWithAsignatura } from "./types";
import { evaluateQuiz } from "@/app/utils/general-helpers";
import { Calendar, CircleHelp, LibraryBig } from "lucide-react";
import { formatDate } from "@/app/utils/general-helpers";
import { useParams } from "next/navigation";
import { crearAttemp } from "@/app/utils/attemps";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QuizResult } from "./types";
import { useState } from "react";
import { useRef } from "react";
import SubmitResetButton from "./submitButton";



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
  const queryClient = useQueryClient();
  const params = useParams();
  const quidId = typeof params.quiz_id === 'string' ? params.quiz_id : '';
  const topRef = useRef<HTMLDivElement>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  let questions: Question[] = [];
  try {
    questions = JSON.parse(quizData.raw_quiz_text);
  } catch (e) {
    console.error("Error parsing questions:", e);
    return <div>Error parsing quiz questions</div>;
  }

  const defaultValues = {
    answers: questions.reduce((acc, _, idx) => {
      acc[idx] = undefined; // or null, or '' as your default
      return acc;
    }, {} as SelectedAnswers),
  };

  const mutation = useMutation({
    mutationFn: ({ attempData, quidId }: { attempData: QuizResult; quidId: string }) =>
      crearAttemp(attempData, quidId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz-attemps", quidId] });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setShowResults(true);
      setIsSubmitted(true)
    },
    onError: (error) => {
      console.error("Failed to register attemp", error);
    },
  });

  console.log(defaultValues)
  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      const attempData = evaluateQuiz(questions, value.answers);
      mutation.mutate({ attempData, quidId });
      console.log(attempData)
    },
  });

  if (!quizData) {
    return <div>No quiz data available</div>;
  }

  const formatedDate = formatDate(quizData.created_at);

  return (
    <div ref={topRef} className="container mx-auto px-4 py-8 max-w-3xl">
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
        {showResults && (
          <div>Score: 2.3</div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className="space-y-8">
            {questions.map((question, index) => (
              <form.Field
                key={question.question}
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

          <div className="mt-6 text-center">
            <SubmitResetButton
              isPending={mutation.isPending}
              isSubmitted={isSubmitted}
              onReset={form.reset}
              onSubmit={form.handleSubmit}
              className={"bg-green-4 text-yellow-1 py-2 px-8 rounded-xl cursor-pointer"}
            />
            <button></button>
          </div>
        </form>
    </div>
  );
}
