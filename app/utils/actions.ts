'use server'

import { redirect } from "next/navigation";
import { createClient } from "./supabase/server"



const signInWith = provider => async() => {
    const supabase = await createClient();

    const auth_callback_url = `${process.env.SITE_URL}/auth/callback`;

    const {data, error } =
    await supabase.auth.signInWithOAuth({
        provider,
        options: {
           redirectTo: auth_callback_url, 
        }
    });

    if (error) {
        console.log(error)
    } else {
        console.log(data);
    }

    if (data.url) {
        redirect(data.url)
    }

}

const signInWithGoogle = signInWith('google');

export { signInWithGoogle }