// app/test/[quizId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useParams } from "next/navigation";
import QuizRenderer from "@/app/components/Quiz/quizRenderer";

interface QuizData {
  id: string;
  status: "processing" | "complete";
  raw_quiz_text: string;
  // Add other fields as needed
}

export default function QuizPage() {
  const params = useParams();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch of quiz data
    const fetchQuizData = async () => {
      const { data, error } = await supabase
        .from("quiz")
        .select("*")
        .eq("id", params.quiz_id)
        .single();

        console.log(data);
        console.log(params);

      if (data) {
        setQuizData(data);
        if (data.status === "complete") {
          setLoading(false);
        }
      }
    };

    fetchQuizData();

    // Set up real-time subscription
    const subscription = supabase
      .channel(`quiz_status_${params.quizId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "quiz",
          filter: `id=eq.${params.quizId}`,
        },
        (payload) => {
          setQuizData(payload.new as QuizData);
          if (payload.new.status === "complete") {
            setLoading(false);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [params.quizId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        <p className="mt-4 text-lg">Cargando preguntas</p>
      </div>
    );
  }

  if (!quizData) {
    return <div>Quiz not found</div>;
  }

  if (quizData.status === "processing") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        <p className="mt-4 text-lg">Generando preguntas</p>
      </div>
    );
  }

  return <QuizRenderer quizData={quizData} />;
}
