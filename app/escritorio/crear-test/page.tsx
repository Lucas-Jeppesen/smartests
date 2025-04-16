"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import cleanFileName from "../../utils/cleanFileName";
import { supabase } from "../../lib/supabase";
import { createClient } from "../../utils/supabase/client";
import { fetchWholeTable } from "../../utils/fetches/fetchWholeTable";
import { useQuery } from "@tanstack/react-query";
import { Upload } from "lucide-react";


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


  const { data: subjects = [], isLoading: isLoadingSubjects } = useQuery({
    queryKey: ['asignaturas', user?.id],
    queryFn: () => fetchWholeTable('asignatura'),
    enabled: !!user,
  });
  console.log("Asignaturas:", subjects);

  // Initialize the form with default values, submission logic, and Zod-based validation.
  const form = useForm({
    defaultValues: {
      quizName: "",
      file: null as File | null,
      numQuestions: 12,
      subjectId: "",
    },
    onSubmit: async ({ value }) => {
      if (!user) {
        console.error("User not authenticated");
        return;
      }

      if (!value.file) {
        console.error("No file provided");
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
            num_questions: value.numQuestions,
            asignatura_id: value.subjectId,
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
              ? "Dale un nombre a tu test" 
              : undefined,
            file: !value.file 
              ? "Añade un pdf" 
              : undefined,
          },
        };
      },
    },
  });

  return (
    <div className="flex flex-col gap-4 w-full items-center">  
      <h1 className="text-2xl text-center font-semibold text-green-4">Crea un test nuevo</h1>
      <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col items-center gap-4 w-full max-w-4xl px-8 pb-8"
    >

      {/* Quiz Name Field */}
      <div className="w-full">
        <form.Field name="quizName">
          {(field) => (
            <>
              <label htmlFor={field.name} className="block text-sm font-medium">
                Nombre
              </label>
              <input
                id={field.name}
                type="text"
                value={field.state.value || ""}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="border px-4 py-2 rounded-md w-full bg-yellow-1 border-yellow-4"
                placeholder="Nombre del test"
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

      {/* File Input Field */}
      <div className="w-full">
        <form.Field name="file">
          {(field) => {
            // Custom file change handler for updating the file field.
            const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files?.[0]) {
                const file = e.target.files[0];
                field.handleChange(file as File | null);
              }
            };

            return (
              <>
                <label
                  htmlFor={field.name}
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-yellow-4 border-dashed rounded-lg cursor-pointer bg-yellow-1  transition-all duration-200"
                >
                  <div className="flex flex-col gap-2 items-center justify-center pt-5 pb-6 ">
                    <Upload className="w-6 h-6 text-green-1"/>
                    <p className="text-md font-semibold text-green-2"> 
                      Haz click o suelta tu <span className="text-green-1">pdf</span> aquí
                    </p>
                    {field.state.value && (
                      <p className="text-sm font-medium text-green-1">
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
      
      <div className="flex justify-between w-full">
        {/* Number of Questions Range Selector */}
        <div className="w-2/5">
          <form.Field name="numQuestions">
            {(field) => {
              // Handle range input and display the current value
              return (
                <>
                  <div className="flex justify-between items-center">
                    <label htmlFor={field.name} className="block text-sm font-medium text-green-4">
                      Número de Preguntas
                    </label>
                    <span className="bg-yellow-1 border border-yellow-4 text-green-1 text-xs font-medium px-2 py-0.5 rounded">
                      {field.state.value}
                    </span>
                  </div>
                  
                  <div className="mt-2">
                    <input
                      id={field.name}
                      type="range"
                      min="10"
                      max="30"
                      step="1"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>10</span>
                      <span>20</span>
                      <span>30</span>
                    </div>
                  </div>
                  
                  {field.state.meta.errors && (
                    <p className="text-red-500 text-sm mt-1">
                      {field.state.meta.errors}
                    </p>
                  )}
                </>
              );
            }}
          </form.Field>
        </div>

        {/* Subject Dropdown */}
        <div className="w-2/5">
          <form.Field name="subjectId">
            {(field) => (
              <>
                <label htmlFor={field.name} className="block text-sm font-medium">
                  Asignatura
                </label>
                <div className="mt-1 relative">
                  <select
                    id={field.name}
                    value={field.state.value || ""}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="appearance-none border px-4 py-2 text-sm font-medium text-green-4 rounded-md border-yellow-4 w-full bg-yellow-1"
                    disabled={isLoadingSubjects}
                  >
                    <option value="">Selecciona una asignatura</option>
                    {Array.isArray(subjects) && subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg
                      className="h-4 w-4 text-green-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                  {isLoadingSubjects && (
                    <div className="absolute right-2 top-2">
                      <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                    </div>
                  )}
                </div>
                {Array.isArray(subjects) && subjects.length === 0 && !isLoadingSubjects && (
                  <p className="text-sm text-gray-500 mt-1">
                    No tienes asignaturas creadas. Crea una primero en la sección de asignaturas.
                  </p>
                )}
                {field.state.meta.errors.map((error, i) => (
                  <div key={i} className="error text-red-700 text-sm">
                    {error}
                  </div>
                ))}
              </>
            )}
          </form.Field>
        </div>
      </div>   

      {/* Reactive submit button */}
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        )}
      </form.Subscribe>
    </form>
    </div>
    
  );
}

