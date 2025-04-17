"use server"

import { createClient } from "@/app/utils/supabase/server";


export async function fetchWholeTable(table: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();


  if (user) {
    const userId = user.id;
    const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("user_id", userId)
    .order('created_at', { ascending: false })

    if (data) {
    return data;
    }

    if (error) {
    return error;
    }
  }
}

