
import TestCard from "../components/tests/testCard";
import Asignaturas from "../components/Asignaturas/asignaturas";
import Tests from "../components/tests/tests";

export default async function MisTests() {

  return(
    <div className="p-12 flex gap-8 bg-gray-100 w-full">
      {/* <section className="rounded-2xl bg-white p-8 flex flex-col gap-2">
        <h2 className="text-2xl text-gray-950 font-bold">Aquí tienes todos tus tests:</h2>
        {tests.map(test => (
          <TestCard key={test.id} name={test.name} created_at={test.created_at} />
        ))}
      </section> */}
      <div className="w-2/3">
        <Tests />
      </div>
      <div className="w-1/3">
        <Asignaturas />
      </div>
    </div>
  );
}