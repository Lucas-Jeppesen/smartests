"use server";

import { createClient } from "./supabase/server";



export async function borrarTest({ id } : { id: string; }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No user found" };
  }

  const { data, error } = await supabase
    .from("quiz")
    .delete()
    .eq('id', id)

  if (error) {
    console.log(error)
    return { error };
  }
  console.log("Data:", data)
  return { data };
}