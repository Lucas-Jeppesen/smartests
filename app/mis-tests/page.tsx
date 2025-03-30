import { createClient } from "../utils/supabase/server";
import TestCard from "../components/tests/testCard";
import { Tables } from "@/database.types";

export default async function MisTests() {

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let tests: Tables<'quiz'>[] = [];

    if (user) {
      const userId = user.id;
      const { data, error } = await supabase
      .from("quiz")
      .select("*")
      .eq("user_id", userId)

      if (data) {
        tests = data;
      }

      if (error) {
        console.error("Error fetching tests:", error);
      }
    }

    return(
        <div>
          {tests.map(test => (
            <TestCard key={test.id} name={test.name} created_at={test.created_at} />
          ))}
        </div>
    );
}