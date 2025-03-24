import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  try {
    
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          ...corsHeaders,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
        },
      });
    }

    const { pdf } = await req.json();

    // Validate if a PDF is provided
    if (!pdf) {
      return new Response(JSON.stringify({ error: "Missing PDF" }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
    });
    }

    // Log PDF size (approximate size in KB)
    console.log("✅ PDF received successfully!");
    console.log(`📄 PDF Size: ${Math.round((pdf.length * 3) / 4 / 1024)} KB`);

    return new Response(JSON.stringify({ success: true, id: "test123" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error processing request:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
