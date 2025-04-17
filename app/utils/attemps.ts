"use server";

import { createClient } from "./supabase/server";

export async function crearAttemp(attempData, quizId) {

    console.log("Server action started with quiz ID:", quizId);
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.log("No user found");
      return { error: "No user found" };
    }

    const scoreNum = parseFloat(attempData.score);
    const roundedScore = Math.round(scoreNum * 10) / 100;

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
    
    console.log("Database insert successful:", data);
    return { data };
}