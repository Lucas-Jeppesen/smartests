"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import cleanFileName from "../utils/cleanFileName";
import { supabase } from "../lib/supabase";
import { createClient } from "../utils/supabase/client";


export default function QuizUploadForm() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string } | null>(null);

  // Fetch the authenticated user.
  useEffect(() => {
    const getUser = async () => {
      const clientSupa = await createClient();
      const { data: { user }, error } = await clientSupa.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }
      setUser(user);
    };
    getUser();
  }, []);

  // Initialize the form with default values, submission logic, and Zod-based validation.
  const form = useForm({
    defaultValues: {
      quizName: "",
      file: null,
    },
    onSubmit: async ({ value }) => {
      if (!user) {
        console.error("User not authenticated");
        return;
      }

      // Process the file upload.
      const file: File = value.file;
      const rawFileName = file.name.replace(/\.[^/.]+$/, "");
      const cleanedName = cleanFileName(rawFileName);
      const filePath = `user_uploads/${Date.now()}-${cleanedName}.pdf`;

      const { error } = await supabase.storage
        .from("pdf-uploads")
        .upload(filePath, file, { contentType: "application/pdf" });
      if (error) {
        console.error("Upload failed", error);
        return;
      }

      const publicUrl = supabase.storage
        .from("pdf-uploads")
        .getPublicUrl(filePath).data.publicUrl;

      // Insert a record in the database.
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);
      const { error: dbError } = await supabase.from("user_pdf_uploads").insert({
        file_path: filePath,
        public_url: publicUrl,
        expires_at: expiresAt.toISOString(),
      });
      if (dbError) {
        console.error("DB insert error", dbError);
        return;
      }

      // Call an edge function to process the quiz.
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_EDGE_FUNCTION_URL}process-quiz`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            pdf_url: publicUrl,
            quiz_name: value.quizName || rawFileName,
            user_id: user.id,
          }),
        }
      );

      const quizData = await response.json();
      if (!response.ok) {
        console.error("Failed to generate quiz", quizData);
        return;
      }
      router.push(`/test/${quizData.quizId}`);
    },
    validators: {
      onChange: ({ value }) => {
        return {
          fields: {
            quizName: !value.quizName || value.quizName.trim() === "" 
              ? "Quiz name is required" 
              : undefined,
            file: !value.file 
              ? "A file is required" 
              : undefined,
          },
        };
      },
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col items-center space-y-4"
    >
      {/* File Input Field */}
      <div className="w-full">
        <form.Field name="file">
          {(field) => {
            // Custom file change handler for updating the file field.
            const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files?.[0]) {
                const file = e.target.files[0];
                field.handleChange(file);
                // Auto-populate the quizName field if it's empty.
                const quizNameField = form.getField("quizName");
                if (!quizNameField.state.value) {
                  const rawName = file.name.replace(/\.[^/.]+$/, "");
                  quizNameField.handleChange(cleanFileName(rawName));
                }
              }
            };

            return (
              <>
                <label
                  htmlFor={field.name}
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF only</p>
                    {field.state.value && (
                      <p className="mt-2 text-sm font-semibold text-green-600">
                        {(field.state.value as File).name}
                      </p>
                    )}
                  </div>
                  <input
                    id={field.name}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                {
                  field.state.meta.errors.map((error, i) => (
                    <div key={i} className="error text-red-700 text-sm">
                      {error}
                    </div>
                  ))
                }
              </>
            );
          }}
        </form.Field>
      </div>

      {/* Quiz Name Field */}
      <div className="w-full">
        <form.Field name="quizName">
          {(field) => (
            <>
              <label htmlFor={field.name} className="block text-sm font-medium">
                Nombre del Test
              </label>
              <input
                id={field.name}
                type="text"
                value={field.state.value || ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="border px-4 py-2 rounded w-full"
                placeholder="Dejar vacío para coger nombre del pdf"
              />
              {
                field.state.meta.errors.map((error, i) => (
                  <div key={i} className="error text-red-700 text-sm">
                    {error}
                  </div>
                ))
              }
            </>
          )}
        </form.Field>
      </div>

      {/* Reactive submit button */}
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        )}
      />
    </form>
  );
}



















// "use client";

// import UploadPdf from "../components/uploadPdf";
// import { useRouter } from "next/navigation";
// import { useForm } from '@tanstack/react-form';
// import { z } from "zod";


// const quizSchema = z.object({
//   quizName: z.string().min(1, "Quiz name is required"),
//   file: z.instanceof(File, "A file is required"),
// });

// export default function CrearTestForm() {

//   const router = useRouter();

//   const form = useForm({
//     defaultValues: {
//       quizName: '',
//       file: null,
//     },
//     onSubmit: async ({ value }) => {
//       // Do something with form data
//       console.log(value)
//     },
//     validators: {
//       onChange: quizSchema,
//     }
//   })

//   return(
//       <div>
//         <form
//           onSubmit={(e) => {
//             e.preventDefault()
//             e.stopPropagation()
//             form.handleSubmit()
//           }}
//         >
//           <div>
//             <form.Field
//               name="quizName"
//               children={(field) => {
//                 return (
//                   <>
//                     <label htmlFor={field.name}>Nombre del Test</label>
//                     <input
//                       id={field.name}
//                       name={field.name}
//                       value={field.state.value}
//                       onBlur={field.handleBlur}
//                       onChange={(e) => field.handleChange(e.target.value)}
//                       placeholder="Dejar vacío para coger nombre del pdf"
//                     />
//                   </>
//                 )
//               }}
//             />
//           </div>
//           <form.Subscribe
//             selector={(state) => [state.canSubmit, state.isSubmitting]}
//             children={([canSubmit, isSubmitting]) => (
//               <button type="submit" disabled={!canSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">
//                 {isSubmitting ? "Submitting..." : "Submit"}
//               </button>
//             )}
//           />
//         </form>
//       </div>
//   ); 
// }