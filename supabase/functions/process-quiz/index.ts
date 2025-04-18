import { GoogleGenerativeAI } from "npm:@google/generative-ai";
import { corsHeaders } from "../_shared/cors.ts";
import { schema as baseSchema } from "../_shared/schema.ts";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js";
import { Buffer } from "node:buffer";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { pdf_url, quiz_name, user_id, num_questions, asignatura_id } = await req.json();

    if (!pdf_url) {
      return new Response(JSON.stringify({ error: "Missing PDF URL" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }


    const apiKey = Deno.env.get("GEMINI_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!apiKey || !supabaseUrl || !(supabaseServiceRoleKey)) {
      return new Response(
        JSON.stringify({ error: "Missing required environment variables" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      supabaseUrl,
      supabaseServiceRoleKey
    );

    // Create initial quiz row with pending status
    const { data, error } = await supabase
      .from("quiz")
      .insert([
        {
          raw_quiz_text: "",
          source_url: pdf_url,
          status: "processing",
          user_id: user_id,
          name: quiz_name,
          num_questions: num_questions,
          asignatura_id: asignatura_id,
        },
      ])
      .select("id");

    if (error) {
      throw new Error(`Error inserting new quiz row: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error("No data returned after inserting quiz");
    }

    const quizId = data[0].id;

    // Start async processing
    (async () => {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const dynamicSchema = {
          ...baseSchema,
          minItems: num_questions,
          maxItems: num_questions,
        };
        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash",
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: dynamicSchema,
          },
        });

        const pdfResp = await fetch(pdf_url);
        if (!pdfResp.ok) {
          throw new Error("Failed to fetch PDF from URL");
        }

        const pdfBuffer = await pdfResp.arrayBuffer();
        const base64Pdf = Buffer.from(pdfBuffer).toString("base64");

        const result = await model.generateContent([
          {
            inlineData: {
              data: base64Pdf,
              mimeType: "application/pdf",
            },
          },
          "Genera preguntas de tipo test en base a los contenidos de este documento. Asegúrate de que todas las preguntas tengan 4 opciones y solo una correcta.",
        ]);

        const quizText = result.response.text();

        // Update the quiz row with the generated content
        const { error: updateError } = await supabase
          .from("quiz")
          .update({
            raw_quiz_text: quizText,
            status: "complete",
          })
          .eq("id", quizId);

        if (updateError) {
          throw new Error(`Error updating quiz: ${updateError.message}`);
        }
      } catch (processError) {
        console.error("Error processing quiz:", processError);
      }
    })();

    // Immediately return the quiz ID
    return new Response(
      JSON.stringify({
        success: true,
        message: "Quiz generation started",
        quizId: quizId,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
