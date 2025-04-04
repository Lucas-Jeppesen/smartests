
import Asignaturas from "../components/Asignaturas/asignaturas";
import Tests from "../components/tests/tests";

export default async function MisTests() {

  return(
    <div className="p-12 flex gap-8 bg-gray-100 w-full">
      <div className="w-2/3">
        <Tests />
      </div>
      <div className="w-1/3">
        <Asignaturas />
      </div>
    </div>
  );
}