"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import cleanFileName from "../utils/cleanFileName";
import { supabase } from "../lib/supabase";
import { createClient } from "../utils/supabase/client";
import { fetchWholeTable } from "../utils/fetches/fetchWholeTable";
import { useQuery } from "@tanstack/react-query";


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
      file: null,
      numQuestions: 12,
      subjectId: "",
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col items-center space-y-4 px-12 pt-12"
    >

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
      
      <div className="flex justify-between w-full">
        {/* Number of Questions Range Selector */}
        <div className="w-2/5">
          <form.Field name="numQuestions">
            {(field) => {
              // Handle range input and display the current value
              return (
                <>
                  <div className="flex justify-between items-center">
                    <label htmlFor={field.name} className="block text-sm font-medium">
                      Número de Preguntas
                    </label>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
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
                    className="border px-4 py-2 rounded w-full bg-white"
                    disabled={isLoadingSubjects}
                  >
                    <option value="">Selecciona una asignatura</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                  {isLoadingSubjects && (
                    <div className="absolute right-2 top-2">
                      <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                    </div>
                  )}
                </div>
                {subjects.length === 0 && !isLoadingSubjects && (
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

