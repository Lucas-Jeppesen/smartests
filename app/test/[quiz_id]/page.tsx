"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import QuizRenderer from "@/app/components/Quiz/quizRenderer";
import { createClient } from "@/app/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";


interface QuizData {
  id: string;
  status: "processing" | "complete";
  raw_quiz_text: string;
}

export default function QuizPage() {
  const params = useParams();
  const quizId = params.quiz_id;
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  

  useEffect(() => {
    let subscription: RealtimeChannel | null = null;
    const setupRealtimeSubscription = async (supabase: any) => {
      // Create new subscription, no need to check for "channel" state here
      const newChannel = supabase
        .channel(`quiz_status_${quizId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "quiz",
            filter: `id=eq.${quizId}`,
          },
          (payload: { new: QuizData }) => {
            setQuizData(payload.new);
            if (payload.new.status === "complete") {
              setLoading(false);
            }
          }
        );
  
      await newChannel.subscribe();
      subscription = newChannel;
    };
  
    const fetchQuizData = async () => {
      const supabase = createClient();
  
      const { data, error } = await supabase
        .from("quiz")
        .select("*")
        .eq("id", quizId)
        .single();
  
      if (data) {
        setQuizData(data);
        if (data.status === "complete") {
          setLoading(false);
        }
      } else {
        console.error("Error:", error);
      }
  
      await setupRealtimeSubscription(supabase);
    };
  
    fetchQuizData();
  
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);
  

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
