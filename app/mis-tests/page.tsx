import { createClient } from "../utils/supabase/server";
import TestCard from "../components/tests/testCard";
import { Tables } from "@/database.types";
import AsignaturaCard from "../components/Asignaturas/asignaturaCard";
import Asignaturas from "../components/Asignaturas/asignaturas";

export default async function MisTests() {

  return(
    <div className="p-12 flex gap-8 bg-gray-200 w-full">
      {/* <section className="rounded-2xl bg-white p-8 flex flex-col gap-2">
        <h2 className="text-2xl text-gray-950 font-bold">Aquí tienes todos tus tests:</h2>
        {tests.map(test => (
          <TestCard key={test.id} name={test.name} created_at={test.created_at} />
        ))}
      </section> */}
      <Asignaturas />
    </div>
  );
}