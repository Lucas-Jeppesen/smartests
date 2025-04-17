"use server";

import { QuizResult } from "../components/Quiz/types";
import { createClient } from "./supabase/server";

export async function crearAttemp(attempData: QuizResult , quizId : string) {

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "No user found" };
    }

    const roundedScore = Math.round(attempData.score * 10) / 100;

    const { data, error } = await supabase
      .from("quiz_attemp")
      .insert({
        quiz_id: quizId,
        user_id: user.id,
        score: roundedScore,
        attemp_raw_data: attempData
      });

    if (error) {
      console.error("Database error:", error);
      return { error };
    }
    
    return { data };
}



export async function fetchAttemps(quizId : string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "No user found" };
    }

    if (user) {
        const { data, error } = await supabase
        .from("quiz_attemp")
        .select("*")
        .eq("quiz_id", quizId)
        .order('created_at', { ascending: false })
    
        if (data) {
        return data;
        }
    
        if (error) {
        return error;
        }
      }
}