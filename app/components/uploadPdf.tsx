"use client"

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { createClient } from "../utils/supabase/client";
import cleanFileName from "../utils/cleanFileName";
import { useRouter } from "next/navigation";


export default function UploadPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

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
 
  console.log("This is the user id:", user.id);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Please select a file.");
      return;
    }

    setLoading(true);
    setMessage(null);



    const rawFileName = file.name.replace(/\.[^/.]+$/, "");
    const cleanName = cleanFileName(rawFileName);

    console.log(rawFileName);
    console.log(cleanName);

    const filePath = `user_uploads/${Date.now()}-${cleanName}.pdf`;

    const { data , error } = await supabase.storage
      .from("pdf-uploads")
      .upload(filePath, file, {
        contentType: "application/pdf",
      })

      if (error) {
        setLoading(false);
        setMessage("❌ Upload failed.");
        return;
    }

    const publicUrl = supabase.storage.from("pdf-uploads").getPublicUrl(filePath).data.publicUrl;

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    console.log(expiresAt);

    const { error: dbError } = await supabase.from("user_pdf_uploads").insert(
      {
        file_path: filePath,
        public_url: publicUrl,
        expires_at: expiresAt.toISOString(),
      }
    );


    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_EDGE_FUNCTION_URL}process-quiz`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
          pdf_url: publicUrl,
          quiz_name: rawFileName,
          user_id: user.id,
      }),
    });

    const quizData = await response.json();
    console.log(quizData);

    router.push(`/test/${quizData.quizId}`);

    if (!response.ok) {
      throw new Error(quizData.error || "Failed to generate quiz");
    }


    setLoading(false);

    /*
    if (dbError) {
      setMessage("⚠️ File uploaded but database entry failed.");
    } else {
      setMessage(`✅ File uploaded successfully! View: ${publicUrl}`);
    }
    */
  }

  return (
    <div className="flex flex-col items-center space-y-4">        
        <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    {file && (<p className="mt-2 text-sm font-semibold text-green-600 dark:text-green-400">{file.name}</p>)}
                </div>
                <input id="dropzone-file" type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
            </label>
        </div> 
        <button 
            onClick={handleUpload} 
            disabled={loading || !file}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
            {loading ? "Uploading..." : "Upload PDF"}
        </button>
      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}
