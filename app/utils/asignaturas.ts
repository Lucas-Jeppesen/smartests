"use server";

import { createClient } from "./supabase/server";

export async function crearAsignatura({ name, color }: { name: string; color: string; }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No user found" };
  }

  const { data, error } = await supabase
    .from("asignatura")
    .insert({name, color, user_id: user.id})

  if (error) {
    return { error };
  }
  return { data };
} 

export async function editAsignatura({ id, name, color } : { id: string | undefined; name: string; color: string; }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No user found" };
  }

  const { data, error } = await supabase
    .from("asignatura")
    .update({name, color})
    .eq('id', id)

  if (error) {
    console.log(error)
    return { error };
  }
  console.log("Data:", data)
  return { data };
}



export async function borrarAsignatura({ id } : { id: string; }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No user found" };
  }

  const { data, error } = await supabase
    .from("asignatura")
    .delete()
    .eq('id', id)

  if (error) {
    console.log(error)
    return { error };
  }
  console.log("Data:", data)
  return { data };
}