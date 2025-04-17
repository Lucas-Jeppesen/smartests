
import { createClient } from "../supabase/server";




export async function fetchTestAverage(quizId: string) {
    const supabase = await createClient();
    
    const query =  supabase.rpc('test_average_and_count', {quiz_id_input: quizId});
    console.log(query);

    return query;
}